/**
 * Paper tree → spec.md Document (AST).
 *
 * 매핑 규칙:
 * - 매칭 성공 → ComponentInstance (name = catalog 이름, props = variant axes)
 * - 미매칭 + image fill → MarkdownText (raw <img> HTML)
 * - 미매칭 + 일반 → Comment (layer name 디버그)
 * - children 재귀
 *
 * `NodeMeta` 는 Document 와 별도로 반환 — nodeId → meta 맵.
 */

import type { Document, Block, ComponentInstance, MarkdownText, Comment, SourceLocation, AttrValue } from "../chat-md/parser/ast-types";
import type { PaperTreeNode } from "./tree-types";
import { matchByName } from "./component-matcher";
import { extractVariant } from "./variant-extractor";
import type { CatalogAxisDef } from "./variant-extractor";
import { isImageNode, extractImageSrc } from "./image-classifier";
import { score } from "./confidence";

export interface NodeMeta {
  paperId: string;
  confidence: number;
  matched: boolean;
  exact: boolean;
  suggestion: string | null;
}

export interface AstBuilderResult {
  doc: Document;
  nodeMetaMap: Map<string, NodeMeta>;
}

/**
 * catalog: component name → axis 정의 목록.
 * `allComponentNames()` 대신 Map 으로 받아 axis 정보도 활용.
 */
export type CatalogMap = Map<string, CatalogAxisDef[]>;

const NULL_LOC: SourceLocation = { line: 0, col: 0, offset: 0, length: 0 };

export function buildAst(root: PaperTreeNode, catalog: CatalogMap): AstBuilderResult {
  const nodeMetaMap = new Map<string, NodeMeta>();
  const catalogNames = Array.from(catalog.keys());
  const body = root.children?.map((child) => buildBlock(child, catalogNames, catalog, nodeMetaMap)) ?? [];

  return {
    doc: {
      type: "Document",
      frontmatter: null,
      title: null,
      narrative: null,
      structure: null,
      history: null,
      body,
    },
    nodeMetaMap,
  };
}

function buildBlock(
  node: PaperTreeNode,
  catalogNames: string[],
  catalogMap: CatalogMap,
  meta: Map<string, NodeMeta>,
): Block {
  // component 이름 추출 (dot syntax 에서 첫 세그먼트) — axis 정의는 매칭 후 적용
  const { component: componentName } = extractVariant(node.name, []);
  const matchResult = matchByName(componentName, catalogNames);

  const confidence = score({ match: matchResult });

  meta.set(node.id, {
    paperId: node.id,
    confidence,
    matched: matchResult.matched,
    exact: matchResult.exact,
    suggestion: matchResult.suggestion,
  });

  if (matchResult.matched) {
    const resolvedName = matchResult.suggestion ?? componentName;
    const axesDef = catalogMap.get(resolvedName) ?? [];
    const { axes } = extractVariant(node.name, axesDef);
    const children = (node.children ?? []).map((c) => buildBlock(c, catalogNames, catalogMap, meta));
    const props: Record<string, AttrValue> = {};
    for (const [k, v] of Object.entries(axes)) {
      props[k] = v;
    }
    const ci: ComponentInstance = {
      type: "ComponentInstance",
      name: resolvedName,
      props,
      children,
      location: NULL_LOC,
    };
    return ci;
  }

  if (isImageNode(node)) {
    const src = extractImageSrc(node) ?? "";
    const mt: MarkdownText = {
      type: "MarkdownText",
      text: `<img src="${src}" alt="${node.name}" />`,
      location: NULL_LOC,
    };
    return mt;
  }

  const comment: Comment = {
    type: "Comment",
    text: ` unmatched: ${node.name} `,
    location: NULL_LOC,
  };
  return comment;
}
