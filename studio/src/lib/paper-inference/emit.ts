/**
 * Document → spec.md 텍스트 (round-trip stable).
 *
 * emit 결과를 spec-7-02 parser 로 재파싱 시 구조/내용 동일.
 * (location 필드는 파서가 재계산 — 비교 대상 제외)
 */

import type { Document, Block, ComponentInstance, Placeholder, MarkdownText, Comment, AttrValue } from "../spec-md/parser/ast-types";

export function emit(doc: Document): string {
  return doc.body.map((block) => emitBlock(block, 0, false)).join("");
}

/** compact=true 시 trailing newline 제거 (inline 자식 용도). */
function emitBlock(block: Block, depth: number, compact: boolean): string {
  switch (block.type) {
    case "ComponentInstance":
      return emitComponent(block, depth, compact);
    case "Placeholder":
      return emitPlaceholder(block, depth, compact);
    case "MarkdownText":
      return emitMarkdownText(block, depth, compact);
    case "Comment":
      return emitComment(block, depth, compact);
  }
}

function indent(depth: number): string {
  return "  ".repeat(depth);
}

function emitComponent(node: ComponentInstance, depth: number, compact: boolean): string {
  const attrs = emitAttrs(node);
  const pad = indent(depth);
  const nl = compact ? "" : "\n";

  if (node.children.length === 0) {
    return `${pad}<${node.name}${attrs} />${nl}`;
  }

  const hasOnlyComponents = node.children.every((c) => c.type === "ComponentInstance");

  if (hasOnlyComponents) {
    // ComponentInstance 만 — 들여쓰기 있는 블록 형식
    const childrenText = node.children.map((c) => emitBlock(c, depth + 1, false)).join("");
    return `${pad}<${node.name}${attrs}>\n${childrenText}${pad}</${node.name}>${nl}`;
  }

  // MarkdownText / Placeholder / Comment 혼합 — inline (compact) 형식
  // trailing newline 없이 각 child emit
  const childrenText = node.children.map((c) => emitBlock(c, 0, true)).join("");
  return `${pad}<${node.name}${attrs}>${childrenText}</${node.name}>${nl}`;
}

function emitAttrs(node: ComponentInstance): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(node.props)) {
    parts.push(`${key}=${emitAttrValue(value)}`);
  }
  if (node.theme !== undefined) {
    parts.push(`theme="${node.theme}"`);
  }
  if (node.tokens !== undefined) {
    parts.push(`tokens={${JSON.stringify(node.tokens)}}`);
  }

  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function emitAttrValue(val: AttrValue): string {
  if (val === null) return "{null}";
  if (typeof val === "boolean") return `{${val}}`;
  if (typeof val === "number") return `{${val}}`;
  if (typeof val === "string") return `"${escapeString(val)}"`;
  if (typeof val === "object" && "type" in val && val.type === "Placeholder") {
    return `{{${val.kind}.${val.path}}}`;
  }
  // AttrObject / AttrArray — JSON serialize
  return `{${JSON.stringify(val)}}`;
}

function escapeString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function emitPlaceholder(node: Placeholder, depth: number, compact: boolean): string {
  const nl = compact ? "" : "\n";
  return `${indent(depth)}{{${node.kind}.${node.path}}}${nl}`;
}

function emitMarkdownText(node: MarkdownText, _depth: number, compact: boolean): string {
  // MarkdownText 는 indent 없이 원문 그대로 — inline 혼합 레이아웃 유지
  const nl = compact ? "" : "\n";
  const text = compact ? node.text : node.text.endsWith("\n") ? node.text : node.text + nl;
  return text;
}

function emitComment(node: Comment, depth: number, compact: boolean): string {
  const nl = compact ? "" : "\n";
  return `${indent(depth)}<!--${node.text}-->${nl}`;
}
