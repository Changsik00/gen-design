import { describe, it, expect } from "vitest";
import { resolveTokenValue, resolveSemanticColors } from "../resolver";
import type { TokensJson } from "../types";

const FIXTURE: TokensJson = {
  primitive: {
    indigo: {
      500: { $value: "#6366F1" },
      400: { $value: "#818CF8" },
    },
    neutral: {
      0: { $value: "#FFFFFF" },
      900: { $value: "#0F172A" },
    },
  },
  semantic: {
    color: {
      light: {
        primary: { $value: "{primitive.indigo.500}" },
        background: { $value: "{primitive.neutral.0}" },
        foreground: { $value: "{primitive.neutral.900}" },
      },
      dark: {
        primary: { $value: "{primitive.indigo.400}" },
      },
    },
  },
};

describe("resolveTokenValue", () => {
  it("리터럴 값은 그대로 반환", () => {
    expect(resolveTokenValue("#FFFFFF", FIXTURE.primitive)).toBe("#FFFFFF");
  });

  it("{primitive.xxx.yyy} 참조를 1단계 해소", () => {
    expect(resolveTokenValue("{primitive.indigo.500}", FIXTURE.primitive)).toBe("#6366F1");
  });

  it("존재하지 않는 참조는 throw", () => {
    expect(() => resolveTokenValue("{primitive.unknown.999}", FIXTURE.primitive)).toThrow();
  });
});

describe("resolveSemanticColors", () => {
  it("light 스킴 전체를 CSS 변수 레코드로 해소", () => {
    const out = resolveSemanticColors(FIXTURE);
    expect(out["--primary"]).toBe("#6366F1");
    expect(out["--background"]).toBe("#FFFFFF");
    expect(out["--foreground"]).toBe("#0F172A");
  });

  it("light 스킴은 dark 토큰을 포함하지 않음", () => {
    const out = resolveSemanticColors(FIXTURE);
    expect(Object.keys(out)).toEqual(
      expect.arrayContaining(["--primary", "--background", "--foreground"]),
    );
    expect(out["--primary"]).toBe("#6366F1");
  });
});
