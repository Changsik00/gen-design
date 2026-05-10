import { describe, it, expect } from "vitest";
import { parser } from "../../grammar";
import type { Document, MarkdownText, Placeholder, Comment } from "../ast-types";

function parse(text: string): Document {
  return parser.parse(text) as Document;
}

describe("grammar — MarkdownText", () => {
  it("순수 텍스트", () => {
    const ast = parse("Hello world");
    expect(ast.body).toHaveLength(1);
    const m = ast.body[0] as MarkdownText;
    expect(m.type).toBe("MarkdownText");
    expect(m.text).toBe("Hello world");
  });

  it("multi-line 텍스트 보존", () => {
    const text = "Line 1\nLine 2\n  Line 3";
    const ast = parse(text);
    const m = ast.body[0] as MarkdownText;
    expect(m.text).toBe(text);
  });

  it("markdown 문법 (* ** _ #) 은 가공하지 않고 raw 보존", () => {
    const text = "# Heading\n\n*bold* and _italic_";
    const ast = parse(text);
    const m = ast.body[0] as MarkdownText;
    expect(m.text).toBe(text);
  });

  it("placeholder 와 markdown 혼재 — 3 노드", () => {
    const ast = parse("Hello {{i18n.name}} world");
    expect(ast.body).toHaveLength(3);
    expect(ast.body[0].type).toBe("MarkdownText");
    expect((ast.body[0] as MarkdownText).text).toBe("Hello ");
    expect(ast.body[1].type).toBe("Placeholder");
    expect((ast.body[1] as Placeholder).path).toBe("name");
    expect(ast.body[2].type).toBe("MarkdownText");
    expect((ast.body[2] as MarkdownText).text).toBe(" world");
  });
});

describe("grammar — Comment", () => {
  it("HTML 식 주석", () => {
    const ast = parse("<!-- a note -->");
    expect(ast.body).toHaveLength(1);
    const c = ast.body[0] as Comment;
    expect(c.type).toBe("Comment");
    expect(c.text).toBe(" a note ");
  });

  it("multi-line 주석", () => {
    const ast = parse("<!--\n  multi\n  line\n-->");
    const c = ast.body[0] as Comment;
    expect(c.text).toContain("multi");
    expect(c.text).toContain("line");
  });

  it("주석 + markdown 혼재", () => {
    const ast = parse("Before<!-- mid -->After");
    expect(ast.body).toHaveLength(3);
    expect((ast.body[0] as MarkdownText).text).toBe("Before");
    expect(ast.body[1].type).toBe("Comment");
    expect((ast.body[1] as Comment).text).toBe(" mid ");
    expect((ast.body[2] as MarkdownText).text).toBe("After");
  });
});

describe("grammar — Document 빈 입력 / 단일 노드", () => {
  it("빈 문자열 → 빈 body", () => {
    const ast = parse("");
    expect(ast.type).toBe("Document");
    expect(ast.body).toEqual([]);
  });
});
