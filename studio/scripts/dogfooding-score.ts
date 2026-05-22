#!/usr/bin/env tsx
/**
 * dogfooding-score — @/components/ui import 비율 측정.
 *
 * src/**\/*.tsx 파일 중 @/components/ui 를 import 하는 파일 수 / 전체 비율 계산.
 * exit 0 (게이트 아님 — CI 리포트 전용).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STUDIO_SRC = path.resolve(__dirname, "../src");
const UI_IMPORT_RE = /from\s+["']@\/components\/ui\//;

function collectTsx(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsx(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

const files = collectTsx(STUDIO_SRC);
let withUi = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf-8");
  if (UI_IMPORT_RE.test(src)) withUi++;
}

const total = files.length;
const score = total > 0 ? ((withUi / total) * 100).toFixed(1) : "0.0";

const col = (s: string, w: number) => s.padEnd(w);
const line = "─".repeat(42);

console.log("\nDogfooding Score — @/components/ui import ratio");
console.log(line);
console.log(`${col("Metric", 22)} ${col("Value", 18)}`);
console.log(line);
console.log(`${col("Total .tsx files", 22)} ${col(String(total), 18)}`);
console.log(`${col("Files with UI import", 22)} ${col(String(withUi), 18)}`);
console.log(`${col("Score", 22)} ${col(`${score}%`, 18)}`);
console.log(line);
console.log();
