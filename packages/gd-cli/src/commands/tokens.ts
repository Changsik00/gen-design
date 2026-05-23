/**
 * gd tokens — tokens.json 조회 명령.
 *
 * 사용:
 *   gd tokens list [--category <color|radius|fontFamily>] [--tokens-root <path>]
 *   gd tokens find <keyword> [--tokens-root <path>]
 *   gd tokens show <name> [--tokens-root <path>]
 *   gd tokens --help
 *
 * 종료 코드: 0 (성공) / 1 (파싱 실패·이름 없음) / 2 (사용법 위반)
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface TokensArgs {
  subcommand?: "list" | "find" | "show";
  category?: string;
  keyword?: string;
  name?: string;
  tokensRoot?: string;
  help?: boolean;
}

export function parseTokensArgs(argv: string[]): TokensArgs | { error: string } {
  const args: TokensArgs = {};

  if (argv.length === 0) {
    return { error: "서브명령이 필요합니다: list | find | show" };
  }

  const first = argv[0];
  if (first === "--help" || first === "-h") {
    args.help = true;
    return args;
  }

  if (first !== "list" && first !== "find" && first !== "show") {
    return { error: `알 수 없는 서브명령: ${first}\n사용 가능: list | find | show` };
  }

  args.subcommand = first;
  const rest = argv.slice(1);

  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--category") {
      const next = rest[++i];
      if (!next) return { error: "--category requires a value" };
      args.category = next;
    } else if (a === "--tokens-root") {
      const next = rest[++i];
      if (!next) return { error: "--tokens-root requires a path argument" };
      args.tokensRoot = next;
    } else if (a && a.startsWith("--")) {
      return { error: `알 수 없는 옵션: ${a}` };
    } else if (args.subcommand === "find" && !args.keyword) {
      args.keyword = a;
    } else if (args.subcommand === "show" && !args.name) {
      args.name = a;
    }
  }

  if (args.subcommand === "find" && !args.keyword && !args.help) {
    return { error: "find: 키워드가 필요합니다" };
  }
  if (args.subcommand === "show" && !args.name && !args.help) {
    return { error: "show: 토큰 이름이 필요합니다" };
  }

  return args;
}

// ---------------------------------------------------------------------------
// Token data model
// ---------------------------------------------------------------------------

export interface TokenEntry {
  name: string;
  category: string;
  type: string;
  light: string;
  dark: string;
  description: string;
}

type DtcgValue = string | { light?: string; dark?: string };

interface DtcgToken {
  $type?: string;
  $value?: DtcgValue;
  $description?: string;
  [key: string]: unknown;
}

function flattenCategory(
  category: string,
  obj: Record<string, DtcgToken>,
): TokenEntry[] {
  const entries: TokenEntry[] = [];
  for (const [key, token] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (typeof token !== "object" || token === null) continue;
    if (!("$value" in token)) continue;

    const val = token.$value as DtcgValue;
    let light = "";
    let dark = "";

    if (typeof val === "string") {
      light = val;
    } else if (typeof val === "object" && val !== null) {
      light = val.light ?? "";
      dark = val.dark ?? "";
    }

    entries.push({
      name: key,
      category,
      type: token.$type ?? "",
      light,
      dark,
      description: token.$description ?? "",
    });
  }
  return entries;
}

export function loadTokens(tokensRoot: string): TokenEntry[] {
  const tokensPath = resolve(tokensRoot, "tokens.json");
  if (!existsSync(tokensPath)) {
    throw new Error(`tokens.json 을 찾을 수 없습니다: ${tokensPath}`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(tokensPath, "utf-8"));
  } catch (e) {
    throw new Error(`tokens.json 파싱 실패: ${(e as Error).message}`);
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("tokens.json 최상위가 객체가 아닙니다 (DTCG 형식 위반)");
  }

  const allEntries: TokenEntry[] = [];
  for (const [cat, catObj] of Object.entries(raw as Record<string, unknown>)) {
    if (cat.startsWith("$")) continue;
    if (typeof catObj !== "object" || catObj === null) continue;
    allEntries.push(...flattenCategory(cat, catObj as Record<string, DtcgToken>));
  }
  return allEntries;
}

// ---------------------------------------------------------------------------
// ANSI helpers
// ---------------------------------------------------------------------------

const useColor = (): boolean =>
  !!(process.stdout.isTTY && !process.env["NO_COLOR"]);

function bold(s: string): string {
  return useColor() ? `\x1b[1m${s}\x1b[0m` : s;
}

function dim(s: string): string {
  return useColor() ? `\x1b[2m${s}\x1b[0m` : s;
}

const CATEGORY_LABEL: Record<string, string> = {
  color: "색상",
  radius: "반경",
  fontFamily: "폰트",
};

function categoryLabel(cat: string): string {
  return CATEGORY_LABEL[cat] ?? cat;
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatList(entries: TokenEntry[]): string {
  const byCategory = new Map<string, TokenEntry[]>();
  for (const e of entries) {
    if (!byCategory.has(e.category)) byCategory.set(e.category, []);
    byCategory.get(e.category)!.push(e);
  }

  const lines: string[] = [];
  const bar = "━".repeat(50);
  lines.push(`${bar}`);
  lines.push(bold(` gd tokens — 토큰 목록 (${entries.length}개)`));
  lines.push(`${bar}`);
  lines.push("");

  for (const [cat, catEntries] of byCategory) {
    lines.push(bold(`[${categoryLabel(cat)}] (${catEntries.length})`));
    for (const e of catEntries) {
      const namePad = e.name.padEnd(28);
      const lightPad = `light: ${e.light}`.padEnd(32);
      const darkPart = e.dark ? `dark: ${e.dark}`.padEnd(32) : "".padEnd(32);
      const desc = dim(e.description);
      lines.push(`  ${namePad}  ${lightPad}  ${darkPart}  ${desc}`);
    }
    lines.push("");
  }

  lines.push(dim(`총 ${entries.length}개 토큰`));
  return lines.join("\n") + "\n";
}

function formatShow(entry: TokenEntry): string {
  const lines: string[] = [];
  const bar = "━".repeat(50);
  lines.push(`${bar}`);
  lines.push(bold(` gd tokens show — ${entry.name}`));
  lines.push(`${bar}`);
  lines.push(`  CSS 변수명   --${entry.name}`);
  lines.push(`  카테고리     ${categoryLabel(entry.category)}`);
  lines.push(`  타입         ${entry.type}`);
  if (entry.light) lines.push(`  라이트       ${entry.light}`);
  if (entry.dark) lines.push(`  다크         ${entry.dark}`);
  if (!entry.dark && entry.light) lines.push(`  값           ${entry.light}`);
  if (entry.description) lines.push(`  설명         ${entry.description}`);
  lines.push(`${bar}`);
  return lines.join("\n") + "\n";
}

function helpText(): string {
  return [
    "사용: gd tokens <subcommand> [options]",
    "",
    "Subcommands:",
    "  list [--category <color|radius|fontFamily>]  전체 토큰 목록 출력",
    "  find <keyword>                               이름·설명 키워드 검색",
    "  show <name>                                  단일 토큰 상세 보기",
    "",
    "Options:",
    "  --tokens-root <path>  tokens.json 탐색 기준 경로 (기본: templates/assets/tokens)",
    "  --help, -h            사용법 출력",
    "",
    "종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)",
  ].join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

export async function runTokens(
  argv: string[],
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const parsed = parseTokensArgs(argv);

  if ("error" in parsed) {
    return { exitCode: 2, stdout: "", stderr: `오류: ${parsed.error}\n\n${helpText()}` };
  }

  if (parsed.help || !parsed.subcommand) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  const tokensRoot = resolve(
    parsed.tokensRoot ?? join("templates", "assets", "tokens"),
  );

  let entries: TokenEntry[];
  try {
    entries = loadTokens(tokensRoot);
  } catch (e) {
    return { exitCode: 1, stdout: "", stderr: `오류: ${(e as Error).message}\n` };
  }

  if (parsed.subcommand === "list") {
    const filtered = parsed.category
      ? entries.filter((e) => e.category === parsed.category)
      : entries;
    if (filtered.length === 0) {
      return {
        exitCode: 1,
        stdout: "",
        stderr: `카테고리 '${parsed.category}' 에 해당하는 토큰이 없습니다.\n`,
      };
    }
    return { exitCode: 0, stdout: formatList(filtered), stderr: "" };
  }

  if (parsed.subcommand === "find") {
    const kw = parsed.keyword!.toLowerCase();
    const matched = entries.filter(
      (e) => e.name.toLowerCase().includes(kw) || e.description.toLowerCase().includes(kw),
    );
    if (matched.length === 0) {
      return {
        exitCode: 0,
        stdout: `'${parsed.keyword}' 에 해당하는 토큰이 없습니다.\n`,
        stderr: "",
      };
    }
    return { exitCode: 0, stdout: formatList(matched), stderr: "" };
  }

  if (parsed.subcommand === "show") {
    const entry = entries.find((e) => e.name === parsed.name);
    if (!entry) {
      return {
        exitCode: 1,
        stdout: "",
        stderr: `'${parsed.name}' 토큰을 찾을 수 없습니다.\n`,
      };
    }
    return { exitCode: 0, stdout: formatShow(entry), stderr: "" };
  }

  return { exitCode: 2, stdout: "", stderr: helpText() };
}
