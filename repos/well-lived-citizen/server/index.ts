import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getAttachmentsByInquiryId, insertFileAttachment } from "./db";
import { appRouter } from "./routers";
import { createContext } from "./trpc";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "../shared/const";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  // ─── tRPC ──────────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── File Upload ───────────────────────────────────────────────────────────
  // POST /api/upload/:inquiryId — upload up to 5 files for an inquiry
  app.post(
    "/api/upload/:inquiryId",
    upload.array("files", 5),
    async (req, res) => {
      try {
        const inquiryId = parseInt(req.params.inquiryId, 10);
        if (isNaN(inquiryId)) {
          res.status(400).json({ error: "Invalid inquiry ID" });
          return;
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: "No files provided" });
          return;
        }

        const saved = [];
        for (const file of files) {
          const ext = path.extname(file.originalname).toLowerCase();
          const key = `inquiries/${inquiryId}/${nanoid()}-${Date.now()}${ext}`;
          const { url } = await storagePut(key, file.buffer, file.mimetype);

          await insertFileAttachment({
            inquiryId,
            storageKey: key,
            storageUrl: url,
            originalName: file.originalname,
            mimeType: file.mimetype,
            sizeBytes: file.size,
          });

          saved.push({ key, url, originalName: file.originalname });
        }

        res.json({ success: true, files: saved });
      } catch (err) {
        console.error("[Upload] Error:", err);
        res.status(500).json({ error: "Upload failed" });
      }
    }
  );

  // GET /api/attachments/:inquiryId — list attachments for an inquiry
  app.get("/api/attachments/:inquiryId", async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.inquiryId, 10);
      if (isNaN(inquiryId)) {
        res.status(400).json({ error: "Invalid inquiry ID" });
        return;
      }
      const attachments = await getAttachmentsByInquiryId(inquiryId);
      res.json({ attachments });
    } catch (err) {
      console.error("[Attachments] Error:", err);
      res.status(500).json({ error: "Failed to fetch attachments" });
    }
  });

  // ─── Static / SPA ──────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    // Development: mount Vite as middleware so the SPA + HMR run on the same port
    const { createServer: createViteServer } = await import("vite");
    const projectRoot = path.resolve(__dirname, "..");
    const vite = await createViteServer({
      root: path.resolve(projectRoot, "client"),
      server: {
        middlewareMode: true,
        hmr: {
          server,          // share the http.Server so WS upgrades are handled
          clientPort: 443, // proxy terminates TLS, browser connects on 443
          protocol: "wss", // proxy uses wss
        },
      },
      appType: "spa",
      configFile: path.resolve(projectRoot, "vite.config.ts"),
    });
    app.use(vite.middlewares);
  }

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`[WLC] Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
