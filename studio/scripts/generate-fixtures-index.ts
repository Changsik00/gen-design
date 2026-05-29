/**
 * fixtures/chats/{scenes,components}/ 의 fixture 들을
 * studio/src/features/preview/fixtures.generated.ts 로 inline.
 *
 * Vite glob 은 project root 밖의 파일을 import 할 수 없으므로 빌드 단계에서 한 번에 inline.
 * 본 스크립트는 dev / build 시 자동 호출 (package.json 의 prebuild hook).
 *
 * spec-08-01: spec/ → fixtures/chats/ 분리. 동적 fetch 로의 전환은 spec-8-10.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename_ = fileURLToPath(import.meta.url);
const __dirname_ = dirname(__filename_);
const STUDIO_ROOT = resolve(__dirname_, "..");
const PROJECT_ROOT = resolve(STUDIO_ROOT, "..");
const FIXTURES_ROOT = join(PROJECT_ROOT, "fixtures", "chats");
const OUTPUT = join(STUDIO_ROOT, "src", "features", "preview", "fixtures.generated.ts");

interface FixtureSource {
  category: "scenes" | "components";
  name: string;       // 예: "login" / "button"
  text: string;
}

function loadCategory(category: "scenes" | "components"): FixtureSource[] {
  const dir = join(FIXTURES_ROOT, category);
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith(".chat.md")).sort();
    return files.map((file) => ({
      category,
      name: file.replace(/\.chat\.md$/, ""),
      text: readFileSync(join(dir, file), "utf-8"),
    }));
  } catch {
    return [];
  }
}

function main(): void {
  const sources: FixtureSource[] = [
    ...loadCategory("scenes"),
    ...loadCategory("components"),
  ];

  // 기존 호환성: name 은 scene/component 이름 그대로 (디렉토리 prefix 0).
  const entries = sources.map(
    (s) => `  { name: ${JSON.stringify(s.name)}, text: ${JSON.stringify(s.text)} }`,
  );

  const content = `/**
 * AUTO-GENERATED — do not edit.
 * Source: fixtures/chats/{scenes,components}/*.chat.md
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
  process.stdout.write(`✓ wrote ${OUTPUT} (${sources.length} fixtures)\n`);
}

main();
