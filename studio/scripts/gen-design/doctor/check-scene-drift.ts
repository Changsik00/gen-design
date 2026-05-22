/**
 * checkSceneDrift + checkOrphanScene — `// @gd:` annotation 기반 drift / orphan 감지.
 *
 * scene-drift: chat.md 의 mtime > TSX 의 mtime → 컴파일 필요
 * orphan-scene:
 *   - TSX 의 annotation 이 가리키는 chat.md 가 존재 안 함 → orphan error
 *   - annotation 없는 TSX → unmanaged warn (수동 신은 src/scenes/ 외부로 옮겨야)
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import type { DoctorDiag } from "./types";
import { diag, driftMsg } from "./messages";

const ANNOTATION_RE = /^\/\/\s*@gd:\s*(\S.*?)\s*$/;

export function parseGdAnnotation(tsxContent: string): string | null {
  const firstLine = tsxContent.split("\n", 1)[0] ?? "";
  const m = firstLine.match(ANNOTATION_RE);
  return m && m[1] ? m[1] : null;
}

function collectTsxFiles(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectTsxFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * project root 기준 src/scenes/ 의 TSX 들을 검사.
 * 각 TSX 의 annotation 이 가리키는 chat.md 와 mtime 비교.
 */
export function checkSceneDrift(projectRoot: string): DoctorDiag[] {
  const diags: DoctorDiag[] = [];
  const scenesDir = join(projectRoot, "src", "scenes");
  if (!existsSync(scenesDir)) return diags;

  for (const tsxPath of collectTsxFiles(scenesDir)) {
    const content = readFileSync(tsxPath, "utf-8");
    const chatRelPath = parseGdAnnotation(content);
    if (!chatRelPath) continue; // annotation 없으면 orphan-scene 이 처리

    const chatAbsPath = join(projectRoot, chatRelPath);
    if (!existsSync(chatAbsPath)) continue; // orphan-scene 이 처리

    const chatMtime = statSync(chatAbsPath).mtimeMs;
    const tsxMtime = statSync(tsxPath).mtimeMs;
    if (chatMtime > tsxMtime) {
      const tsxRel = relative(projectRoot, tsxPath);
      diags.push(
        diag("scene-drift", "error", tsxRel, driftMsg.staleTsx(chatRelPath, tsxRel), {
          hint: driftMsg.hintRecompile(chatRelPath),
        }),
      );
    }
  }

  return diags;
}

/**
 * project root 기준 src/scenes/ 의 TSX 들을 검사.
 * - annotation 있는데 chat.md 부재 → orphan error
 * - annotation 없음 → unmanaged warn
 */
export function checkOrphanScene(projectRoot: string): DoctorDiag[] {
  const diags: DoctorDiag[] = [];
  const scenesDir = join(projectRoot, "src", "scenes");
  if (!existsSync(scenesDir)) return diags;

  for (const tsxPath of collectTsxFiles(scenesDir)) {
    const content = readFileSync(tsxPath, "utf-8");
    const chatRelPath = parseGdAnnotation(content);
    const tsxRel = relative(projectRoot, tsxPath);

    if (!chatRelPath) {
      diags.push(
        diag("orphan-scene", "warn", tsxRel, driftMsg.unmanagedTsx(tsxRel), {
          hint: driftMsg.hintMoveOrAnnotate,
        }),
      );
      continue;
    }

    const chatAbsPath = join(projectRoot, chatRelPath);
    if (!existsSync(chatAbsPath)) {
      diags.push(
        diag("orphan-scene", "error", tsxRel, driftMsg.orphan(tsxRel, chatRelPath), {
          hint: driftMsg.hintDeleteOrRestore(chatRelPath),
        }),
      );
    }
  }

  return diags;
}
