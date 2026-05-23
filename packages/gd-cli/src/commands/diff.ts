/**
 * gen-design diff — 기존 chat.md + 새 Paper tree → 변경분 적용 (dry-run / --apply).
 *
 * 사용:
 *   gen-design diff <chat.md> <tree.json>                  # dry-run, stdout 에 unified diff
 *   gen-design diff <chat.md> <tree.json> --apply          # chat.md 덮어쓰기
 *   gen-design diff <chat.md> <tree.json> --apply --output /tmp/out.chat.md
 *
 * 옵션:
 *   --apply               실제 쓰기 (기본: dry-run)
 *   --output <path>       --apply 시 다른 경로 (기본: chat.md 덮어쓰기)
 *   --threshold <0-1>     inferChat threshold (기본 0.8)
 *   --no-history          History 자동 라인 추가 비활성
 *   --date <YYYY-MM-DD>   History 날짜 명시 (기본 today)
 *   --help, -h
 *
 * 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)
 *
 * ADR-010 D-3 호응 — dry-run = 제안, --apply = 디자이너 confirm.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inferChatDiff } from "../../../../studio/src/lib/paper-inference/diff";
import type { CatalogMap } from "../../../../studio/src/lib/paper-inference/ast-builder";
import type { PaperTreeNode } from "../../../../studio/src/lib/paper-inference/tree-types";

export interface DiffArgs {
  chat?: string;
  tree?: string;
  apply?: boolean;
  output?: string;
  threshold?: number;
  noHistory?: boolean;
  date?: string;
  help?: boolean;
}

export function parseDiffArgs(argv: string[]): DiffArgs | { error: string } {
  const args: DiffArgs = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--apply") {
      args.apply = true;
    } else if (a === "--no-history") {
      args.noHistory = true;
    } else if (a === "--output") {
      const next = argv[++i];
      if (!next) return { error: "--output requires a path argument" };
      args.output = next;
    } else if (a === "--threshold") {
      const next = argv[++i];
      const val = parseFloat(next ?? "");
      if (isNaN(val) || val < 0 || val > 1) {
        return { error: "--threshold must be a number between 0 and 1" };
      }
      args.threshold = val;
    } else if (a === "--date") {
      const next = argv[++i];
      if (!next || !/^\d{4}-\d{2}-\d{2}$/.test(next)) {
        return { error: "--date must be YYYY-MM-DD format" };
      }
      args.date = next;
    } else if (a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    } else {
      positional.push(a);
    }
  }

  if (args.help) return args;

  if (positional.length < 2) {
    return { error: "Usage: gen-design diff <chat.md> <tree.json> [options]" };
  }
  if (positional.length > 2) {
    return { error: `Unexpected argument: ${positional[2]}` };
  }
  args.chat = positional[0];
  args.tree = positional[1];
  return args;
}

export interface RunDiffOptions {
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
  catalog?: CatalogMap;
  /** 테스트에서 file write 를 차단 (apply 시 결과만 캡쳐). */
  captureWrite?: (path: string, content: string) => void;
}

export interface RunResult {
  exitCode: 0 | 1 | 2;
  stdout: string;
  stderr: string;
}

export async function runDiff(argv: string[], opts: RunDiffOptions = {}): Promise<RunResult> {
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  const parsed = parseDiffArgs(argv);
  if ("error" in parsed) {
    stderrLines.push(`Error: ${parsed.error}`);
    return { exitCode: 2, stdout: "", stderr: stderrLines.join("\n") };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  let existingChat: string;
  let treeRaw: string;
  try {
    existingChat = readFileSync(resolve(parsed.chat!), "utf-8");
    treeRaw = readFileSync(resolve(parsed.tree!), "utf-8");
  } catch (e) {
    stderrLines.push(`Failed to read: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  let tree: PaperTreeNode;
  try {
    tree = JSON.parse(treeRaw) as PaperTreeNode;
  } catch (e) {
    stderrLines.push(`Invalid tree JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  const catalog = opts.catalog ?? loadCatalog();
  let result;
  try {
    result = inferChatDiff(existingChat, tree, {
      catalog,
      threshold: parsed.threshold,
      appendHistory: !parsed.noHistory,
      date: parsed.date,
    });
  } catch (e) {
    stderrLines.push(`Diff failed: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  const { stats } = result;
  const summary = `texts ${stats.textChanges}, variants ${stats.variantChanges}, +${stats.added} / -${stats.removed}`;

  if (parsed.apply) {
    const outPath = parsed.output ?? parsed.chat!;
    if (opts.captureWrite) opts.captureWrite(outPath, result.text);
    else writeFileSync(outPath, result.text, "utf-8");
    stdoutLines.push(`✓ wrote ${outPath} — ${summary}`);
    return { exitCode: 0, stdout: stdoutLines.join("\n") + "\n", stderr: stderrLines.join("\n") };
  }

  const totalChanges = stats.textChanges + stats.variantChanges + stats.added + stats.removed;
  if (totalChanges === 0) {
    stdoutLines.push(`(no changes in ${parsed.chat})`);
  } else {
    stdoutLines.push(unifiedDiff(existingChat, result.text, parsed.chat!));
  }
  stderrLines.push(`[stats] ${summary}`);
  stderrLines.push(
    `[preserved] frontmatter=${result.preserved.frontmatter} narrative=${result.preserved.narrative} history=${result.preserved.history}`,
  );
  if (result.historyLineAdded) {
    stderrLines.push(`[history+] ${result.historyLineAdded}`);
  }
  return { exitCode: 0, stdout: stdoutLines.join("\n"), stderr: stderrLines.join("\n") };
}

function loadCatalog(): CatalogMap {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const catalogPath = join(__dirname, "..", "..", "src", "lib", "vocabulary", "catalog", "catalog.json");
  const raw = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
    tiers: {
      tier2Shadcn: { components: Array<{ name: string; axes: { name: string; values: string[] }[] }> };
      tier3Project: {
        composites: Array<{ name: string; axes: { name: string; values: string[] }[] }>;
        templates: Array<{ name: string; axes: { name: string; values: string[] }[] }>;
      };
    };
  };
  const map: CatalogMap = new Map();
  const all = [
    ...raw.tiers.tier2Shadcn.components,
    ...raw.tiers.tier3Project.composites,
    ...raw.tiers.tier3Project.templates,
  ];
  for (const c of all) map.set(c.name, c.axes);
  return map;
}

function unifiedDiff(oldText: string, newText: string, label: string): string {
  if (oldText === newText) return `(no changes in ${label})`;
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const out: string[] = [`--- ${label}`, `+++ ${label} (proposed)`];
  // 간단 line-by-line diff (정교한 LCS 는 후속 — 본 spec 은 *제안 가독성* 목적)
  const max = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < max; i++) {
    const o = oldLines[i];
    const n = newLines[i];
    if (o === n) {
      if (o !== undefined) out.push(`  ${o}`);
    } else {
      if (o !== undefined) out.push(`- ${o}`);
      if (n !== undefined) out.push(`+ ${n}`);
    }
  }
  return out.join("\n");
}

function helpText(): string {
  return `Usage: gen-design diff <chat.md> <tree.json> [options]

Options:
  --apply               Apply diff to chat.md (default: dry-run, stdout only)
  --output <path>       Write to different path (with --apply)
  --threshold <0-1>     inferChat confident threshold (default: 0.8)
  --no-history          Skip auto-appending Paper sync line to History
  --date <YYYY-MM-DD>   Date for History line (default: today)
  --help, -h            Show this help

ADR-010 D-3: dry-run is the proposal; --apply is the designer's confirm.
`;
}
