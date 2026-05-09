import { describe, it, expect } from "vitest";
import { toCssVars, generateCssOutput } from "../utils";
import { DEFAULT_TOKENS } from "../types";
import type { EditableTokens } from "../types";

describe("toCssVars", () => {
  it("primary → --primary", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(vars["--primary"]).toBe("#6366F1");
  });

  it("primaryForeground → --primary-foreground", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(vars["--primary-foreground"]).toBe("#FFFFFF");
  });

  it("background → --background", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(vars["--background"]).toBe("#F8FAFC");
  });

  it("radiusBase → --radius", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(vars["--radius"]).toBe("0.5rem");
  });

  it("fontSans → --font-sans", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(vars["--font-sans"]).toBe("'Inter', system-ui, sans-serif");
  });

  it("모든 토큰이 CSS 변수로 매핑됨 (16개 필드 → 16개 변수)", () => {
    const vars = toCssVars(DEFAULT_TOKENS);
    expect(Object.keys(vars).length).toBe(16);
  });

  it("커스텀 primary 값 반영", () => {
    const custom: EditableTokens = { ...DEFAULT_TOKENS, primary: "#FF0000" };
    const vars = toCssVars(custom);
    expect(vars["--primary"]).toBe("#FF0000");
  });
});

describe("generateCssOutput", () => {
  it(":root 블록 포함", () => {
    const css = generateCssOutput(DEFAULT_TOKENS);
    expect(css).toContain(":root {");
    expect(css).toContain("}");
  });

  it("--primary 변수 포함", () => {
    const css = generateCssOutput(DEFAULT_TOKENS);
    expect(css).toContain("--primary:");
  });

  it("--radius 변수 포함", () => {
    const css = generateCssOutput(DEFAULT_TOKENS);
    expect(css).toContain("--radius:");
  });

  it("--font-sans 변수 포함", () => {
    const css = generateCssOutput(DEFAULT_TOKENS);
    expect(css).toContain("--font-sans:");
  });

  it("모든 16개 CSS 변수 포함", () => {
    const css = generateCssOutput(DEFAULT_TOKENS);
    const vars = toCssVars(DEFAULT_TOKENS);
    for (const key of Object.keys(vars)) {
      expect(css).toContain(key);
    }
  });
});
