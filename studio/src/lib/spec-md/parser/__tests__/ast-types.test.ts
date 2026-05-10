import { describe, it, expect } from "vitest";
import type {
  Document,
  ComponentInstance,
  Placeholder,
  MarkdownText,
  Comment,
  ParseResult,
  ParseError,
  SourceLocation,
} from "../ast-types";

describe("ast-types — 타입 컴파일 + shape 검증", () => {
  it("Document + ComponentInstance 구성", () => {
    const loc: SourceLocation = { line: 1, col: 1, offset: 0, length: 0 };
    const ast: Document = {
      type: "Document",
      body: [
        {
          type: "ComponentInstance",
          name: "Button",
          props: { variant: "primary", size: "lg" },
          children: [],
          location: loc,
        },
      ],
    };
    expect(ast.type).toBe("Document");
    expect(ast.body[0].type).toBe("ComponentInstance");
  });

  it("ComponentInstance 의 4 layer 모두 표현 가능", () => {
    const loc: SourceLocation = { line: 1, col: 1, offset: 0, length: 0 };
    const c: ComponentInstance = {
      type: "ComponentInstance",
      name: "Button",
      props: { variant: "primary" },         // L1
      // size / tone 등도 props 의 axis: L2
      theme: "brand-b",                       // L3
      tokens: { "--primary": "{{token.semantic.brand-2}}" }, // L4
      children: [],
      location: loc,
    };
    expect(c.theme).toBe("brand-b");
    expect(c.tokens?.["--primary"]).toContain("{{token");
  });

  it("Placeholder 의 kind = i18n / token", () => {
    const loc: SourceLocation = { line: 1, col: 1, offset: 0, length: 0 };
    const i18n: Placeholder = {
      type: "Placeholder",
      kind: "i18n",
      path: "ko.login-input",
      location: loc,
    };
    const token: Placeholder = {
      type: "Placeholder",
      kind: "token",
      path: "semantic.color.light.primary",
      location: loc,
    };
    expect(i18n.kind).toBe("i18n");
    expect(token.kind).toBe("token");
  });

  it("MarkdownText / Comment", () => {
    const loc: SourceLocation = { line: 1, col: 1, offset: 0, length: 0 };
    const md: MarkdownText = { type: "MarkdownText", text: "Hello world", location: loc };
    const cm: Comment = { type: "Comment", text: " note ", location: loc };
    expect(md.text).toBe("Hello world");
    expect(cm.text).toContain("note");
  });

  it("ParseResult 성공 / 실패 분기", () => {
    const ok: ParseResult = { ok: true, ast: { type: "Document", body: [] }, errors: [] };
    const err: ParseError = {
      message: "Unexpected </Button>",
      location: { line: 5, col: 12, offset: 100, length: 9 },
      stage: "parse",
    };
    const fail: ParseResult = { ok: false, errors: [err] };
    expect(ok.ok).toBe(true);
    expect(fail.errors[0].stage).toBe("parse");
  });
});
