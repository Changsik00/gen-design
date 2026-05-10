#!/usr/bin/env node
/**
 * gen-design — ADR-009 D-1 단일 CLI 진입점.
 *
 * 사용:
 *   pnpm gen-design <subcommand> [args...]
 *
 * 지원 subcommand (현재):
 *   - paper-import   Paper tree.json → enriched / chat.md (spec-08-05)
 *
 * 추가 예정 (후속 spec):
 *   - lint           catalog ↔ chats 정합 검증 (spec-08-09)
 *   - merge          chat → 글로벌 SSOT 누적 + shell 승격 (spec-08-08, 조력자)
 *   - react          catalog → shadcn registry (phase-9)
 *   - paper          chat.md → Paper tree (compileToPaper CLI)
 *   - diff           글로벌 SSOT vs studio 코드 비교
 */

import { runPaperImport } from "./gen-design/paper-import";

type Handler = (argv: string[]) => Promise<{ exitCode: number; stdout: string; stderr: string }>;

const COMMANDS: Record<string, Handler> = {
  "paper-import": runPaperImport,
};

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  "paper-import": "Paper tree.json → enriched JSON or chat.md (spec-08-05)",
};

export interface RouterResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export async function runRouter(argv: string[]): Promise<RouterResult> {
  const [cmd, ...rest] = argv;

  if (!cmd || cmd === "--help" || cmd === "-h") {
    return { exitCode: 0, stdout: rootHelp(), stderr: "" };
  }

  const handler = COMMANDS[cmd];
  if (!handler) {
    return {
      exitCode: 2,
      stdout: "",
      stderr: `Unknown command: ${cmd}\n\n${rootHelp()}`,
    };
  }

  return handler(rest);
}

function rootHelp(): string {
  const lines = ["Usage: gen-design <subcommand> [options]", "", "Subcommands:"];
  for (const [name, desc] of Object.entries(COMMAND_DESCRIPTIONS)) {
    lines.push(`  ${name.padEnd(16)} ${desc}`);
  }
  lines.push("", "Run 'gen-design <subcommand> --help' for command-specific help.");
  return lines.join("\n") + "\n";
}

async function main(): Promise<void> {
  const result = await runRouter(process.argv.slice(2));
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr.endsWith("\n") ? result.stderr : result.stderr + "\n");
  process.exit(result.exitCode);
}

const scriptUrl = `file://${process.argv[1]}`;
if (import.meta.url === scriptUrl || process.argv[1].endsWith("gen-design.ts")) {
  void main();
}
