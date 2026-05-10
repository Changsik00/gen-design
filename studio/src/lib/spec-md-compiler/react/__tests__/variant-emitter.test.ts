import { describe, it, expect } from "vitest";
import { emitVariants } from "../variant-emitter";
import type { VariantSpec } from "../section-parser";

describe("emitVariants", () => {
  it("returns empty string when variants is null", () => {
    expect(emitVariants(null, "Button")).toBe("");
  });

  it("returns empty string when variants array is empty", () => {
    expect(emitVariants([], "Button")).toBe("");
  });

  it("emits single variant with one prop as if/return block", () => {
    const variants: VariantSpec[] = [{ name: "Primary", props: { variant: "primary" } }];
    const result = emitVariants(variants, "Button");
    expect(result).toContain("ButtonVariants");
    expect(result).toContain('case "Primary"');
    expect(result).toContain('variant="primary"');
  });

  it("emits single variant with multiple props sorted alphabetically", () => {
    const variants: VariantSpec[] = [
      { name: "LargePrimary", props: { variant: "primary", size: "lg" } },
    ];
    const result = emitVariants(variants, "Button");
    const sizeIdx = result.indexOf("size");
    const variantIdx = result.indexOf('variant="primary"');
    expect(sizeIdx).toBeLessThan(variantIdx);
  });

  it("emits multiple variants as switch statement", () => {
    const variants: VariantSpec[] = [
      { name: "Primary", props: { variant: "primary" } },
      { name: "Secondary", props: { variant: "secondary" } },
      { name: "Ghost", props: { variant: "ghost" } },
    ];
    const result = emitVariants(variants, "Button");
    expect(result).toContain("switch");
    expect(result).toContain('case "Primary"');
    expect(result).toContain('case "Secondary"');
    expect(result).toContain('case "Ghost"');
  });

  it("component name PascalCase → function name with Variants suffix", () => {
    const variants: VariantSpec[] = [{ name: "A", props: { x: "1" } }];
    const result = emitVariants(variants, "LoginForm");
    expect(result).toContain("LoginFormVariants");
  });
});
