/**
 * gen-design paper-import — Paper tree.json → enriched tree (옵션: chain inferChat → chat.md).
 *
 * 사용:
 *   gen-design paper-import <tree.json>
 *   gen-design paper-import <tree.json> --validate-only
 *   gen-design paper-import <tree.json> --chain inferChat --output chat.md
 *   gen-design paper-import --from-stdin --chain inferChat
 *
 * 옵션:
 *   --validate-only      검증만, 출력 없음
 *   --from-stdin         stdin 으로 tree.json 입력
 *   --output <path>      stdout 대신 파일 저장
 *   --chain inferChat    inferChat 까지 chain → chat.md 출력
 *   --threshold <0-1>    inferChat threshold (chain 시, 기본 0.8)
 *
 * 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { enrichWithIdentity } from "../../src/lib/paper-inference/enrich";
import { inferChat } from "../../src/lib/paper-inference/infer";
import type { PaperTreeNode } from "../../src/lib/paper-inference/tree-types";
import { validateTree, type ValidationError } from "../../src/lib/paper-inference/validate";
import type { CatalogMap } from "../../src/lib/paper-inference/ast-builder";

export interface PaperImportArgs {
  file?: string;
  fromStdin?: boolean;
  validateOnly?: boolean;
  output?: string;
  chain?: "inferChat";
  threshold?: number;
  help?: boolean;
}

export function parsePaperImportArgs(argv: string[]): PaperImportArgs | { error: string } {
  const args: PaperImportArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--from-stdin") {
      args.fromStdin = true;
    } else if (a === "--validate-only") {
      args.validateOnly = true;
    } else if (a === "--output") {
      const next = argv[++i];
      if (!next) return { error: "--output requires a path argument" };
      args.output = next;
    } else if (a === "--chain") {
      const next = argv[++i];
      if (next !== "inferChat") return { error: `--chain only supports 'inferChat' (got '${next ?? "<missing>"}')` };
      args.chain = "inferChat";
    } else if (a === "--threshold") {
      const next = argv[++i];
      const val = parseFloat(next ?? "");
      if (isNaN(val) || val < 0 || val > 1) {
        return { error: "--threshold must be a number between 0 and 1" };
      }
      args.threshold = val;
    } else if (a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    } else if (!args.file) {
      args.file = a;
    } else {
      return { error: `Unexpected argument: ${a}` };
    }
  }

  if (args.help) return args;
  if (!args.file && !args.fromStdin) {
    return { error: "Missing <tree.json> argument (or --from-stdin)" };
  }
  return args;
}

export interface RunPaperImportOptions {
  /** 표준 입출력을 inject 가능하게 — 테스트에서 사용. */
  stdin?: () => Promise<string>;
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
  /** catalog map override — 테스트용. */
  catalog?: CatalogMap;
}

export interface RunResult {
  exitCode: 0 | 1 | 2;
  stdout: string;
  stderr: string;
}

export async function runPaperImport(
  argv: string[],
  opts: RunPaperImportOptions = {},
): Promise<RunResult> {
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  const parsed = parsePaperImportArgs(argv);
  if ("error" in parsed) {
    stderrLines.push(`Error: ${parsed.error}`);
    return { exitCode: 2, stdout: "", stderr: stderrLines.join("\n") };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  let raw: string;
  try {
    raw = parsed.fromStdin
      ? await (opts.stdin ?? readStdin)()
      : readFileSync(resolve(parsed.file!), "utf-8");
  } catch (e) {
    stderrLines.push(`Failed to read tree: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  let tree: PaperTreeNode;
  try {
    tree = JSON.parse(raw) as PaperTreeNode;
  } catch (e) {
    stderrLines.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  const errors = validateTree(tree);
  const fatal = errors.filter((x: ValidationError) => x.severity === "error");
  for (const e of errors) {
    stderrLines.push(`[${e.severity}] ${e.message}`);
  }
  if (fatal.length > 0) {
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  if (parsed.validateOnly) {
    stdoutLines.push("✓ valid");
    return { exitCode: 0, stdout: stdoutLines.join("\n") + "\n", stderr: stderrLines.join("\n") };
  }

  const enriched = enrichWithIdentity(tree);

  let outputText: string;
  if (parsed.chain === "inferChat") {
    const catalogMap = opts.catalog ?? loadCatalog();
    const result = inferChat(enriched, catalogMap, {
      confidentThreshold: parsed.threshold ?? 0.8,
    });
    outputText = result.text;
  } else {
    outputText = JSON.stringify(enriched, null, 2);
  }

  if (parsed.output) {
    writeFileSync(parsed.output, outputText, "utf-8");
    stdoutLines.push(`✓ wrote ${parsed.output} (${outputText.length} bytes)`);
  } else {
    stdoutLines.push(outputText);
  }

  return {
    exitCode: 0,
    stdout: stdoutLines.join("\n") + (stdoutLines.length > 0 ? "\n" : ""),
    stderr: stderrLines.join("\n"),
  };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
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

function helpText(): string {
  const lines: string[] = [];
  const stream: { write(s: string): void } = { write(s) { lines.push(s); } };
  printPaperImportHelp(stream as NodeJS.WriteStream);
  return lines.join("");
}

export function printPaperImportHelp(out: NodeJS.WriteStream = process.stdout): void {
  out.write(`Usage: gen-design paper-import <tree.json> [options]
       gen-design paper-import --from-stdin [options]

Options:
  --validate-only       Validate tree structure only (no output)
  --from-stdin          Read tree.json from stdin
  --output <path>       Write to file instead of stdout
  --chain inferChat     Chain to inferChat → chat.md output
  --threshold <0-1>     inferChat confident threshold (default: 0.8)
  --help, -h            Show this help

Examples:
  gen-design paper-import fixtures/paper-trees/scenes/login.tree.json
  gen-design paper-import tree.json --chain inferChat --output login.chat.md
  cat tree.json | gen-design paper-import --from-stdin --validate-only
`);
}
