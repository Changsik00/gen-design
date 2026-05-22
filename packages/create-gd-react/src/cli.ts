#!/usr/bin/env node
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stat, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { parseCliArgs, validateProjectName } from "./args.js";
import { messages } from "./messages.js";
import { copyPreset } from "./fallback.js";
import { fetchAndExtractPreset } from "./fetcher.js";
import { postprocess } from "./postprocess.js";

const require = createRequire(import.meta.url);
const PKG_VERSION = (() => {
  try {
    const pkg = require("../package.json") as { version: string };
    return pkg.version;
  } catch {
    return "0.0.0";
  }
})();

const __dirname = dirname(fileURLToPath(import.meta.url));

/** dist 또는 src 에서 실행되어도 동작하도록 bundled preset 위치를 찾는다. */
function resolveBundledPresetDir(presetName: string): string {
  // dist/cli.js 기준: dist/../presets-bundled/<preset>
  return join(__dirname, "..", "presets-bundled", presetName);
}

async function isDirEmpty(dir: string): Promise<boolean> {
  const exists = await stat(dir).catch(() => null);
  if (!exists) return true;
  const entries = await readdir(dir);
  return entries.length === 0;
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const args = parseCliArgs(argv);

  if (args.help) {
    process.stdout.write(messages.help());
    return 0;
  }

  if (args.version) {
    process.stdout.write(`create-gd-react ${PKG_VERSION}\n`);
    return 0;
  }

  process.stdout.write(messages.header());

  if (!validateProjectName(args.projectName)) {
    process.stderr.write(messages.errorInvalidName(args.projectName ?? "(없음)") + "\n");
    process.stderr.write(messages.help());
    return 1;
  }
  const projectName = args.projectName;
  const targetDir = resolve(process.cwd(), projectName);

  // 디렉토리 존재 검사
  if (!(await isDirEmpty(targetDir)) && !args.force) {
    process.stderr.write(messages.errorDirExists(targetDir) + "\n");
    return 1;
  }

  process.stdout.write(messages.scaffolding(projectName, args.offline) + "\n");

  // Fetch or fallback
  try {
    if (args.offline) {
      process.stdout.write(messages.warnOfflineFallback() + "\n");
      const bundled = resolveBundledPresetDir(args.preset);
      await copyPreset(bundled, targetDir);
    } else {
      process.stdout.write(messages.fetchProgress(args.preset) + "\n");
      try {
        await fetchAndExtractPreset(args.presetRepo, args.preset, targetDir);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        // 네트워크 실패 시 fallback 시도
        if (
          errMsg.includes("타임아웃") ||
          errMsg.includes("HTTP") ||
          errMsg.includes("ENOTFOUND") ||
          errMsg.includes("ECONNREFUSED")
        ) {
          process.stderr.write(messages.errorNetwork() + "\n");
          return 2;
        }
        if (errMsg.includes("을 tarball 에서 찾을 수 없")) {
          process.stderr.write(
            messages.errorPresetNotFound(args.preset, args.presetRepo) + "\n",
          );
          return 3;
        }
        process.stderr.write(messages.errorExtractFailed(errMsg) + "\n");
        return 4;
      }
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    process.stderr.write(messages.errorExtractFailed(errMsg) + "\n");
    return 4;
  }

  // 후처리
  process.stdout.write(messages.postProcessing() + "\n");
  await postprocess(targetDir, projectName);

  // 의존성 설치
  if (!args.noInstall) {
    process.stdout.write(messages.installing() + "\n");
    const installCode = await runInstall(targetDir);
    if (installCode !== 0) {
      process.stderr.write(messages.errorInstallFailed() + "\n");
      // 그래도 scaffold 자체는 성공 — 0 반환하지 않음, 5 반환
      return 5;
    }
  }

  process.stdout.write(messages.success(projectName, targetDir));
  process.stdout.write(messages.nextSteps(projectName, !args.noInstall));
  return 0;
}

async function runInstall(cwd: string): Promise<number> {
  return new Promise((resolveSpawn) => {
    const child = spawn("pnpm", ["install"], { cwd, stdio: "inherit" });
    child.on("close", (code) => resolveSpawn(code ?? 1));
    child.on("error", () => resolveSpawn(1));
  });
}

// CLI 실행
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(err);
      process.exit(99);
    },
  );
}
