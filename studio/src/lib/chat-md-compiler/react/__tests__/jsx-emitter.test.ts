import { describe, it, expect, beforeEach } from "vitest";
import { emitJSX, emitDocument, type EmitContext } from "../jsx-emitter";
import type {
  ComponentInstance,
  Placeholder,
  MarkdownText,
  Comment,
  Block,
  Document,
} from "../../../chat-md/parser/ast-types";

const loc = { line: 1, col: 1, offset: 0, length: 0 };

function makeCtx(): EmitContext {
  return {
    usedI18nKeys: new Set(),
    usedTokenKeys: new Set(),
    knownComponents: new Set(["Button", "LoginForm", "Sidebar"]),
  };
}

function ci(
  name: string,
  props: Record<string, unknown> = {},
  children: Block[] = [],
  extra: Partial<ComponentInstance> = {}
): ComponentInstance {
  return {
    type: "ComponentInstance",
    name,
    props: props as ComponentInstance["props"],
    children,
    location: loc,
    ...extra,
  };
}

describe("emitJSX", () => {
  let ctx: EmitContext;
  beforeEach(() => { ctx = makeCtx(); });

  it("self-closing with string prop", () => {
    const node = ci("Button", { variant: "primary" });
    expect(emitJSX(node, 0, ctx)).toBe('<Button variant="primary" />');
  });

  it("self-closing with number prop", () => {
    const node = ci("Button", { size: 42 });
    expect(emitJSX(node, 0, ctx)).toBe("<Button size={42} />");
  });

  it("self-closing with boolean prop", () => {
    const node = ci("Button", { disabled: true });
    expect(emitJSX(node, 0, ctx)).toBe("<Button disabled={true} />");
  });

  it("paired with text children", () => {
    const child: MarkdownText = { type: "MarkdownText", text: "Hello", location: loc };
    const node = ci("Button", {}, [child]);
    const result = emitJSX(node, 0, ctx);
    expect(result).toContain("<Button>");
    expect(result).toContain("</Button>");
    expect(result).toContain("{/* Hello */}");
  });

  it("tokens prop → style attribute", () => {
    const node: ComponentInstance = {
      ...ci("Button", {}),
      tokens: { "--color-primary": "var(--color-primary)" },
    };
    const result = emitJSX(node, 0, ctx);
    expect(result).toContain('style={{ "--color-primary": "var(--color-primary)" }}');
  });

  it("theme → data-theme attribute", () => {
    const node: ComponentInstance = {
      ...ci("Button", {}),
      theme: "brand-a",
    };
    expect(emitJSX(node, 0, ctx)).toBe('<Button data-theme="brand-a" />');
  });

  it("Placeholder i18n → {t('key')} and records key", () => {
    const node: Placeholder = { type: "Placeholder", kind: "i18n", path: "ko.login-input", location: loc };
    const result = emitJSX(node, 0, ctx);
    expect(result).toBe('{t("ko.login-input")}');
    expect(ctx.usedI18nKeys.has("ko.login-input")).toBe(true);
  });

  it("Placeholder token → {tokens['key']} and records key", () => {
    const node: Placeholder = { type: "Placeholder", kind: "token", path: "semantic.color.primary", location: loc };
    const result = emitJSX(node, 0, ctx);
    expect(result).toBe('{tokens["semantic.color.primary"]}');
    expect(ctx.usedTokenKeys.has("semantic.color.primary")).toBe(true);
  });

  it("MarkdownText → JSX comment", () => {
    const node: MarkdownText = { type: "MarkdownText", text: "some text", location: loc };
    expect(emitJSX(node, 0, ctx)).toBe("{/* some text */}");
  });

  it("Comment → JSX comment", () => {
    const node: Comment = { type: "Comment", text: " a comment ", location: loc };
    expect(emitJSX(node, 0, ctx)).toBe("{/*  a comment  */}");
  });

  it("props sorted alphabetically for determinism", () => {
    const node = ci("Button", { variant: "primary", size: "lg", disabled: false });
    const result = emitJSX(node, 0, ctx);
    const disabledIdx = result.indexOf("disabled");
    const sizeIdx = result.indexOf("size");
    const variantIdx = result.indexOf("variant");
    expect(disabledIdx).toBeLessThan(sizeIdx);
    expect(sizeIdx).toBeLessThan(variantIdx);
  });

  it("nested 3-depth children with indent", () => {
    const inner = ci("Button", { variant: "primary" });
    const mid = ci("LoginForm", {}, [inner]);
    const outer = ci("Sidebar", {}, [mid]);
    const result = emitJSX(outer, 0, ctx);
    expect(result).toContain("<Sidebar>");
    expect(result).toContain("  <LoginForm>");
    expect(result).toContain("    <Button variant=\"primary\" />");
    expect(result).toContain("  </LoginForm>");
    expect(result).toContain("</Sidebar>");
  });
});

describe("emitDocument", () => {
  it("emits all top-level blocks joined by newlines", () => {
    const ctx = makeCtx();
    const doc: Document = {
      type: "Document",
      body: [
        ci("Button", { variant: "primary" }),
        ci("LoginForm", {}),
      ],
    };
    const result = emitDocument(doc, ctx);
    expect(result).toContain('<Button variant="primary" />');
    expect(result).toContain("<LoginForm />");
  });
});
