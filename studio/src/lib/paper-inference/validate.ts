/**
 * PaperTreeNode 입력 검증.
 *
 * - 구조 (id / name / component / children)
 * - identity 컨벤션 위반 (잘못된 kind 는 *마커 없는 것* 으로 처리되므로 error 아님)
 * - 중복 identity (한 tree 안 같은 [chat:scenes/login] 2회+ → warning)
 */

import { parseIdentity } from "./identity";
import type { PaperTreeNode } from "./tree-types";

export interface ValidationError {
  message: string;
  severity: "error" | "warning";
  /** node id 경로 (root → ... → 현재 노드). 디버그용. */
  path: string[];
}

export function validateTree(tree: PaperTreeNode): ValidationError[] {
  const errors: ValidationError[] = [];
  const identityCount = new Map<string, string[]>(); // marker → [path-string,...]

  function walk(node: PaperTreeNode, path: string[]): void {
    if (!node || typeof node !== "object") {
      errors.push({ message: "node is not an object", severity: "error", path });
      return;
    }
    if (!node.id || typeof node.id !== "string") {
      errors.push({ message: `node.id is required (string)`, severity: "error", path });
    }
    if (!node.name || typeof node.name !== "string") {
      errors.push({ message: `node.name is required (string)`, severity: "error", path });
    }
    if (!node.component || typeof node.component !== "string") {
      errors.push({ message: `node.component is required (string)`, severity: "error", path });
    }

    const id = parseIdentity(node.name ?? "");
    if (id) {
      const key = id.raw;
      const existing = identityCount.get(key) ?? [];
      existing.push(path.join("/"));
      identityCount.set(key, existing);
    }

    if (Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        walk(node.children[i], [...path, node.id ?? `idx${i}`]);
      }
    }
  }

  walk(tree, ["root"]);

  for (const [marker, paths] of identityCount) {
    if (paths.length > 1) {
      errors.push({
        message: `duplicate identity ${marker} found at ${paths.length} nodes (${paths.join(", ")})`,
        severity: "warning",
        path: paths,
      });
    }
  }

  return errors;
}
