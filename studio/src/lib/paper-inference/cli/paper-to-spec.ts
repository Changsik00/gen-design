/**
 * paper-to-spec CLI — `pnpm --filter studio paper-to-spec <tree.json> [options]`
 *
 * 사용:
 *   pnpm --filter studio paper-to-spec /tmp/tree.json
 *   pnpm --filter studio paper-to-spec /tmp/tree.json --report
 *   pnpm --filter studio paper-to-spec /tmp/tree.json --threshold 0.7
 *   pnpm --filter studio paper-to-spec /tmp/tree.json --output spec.md
 *
 * 옵션:
 *   --report               InferReport JSON 을 stderr 에 출력
 *   --threshold <0-1>      confident 임계값 (기본 0.8)
 *   --output <path>        stdout 대신 파일로 저장
 *
 * 종료 코드: 0 (성공), 1 (오류), 2 (사용법 위반)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { PaperTreeNode } from "../tree-types";
import type { CatalogMap } from "../ast-builder";
import { inferChat } from "../infer";

export interface CliArgs {
  file: string;
  output?: string;
  report?: boolean;
  threshold?: number;
}

export interface CliResult {
  text: string;
  report: string;
  exitCode: 0 | 1;
}

export function parseArgs(argv: string[]): CliArgs | { error: string } {
  const args: CliArgs = { file: "" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--report") {
      args.report = true;
    } else if (a === "--threshold") {
      const val = parseFloat(argv[++i]);
      if (isNaN(val) || val < 0 || val > 1) return { error: "--threshold must be a number between 0 and 1" };
      args.threshold = val;
    } else if (a === "--output") {
      args.output = argv[++i];
    } else if (!a.startsWith("--") && !args.file) {
      args.file = a;
    } else {
      return { error: `Unknown or duplicate argument: ${a}` };
    }
  }
  if (!args.file) return { error: "Missing <tree.json> argument" };
  return args;
}

export function runInfer(args: CliArgs, catalogMap: CatalogMap): CliResult {
  let tree: PaperTreeNode;
  try {
    const raw = readFileSync(resolve(args.file), "utf-8");
    tree = JSON.parse(raw) as PaperTreeNode;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    process.stderr.write(`Error reading ${args.file}: ${msg}\n`);
    return { text: "", report: "", exitCode: 1 };
  }

  const { text, report } = inferChat(tree, catalogMap, {
    confidentThreshold: args.threshold ?? 0.8,
  });

  const reportJson = JSON.stringify(
    {
      confident: report.confident.length,
      confirm: report.confirm.length,
      unknown: report.unknown.length,
      total: report.total,
      thresholds: report.thresholds,
    },
    null,
    2,
  );

  return { text, report: reportJson, exitCode: 0 };
}

function loadCatalogMap(): CatalogMap {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const catalogPath = join(__dirname, "..", "..", "..", "lib", "vocabulary", "catalog", "catalog.json");
  const raw = JSON.parse(readFileSync(catalogPath, "utf-8"));
  return buildCatalogMapFromRaw(raw);
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if ("error" in parsed) {
    process.stderr.write(`Error: ${parsed.error}\n`);
    process.stderr.write("Usage: paper-to-spec <tree.json> [--report] [--threshold 0-1] [--output <path>]\n");
    process.exit(2);
  }

  let catalogMap: CatalogMap;
  try {
    catalogMap = loadCatalogMap();
  } catch (e) {
    process.stderr.write(`Error loading catalog: ${e instanceof Error ? e.message : String(e)}\n`);
    process.exit(1);
  }

  const result = runInfer(parsed, catalogMap);

  if (parsed.output) {
    writeFileSync(parsed.output, result.text, "utf-8");
    process.stdout.write(`✓ wrote ${parsed.output} (${result.text.length} bytes)\n`);
  } else {
    process.stdout.write(result.text);
  }

  if (parsed.report) {
    process.stderr.write(`\n[report]\n${result.report}\n`);
  }

  process.exit(result.exitCode);
}

function buildCatalogMapFromRaw(raw: Record<string, unknown>): CatalogMap {
  const map: CatalogMap = new Map();
  const tiers = (raw as { tiers: { tier2Shadcn: { components: unknown[] }; tier3Project: { composites: unknown[]; templates: unknown[] } } }).tiers;
  const all = [...tiers.tier2Shadcn.components, ...tiers.tier3Project.composites, ...tiers.tier3Project.templates] as Array<{
    name: string;
    axes: { name: string; values: string[] }[];
  }>;
  for (const c of all) {
    map.set(c.name, c.axes);
  }
  return map;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
