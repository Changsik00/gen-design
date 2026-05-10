/**
 * spec/ 의 fixture 들을 studio/src/features/preview/fixtures.generated.ts 로 inline.
 *
 * Vite glob 은 project root 밖의 파일을 import 할 수 없으므로 빌드 단계에서 한 번에 inline.
 * 본 스크립트는 dev / build 시 자동 호출 (package.json 의 prebuild hook).
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename_ = fileURLToPath(import.meta.url);
const __dirname_ = dirname(__filename_);
const STUDIO_ROOT = resolve(__dirname_, "..");
const PROJECT_ROOT = resolve(STUDIO_ROOT, "..");
const SPEC_DIR = join(PROJECT_ROOT, "spec");
const OUTPUT = join(STUDIO_ROOT, "src", "features", "preview", "fixtures.generated.ts");

function main(): void {
  const files = readdirSync(SPEC_DIR).filter((f) => f.endsWith(".spec.md")).sort();
  const entries: string[] = [];
  for (const file of files) {
    const text = readFileSync(join(SPEC_DIR, file), "utf-8");
    const name = file.replace(/\.spec\.md$/, "");
    entries.push(`  { name: ${JSON.stringify(name)}, text: ${JSON.stringify(text)} }`);
  }
  const content = `/**
 * AUTO-GENERATED — do not edit.
 * Source: spec/*.spec.md
 * Generator: studio/scripts/generate-fixtures-index.ts
 *
 * 본 파일을 갱신하려면: pnpm --filter studio fixtures:gen
 */

export interface FixtureEntry {
  name: string;
  text: string;
}

export const FIXTURES: FixtureEntry[] = [
${entries.join(",\n")}
];
`;
  writeFileSync(OUTPUT, content, "utf-8");
  process.stdout.write(`✓ wrote ${OUTPUT} (${files.length} fixtures)\n`);
}

main();
