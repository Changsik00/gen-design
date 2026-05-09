/**
 * Vocabulary CLI — `pnpm --filter studio vocab` entry.
 *
 * 단일 명령으로 다음 산출물 일괄 생성:
 * - studio/src/lib/vocabulary/catalog/catalog.json   (3-tier 카탈로그)
 * - studio/src/lib/vocabulary/catalog/spec-schema.json (spec.md JSON Schema)
 * - templates/FRONT.md  (3-tier 어휘 카탈로그, 사람-가독)
 * - templates/TOKEN.md  (DTCG → 사람-가독)
 * - templates/DESIGN.md (Stitch superset)
 * - templates/DESIGN.stitch.md (Stitch 0.1 호환 subset)
 *
 * 모든 산출물은 *수동 편집 금지* (AUTO-GENERATED 마커). 코드 변경 시 본 명령
 * 재실행 → 회귀 lint 가 mismatch detect.
 *
 * ADR-004 D-2 자동 추출 파이프라인의 entry point.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import { buildCatalog } from "../src/lib/vocabulary/catalog";
import { generateSpecSchema } from "../src/lib/vocabulary/catalog/spec-schema";
import { renderFrontMd } from "../src/lib/vocabulary/render/front-md";
import { renderTokenMd } from "../src/lib/vocabulary/render/token-md";
import { renderDesignMd } from "../src/lib/vocabulary/render/design-md";
import { exportStitchSubset } from "../src/lib/vocabulary/render/stitch-export";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// studio/scripts/ → ../  → studio/
const STUDIO_ROOT = path.resolve(__dirname, "..");
// studio/ → ../ → repo root
const REPO_ROOT = path.resolve(STUDIO_ROOT, "..");

const STUDIO_SRC = path.join(STUDIO_ROOT, "src");
const TOKENS_PATH = path.join(REPO_ROOT, "templates/assets/tokens/tokens.json");
const TEMPLATES_DIR = path.join(REPO_ROOT, "templates");
const VOCAB_LIB_DIR = path.join(STUDIO_SRC, "lib/vocabulary/catalog");

interface PackageInfo {
  name?: string;
  version?: string;
  description?: string;
}

function loadProjectMeta(): PackageInfo {
  const pkgPath = path.join(REPO_ROOT, "package.json");
  if (!fs.existsSync(pkgPath)) return {};
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return { name: pkg.name, version: pkg.version, description: pkg.description };
  } catch {
    return {};
  }
}

function loadTokens(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf8"));
}

function writeIfChanged(filePath: string, content: string): "wrote" | "unchanged" {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf8");
    if (existing === content) return "unchanged";
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  return "wrote";
}

function main(): void {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has("--check");

  console.log(`📦 vocab — Studio root: ${STUDIO_ROOT}`);
  if (checkOnly) console.log("   mode: --check (dry-run, fail on drift)");

  // cwd 를 studio root 로 고정 — buildCatalog 가 *상대 경로* "src" 로 작동하면
  // 추출된 filePath 도 상대 경로 (portable, git-friendly).
  process.chdir(STUDIO_ROOT);

  const tokens = loadTokens();
  const project = loadProjectMeta();

  const catalog = buildCatalog({
    studioSrcRoot: "src",
    generatedAt: new Date().toISOString().slice(0, 10), // 일자만 (deterministic in 1 day)
  });

  const specSchema = generateSpecSchema(catalog);
  const frontMd = renderFrontMd(catalog);
  const tokenMd = renderTokenMd({ tokens });
  const designMd = renderDesignMd({ catalog, tokens, project });
  const stitchMd = exportStitchSubset({ catalog, tokens, project });

  const outputs: Array<{ path: string; content: string; label: string }> = [
    {
      path: path.join(VOCAB_LIB_DIR, "catalog.json"),
      content: JSON.stringify(catalog, null, 2) + "\n",
      label: "catalog.json",
    },
    {
      path: path.join(VOCAB_LIB_DIR, "spec-schema.json"),
      content: JSON.stringify(specSchema, null, 2) + "\n",
      label: "spec-schema.json",
    },
    { path: path.join(TEMPLATES_DIR, "FRONT.md"), content: frontMd, label: "FRONT.md" },
    { path: path.join(TEMPLATES_DIR, "TOKEN.md"), content: tokenMd, label: "TOKEN.md" },
    { path: path.join(TEMPLATES_DIR, "DESIGN.md"), content: designMd, label: "DESIGN.md" },
    {
      path: path.join(TEMPLATES_DIR, "DESIGN.stitch.md"),
      content: stitchMd,
      label: "DESIGN.stitch.md (Stitch 0.1 subset)",
    },
  ];

  let drift = 0;
  for (const o of outputs) {
    if (checkOnly) {
      const existing = fs.existsSync(o.path) ? fs.readFileSync(o.path, "utf8") : "";
      if (existing !== o.content) {
        console.error(`✗ DRIFT: ${o.label} — re-run \`pnpm --filter studio vocab\``);
        drift++;
      } else {
        console.log(`✓ unchanged: ${o.label}`);
      }
    } else {
      const status = writeIfChanged(o.path, o.content);
      console.log(`${status === "wrote" ? "✓ wrote" : "✓ unchanged"}: ${o.label}`);
    }
  }

  if (checkOnly && drift > 0) {
    console.error(`\n✗ ${drift} file(s) drifted. CI 실패.`);
    process.exit(1);
  }

  console.log(
    `\n✅ Done. components: ${
      catalog.tiers.tier2Shadcn.components.length +
      catalog.tiers.tier3Project.composites.length +
      catalog.tiers.tier3Project.templates.length
    } (Tier 2 + Tier 3) / ARIA roles: ${catalog.tiers.tier1Aria.roles.length}`,
  );
}

main();
