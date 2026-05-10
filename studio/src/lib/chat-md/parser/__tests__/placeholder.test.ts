import { describe, it, expect } from "vitest";
import { parser } from "../../grammar";
import type { Document, Placeholder } from "../ast-types";

function parse(text: string): Document {
  return parser.parse(text) as Document;
}

describe("grammar — Placeholder", () => {
  it("i18n placeholder, 단일 segment", () => {
    const ast = parse("{{i18n.x}}");
    expect(ast.type).toBe("Document");
    expect(ast.body).toHaveLength(1);
    const p = ast.body[0] as Placeholder;
    expect(p.type).toBe("Placeholder");
    expect(p.kind).toBe("i18n");
    expect(p.path).toBe("x");
  });

  it("i18n placeholder, dotted path", () => {
    const ast = parse("{{i18n.ko.login-input}}");
    const p = ast.body[0] as Placeholder;
    expect(p.kind).toBe("i18n");
    expect(p.path).toBe("ko.login-input");
  });

  it("token placeholder, 깊은 path", () => {
    const ast = parse("{{token.semantic.color.light.primary}}");
    const p = ast.body[0] as Placeholder;
    expect(p.kind).toBe("token");
    expect(p.path).toBe("semantic.color.light.primary");
  });

  it("location 추적", () => {
    const ast = parse("{{i18n.x}}");
    const p = ast.body[0] as Placeholder;
    expect(p.location.line).toBe(1);
    expect(p.location.col).toBe(1);
    expect(p.location.offset).toBe(0);
    expect(p.location.length).toBe(10);
  });

  it("잘못된 kind 는 parse 실패", () => {
    expect(() => parse("{{xxx.foo}}")).toThrow(/Expected.*"i18n".*"token"/);
  });

  it("path 없는 placeholder 는 parse 실패", () => {
    expect(() => parse("{{i18n}}")).toThrow();
  });
});
