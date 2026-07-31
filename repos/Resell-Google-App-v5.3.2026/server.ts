import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Multer setup for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // API route for processing images
  app.post("/api/process-images", upload.array("images"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const existingInventory = req.body.existingInventory;

      const prompt = `You are the "DB Strategic Resale Engine."
        Analyze these images and generate a consolidated inventory list.
        Group items, Deduplicate based on: ${existingInventory}
        Platform Routing:
        - Small/Luxury -> eBay/Poshmark
        - Vintage/Handmade -> Etsy
        - Large/High-end -> Chairish
        - Bulky -> FB Marketplace
        Output Format: Return ONLY a JSON array of objects with keys: Brand, Model, MarketPrice, FloorPrice, Platform, Status.`;

      const parts = files.map(file => ({
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString("base64"),
        },
      }));

      const result = await model.generateContent([
        ...parts,
        { text: prompt }
      ]);

      const responseText = result.response.text();
      // Simple cleaning
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Error processing images:", error);
      res.status(500).json({ error: "Failed to process images" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
