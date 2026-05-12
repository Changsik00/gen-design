/**
 * compileScene — slug 입력으로 chat 디렉토리에서 scene + shell 을 로드하여 단일 TSX 컴파일.
 *
 * - <chatRoot>/scenes/<slug>.chat.md 로드 → scene AST
 * - scene.frontmatter.shell.inherit === true → <chatRoot>/_shell.chat.md 로드 → merge
 * - 그 외 → scene 단독 컴파일
 * - 결과는 기존 compileToReact 의 CompileResult
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../../chat-md/parser";
import { compileToReact, type CompileError, type CompileResult } from "./compile";
import { mergeShellAndScene } from "./shell-merge";
import type { Document } from "../../chat-md/parser/ast-types";

export interface CompileSceneOptions {
  /** chats/ 디렉토리 (절대 또는 cwd 기준). */
  chatRoot: string;
  /** shell merge 비활성화 (scene 단독 컴파일). */
  noShell?: boolean;
}

export function compileScene(sceneSlug: string, opts: CompileSceneOptions): CompileResult {
  const scenePath = join(opts.chatRoot, "scenes", `${sceneSlug}.chat.md`);
  if (!existsSync(scenePath)) {
    return {
      ok: false,
      errors: [{ message: `scene chat file not found: ${scenePath}`, stage: "compile" }],
    };
  }

  const sceneText = readFileSync(scenePath, "utf-8");
  const sceneParsed = parse(sceneText, { skipSchema: true });
  if (!sceneParsed.ok || !sceneParsed.ast) {
    return {
      ok: false,
      errors: sceneParsed.errors.map(
        (e): CompileError => ({ message: `scene parse: ${e.message}`, stage: "parse" }),
      ),
    };
  }
  const sceneDoc = sceneParsed.ast;
  const sceneFm = sceneDoc.frontmatter;
  const shouldMerge = !opts.noShell && sceneFm?.shell != null && sceneFm.shell.inherit === true;

  let mergedDoc: Document = sceneDoc;
  if (shouldMerge) {
    const shellPath = join(opts.chatRoot, "_shell.chat.md");
    if (!existsSync(shellPath)) {
      return {
        ok: false,
        errors: [{ message: `shell chat file not found: ${shellPath}`, stage: "compile" }],
      };
    }
    const shellText = readFileSync(shellPath, "utf-8");
    const shellParsed = parse(shellText, { skipSchema: true });
    if (!shellParsed.ok || !shellParsed.ast) {
      return {
        ok: false,
        errors: shellParsed.errors.map(
          (e): CompileError => ({ message: `shell parse: ${e.message}`, stage: "parse" }),
        ),
      };
    }
    mergedDoc = mergeShellAndScene({
      sceneDoc,
      shellDoc: shellParsed.ast,
      exclude: sceneFm!.shell!.exclude ?? [],
    });
  }

  const componentName = sceneFm?.name ?? deriveNameFromSlug(sceneSlug);
  return compileToReact({ ast: mergedDoc, componentName });
}

function deriveNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
