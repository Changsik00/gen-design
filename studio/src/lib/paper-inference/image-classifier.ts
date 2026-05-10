/**
 * Paper 트리 노드 중 fill 이 image 인 노드를 식별하고 asset 경로를 추출.
 */

import type { PaperTreeNode } from "./tree-types";

export interface ImageNodeInfo {
  node: PaperTreeNode;
  /** fills 에서 추출한 image src — 없으면 null */
  src: string | null;
}

/**
 * 노드가 image fill 을 가지고 있는지 판별.
 */
export function isImageNode(node: PaperTreeNode): boolean {
  return !!node.fills?.some((f) => f.type === "image");
}

/**
 * image fill 의 src 경로 추출. 여러 image fill 이 있으면 첫 번째.
 */
export function extractImageSrc(node: PaperTreeNode): string | null {
  const imageFill = node.fills?.find((f) => f.type === "image");
  return imageFill?.src ?? null;
}

/**
 * 트리에서 image fill 을 가진 모든 노드를 수집 (깊이 우선).
 */
export function collectImageNodes(root: PaperTreeNode): ImageNodeInfo[] {
  const results: ImageNodeInfo[] = [];

  function walk(node: PaperTreeNode): void {
    if (isImageNode(node)) {
      results.push({ node, src: extractImageSrc(node) });
    }
    for (const child of node.children ?? []) {
      walk(child);
    }
  }

  walk(root);
  return results;
}
