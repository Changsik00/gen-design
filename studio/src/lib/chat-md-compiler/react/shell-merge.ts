/**
 * Shell + Scene 합성 — spec-08-07.
 *
 * 두 chat.md AST (shell, scene) 를 단일 Document 로 합성:
 * - shell.Structure.body 를 deep clone → 작업 본문
 * - exclude 안 ComponentInstance 제거 (재귀)
 * - `{{scene.content}}` Placeholder 위치에 scene.Structure.body 로 교체
 * - 메타 (frontmatter / title / narrative / history) 는 scene 의 것
 *
 * 결과 Document 는 기존 compileToReact 에 그대로 전달 가능.
 */

import type {
  Block,
  ComponentInstance,
  Document,
  Placeholder,
} from "../../chat-md/parser/ast-types";

export interface ShellMergeOptions {
  sceneDoc: Document;
  shellDoc: Document;
  /** PascalCase component names to remove from shell.Structure.body (recursive). */
  exclude: string[];
}

export function mergeShellAndScene(opts: ShellMergeOptions): Document {
  const { sceneDoc, shellDoc, exclude } = opts;
  const excludeSet = new Set(exclude);

  const shellBody: Block[] = shellDoc.structure?.body ?? [];
  const sceneBody: Block[] = sceneDoc.structure?.body ?? [];

  const mergedBody = transformBlocks(shellBody, excludeSet, sceneBody);

  return {
    type: "Document",
    body: mergedBody,
    frontmatter: sceneDoc.frontmatter ?? null,
    title: sceneDoc.title ?? null,
    narrative: sceneDoc.narrative ?? null,
    structure: {
      type: "Structure",
      body: mergedBody,
      location: sceneDoc.structure?.location ?? shellDoc.structure?.location ?? {
        line: 0,
        col: 0,
        offset: 0,
        length: 0,
      },
    },
    history: sceneDoc.history ?? null,
  };
}

function transformBlocks(blocks: Block[], excludeSet: Set<string>, sceneBody: Block[]): Block[] {
  const out: Block[] = [];
  for (const block of blocks) {
    if (isSceneContentPlaceholder(block)) {
      // splice in scene body — deep clone to avoid AST aliasing
      for (const sb of sceneBody) out.push(cloneBlock(sb));
      continue;
    }
    if (block.type === "ComponentInstance") {
      if (excludeSet.has(block.name)) continue;
      out.push({
        ...block,
        children: transformBlocks(block.children, excludeSet, sceneBody),
      });
      continue;
    }
    out.push(cloneBlock(block));
  }
  return out;
}

function isSceneContentPlaceholder(block: Block): block is Placeholder {
  return block.type === "Placeholder" && block.kind === "scene" && block.path === "content";
}

function cloneBlock(block: Block): Block {
  // structuredClone 으로 충분 — Block 은 plain object 트리
  return structuredClone(block);
}

export function _internal_isSceneContentPlaceholder(block: Block): boolean {
  return isSceneContentPlaceholder(block);
}

// type-only re-export for downstream use
export type { ComponentInstance };
