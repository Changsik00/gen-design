/**
 * PaperTreeNode walk → 각 노드의 layer name 에서 [chat:type/slug] 마커 추출 →
 * `identity?: IdentityRef` 자동 채움.
 *
 * - 입력 *immutable* (deep clone 후 수정)
 * - 마커 없는 노드는 identity 부재 (undefined)
 */

import { parseIdentity } from "./identity";
import type { PaperTreeNode } from "./tree-types";

export function enrichWithIdentity(tree: PaperTreeNode): PaperTreeNode {
  return walk(tree);
}

function walk(node: PaperTreeNode): PaperTreeNode {
  const id = parseIdentity(node.name ?? "");
  const next: PaperTreeNode = { ...node };
  if (id) {
    next.identity = id;
  } else if ("identity" in next) {
    delete next.identity;
  }
  if (Array.isArray(node.children)) {
    next.children = node.children.map(walk);
  }
  return next;
}
