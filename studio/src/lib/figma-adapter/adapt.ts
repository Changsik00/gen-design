import { inferSpec, type InferOptions, type InferResult } from "../paper-inference/infer";
import type { CatalogMap } from "../paper-inference/ast-builder";
import type { FigmaNode } from "./figma-types";
import { mapFigmaNode } from "./figma-node-mapper";

export function adaptFigma(
  figmaNode: FigmaNode,
  catalog: CatalogMap,
  options: InferOptions = {},
): InferResult {
  const paperTree = mapFigmaNode(figmaNode);
  return inferSpec(paperTree, catalog, options);
}
