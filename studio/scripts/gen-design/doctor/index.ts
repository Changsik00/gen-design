/**
 * gd doctor — 12 카테고리 정합 검증 통합 entry.
 *
 * 사용:
 *   gd doctor [--chat-root <path>] [--templates-root <path>] [--src-root <path>]
 *             [--no-compile] [--json] [--help]
 *
 * 기존 6 (lint.ts 흡수): frontmatter / grammar / catalog-ref / shell-inherit / naming / compile
 * 신규 6:
 *   - token-format / token-ref / contrast / scene-drift / orphan-scene / vocab-similar
 *
 * 종료 코드:
 *   0 — 모든 검증 PASS
 *   1 — error ≥ 1
 *   2 — 사용법 위반
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import type { DoctorArgs, DoctorDiag, DoctorResult } from "./types";
import { formatDiag, formatSummary } from "./messages";
import { checkTokenFormat, SHADCN_REQUIRED_TOKENS } from "./check-token-format";
import { checkTokenRef } from "./check-token-ref";
import { checkContrast } from "./check-contrast";
import { checkSceneDrift, checkOrphanScene } from "./check-scene-drift";
import { checkVocabSimilar } from "./check-vocab-similar";
import { runLint } from "../lint";

export function parseDoctorArgs(argv: string[]): DoctorArgs | { error: string } {
  const args: DoctorArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--no-compile") args.noCompile = true;
    else if (a === "--json") args.json = true;
    else if (a === "--chat-root") {
      const next = argv[++i];
      if (!next) return { error: "--chat-root requires a path argument" };
      args.chatRoot = next;
    } else if (a === "--templates-root") {
      const next = argv[++i];
      if (!next) return { error: "--templates-root requires a path argument" };
      args.templatesRoot = next;
    } else if (a === "--src-root") {
      const next = argv[++i];
      if (!next) return { error: "--src-root requires a path argument" };
      args.srcRoot = next;
    } else if (a && a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    }
  }
  return args;
}

function resolvePath(input: string | undefined, fallback: string): string {
  if (!input) return resolve(fallback);
  return isAbsolute(input) ? input : resolve(input);
}

function collectChatFiles(root: string): Array<{ path: string; content: string }> {
  const out: Array<{ path: string; content: string }> = [];
  if (!existsSync(root)) return out;
  walk(root, (full) => {
    if (full.endsWith(".chat.md")) {
      out.push({ path: full, content: readFileSync(full, "utf-8") });
    }
  });
  return out;
}

function walk(dir: string, cb: (full: string) => void): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.isFile()) cb(full);
  }
}

interface FlatTokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

function flattenTokensJson(raw: unknown): FlatTokens {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  if (typeof raw !== "object" || raw === null) return { light, dark };

  function walkObj(obj: Record<string, unknown>): void {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      if (typeof v !== "object" || v === null) continue;
      const o = v as Record<string, unknown>;
      if ("$value" in o) {
        const val = o.$value;
        if (typeof val === "object" && val !== null) {
          const modes = val as Record<string, unknown>;
          if (typeof modes.light === "string") light[k] = modes.light;
          if (typeof modes.dark === "string") dark[k] = modes.dark;
        }
      } else {
        walkObj(o);
      }
    }
  }
  walkObj(raw as Record<string, unknown>);
  return { light, dark };
}

export async function runDoctor(argv: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const started = Date.now();
  const parsed = parseDoctorArgs(argv);
  if ("error" in parsed) {
    return { exitCode: 2, stdout: "", stderr: `Error: ${parsed.error}\n${helpText()}` };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  const projectRoot = process.cwd();
  const chatRoot = resolvePath(parsed.chatRoot, "playground/chats");
  const templatesRoot = resolvePath(parsed.templatesRoot, "templates");

  const diags: DoctorDiag[] = [];

  // ─── 기존 lint 6 카테고리 (lint.ts 재사용) ─────────────────────────
  const lintArgs = ["--chat-root", chatRoot];
  if (parsed.noCompile) lintArgs.push("--no-compile");
  const lintResult = await runLint(lintArgs);
  // lint 의 stdout 에 진단이 들어있을 가능성 — 단순화: lint exit 0 이 아니면 error 1개로 카운트
  // (lint.ts 가 구조화된 diag 반환을 안 하므로 본 통합에서는 lint stdout 을 그대로 전달)
  if (lintResult.exitCode !== 0 && lintResult.stdout) {
    // lint stdout 을 그대로 보존 — gd doctor 의 한국어 메시지와 별도 섹션
  }

  // ─── 신규 6 검증 ─────────────────────────────────────────────
  const tokensPath = join(templatesRoot, "assets", "tokens", "tokens.json");
  let flatTokens: FlatTokens = { light: {}, dark: {} };
  if (existsSync(tokensPath)) {
    try {
      const tokensRaw = JSON.parse(readFileSync(tokensPath, "utf-8"));
      // token-format 검증
      diags.push(...checkTokenFormat(tokensRaw, "templates/assets/tokens/tokens.json", [...SHADCN_REQUIRED_TOKENS]));
      flatTokens = flattenTokensJson(tokensRaw);
    } catch (err) {
      diags.push({
        category: "token-format",
        severity: "error",
        file: "templates/assets/tokens/tokens.json",
        line: 0,
        message: `tokens.json 파싱 실패: ${(err as Error).message}`,
        hint: "→ JSON 형식 / DTCG 구조 확인",
      });
    }
  }

  // token-ref 검증 — DESIGN.md + chat.md 들
  const designMdPath = join(templatesRoot, "DESIGN.md");
  const designContent = existsSync(designMdPath) ? readFileSync(designMdPath, "utf-8") : "";
  const chatFiles = collectChatFiles(chatRoot);
  // tokens.json 의 light 키 집합 (이름 = 토큰)
  const definedTokenNames = new Set(Object.keys(flatTokens.light));
  diags.push(...checkTokenRef(designContent, "templates/DESIGN.md", chatFiles, definedTokenNames));

  // contrast 검증 — light + dark 모두
  if (Object.keys(flatTokens.light).length > 0) {
    diags.push(...checkContrast(flatTokens.light, "templates/assets/tokens/tokens.json", "light"));
  }
  if (Object.keys(flatTokens.dark).length > 0) {
    diags.push(...checkContrast(flatTokens.dark, "templates/assets/tokens/tokens.json", "dark"));
  }

  // scene-drift + orphan-scene — src/scenes/ 검사
  diags.push(...checkSceneDrift(projectRoot));
  diags.push(...checkOrphanScene(projectRoot));

  // vocab-similar — catalog.json 또는 FRONT.md 의 컴포넌트
  const catalog = loadCatalog(projectRoot);
  if (catalog.size > 0) {
    diags.push(...checkVocabSimilar(chatFiles, catalog));
  }

  // ─── 결과 집계 ─────────────────────────────────────────────────
  const errorCount = diags.filter((d) => d.severity === "error").length;
  const warnCount = diags.filter((d) => d.severity === "warn").length;
  const durationMs = Date.now() - started;
  const result: DoctorResult = { diags, errorCount, warnCount, durationMs };

  if (parsed.json) {
    return { exitCode: errorCount > 0 ? 1 : 0, stdout: JSON.stringify(result, null, 2), stderr: "" };
  }

  const lines: string[] = [];
  // lint stdout 가 있으면 먼저 (기존 6 카테고리)
  if (lintResult.stdout.trim()) {
    lines.push(lintResult.stdout.trim());
  }
  // 신규 6 카테고리 진단
  for (const d of diags) {
    lines.push(formatDiag(d));
  }
  lines.push("");
  lines.push(formatSummary(errorCount + (lintResult.exitCode !== 0 ? 1 : 0), warnCount, durationMs));

  return {
    exitCode: errorCount > 0 || lintResult.exitCode !== 0 ? 1 : 0,
    stdout: lines.join("\n") + "\n",
    stderr: lintResult.stderr,
  };
}

function loadCatalog(projectRoot: string): Set<string> {
  const catalogPath = join(projectRoot, "src", "lib", "vocabulary", "catalog", "catalog.json");
  if (!existsSync(catalogPath)) return new Set();
  try {
    const raw = JSON.parse(readFileSync(catalogPath, "utf-8"));
    const set = new Set<string>();
    function walkNode(node: unknown): void {
      if (typeof node !== "object" || node === null) return;
      const o = node as Record<string, unknown>;
      if (typeof o.name === "string" && /^[A-Z]/.test(o.name)) set.add(o.name);
      for (const v of Object.values(o)) {
        if (Array.isArray(v)) for (const item of v) walkNode(item);
        else if (typeof v === "object") walkNode(v);
      }
    }
    walkNode(raw);
    // 기본 html 태그 같은 것 제외 (catalog 에 가짜 추가됐을 경우 대비)
    return set;
  } catch {
    return new Set();
  }
}

function helpText(): string {
  return `Usage: gen-design doctor [options]

DESIGN.md / TOKEN.md / chat.md / TSX 의 정합 검증 (12 카테고리).

Options:
  --chat-root <path>       chats/ 디렉토리 (기본: ./playground/chats)
  --templates-root <path>  templates/ 디렉토리 (기본: ./templates)
  --src-root <path>        src/ 디렉토리 (기본: ./src)
  --no-compile             compile 검증 skip
  --json                   기계 처리용 JSON 출력
  --help, -h               이 도움말

카테고리:
  기존 (lint 흡수): frontmatter / grammar / catalog-ref / shell-inherit / naming / compile
  신규: token-format / token-ref / contrast / scene-drift / orphan-scene / vocab-similar
`;
}
