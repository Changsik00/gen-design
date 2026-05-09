import { describe, it, expect } from "vitest";
import { parseFontFallback, serializeFontFallback } from "../font-fallback";

describe("parseFontFallback — quote / fallback 변형", () => {
  it("single quote primary + generic", () => {
    expect(parseFontFallback("'Inter', system-ui, sans-serif")).toEqual({
      primary: "Inter",
      fallbacks: ["system-ui"],
      generic: "sans-serif",
    });
  });

  it("double quote primary + generic", () => {
    expect(parseFontFallback('"Inter", system-ui, sans-serif')).toEqual({
      primary: "Inter",
      fallbacks: ["system-ui"],
      generic: "sans-serif",
    });
  });

  it("quote 없음 + generic", () => {
    expect(parseFontFallback("Inter, system-ui, sans-serif")).toEqual({
      primary: "Inter",
      fallbacks: ["system-ui"],
      generic: "sans-serif",
    });
  });

  it("generic 누락", () => {
    expect(parseFontFallback("'Inter', system-ui")).toEqual({
      primary: "Inter",
      fallbacks: ["system-ui"],
      generic: null,
    });
  });

  it("primary 만", () => {
    expect(parseFontFallback("'Inter'")).toEqual({
      primary: "Inter",
      fallbacks: [],
      generic: null,
    });
  });

  it("공백 포함 가족명 (Geist Variable)", () => {
    expect(parseFontFallback("'Geist Variable', system-ui, sans-serif")).toEqual({
      primary: "Geist Variable",
      fallbacks: ["system-ui"],
      generic: "sans-serif",
    });
  });
});

describe("parseFontFallback — 경계", () => {
  it("빈 문자열 시 throw", () => {
    expect(() => parseFontFallback("")).toThrow();
  });

  it("generic 만 있고 primary 없음 시 throw", () => {
    expect(() => parseFontFallback("sans-serif")).toThrow(/primary family 없이/);
  });
});

describe("serializeFontFallback — quote / generic 보강", () => {
  it("공백 없는 가족 → unquoted, generic 보존", () => {
    expect(
      serializeFontFallback({ primary: "Inter", fallbacks: ["system-ui"], generic: "sans-serif" }),
    ).toBe("Inter, system-ui, sans-serif");
  });

  it("공백 포함 가족 → single quote", () => {
    expect(
      serializeFontFallback({
        primary: "Geist Variable",
        fallbacks: ["system-ui"],
        generic: "sans-serif",
      }),
    ).toBe("'Geist Variable', system-ui, sans-serif");
  });

  it("generic null → 'sans-serif' 기본 보강", () => {
    expect(
      serializeFontFallback({ primary: "Inter", fallbacks: ["system-ui"], generic: null }),
    ).toBe("Inter, system-ui, sans-serif");
  });

  it("monospace generic 보존", () => {
    expect(
      serializeFontFallback({ primary: "JetBrains Mono", fallbacks: [], generic: "monospace" }),
    ).toBe("'JetBrains Mono', monospace");
  });
});

describe("font-fallback — round-trip (값 등가, quote 정규화 허용)", () => {
  it("quote 가 단어 1개 family 에서는 normalize 시 제거됨 (Inter)", () => {
    // 입력 quote 는 정규화 — single quote 는 영문 가족명에서 불필요
    expect(serializeFontFallback(parseFontFallback("'Inter', system-ui, sans-serif"))).toBe(
      "Inter, system-ui, sans-serif",
    );
  });

  it("quote 없는 입력 → 그대로 unquoted", () => {
    expect(serializeFontFallback(parseFontFallback("Inter, system-ui, sans-serif"))).toBe(
      "Inter, system-ui, sans-serif",
    );
  });

  it("공백 포함 family 는 quote 보존", () => {
    expect(
      serializeFontFallback(parseFontFallback("'Geist Variable', system-ui, sans-serif")),
    ).toBe("'Geist Variable', system-ui, sans-serif");
  });
});
