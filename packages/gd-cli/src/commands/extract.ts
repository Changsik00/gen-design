/**
 * gen-design extract — chat.md v2 Scenarios/API → MSW 핸들러 스텁 + API spec 생성.
 *
 * 사용:
 *   gen-design extract <chat-file>
 *   gen-design extract --all [--chat-root <dir>]
 *   gen-design extract <chat-file> --dry-run
 *
 * 출력:
 *   <slug>.msw.ts       — MSW v2 핸들러 스텁 (chat.md 옆)
 *   <slug>.api-spec.md  — API 계약 문서 (API 섹션 있을 때만)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import yaml from "js-yaml";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtractArgs {
  chatFile?: string;
  all?: boolean;
  chatRoot?: string;
  dryRun?: boolean;
  help?: boolean;
}

export interface Scenario {
  name: string;
  description?: string;
  state?: "pending" | "error";
  data?: Record<string, unknown>;
  message?: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description?: string;
  params?: Record<string, { type?: string; default?: unknown }>;
  response?: Record<string, unknown>;
}

export interface RunResult {
  exitCode: 0 | 1 | 2;
  stdout: string;
  stderr: string;
}

export interface RunExtractOptions {
  captureWrite?: (path: string, content: string) => void;
  readFile?: (path: string) => string;
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

export function parseExtractArgs(argv: string[]): ExtractArgs | { error: string } {
  const args: ExtractArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--all") {
      args.all = true;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else if (a === "--chat-root") {
      const next = argv[++i];
      if (!next) return { error: "--chat-root requires a path argument" };
      args.chatRoot = next;
    } else if (a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    } else if (!args.chatFile) {
      args.chatFile = a;
    } else {
      return { error: `Unexpected argument: ${a}` };
    }
  }
  if (args.help) return args;
  if (!args.chatFile && !args.all) {
    return { error: "Missing <chat-file> argument or --all flag" };
  }
  return args;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

export function getFrontmatterVersion(content: string): number | null {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  const versionMatch = fm.match(/^version:\s*(\d+)/m);
  if (!versionMatch) return 1;
  return parseInt(versionMatch[1], 10);
}

export function parseSectionYaml(content: string, sectionKeyword: string): unknown | null {
  const lines = content.split("\n");
  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inSection) break;
      if (line.includes(sectionKeyword)) {
        inSection = true;
        continue;
      }
    }
    if (inSection) sectionLines.push(line);
  }

  if (!inSection) return null;

  const sectionContent = sectionLines.join("\n");
  const yamlMatch = sectionContent.match(/```yaml\n([\s\S]*?)```/);
  if (!yamlMatch) return null;

  return yaml.load(yamlMatch[1]);
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => (c as string).toUpperCase());
}

export function generateMswHandlers(
  slug: string,
  scenarios: Scenario[],
  apis: ApiEndpoint[],
): string {
  const handlersName = `${toCamelCase(slug)}Handlers`;

  const scenarioBlocks = scenarios.map((scenario) => {
    let handlerLines: string[];

    if (scenario.state === "pending") {
      handlerLines =
        apis.length > 0
          ? apis.map(
              (api) =>
                `    http.${api.method.toLowerCase()}('${api.path}', async () => {\n      await delay('infinite')\n      return HttpResponse.json({})\n    })`,
            )
          : [`    // TODO: add loading handlers for '${scenario.name}' scenario`];
    } else if (scenario.state === "error") {
      const msg = scenario.message;
      handlerLines =
        apis.length > 0
          ? apis.map((api) => {
              const method = api.method.toLowerCase();
              if (msg) {
                return `    http.${method}('${api.path}', () => new HttpResponse(\n      JSON.stringify({ message: ${JSON.stringify(msg)} }),\n      { status: 500, headers: { 'Content-Type': 'application/json' } }\n    ))`;
              }
              return `    http.${method}('${api.path}', () => new HttpResponse(null, { status: 500 }))`;
            })
          : [`    // TODO: add error handlers for '${scenario.name}' scenario`];
    } else {
      const data = scenario.data ?? {};
      handlerLines =
        apis.length > 0
          ? apis.map((api) => {
              const method = api.method.toLowerCase();
              const responseData = api.response ?? data;
              return `    http.${method}('${api.path}', () => HttpResponse.json(${JSON.stringify(responseData, null, 2).replace(/\n/g, "\n    ")}))`;
            })
          : [`    // TODO: add loaded handlers for '${scenario.name}' scenario`];
    }

    return `  ${scenario.name}: [\n${handlerLines.join(",\n")},\n  ]`;
  });

  return [
    `import { http, HttpResponse, delay } from 'msw'`,
    ``,
    `// Generated from chat.md v2 Scenarios layer`,
    `// Run 'gen-design extract' to regenerate`,
    `export const ${handlersName} = {`,
    scenarioBlocks.join(",\n"),
    `}`,
    ``,
  ].join("\n");
}

export function generateApiSpec(slug: string, apis: ApiEndpoint[]): string {
  const lines: string[] = [
    `# API Spec: ${slug}`,
    ``,
    `> Generated from \`chats/scenes/${slug}.chat.md\` — do not edit manually.`,
    `> Run \`gen-design extract\` to regenerate.`,
    ``,
  ];

  if (apis.length === 0) {
    lines.push("No API endpoints defined.");
    return lines.join("\n");
  }

  lines.push("## Endpoints", "");
  lines.push("| Method | Path | Description |");
  lines.push("|---|---|---|");
  for (const api of apis) {
    lines.push(`| \`${api.method}\` | \`${api.path}\` | ${api.description ?? ""} |`);
  }
  lines.push("");

  for (const api of apis) {
    lines.push(`### ${api.method} ${api.path}`, "");
    if (api.description) lines.push(`${api.description}`, "");
    if (api.params) {
      lines.push("**Params:**", "");
      for (const [key, val] of Object.entries(api.params)) {
        const v = (typeof val === "object" && val !== null ? val : {}) as {
          type?: string;
        };
        lines.push(`- \`${key}\`: ${v.type ?? "unknown"}`);
      }
      lines.push("");
    }
    if (api.response) {
      lines.push("**Response:**", "");
      lines.push("```json");
      lines.push(JSON.stringify(api.response, null, 2));
      lines.push("```", "");
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// File collection
// ---------------------------------------------------------------------------

function collectChatFiles(dir: string): string[] {
  const results: string[] = [];
  function walk(current: string): void {
    try {
      const { readdirSync, statSync } = require("node:fs") as typeof import("node:fs");
      for (const entry of readdirSync(current)) {
        const full = join(current, entry);
        try {
          const stat = statSync(full);
          if (stat.isDirectory()) {
            walk(full);
          } else if (entry.endsWith(".chat.md")) {
            results.push(full);
          }
        } catch {
          // skip unreadable entries
        }
      }
    } catch {
      // skip unreadable directory
    }
  }
  walk(dir);
  return results;
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export async function runExtract(
  argv: string[],
  opts: RunExtractOptions = {},
): Promise<RunResult> {
  const parsed = parseExtractArgs(argv);
  if ("error" in parsed) {
    return { exitCode: 2, stdout: "", stderr: `Error: ${parsed.error}\n` };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: helpText(), stderr: "" };
  }

  const chatRoot = parsed.chatRoot
    ? isAbsolute(parsed.chatRoot)
      ? parsed.chatRoot
      : resolve(parsed.chatRoot)
    : resolve("chats");

  let files: string[] = [];
  if (parsed.all) {
    files = collectChatFiles(chatRoot);
  } else if (parsed.chatFile) {
    files = [isAbsolute(parsed.chatFile) ? parsed.chatFile : resolve(parsed.chatFile)];
  }

  const outLines: string[] = [];
  const errLines: string[] = [];

  const readContent = opts.readFile ?? ((p: string) => readFileSync(p, "utf-8"));

  for (const file of files) {
    let content: string;
    try {
      content = readContent(file);
    } catch {
      errLines.push(`[skip] Cannot read: ${file}`);
      continue;
    }

    const version = getFrontmatterVersion(content);
    if (version !== 2) {
      outLines.push(`[skip] Not v2 format: ${file}`);
      continue;
    }

    let scenarios: Scenario[] | null = null;
    let apis: ApiEndpoint[] | null = null;

    try {
      const rawScenarios = parseSectionYaml(content, "Scenarios");
      if (Array.isArray(rawScenarios)) scenarios = rawScenarios as Scenario[];
    } catch (e) {
      errLines.push(
        `[error] Failed to parse Scenarios in ${file}: ${(e as Error).message}`,
      );
      continue;
    }

    try {
      const rawApis = parseSectionYaml(content, "API");
      if (Array.isArray(rawApis)) apis = rawApis as ApiEndpoint[];
    } catch (e) {
      errLines.push(`[error] Failed to parse API in ${file}: ${(e as Error).message}`);
      continue;
    }

    if (!scenarios) {
      outLines.push(`[skip] No Scenarios section: ${file}`);
      continue;
    }

    const slug = basename(file, ".chat.md");
    const dir = dirname(file);

    const mswContent = generateMswHandlers(slug, scenarios, apis ?? []);
    const mswPath = join(dir, `${slug}.msw.ts`);

    if (parsed.dryRun) {
      outLines.push(`[dry-run] Would write: ${mswPath}`);
    } else {
      if (opts.captureWrite) {
        opts.captureWrite(mswPath, mswContent);
      } else {
        writeFileSync(mswPath, mswContent, "utf-8");
      }
      outLines.push(`✓ ${mswPath}`);
    }

    if (apis && apis.length > 0) {
      const specContent = generateApiSpec(slug, apis);
      const specPath = join(dir, `${slug}.api-spec.md`);
      if (parsed.dryRun) {
        outLines.push(`[dry-run] Would write: ${specPath}`);
      } else {
        if (opts.captureWrite) {
          opts.captureWrite(specPath, specContent);
        } else {
          writeFileSync(specPath, specContent, "utf-8");
        }
        outLines.push(`✓ ${specPath}`);
      }
    }
  }

  const hasError = errLines.length > 0;
  return {
    exitCode: hasError ? 1 : 0,
    stdout: outLines.join("\n") + (outLines.length ? "\n" : ""),
    stderr: errLines.join("\n") + (errLines.length ? "\n" : ""),
  };
}

function helpText(): string {
  return `Usage: gen-design extract <chat-file> [options]
         gen-design extract --all [options]

Options:
  --chat-root <path>   chats/ 디렉토리 (기본: ./chats, --all 사용 시)
  --dry-run            파일 미생성, 결과만 stdout 출력
  --help, -h           도움말

Examples:
  gen-design extract chats/scenes/dashboard.chat.md
  gen-design extract --all --chat-root chats
`;
}
