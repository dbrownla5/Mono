// Shared test utilities for the Mono documentation/content test suite.
//
// Mono is a content-extraction workspace (see README.md / .coderabbit.yaml) —
// there is no application code, so these tests validate the *structure and
// cross-references* of the markdown/YAML content added in this PR: agent
// frontmatter, the audit ledger, and the _incoming staging docs.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, '..');

export function repoPath(...segments) {
  return path.join(ROOT, ...segments);
}

export function readRepoFile(...segments) {
  return readFileSync(repoPath(...segments), 'utf8');
}

export function repoFileExists(...segments) {
  return existsSync(repoPath(...segments));
}

export function listDir(...segments) {
  return readdirSync(repoPath(...segments));
}

/**
 * Parses a simple frontmatter block of the form:
 *
 *   ---
 *   key: value
 *   key2: value2
 *   ---
 *   body...
 *
 * This is intentionally NOT a general YAML parser — it only supports the
 * flat `key: value` frontmatter used by the agent definition files in
 * `.claude/agents/`. Values are returned as raw (untyped) strings.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('No frontmatter block found (expected leading --- ... ---)');
  }
  const [, rawFrontmatter, body] = match;
  const data = {};
  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) {
      throw new Error(`Malformed frontmatter line (no ":"): ${line}`);
    }
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  }
  return { data, body };
}

/** Splits a comma-separated frontmatter value (e.g. `tools: Read, Grep`) into a trimmed array. */
export function splitList(value) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitTableRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

/**
 * Extracts GitHub-flavored-markdown pipe tables from a markdown string.
 * Returns an array of `{ header: string[], rows: string[][] }`.
 *
 * This is a lightweight scanner (not a full markdown parser): it looks for a
 * `| ... |` header line immediately followed by a `|---|---|` style
 * separator line, then collects subsequent `|`-prefixed lines as data rows.
 */
export function extractTables(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tables = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const next = lines[i + 1];
    const looksLikeHeader = line.trim().startsWith('|');
    const looksLikeSeparator = /^\|?[\s:|-]+\|?$/.test(next.trim()) && next.includes('-');
    if (looksLikeHeader && looksLikeSeparator) {
      const header = splitTableRow(line);
      const rows = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[j]));
        j++;
      }
      tables.push({ header, rows });
      i = j - 1;
    }
  }
  return tables;
}