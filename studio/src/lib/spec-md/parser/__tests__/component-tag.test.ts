import { describe, it, expect } from "vitest";
import { parser } from "../../grammar";
import type {
  Document,
  ComponentInstance,
  MarkdownText,
  Placeholder,
} from "../ast-types";

function parse(text: string): Document {
  return parser.parse(text) as Document;
}

describe("grammar — Self-closing tag", () => {
  it("`<Login />`", () => {
    const ast = parse("<Login />");
    expect(ast.body).toHaveLength(1);
    const c = ast.body[0] as ComponentInstance;
    expect(c.type).toBe("ComponentInstance");
    expect(c.name).toBe("Login");
    expect(c.children).toEqual([]);
    expect(c.props).toEqual({});
  });

  it("`<Login/>` 공백 없음", () => {
    const ast = parse("<Login/>");
    const c = ast.body[0] as ComponentInstance;
    expect(c.name).toBe("Login");
  });

  it("multi-word PascalCase name", () => {
    const ast = parse("<DashboardPage />");
    const c = ast.body[0] as ComponentInstance;
    expect(c.name).toBe("DashboardPage");
  });

  it("두 개의 self-closing 태그 (sibling)", () => {
    const ast = parse("<A /><B />");
    expect(ast.body).toHaveLength(2);
    expect((ast.body[0] as ComponentInstance).name).toBe("A");
    expect((ast.body[1] as ComponentInstance).name).toBe("B");
  });
});

describe("grammar — Paired tag", () => {
  it("`<Login></Login>` 빈 본문", () => {
    const ast = parse("<Login></Login>");
    const c = ast.body[0] as ComponentInstance;
    expect(c.name).toBe("Login");
    expect(c.children).toEqual([]);
  });

  it("`<Login>Hello</Login>` 텍스트 자식", () => {
    const ast = parse("<Login>Hello</Login>");
    const c = ast.body[0] as ComponentInstance;
    expect(c.children).toHaveLength(1);
    expect((c.children[0] as MarkdownText).text).toBe("Hello");
  });

  it("`<Login>{{i18n.x}}</Login>` placeholder 자식", () => {
    const ast = parse("<Login>{{i18n.x}}</Login>");
    const c = ast.body[0] as ComponentInstance;
    expect(c.children).toHaveLength(1);
    const p = c.children[0] as Placeholder;
    expect(p.type).toBe("Placeholder");
    expect(p.kind).toBe("i18n");
    expect(p.path).toBe("x");
  });

  it("nested 컴포넌트 (재귀)", () => {
    const ast = parse("<Card><Button /></Card>");
    const card = ast.body[0] as ComponentInstance;
    expect(card.name).toBe("Card");
    expect(card.children).toHaveLength(1);
    const btn = card.children[0] as ComponentInstance;
    expect(btn.type).toBe("ComponentInstance");
    expect(btn.name).toBe("Button");
  });

  it("3 단계 중첩", () => {
    const ast = parse("<A><B><C /></B></A>");
    const a = ast.body[0] as ComponentInstance;
    expect(a.name).toBe("A");
    const b = a.children[0] as ComponentInstance;
    expect(b.name).toBe("B");
    const c = b.children[0] as ComponentInstance;
    expect(c.name).toBe("C");
  });

  it("paired tag 의 자식: 텍스트 + 컴포넌트 + placeholder 혼재", () => {
    const ast = parse("<Page>Welcome <Button /> see {{i18n.x}}</Page>");
    const page = ast.body[0] as ComponentInstance;
    expect(page.children).toHaveLength(4);
    expect((page.children[0] as MarkdownText).text).toBe("Welcome ");
    expect((page.children[1] as ComponentInstance).name).toBe("Button");
    expect((page.children[2] as MarkdownText).text).toBe(" see ");
    expect((page.children[3] as Placeholder).path).toBe("x");
  });
});

describe("grammar — Mismatched closing tag", () => {
  it("`<A>...</B>` 친화적 에러", () => {
    expect(() => parse("<A>foo</B>")).toThrow(/Mismatched closing tag.*<\/A>.*<\/B>/);
  });
});

describe("grammar — Lowercase HTML 은 markdown text", () => {
  it("`<div>...</div>` 전체가 MarkdownText", () => {
    const ast = parse("<div>raw html</div>");
    expect(ast.body).toHaveLength(1);
    const m = ast.body[0] as MarkdownText;
    expect(m.type).toBe("MarkdownText");
    expect(m.text).toBe("<div>raw html</div>");
  });
});

describe("grammar — ComponentTag 와 markdown / placeholder 혼재", () => {
  it("top-level: 마크다운 + 컴포넌트 + 마크다운", () => {
    const ast = parse("Intro\n<Button />\nOutro");
    expect(ast.body).toHaveLength(3);
    expect(ast.body[0].type).toBe("MarkdownText");
    expect(ast.body[1].type).toBe("ComponentInstance");
    expect(ast.body[2].type).toBe("MarkdownText");
  });
});
