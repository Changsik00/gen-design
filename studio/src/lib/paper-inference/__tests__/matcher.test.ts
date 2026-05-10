import { describe, it, expect } from "vitest";
import { matchByName } from "../component-matcher";

const CATALOG = ["Button", "Input", "LoginForm", "BrandHeader", "SettingsScene"];

describe("matchByName — 컴포넌트 이름 매칭", () => {
  it("exact match — catalog 에 동일 이름 존재", () => {
    const result = matchByName("Button", CATALOG);
    expect(result).toEqual({ matched: true, exact: true, distance: 0, suggestion: null });
  });

  it("fuzzy match — typo 1자 차이 (삽입)", () => {
    // Buttton (7자) vs Button (6자) → distance 1
    const result = matchByName("Buttton", CATALOG);
    expect(result.matched).toBe(true);
    expect(result.exact).toBe(false);
    expect(result.distance).toBe(1);
    expect(result.suggestion).toBe("Button");
  });

  it("fuzzy match — typo 2자 차이", () => {
    // Bton (4자) vs Button (6자) → u,t 삽입 필요 → distance 2
    const result = matchByName("Bton", CATALOG);
    expect(result.matched).toBe(true);
    expect(result.exact).toBe(false);
    expect(result.distance).toBe(2);
    expect(result.suggestion).toBe("Button");
  });

  it("미등록 — catalog 에 없고 fuzzy 범위도 초과", () => {
    const result = matchByName("MyCustomWidget", CATALOG);
    expect(result).toEqual({ matched: false, exact: false, distance: null, suggestion: null });
  });

  it("빈 이름 — 즉시 미매칭 반환", () => {
    const result = matchByName("", CATALOG);
    expect(result).toEqual({ matched: false, exact: false, distance: null, suggestion: null });
  });

  it("케이스 불일치 — 'button' (소문자) 는 fuzzy 매칭 (distance 1)", () => {
    // 'b' !== 'B' → substitution → distance 1
    const result = matchByName("button", CATALOG);
    expect(result.matched).toBe(true);
    expect(result.exact).toBe(false);
    expect(result.distance).toBe(1);
    expect(result.suggestion).toBe("Button");
  });
});
