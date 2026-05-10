import { describe, it, expect } from "vitest";
import { emit } from "../emit";
import { parse } from "../../spec-md/parser/index";
import type { Document, ComponentInstance, MarkdownText, Comment, Placeholder, SourceLocation } from "../../spec-md/parser/ast-types";

const NULL_LOC: SourceLocation = { line: 0, col: 0, offset: 0, length: 0 };

function ci(name: string, props: Record<string, unknown> = {}, children: Document["body"] = []): ComponentInstance {
  return { type: "ComponentInstance", name, props, children, location: NULL_LOC } as ComponentInstance;
}
function mt(text: string): MarkdownText {
  return { type: "MarkdownText", text, location: NULL_LOC };
}
function comment(text: string): Comment {
  return { type: "Comment", text, location: NULL_LOC };
}
function ph(kind: "i18n" | "token", path: string): Placeholder {
  return { type: "Placeholder", kind, path, location: NULL_LOC };
}
function doc(...body: Document["body"]): Document {
  return { type: "Document", body };
}

/** location 제외, 공백 전용 MarkdownText 제거 후 비교 */
function normalize(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node
      .filter((item) => {
        if (item && typeof item === "object" && "type" in (item as object)) {
          const typed = item as { type: string; text?: string };
          if (typed.type === "MarkdownText" && typed.text !== undefined) {
            return typed.text.trim() !== "";
          }
        }
        return true;
      })
      .map(normalize);
  }
  if (node && typeof node === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k === "location") continue;
      result[k] = normalize(v);
    }
    return result;
  }
  return node;
}

describe("emit — Document → spec.md 텍스트", () => {
  it("single self-closing component", () => {
    const text = emit(doc(ci("Button")));
    expect(text.trim()).toBe("<Button />");
  });

  it("nested component", () => {
    const d = doc(ci("LoginForm", {}, [ci("Button")]));
    const text = emit(d);
    expect(text).toContain("<LoginForm>");
    expect(text).toContain("  <Button />");
    expect(text).toContain("</LoginForm>");
  });

  it("attrs — string / number / placeholder", () => {
    const d = doc(ci("Button", { variant: "primary", count: 42, label: ph("i18n", "ko.login") }));
    const text = emit(d);
    expect(text).toContain('variant="primary"');
    expect(text).toContain("count={42}");
    expect(text).toContain("label={{i18n.ko.login}}");
  });

  it("placeholder 자식", () => {
    const d = doc(ci("Card", {}, [ph("i18n", "ko.greeting")]));
    const text = emit(d);
    expect(text).toContain("{{i18n.ko.greeting}}");
  });

  it("round-trip: emit → parse → 동일 구조", () => {
    const original = doc(
      ci("LoginForm", { variant: "primary" }, [
        ci("Button", { label: ph("i18n", "ko.login") }),
        mt("Hello"),
      ]),
    );
    const text = emit(original);
    const result = parse(text);
    expect(result.ok).toBe(true);
    expect(normalize(result.ast)).toEqual(normalize(original));
  });

  it("round-trip: nested placeholder 속성", () => {
    const original = doc(ci("Card", { color: ph("token", "semantic.brand-2") }));
    const text = emit(original);
    const result = parse(text);
    expect(result.ok).toBe(true);
    expect(normalize(result.ast)).toEqual(normalize(original));
  });

  it("round-trip: 다중 속성 + 중첩", () => {
    // theme 은 ComponentInstance.theme 필드에 저장 (props 아님)
    const original: Document = {
      type: "Document",
      body: [
        {
          type: "ComponentInstance",
          name: "Page",
          props: {},
          theme: "brand-a",
          children: [
            ci("Header"),
            ci("Button", { variant: "ghost", size: "sm" }),
          ],
          location: NULL_LOC,
        },
      ],
    };
    const text = emit(original);
    const result = parse(text);
    expect(result.ok).toBe(true);
    expect(normalize(result.ast)).toEqual(normalize(original));
  });

  it("round-trip: 빈 document", () => {
    const original = doc();
    const text = emit(original);
    expect(text).toBe("");
    const result = parse(text);
    expect(result.ok).toBe(true);
    expect(result.ast?.body).toHaveLength(0);
  });

  it("comment 노드 emit", () => {
    const d = doc(comment(" unmatched: Frame "));
    const text = emit(d);
    expect(text).toContain("<!-- unmatched: Frame -->");
  });
});
