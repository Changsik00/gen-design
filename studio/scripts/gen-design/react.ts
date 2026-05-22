/**
 * gen-design react — scene slug → 단일 TSX (shell.inherit 해석 포함).
 *
 * 사용:
 *   gen-design react <scene-slug>
 *   gen-design react <scene-slug> --chat-root playground/chats
 *   gen-design react <scene-slug> --output LoginScene.tsx
 *   gen-design react <scene-slug> --no-shell    # scene 단독 컴파일
 *
 * 옵션:
 *   --chat-root <path>     chats/ 디렉토리 (기본: 현재 디렉토리)
 *   --output <path>        TSX 파일 저장 (기본: stdout)
 *   --no-shell             shell.inherit 무시 (scene 단독)
 *   --help, -h
 *
 * 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)
 */

import { writeFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { compileScene } from "../../src/lib/chat-md-compiler/react/compile-scene";

/**
 * gd doctor 의 scene-drift / orphan-scene 검증을 위해 컴파일된 TSX 의 *최상단* 에
 * `// @gd: <chat-relative-path>` annotation 자동 삽입.
 *
 * - 위치: 첫 줄 (lat.md 호환)
 * - 경로: workspace 기준 *상대 경로* (예: `chats/scenes/login.chat.md`)
 * - doctor 가 본 annotation 으로 chat ↔ TSX mtime 비교 + orphan 감지
 */
export function prependGdAnnotation(tsx: string, chatRelPath: string): string {
  const annotation = `// @gd: ${chatRelPath}\n`;
  // 이미 annotation 있으면 교체 (재컴파일 시 idempotent)
  const firstLine = tsx.split("\n", 1)[0] ?? "";
  if (/^\/\/\s*@gd:/.test(firstLine)) {
    const rest = tsx.slice(firstLine.length + 1);
    return annotation + rest;
  }
  return annotation + tsx;
}

export interface ReactArgs {
  slug?: string;
  chatRoot?: string;
  output?: string;
  noShell?: boolean;
  help?: boolean;
}

export function parseReactArgs(argv: string[]): ReactArgs | { error: string } {
  const args: ReactArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--no-shell") args.noShell = true;
    else if (a === "--chat-root") {
      const next = argv[++i];
      if (!next) return { error: "--chat-root requires a path argument" };
      args.chatRoot = next;
    } else if (a === "--output") {
      const next = argv[++i];
      if (!next) return { error: "--output requires a path argument" };
      args.output = next;
    } else if (a.startsWith("--")) {
      return { error: `Unknown option: ${a}` };
    } else if (!args.slug) {
      args.slug = a;
    } else {
      return { error: `Unexpected argument: ${a}` };
    }
  }
  if (args.help) return args;
  if (!args.slug) return { error: "Missing <scene-slug> argument" };
  return args;
}

export interface RunReactOptions {
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
  captureWrite?: (path: string, content: string) => void;
}

export interface RunResult {
  exitCode: 0 | 1 | 2;
  stdout: string;
  stderr: string;
}

export async function runReact(argv: string[], opts: RunReactOptions = {}): Promise<RunResult> {
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  const parsed = parseReactArgs(argv);
  if ("error" in parsed) {
    stderrLines.push(`Error: ${parsed.error}`);
    return { exitCode: 2, stdout: "", stderr: stderrLines.join("\n") };
  }
  if (parsed.help) return { exitCode: 0, stdout: helpText(), stderr: "" };

  const chatRoot = parsed.chatRoot
    ? isAbsolute(parsed.chatRoot)
      ? parsed.chatRoot
      : resolve(parsed.chatRoot)
    : resolve("chats");

  const result = compileScene(parsed.slug!, {
    chatRoot,
    noShell: parsed.noShell,
  });

  if (!result.ok) {
    for (const e of result.errors) stderrLines.push(`[${e.stage}] ${e.message}`);
    return { exitCode: 1, stdout: "", stderr: stderrLines.join("\n") };
  }

  const rawTsx = result.tsx ?? "";
  // project root 기준 상대 경로 (chatRoot 의 부모 = project root 컨벤션)
  // spec-11-05 fix #2 — 이전엔 process.cwd() 기준이라 pnpm --filter studio 호출 시
  // ../experiments/... 같은 부정확한 경로 출력. 이제 chatRoot 부모 기준으로 안정.
  // doctor 가 같은 기준 (chatRoot 부모 = project root) 로 비교.
  const chatPath = resolve(chatRoot, "scenes", `${parsed.slug}.chat.md`);
  const projectRoot = resolve(chatRoot, "..");
  const chatRelPath = relative(projectRoot, chatPath);
  const tsx = prependGdAnnotation(rawTsx, chatRelPath);

  if (parsed.output) {
    if (opts.captureWrite) opts.captureWrite(parsed.output, tsx);
    else writeFileSync(parsed.output, tsx, "utf-8");
    stdoutLines.push(`✓ wrote ${parsed.output} (${tsx.length} bytes)`);
  } else {
    stdoutLines.push(tsx);
  }

  return { exitCode: 0, stdout: stdoutLines.join("\n") + "\n", stderr: stderrLines.join("\n") };
}

function helpText(): string {
  return `Usage: gen-design react <scene-slug> [options]

Options:
  --chat-root <path>    chats/ directory (default: ./chats)
  --output <path>       Write TSX to file instead of stdout
  --no-shell            Skip shell.inherit merge (scene only)
  --help, -h            Show this help

Examples:
  gen-design react login --chat-root playground/chats
  gen-design react main --output dist/MainScene.tsx
`;
}
