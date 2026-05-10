import { describe, it, expect } from "vitest";
import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "../../../chat-md/parser";
import { buildReactTree } from "../react-builder";
import { COMPONENT_REGISTRY } from "../component-registry";
import koBundle from "@/i18n/ko.json";

function compile(text: string): ReactElement[] {
  const r = parse(text);
  if (!r.ok || !r.ast) throw new Error("parse failed");
  return buildReactTree(r.ast, {
    registry: COMPONENT_REGISTRY,
    bundle: koBundle,
  }).filter(isValidElement) as ReactElement[];
}

function renderHtml(text: string): string {
  return compile(text)
    .map((el) => renderToStaticMarkup(el))
    .join("");
}

describe("react-builder — ComponentInstance 매핑", () => {
  it("`<Button />` → React.createElement(Button)", () => {
    const els = compile("<Button />");
    expect(els).toHaveLength(1);
    expect(isValidElement(els[0])).toBe(true);
    // Button 은 button 태그를 emit
    const html = renderHtml("<Button />");
    expect(html).toContain("<button");
  });

  it("미등록 컴포넌트 → 빨간 sentinel span", () => {
    const els = compile("<UnknownXyz />");
    const html = renderToStaticMarkup(els[0]);
    expect(html).toContain("Unknown component");
    expect(html).toContain("ff4d4d");
  });
});

describe("react-builder — 자식 + nested", () => {
  it("nested 컴포넌트 트리 (LoginForm > Button)", () => {
    const html = renderHtml('<LoginForm><Button variant="default" /></LoginForm>');
    // LoginForm 은 form/div 컨테이너, 내부에 button 자식
    expect(html).toContain("<button");
  });
});

describe("react-builder — i18n placeholder", () => {
  it("자식의 i18n placeholder 가 한국어로 해소됨", () => {
    const html = renderHtml("<Button>{{i18n.ko.action.login}}</Button>");
    expect(html).toContain("로그인");
  });

  it("누락 i18n 키는 빨간 background span", () => {
    const html = renderHtml("<Button>{{i18n.ko.action.unknown-key}}</Button>");
    expect(html).toContain("missing");
    expect(html).toContain("ff4d4d");
  });
});

describe("react-builder — L3 theme wrapper", () => {
  it('theme="brand-a" → data-theme 컨테이너', () => {
    const html = renderHtml('<Button theme="brand-a">click</Button>');
    expect(html).toContain('data-theme="brand-a"');
  });
});

describe("react-builder — L4 tokens wrapper", () => {
  it("tokens={...} → inline style div", () => {
    const html = renderHtml(
      '<Button tokens={{ "--primary": "{{token.brand-2}}" }}>click</Button>',
    );
    // token reference 가 var(--brand-2) 로 정규화됨
    expect(html).toContain("style=");
    expect(html).toMatch(/--primary:\s*var\(--brand-2\)/);
  });
});

describe("react-builder — top-level prose 무시", () => {
  it("# Heading + 컴포넌트 → 컴포넌트만 출력", () => {
    const text = `# Title

설명 텍스트.

<Button />`;
    const html = renderHtml(text);
    expect(html).toContain("<button");
    expect(html).not.toContain("# Title");
    expect(html).not.toContain("설명");
  });
});
