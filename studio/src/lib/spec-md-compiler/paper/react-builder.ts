/**
 * AST → React 엘리먼트 트리 빌더.
 *
 * spec.md AST 의 ComponentInstance / Placeholder / MarkdownText / Comment 를
 * React 엘리먼트로 변환한다.
 *
 * 변환 규칙:
 *   ComponentInstance → React.createElement(registry[name], resolvedProps, ...children)
 *   Placeholder kind=i18n → 해소된 string (누락 시 빨간 background span)
 *   Placeholder kind=token → "var(--x)" string
 *   MarkdownText → text node (children 내부에서만)
 *   Comment → null
 *
 * theme/tokens layer:
 *   theme="brand-a"  → wrapping `<div data-theme="brand-a">`
 *   tokens={...}     → wrapping `<div style={{ ...cssVars }}>`
 *
 * 본 함수는 *순수* — 입력 → 동일 React 트리 (deterministic).
 */

import { createElement, type ReactNode, type ComponentType } from "react";
import type {
  Document,
  Block,
  ComponentInstance,
  Placeholder,
  MarkdownText,
  AttrValue,
} from "../../spec-md/parser/ast-types";
import { resolveI18n, I18N_MISSING_STYLE } from "./i18n-resolver";
import { tokenPathToCssVar, normalizeInlineTokenString } from "./token-resolver";

export interface BuildOptions {
  registry: Record<string, ComponentType<Record<string, unknown>>>;
  bundle: unknown;
}

/** 최상위 진입 — Document.body 의 ComponentInstance 들만 출력 (markdown heading 등 prose 스킵). */
export function buildReactTree(doc: Document, options: BuildOptions): ReactNode[] {
  const nodes: ReactNode[] = [];
  let key = 0;
  for (const b of doc.body) {
    if (b.type === "ComponentInstance") {
      nodes.push(buildBlock(b, options, `top-${key++}`));
    }
  }
  return nodes;
}

function buildBlock(block: Block, options: BuildOptions, key: string): ReactNode {
  switch (block.type) {
    case "ComponentInstance":
      return buildComponent(block, options, key);
    case "Placeholder":
      return buildPlaceholder(block, options, key);
    case "MarkdownText":
      return buildMarkdownText(block);
    case "Comment":
      return null;
  }
}

function buildComponent(
  c: ComponentInstance,
  options: BuildOptions,
  key: string,
): ReactNode {
  const Comp = options.registry[c.name];
  if (!Comp) {
    return createElement(
      "span",
      { key, style: { background: "#ff4d4d", color: "#fff", padding: "0 4px" } },
      `[Unknown component: <${c.name}>]`,
    );
  }
  const props = resolveProps(c.props, options);
  const children = c.children
    .map((b, i) => buildBlock(b, options, `${key}-c${i}`))
    .filter((n): n is NonNullable<ReactNode> => n !== null && n !== undefined);
  const element = createElement(
    Comp,
    { ...props, key } as Record<string, unknown>,
    ...children,
  );

  let wrapped: ReactNode = element;

  // L4 — tokens (CSS var override) wrapper
  if (c.tokens && Object.keys(c.tokens).length > 0) {
    const style = normalizeTokens(c.tokens);
    wrapped = createElement("div", { key: `${key}-tokens`, style }, wrapped);
  }

  // L3 — theme context wrapper
  if (c.theme) {
    wrapped = createElement(
      "div",
      { key: `${key}-theme`, "data-theme": c.theme },
      wrapped,
    );
  }

  return wrapped;
}

function buildPlaceholder(
  p: Placeholder,
  options: BuildOptions,
  key: string,
): ReactNode {
  if (p.kind === "i18n") {
    const r = resolveI18n(p.path, options.bundle);
    if (r.missing) {
      return createElement(
        "span",
        { key, style: parseStyleString(I18N_MISSING_STYLE) },
        r.value,
      );
    }
    return r.value;
  }
  return tokenPathToCssVar(p.path);
}

function buildMarkdownText(m: MarkdownText): string {
  return m.text;
}

function resolveProps(
  props: Record<string, AttrValue>,
  options: BuildOptions,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    out[k] = resolveAttrValue(v, options);
  }
  return out;
}

function resolveAttrValue(v: AttrValue, options: BuildOptions): unknown {
  if (v === null || typeof v !== "object") return v;
  if ("type" in v && (v as Placeholder).type === "Placeholder") {
    const ph = v as Placeholder;
    if (ph.kind === "i18n") return resolveI18n(ph.path, options.bundle).value;
    return tokenPathToCssVar(ph.path);
  }
  if (Array.isArray(v)) {
    return v.map((item) => resolveAttrValue(item, options));
  }
  // plain object
  const obj = v as Record<string, AttrValue>;
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(obj)) {
    out[k] = resolveAttrValue(val, options);
  }
  return out;
}

function normalizeTokens(tokens: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens)) {
    out[k] = normalizeInlineTokenString(v);
  }
  return out;
}

function parseStyleString(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const [k, v] = decl.split(":");
    if (!k || !v) continue;
    const camel = k.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = v.trim();
  }
  return out;
}
