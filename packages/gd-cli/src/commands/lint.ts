/**
 * gen-design lint — chat.md 정합 검증 (ADR-009 D-5).
 *
 * 사용:
 *   gen-design lint [--chat-root <dir>] [--no-compile]
 *
 * 6 카테고리:
 *   frontmatter  — 필수 필드 + type/tier 유효성
 *   grammar      — peggy parse 성공 여부
 *   catalog-ref  — Structure JSX 태그 → catalog 등록 여부
 *   shell-inherit — shell.inherit 정합
 *   naming       — 파일명 + 디렉토리 규칙
 *   compile      — runReact exitCode (--no-compile 로 skip)
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { lintFile } from "../../../../studio/src/lib/chat-md/lint";
import type { RouterResult } from "../cli";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LintCategory =
  | "frontmatter"
  | "grammar"
  | "catalog-ref"
  | "shell-inherit"
  | "naming";

export interface LintArgs {
  chatRoot?: string;
  help?: boolean;
}

export interface ChatFile {
  path: string;
  relPath: string;
  fileType: "scene" | "component" | "shell" | "unknown";
}

export interface ChatLintDiag {
  category: LintCategory;
  file: string;
  message: string;
  line: number;
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

export function parseLintArgs(argv: string[]): LintArgs | { error: string } {
  const args: LintArgs = { help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--chat-root") {
      const next = argv[++i];
      if (!next || next.startsWith("--")) {
        return { error: "--chat-root requires a path argument" };
      }
      args.chatRoot = next;
    } else if (a.startsWith("--") || a.startsWith("-")) {
      return { error: `Unknown option: ${a}` };
    } else {
      return { error: `Unexpected argument: ${a}` };
    }
  }
  return args;
}

// ---------------------------------------------------------------------------
// File scanning
// ---------------------------------------------------------------------------

export function scanChatFiles(chatRoot: string): ChatFile[] {
  const files: ChatFile[] = [];

  const shellPath = join(chatRoot, "_shell.chat.md");
  if (existsSync(shellPath)) {
    files.push({
      path: shellPath,
      relPath: "_shell.chat.md",
      fileType: "shell",
    });
  }

  for (const subdir of ["scenes", "components"] as const) {
    const dir = join(chatRoot, subdir);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith(".chat.md")) continue;
      const abs = join(dir, entry);
      files.push({
        path: abs,
        relPath: `${subdir}/${entry}`,
        fileType: subdir === "scenes" ? "scene" : "component",
      });
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Frontmatter parsing (regex — no gray-matter dependency)
// ---------------------------------------------------------------------------

function parseFrontmatter(raw: string): Record<string, unknown> | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return null;
  const block = match[1];
  const result: Record<string, unknown> = {};

  const lines = block.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // top-level key
    const topMatch = /^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/.exec(line);
    if (!topMatch) { i++; continue; }
    const [, key, val] = topMatch;
    const trimmed = val.trim();
    if (trimmed === "" || trimmed === "|" || trimmed === ">") {
      // nested block — collect indented sub-lines
      const sub: Record<string, unknown> = {};
      i++;
      while (i < lines.length && /^[ \t]+\S/.test(lines[i])) {
        const subLine = lines[i];
        const subMatch = /^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/.exec(subLine);
        if (subMatch) {
          const [, sk, sv] = subMatch;
          const st = sv.replace(/#.*$/, "").trim();
          if (st === "true") sub[sk] = true;
          else if (st === "false") sub[sk] = false;
          else if (/^\d+$/.test(st)) sub[sk] = parseInt(st, 10);
          else if (st !== "") sub[sk] = st.replace(/^["']|["']$/g, "");
        }
        i++;
      }
      result[key] = sub;
    } else if (trimmed === "true") {
      result[key] = true;
      i++;
    } else if (trimmed === "false") {
      result[key] = false;
      i++;
    } else if (/^\d+$/.test(trimmed)) {
      result[key] = parseInt(trimmed, 10);
      i++;
    } else {
      result[key] = trimmed.replace(/#.*$/, "").trim().replace(/^["']|["']$/g, "");
      i++;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Category: frontmatter
// ---------------------------------------------------------------------------

const VALID_TYPES = ["scene", "shell", "component"] as const;
const VALID_TIERS = [1, 2, 3] as const;

export function checkFrontmatter(files: ChatFile[]): ChatLintDiag[] {
  const diags: ChatLintDiag[] = [];
  for (const f of files) {
    let raw: string;
    try {
      raw = readFileSync(f.path, "utf-8");
    } catch {
      diags.push({ category: "frontmatter", file: f.relPath, message: "Cannot read file", line: 0 });
      continue;
    }

    const fm = parseFrontmatter(raw);
    if (!fm) {
      diags.push({ category: "frontmatter", file: f.relPath, message: "Frontmatter parse error or missing frontmatter", line: 0 });
      continue;
    }

    for (const field of ["type", "name", "identity", "created"]) {
      if (fm[field] === undefined || fm[field] === null || fm[field] === "") {
        diags.push({
          category: "frontmatter",
          file: f.relPath,
          message: `Missing required field: ${field}`,
          line: 0,
        });
      }
    }

    if (fm["type"] !== undefined && !VALID_TYPES.includes(fm["type"] as typeof VALID_TYPES[number])) {
      diags.push({
        category: "frontmatter",
        file: f.relPath,
        message: `Invalid type: "${fm["type"]}" (allowed: ${VALID_TYPES.join(", ")})`,
        line: 0,
      });
    }

    const catalog = fm["catalog"] as Record<string, unknown> | undefined;
    if (catalog && catalog["tier"] !== undefined) {
      const tier = catalog["tier"];
      if (!VALID_TIERS.includes(tier as typeof VALID_TIERS[number])) {
        diags.push({
          category: "frontmatter",
          file: f.relPath,
          message: `Invalid catalog.tier: ${tier} (allowed: 1, 2, 3)`,
          line: 0,
        });
      }
    }
  }
  return diags;
}

// ---------------------------------------------------------------------------
// Category: grammar + catalog-ref (via existing lintFile pipeline)
// ---------------------------------------------------------------------------

function resolveCatalogPath(chatRoot: string): string {
  return resolve(
    chatRoot,
    "..",
    "studio",
    "src",
    "lib",
    "vocabulary",
    "catalog",
    "catalog.json",
  );
}

function resolveSchemaPath(chatRoot: string): string {
  return resolve(
    chatRoot,
    "..",
    "studio",
    "src",
    "lib",
    "vocabulary",
    "catalog",
    "spec-schema.json",
  );
}

export function checkGrammar(
  files: ChatFile[],
  catalogPath: string,
  schemaPath: string,
): ChatLintDiag[] {
  const diags: ChatLintDiag[] = [];
  if (!existsSync(catalogPath) || !existsSync(schemaPath)) return diags;

  const catalog = JSON.parse(readFileSync(catalogPath, "utf-8")) as object;
  const schema = JSON.parse(readFileSync(schemaPath, "utf-8")) as object;

  for (const f of files) {
    const result = lintFile(f.path, { catalog: catalog as never, schema });
    for (const err of result.errors) {
      if (err.stage === "parse") {
        diags.push({
          category: "grammar",
          file: f.relPath,
          message: err.message,
          line: err.location?.line ?? 0,
        });
      }
    }
  }
  return diags;
}

export function checkCatalogRef(
  files: ChatFile[],
  catalogPath: string,
  schemaPath: string,
): ChatLintDiag[] {
  const diags: ChatLintDiag[] = [];
  if (!existsSync(catalogPath) || !existsSync(schemaPath)) return diags;

  const catalog = JSON.parse(readFileSync(catalogPath, "utf-8")) as object;
  const schema = JSON.parse(readFileSync(schemaPath, "utf-8")) as object;

  for (const f of files) {
    const result = lintFile(f.path, { catalog: catalog as never, schema });
    for (const err of result.errors) {
      if (err.stage === "catalog" || err.stage === "axis") {
        diags.push({
          category: "catalog-ref",
          file: f.relPath,
          message: err.message,
          line: err.location?.line ?? 0,
        });
      }
    }
  }
  return diags;
}

// ---------------------------------------------------------------------------
// Category: shell-inherit
// ---------------------------------------------------------------------------

function getCatalogNames(catalogPath: string): Set<string> {
  if (!existsSync(catalogPath)) return new Set();
  try {
    const raw = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
      components?: Array<{ name: string }>;
    };
    return new Set((raw.components ?? []).map((c) => c.name));
  } catch {
    return new Set();
  }
}

export function checkShellInherit(
  files: ChatFile[],
  chatRoot: string,
  catalogPath: string,
): ChatLintDiag[] {
  const diags: ChatLintDiag[] = [];
  const shellExists = existsSync(join(chatRoot, "_shell.chat.md"));
  const catalogNames = getCatalogNames(catalogPath);

  for (const f of files) {
    if (f.fileType !== "scene") continue;

    let fm: Record<string, unknown>;
    try {
      const raw = readFileSync(f.path, "utf-8");
      const parsed = parseFrontmatter(raw);
      if (!parsed) continue;
      fm = parsed;
    } catch {
      continue;
    }

    const shell = fm["shell"] as Record<string, unknown> | undefined;
    if (!shell) continue;

    if (shell["inherit"] === true && !shellExists) {
      diags.push({
        category: "shell-inherit",
        file: f.relPath,
        message: "shell.inherit: true but _shell.chat.md not found in chatRoot",
        line: 0,
      });
    }

    const exclude = shell["exclude"];
    if (Array.isArray(exclude) && catalogNames.size > 0) {
      for (const item of exclude) {
        if (typeof item === "string" && !catalogNames.has(item)) {
          diags.push({
            category: "shell-inherit",
            file: f.relPath,
            message: `shell.exclude contains unknown component: "${item}"`,
            line: 0,
          });
        }
      }
    }
  }
  return diags;
}

// ---------------------------------------------------------------------------
// Category: naming
// ---------------------------------------------------------------------------

const KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function checkNaming(files: ChatFile[]): ChatLintDiag[] {
  const diags: ChatLintDiag[] = [];
  for (const f of files) {
    const ext = extname(f.path);
    const base = basename(f.path, ".chat.md");
    const dir = basename(dirname(f.path));

    if (ext !== ".md" || !f.path.endsWith(".chat.md")) {
      diags.push({
        category: "naming",
        file: f.relPath,
        message: `File must have .chat.md extension (got: ${basename(f.path)})`,
        line: 0,
      });
      continue;
    }

    if (f.fileType === "shell") continue;

    if (!KEBAB_RE.test(base)) {
      diags.push({
        category: "naming",
        file: f.relPath,
        message: `Filename must be kebab-case (got: "${base}.chat.md")`,
        line: 0,
      });
    }

    if (f.fileType === "scene" && dir !== "scenes") {
      diags.push({
        category: "naming",
        file: f.relPath,
        message: `Scene file must be under scenes/ directory (found in: ${dir}/)`,
        line: 0,
      });
    }

    if (f.fileType === "component" && dir !== "components") {
      diags.push({
        category: "naming",
        file: f.relPath,
        message: `Component file must be under components/ directory (found in: ${dir}/)`,
        line: 0,
      });
    }
  }
  return diags;
}


// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

export function formatLintReport(diags: ChatLintDiag[], fileCount: number): string {
  if (diags.length === 0) {
    return `All checks passed. (${fileCount} file${fileCount === 1 ? "" : "s"})\n`;
  }

  const byFile = new Map<string, ChatLintDiag[]>();
  for (const d of diags) {
    const list = byFile.get(d.file) ?? [];
    list.push(d);
    byFile.set(d.file, list);
  }

  const lines: string[] = [];
  for (const [file, fileDiags] of byFile) {
    lines.push(`✗ ${file}`);
    for (const d of fileDiags) {
      const loc = d.line > 0 ? `[${d.line}] ` : "";
      lines.push(`  ${loc}error [${d.category}] ${d.message}`);
    }
  }
  lines.push("");
  lines.push(
    `FAIL — ${fileCount} file${fileCount === 1 ? "" : "s"}, ${diags.length} error${diags.length === 1 ? "" : "s"}.`,
  );
  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// runLint — router entry
// ---------------------------------------------------------------------------

function lintHelp(): string {
  return [
    "Usage: gen-design lint [--chat-root <dir>]",
    "",
    "Options:",
    "  --chat-root <dir>   chat.md 루트 디렉토리 (기본: cwd)",

    "  --help, -h          도움말",
    "",
    "검증 카테고리: frontmatter / grammar / catalog-ref / shell-inherit / naming",
  ].join("\n") + "\n";
}

export async function runLint(argv: string[]): Promise<RouterResult> {
  const parsed = parseLintArgs(argv);
  if ("error" in parsed) {
    return { exitCode: 2, stdout: "", stderr: `Error: ${parsed.error}\n\n${lintHelp()}` };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: lintHelp(), stderr: "" };
  }

  const chatRoot = resolve(parsed.chatRoot ?? process.cwd());
  const catalogPath = resolveCatalogPath(chatRoot);
  const schemaPath = resolveSchemaPath(chatRoot);

  const files = scanChatFiles(chatRoot);
  if (files.length === 0) {
    return { exitCode: 0, stdout: "No chat.md files found.\n", stderr: "" };
  }

  const diags: ChatLintDiag[] = [
    ...checkFrontmatter(files),
    ...checkGrammar(files, catalogPath, schemaPath),
    ...checkCatalogRef(files, catalogPath, schemaPath),
    ...checkShellInherit(files, chatRoot, catalogPath),
    ...checkNaming(files),
  ];

  const report = formatLintReport(diags, files.length);
  const exitCode = diags.length === 0 ? 0 : 1;
  return { exitCode, stdout: report, stderr: "" };
}
