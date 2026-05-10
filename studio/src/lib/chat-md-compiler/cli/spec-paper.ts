/**
 * spec-paper CLI — `pnpm --filter studio spec-paper <file> [options]`
 *
 * 사용:
 *   pnpm --filter studio spec-paper spec/login-page.spec.md
 *   pnpm --filter studio spec-paper spec/login-page.spec.md --payload
 *   pnpm --filter studio spec-paper spec/login-page.spec.md --output preview.html
 *
 * 옵션:
 *   --payload          Paper write_html fragment 출력 (기본: 전체 HTML doc)
 *   --output <path>    stdout 대신 파일로 저장
 *   --no-tailwind      Tailwind play CDN 제외
 *
 * 종료 코드: 0 (성공), 1 (parse 에러), 2 (사용법 위반)
 */

import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { compileToPaper } from "../paper/compile";

export interface CliArgs {
  file: string;
  output?: string;
  payload?: boolean;
  withTailwind?: boolean;
}

export interface CliResult {
  output: string;
  errors: number;
  exitCode: 0 | 1;
}

export function parseArgs(argv: string[]): CliArgs | { error: string } {
  const args: CliArgs = { file: "" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--payload") args.payload = true;
    else if (a === "--no-tailwind") args.withTailwind = false;
    else if (a === "--output") args.output = argv[++i];
    else if (!a.startsWith("--") && !args.file) args.file = a;
    else return { error: `Unknown or duplicate argument: ${a}` };
  }
  if (!args.file) return { error: "Missing <file> argument" };
  return args;
}

export function runCompile(args: CliArgs): CliResult {
  const text = readFileSync(resolve(args.file), "utf-8");
  const r = compileToPaper(text, { withTailwind: args.withTailwind });
  const output = args.payload ? r.payload : r.html;
  const errors = r.errors?.length ?? 0;
  return {
    output,
    errors,
    exitCode: errors > 0 ? 1 : 0,
  };
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if ("error" in parsed) {
    process.stderr.write(`Error: ${parsed.error}\n`);
    process.stderr.write("Usage: spec-paper <file.spec.md> [--payload] [--output <path>] [--no-tailwind]\n");
    process.exit(2);
  }
  const result = runCompile(parsed);
  if (parsed.output) {
    writeFileSync(parsed.output, result.output, "utf-8");
    process.stdout.write(`✓ wrote ${parsed.output} (${result.output.length} bytes)\n`);
  } else {
    process.stdout.write(result.output);
  }
  if (result.errors > 0) {
    process.stderr.write(`\n[${result.errors} error(s)]\n`);
  }
  process.exit(result.exitCode);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
