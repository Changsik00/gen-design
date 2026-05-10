import { describe, it, expect } from "vitest";
import { compileToReact } from "../compile";

describe("compileToReact", () => {
  it("compiles a simple ComponentInstance to tsx", () => {
    const result = compileToReact({
      text: '<Button variant="primary" />',
      componentName: "MyScene",
    });
    expect(result.ok).toBe(true);
    expect(result.tsx).toContain('<Button variant="primary" />');
    expect(result.tsx).toContain("export function MyScene");
  });

  it("emits t() call for i18n placeholder (no fake-pass on comments)", () => {
    const result = compileToReact({
      text: "<Button>{{i18n.ko.submit}}</Button>",
      componentName: "MyScene",
    });
    expect(result.ok).toBe(true);
    const tsx = result.tsx ?? "";

    // The i18n hint is currently emitted as a comment + t() call. Assert the
    // *call* (real code) rather than just the word "useTranslation" which
    // also appears inside the comment hint and would fake-pass (C4).
    expect(tsx).toMatch(/\bt\(\s*['"]ko\.submit['"]\s*\)/);

    // Strip comments before checking for the bare word "useTranslation" —
    // this guarantees the assertion would fail if the call site disappeared,
    // even when the hint comment still mentions useTranslation.
    const withoutComments = tsx
      .replace(/\/\/[^\n]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    expect(
      /\bt\(\s*['"]ko\.submit['"]\s*\)/.test(withoutComments),
      "expected t('ko.submit') call outside of comments",
    ).toBe(true);
  });

  it("emits useState when ## Behavior state present", () => {
    const input = [
      "<Button />",
      "## Behavior",
      "- state: open: boolean = false",
    ].join("\n");
    const result = compileToReact({ text: input, componentName: "MyScene" });
    expect(result.ok).toBe(true);
    expect(result.tsx).toContain("useState<boolean>(false)");
    expect(result.tsx).toContain("import { useState }");
  });

  it("emits variant switch when ## Variants present", () => {
    const input = [
      "<Button />",
      "## Variants",
      "- Primary: variant=primary",
      "- Secondary: variant=secondary",
    ].join("\n");
    const result = compileToReact({ text: input, componentName: "Button" });
    expect(result.ok).toBe(true);
    expect(result.tsx).toContain("ButtonVariants");
    expect(result.tsx).toContain('case "Primary"');
  });

  it("returns ok:false on parse error", () => {
    const result = compileToReact({
      text: "<Unclosed",
      componentName: "Bad",
    });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
