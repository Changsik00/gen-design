#!/usr/bin/env node
/**
 * @gd/cli bin entry — thin wrapper that spawns `tsx` to run the TS source.
 *
 * Why: cli.ts uses path-relative imports into the studio workspace, so we keep
 * source-form execution and let tsx handle TS + ESM. tsup builds are deferred
 * until external publish (spec-12-01 의 out-of-scope).
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const tsxCli = require.resolve("tsx/cli");
const entry = resolve(__dirname, "../src/cli.ts");

const child = spawn(process.execPath, [tsxCli, entry, ...process.argv.slice(2)], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
