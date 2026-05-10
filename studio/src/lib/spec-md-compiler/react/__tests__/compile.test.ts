import { describe, it, expect } from "vitest";
import { compileToReact } from "../compile";

describe("compileToReact", () => {
  it("compiles a simple ComponentInstance to tsx", () => {
    const result = compileToReact({
      text: '<Button variant="primary" />',
      componentName: "MyPage",
    });
    expect(result.ok).toBe(true);
    expect(result.tsx).toContain('<Button variant="primary" />');
    expect(result.tsx).toContain("export function MyPage");
  });

  it("includes i18n import when placeholder used", () => {
    const result = compileToReact({
      text: "<Button>{{i18n.ko.submit}}</Button>",
      componentName: "MyPage",
    });
    expect(result.ok).toBe(true);
    expect(result.tsx).toContain("useTranslation");
    expect(result.tsx).toContain('t("ko.submit")');
  });

  it("emits useState when ## Behavior state present", () => {
    const input = [
      "<Button />",
      "## Behavior",
      "- state: open: boolean = false",
    ].join("\n");
    const result = compileToReact({ text: input, componentName: "MyPage" });
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
