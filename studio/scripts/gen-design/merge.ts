/**
 * gen-design merge — shell 승격 조력자 (ADR-010 D-4).
 *
 * 사용:
 *   gen-design merge [--chat-root <dir>] [--threshold <N>]   # dry-run: 후보 목록 출력
 *   gen-design merge --apply [--yes]                         # 승격 실행 (y/N 확인)
 *
 * 옵션:
 *   --chat-root <dir>    스캔 기준 디렉토리 (기본: process.cwd())
 *   --threshold <N>      N 개 이상 scene 에서 참조 시 후보 (기본: 3, 최소: 1)
 *   --apply              실제 파일 갱신 (기본: dry-run)
 *   --yes                non-interactive 자동 confirm (--apply 와 함께 사용)
 *   --help, -h
 *
 * 종료 코드: 0 (성공) / 1 (오류) / 2 (사용법 위반)
 *
 * ADR-010 D-4 조력자 원칙:
 *   - 제안 자동 (dry-run 기본)
 *   - 실행은 디자이너 confirm 후 (--apply + y/N)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RouterResult } from "../gen-design";

export interface MergeArgs {
  chatRoot?: string;
  threshold: number;
  apply: boolean;
  yes: boolean;
  help: boolean;
}

export interface Candidate {
  component: string;
  scenes: string[];
}

export function parseMergeArgs(argv: string[]): MergeArgs | { error: string } {
  const args: MergeArgs = {
    chatRoot: undefined,
    threshold: 3,
    apply: false,
    yes: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      args.help = true;
    } else if (a === "--apply") {
      args.apply = true;
    } else if (a === "--yes") {
      args.yes = true;
    } else if (a === "--threshold") {
      const next = argv[++i];
      if (next === undefined) return { error: "--threshold requires a numeric argument" };
      const val = parseInt(next, 10);
      if (isNaN(val) || val < 1) {
        return { error: `--threshold must be an integer >= 1, got: ${next}` };
      }
      args.threshold = val;
    } else if (a === "--chat-root") {
      const next = argv[++i];
      if (next === undefined) return { error: "--chat-root requires a path argument" };
      args.chatRoot = next;
    } else {
      return { error: `Unknown option: ${a}` };
    }
  }

  return args;
}

export function extractComponents(structureSection: string): string[] {
  const seen = new Set<string>();
  const regex = /<([A-Z][A-Za-z0-9]*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(structureSection)) !== null) {
    seen.add(match[1]);
  }
  return [...seen];
}

export interface SceneFile {
  path: string;
  components: string[];
  hasShellInherit: boolean;
}

export function scanScenes(chatRoot: string): SceneFile[] {
  const sceneDirs = [
    join(chatRoot, "playground", "chats", "scenes"),
    join(chatRoot, "chats", "scenes"),
  ];

  const scenes: SceneFile[] = [];
  for (const dir of sceneDirs) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".chat.md")) continue;
      const filePath = join(dir, file);
      const content = readFileSync(filePath, "utf-8");
      const structureMatch = content.match(/##\s+🧩\s+Structure[^\n]*\n([\s\S]*?)(?=\n##\s+|$)/);
      const structureSection = structureMatch ? structureMatch[1] : "";
      const components = extractComponents(structureSection);
      const hasShellInherit = /shell:\s*\n(?:[ \t]+\S[^\n]*\n)*[ \t]+inherit:\s*true/.test(content);
      scenes.push({ path: filePath, components, hasShellInherit });
    }
  }
  return scenes;
}

export function readShellComponents(chatRoot: string): string[] {
  const shellPaths = [
    join(chatRoot, "playground", "chats", "_shell.chat.md"),
    join(chatRoot, "chats", "_shell.chat.md"),
  ];
  for (const p of shellPaths) {
    if (!existsSync(p)) continue;
    const content = readFileSync(p, "utf-8");
    const structureMatch = content.match(/##\s+🧩\s+Structure[^\n]*\n([\s\S]*?)(?=\n##\s+|$)/);
    if (structureMatch) return extractComponents(structureMatch[1]);
  }
  return [];
}

export function detectCandidates(
  scenes: SceneFile[],
  shellComponents: string[],
  threshold: number,
): Candidate[] {
  const counts = new Map<string, string[]>();
  for (const scene of scenes) {
    for (const comp of scene.components) {
      if (!counts.has(comp)) counts.set(comp, []);
      counts.get(comp)!.push(scene.path);
    }
  }

  const shellSet = new Set(shellComponents);
  const candidates: Candidate[] = [];
  for (const [comp, scenePaths] of counts) {
    if (scenePaths.length >= threshold && !shellSet.has(comp)) {
      candidates.push({ component: comp, scenes: scenePaths });
    }
  }
  return candidates;
}

export function buildPreview(candidates: Candidate[]): string {
  if (candidates.length === 0) {
    return "No shell promotion candidates found.\n";
  }
  const lines = ["Shell promotion candidates:", ""];
  for (const c of candidates) {
    lines.push(`  ${c.component}  (${c.scenes.length} scenes)`);
    for (const s of c.scenes) {
      lines.push(`    - ${s}`);
    }
  }
  lines.push("", `Run with --apply to promote these components to _shell.chat.md.`);
  return lines.join("\n") + "\n";
}

export function applyPromotion(
  candidates: Candidate[],
  chatRoot: string,
  today: string,
): void {
  if (candidates.length === 0) return;

  const shellPaths = [
    join(chatRoot, "playground", "chats", "_shell.chat.md"),
    join(chatRoot, "chats", "_shell.chat.md"),
  ];
  const shellPath = shellPaths.find((p) => existsSync(p));
  if (!shellPath) {
    throw new Error("_shell.chat.md not found in playground/chats/ or chats/");
  }

  let shellContent = readFileSync(shellPath, "utf-8");

  for (const c of candidates) {
    const componentLine = `  <${c.component} />\n`;
    shellContent = shellContent.replace(
      /(##\s+🧩\s+Structure[^\n]*\n[\s\S]*?```jsx\n)([\s\S]*?)(```)/,
      (_match, open, body, close) => {
        if (body.includes(`<${c.component}`)) return _match;
        return `${open}${body}  {/* ${c.component} — shell 승격 (gen-design merge) */}\n${componentLine}${close}`;
      },
    );

    const historyLine = `- **${today}** ${c.component} 승격 — ${c.scenes.length} scene 공통 참조 (gen-design merge).`;
    shellContent = shellContent.replace(
      /(##\s+📜\s+History\n)([\s\S]*?)$/,
      (_match, header, body) => `${header}\n${historyLine}\n${body.trimStart()}`,
    );
  }

  writeFileSync(shellPath, shellContent, "utf-8");

  for (const c of candidates) {
    for (const scenePath of c.scenes) {
      let sceneContent = readFileSync(scenePath, "utf-8");
      if (!/shell:/.test(sceneContent)) {
        sceneContent = sceneContent.replace(
          /^(---\n[\s\S]*?)\n(---)/m,
          `$1\nshell:\n  inherit: true\n$2`,
        );
        writeFileSync(scenePath, sceneContent, "utf-8");
      } else if (!/shell:\s*\n(?:[^\n]*\n)*\s*inherit:\s*true/.test(sceneContent)) {
        sceneContent = sceneContent.replace(
          /(shell:\s*\n)([\s\S]*?)(\n(?:---|\S))/,
          (_m, shellKey, body, after) => `${shellKey}${body}\n  inherit: true${after}`,
        );
        writeFileSync(scenePath, sceneContent, "utf-8");
      }
    }
  }
}

function mergeHelp(): string {
  return [
    "Usage: gen-design merge [options]",
    "",
    "Shell 승격 조력자 — ADR-010 D-4 Hybrid 정책 구현.",
    "3+ scene 에서 공통 참조된 component 를 _shell.chat.md 승격 후보로 제시.",
    "",
    "Options:",
    "  --chat-root <dir>    스캔 기준 디렉토리 (기본: process.cwd())",
    "  --threshold <N>      N개 이상 scene 에서 참조 시 후보 (기본: 3, 최소: 1)",
    "  --apply              실제 파일 갱신 (기본: dry-run)",
    "  --yes                non-interactive 자동 confirm (--apply 와 함께)",
    "  --help, -h           이 도움말",
    "",
    "Examples:",
    "  gen-design merge                      # dry-run: 후보 목록만 출력",
    "  gen-design merge --threshold 2        # 2+ scene 공통도 후보로",
    "  gen-design merge --apply              # 후보 confirm 후 적용",
    "  gen-design merge --apply --yes        # non-interactive 자동 적용",
  ].join("\n") + "\n";
}

export async function runMerge(argv: string[]): Promise<RouterResult> {
  const parsed = parseMergeArgs(argv);
  if ("error" in parsed) {
    return { exitCode: 2, stdout: "", stderr: `Error: ${parsed.error}\n\n${mergeHelp()}` };
  }
  if (parsed.help) {
    return { exitCode: 0, stdout: mergeHelp(), stderr: "" };
  }

  const chatRoot = resolve(parsed.chatRoot ?? process.cwd());
  const scenes = scanScenes(chatRoot);
  const shellComponents = readShellComponents(chatRoot);
  const candidates = detectCandidates(scenes, shellComponents, parsed.threshold);
  const preview = buildPreview(candidates);

  if (!parsed.apply || candidates.length === 0) {
    return { exitCode: 0, stdout: preview, stderr: "" };
  }

  let stdout = preview;

  if (!parsed.yes) {
    process.stdout.write(preview);
    process.stdout.write("Proceed with promotion? [y/N] ");
    const answer = await readLine();
    if (!["y", "yes"].includes(answer.trim().toLowerCase())) {
      return { exitCode: 0, stdout: "Aborted.\n", stderr: "" };
    }
    stdout = "";
  }

  const today = new Date().toISOString().slice(0, 10);
  applyPromotion(candidates, chatRoot, today);

  const applied = candidates.map((c) => `  ✓ ${c.component}`).join("\n");
  stdout += `Promoted:\n${applied}\n`;
  return { exitCode: 0, stdout, stderr: "" };
}

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    const onData = (chunk: Buffer) => {
      data += chunk.toString();
      if (data.includes("\n")) {
        process.stdin.removeListener("data", onData);
        process.stdin.pause();
        resolve(data.trim());
      }
    };
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}
