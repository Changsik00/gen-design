/**
 * inferChat — paper-inference 공용 API.
 *
 * 입력: Paper tree JSON + catalog map + options
 * 출력: { ast: Document, report: InferReport, text: string }
 */

import type { Document } from "../chat-md/parser/ast-types";
import type { PaperTreeNode } from "./tree-types";
import type { CatalogMap } from "./ast-builder";
import type { InferReport, ClassifyOptions } from "./classify";
import { buildAst } from "./ast-builder";
import { classify } from "./classify";
import { emit } from "./emit";

export interface InferOptions extends ClassifyOptions {}

export interface InferResult {
  ast: Document;
  report: InferReport;
  text: string;
}

export function inferChat(
  tree: PaperTreeNode,
  catalog: CatalogMap,
  options: InferOptions = {},
): InferResult {
  const { doc, nodeMetaMap } = buildAst(tree, catalog);
  const report = classify(nodeMetaMap, options);
  const text = emit(doc);
  return { ast: doc, report, text };
}
