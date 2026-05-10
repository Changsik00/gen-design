/**
 * spec-react CLI — `pnpm --filter studio spec-react <file.md> [options]`
 *
 * 사용:
 *   pnpm --filter studio spec-react page.spec.md
 *   pnpm --filter studio spec-react page.spec.md --name LoginScene
 *   pnpm --filter studio spec-react page.spec.md --registry --out /tmp/out/
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";
import { compileToReact } from "../compile";
import { toKebabCase } from "../registry-writer";

export function deriveComponentName(filePath: string): string {
  return basename(filePath)
    .replace(/\.chat\.md$|\.spec\.md$|\.md$/, "")
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export interface CliArgs {
  file: string;
  out?: string;
  registry: boolean;
  name?: string;
}

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: 0 | 1;
}

export function parseArgs(argv: string[]): CliArgs | { error: string } {
  if (argv.length === 0) return { error: "Usage: spec-react <file.md> [--name <Name>] [--registry] [--out <dir>]" };

  const args: CliArgs = { file: "", registry: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--registry") {
      args.registry = true;
    } else if (arg === "--out" && argv[i + 1]) {
      args.out = argv[++i];
    } else if (arg === "--name" && argv[i + 1]) {
      args.name = argv[++i];
    } else if (!arg.startsWith("--")) {
      args.file = arg;
    }
  }

  if (!args.file) return { error: "Missing required argument: <file>" };
  return args;
}

export function runCompile(args: CliArgs): CliResult {
  let text: string;
  try {
    text = readFileSync(resolve(args.file), "utf-8");
  } catch {
    return { stdout: "", stderr: `Error: file not found: ${args.file}`, exitCode: 1 };
  }

  const componentName = args.name ?? deriveComponentName(args.file);

  const result = compileToReact({ text, componentName });

  if (!result.ok) {
    const msg = result.errors.map((e) => e.message).join("\n");
    return { stdout: "", stderr: `Compile error:\n${msg}`, exitCode: 1 };
  }

  if (args.registry && args.out && result.registry) {
    mkdirSync(resolve(args.out), { recursive: true });
    const kebab = toKebabCase(componentName);
    writeFileSync(join(resolve(args.out), `${kebab}.tsx`), result.tsx!);
    writeFileSync(
      join(resolve(args.out), "registry.json"),
      JSON.stringify(result.registry, null, 2)
    );
    return { stdout: `Written: ${args.out}/${kebab}.tsx + registry.json`, stderr: "", exitCode: 0 };
  }

  return { stdout: result.tsx!, stderr: "", exitCode: 0 };
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  if ("error" in args) {
    process.stderr.write(args.error + "\n");
    process.exit(2);
  }
  const result = runCompile(args);
  if (result.stdout) process.stdout.write(result.stdout + "\n");
  if (result.stderr) process.stderr.write(result.stderr + "\n");
  process.exit(result.exitCode);
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))
) {
  main();
}
