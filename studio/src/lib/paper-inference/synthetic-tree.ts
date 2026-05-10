/**
 * synthetic-tree — HTML → 가상 PaperTreeNode 변환 (벤치마크용).
 *
 * compileToPaper (spec-7-03) 의 SSR HTML 출력을 가상 Paper tree 로 변환.
 * 실 Paper MCP 없이 round-trip 벤치마크를 수행하기 위한 합성 입력.
 *
 * 매핑 규칙:
 * - HTML element tag → component type ("div" → "Frame", "button" → "Button" 등)
 * - class 목록 → name 추정 (첫 번째 PascalCase class 사용)
 * - data-component 속성 → name override (가장 우선)
 * - 재귀 순회로 children 빌드
 */

import type { PaperTreeNode } from "./tree-types";

let _nodeCounter = 0;

function nextId(): string {
  return `syn-${++_nodeCounter}`;
}

/** counter 초기화 (테스트 재현성). */
export function resetSyntheticCounter(): void {
  _nodeCounter = 0;
}

const TAG_TO_COMPONENT: Record<string, string> = {
  div: "Frame",
  section: "Frame",
  article: "Frame",
  main: "Frame",
  header: "Frame",
  footer: "Frame",
  nav: "Frame",
  aside: "Frame",
  span: "Text",
  p: "Text",
  h1: "Text",
  h2: "Text",
  h3: "Text",
  h4: "Text",
  h5: "Text",
  h6: "Text",
  button: "Button",
  input: "Input",
  img: "Image",
  form: "Frame",
  ul: "Frame",
  ol: "Frame",
  li: "Frame",
};

/**
 * HTML 문자열을 파싱해 PaperTreeNode 트리로 변환.
 * 브라우저 환경 / Node.js (JSDOM) 에서 동작.
 */
export function htmlToPaperTree(html: string, rootName = "Root"): PaperTreeNode {
  // JSDOM 또는 브라우저 DOMParser 모두 지원
  let doc: Document;
  if (typeof window !== "undefined" && window.DOMParser) {
    const parser = new window.DOMParser();
    doc = parser.parseFromString(`<div id="__root">${html}</div>`, "text/html");
  } else {
    // Node 환경 — vitest jsdom 환경에서는 DOMParser 가 전역에 있음
    const parser = new DOMParser();
    doc = parser.parseFromString(`<div id="__root">${html}</div>`, "text/html");
  }

  const root = doc.getElementById("__root");
  if (!root) {
    return { id: nextId(), name: rootName, component: "Frame", children: [] };
  }

  return {
    id: nextId(),
    name: rootName,
    component: "Frame",
    children: Array.from(root.children).map(elementToNode),
  };
}

function elementToNode(el: Element): PaperTreeNode {
  const tag = el.tagName.toLowerCase();
  const component = TAG_TO_COMPONENT[tag] ?? "Frame";

  // data-component > first PascalCase class > tag-derived component name
  const dataComp = el.getAttribute("data-component");
  const name = dataComp ?? extractPascalClass(el.className) ?? component;

  const children = Array.from(el.children).map(elementToNode);

  return {
    id: nextId(),
    name,
    component,
    children: children.length > 0 ? children : undefined,
  };
}

function extractPascalClass(className: string): string | null {
  if (!className) return null;
  const classes = className.split(/\s+/);
  for (const cls of classes) {
    if (/^[A-Z]/.test(cls)) return cls;
  }
  return null;
}
