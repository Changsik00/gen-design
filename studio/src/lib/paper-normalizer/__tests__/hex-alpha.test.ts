import { describe, it, expect } from "vitest";
import { parseHexAlpha, serializeHexAlpha } from "../hex-alpha";

describe("parseHexAlpha — 정상 케이스", () => {
  it("6-hex 를 alpha=1 로 parse", () => {
    expect(parseHexAlpha("#4F46E5")).toEqual({ r: 0x4f, g: 0x46, b: 0xe5, a: 1 });
  });

  it("8-hex 를 alpha 포함으로 parse (회고 예시 #4F46E52E)", () => {
    const v = parseHexAlpha("#4F46E52E");
    expect(v.r).toBe(0x4f);
    expect(v.g).toBe(0x46);
    expect(v.b).toBe(0xe5);
    expect(v.a).toBeCloseTo(0x2e / 255, 4);
  });

  it("rgb(...) 를 alpha=1 로 parse", () => {
    expect(parseHexAlpha("rgb(79, 70, 229)")).toEqual({ r: 79, g: 70, b: 229, a: 1 });
  });

  it("rgba(...) 를 alpha 포함으로 parse (회고 예시 0.18)", () => {
    expect(parseHexAlpha("rgba(79, 70, 229, 0.18)")).toEqual({ r: 79, g: 70, b: 229, a: 0.18 });
  });

  it("oklch(...) 도 culori 로 parse", () => {
    const v = parseHexAlpha("oklch(0.7 0.15 250)");
    expect(v.r).toBeGreaterThanOrEqual(0);
    expect(v.r).toBeLessThanOrEqual(255);
    expect(v.a).toBe(1);
  });
});

describe("parseHexAlpha — 경계", () => {
  it("잘못된 입력 시 throw", () => {
    expect(() => parseHexAlpha("not-a-color")).toThrow(/알 수 없는 색 표기/);
  });

  it("빈 문자열 시 throw", () => {
    expect(() => parseHexAlpha("")).toThrow();
  });

  it("hex 길이 비정상 시 throw (5-hex)", () => {
    expect(() => parseHexAlpha("#abcde")).toThrow();
  });
});

describe("serializeHexAlpha — 형식 옵션", () => {
  const v = { r: 0x4f, g: 0x46, b: 0xe5, a: 0.18 };

  it("'hex' format 은 alpha 무시", () => {
    expect(serializeHexAlpha(v, "hex")).toBe("#4F46E5");
  });

  it("'hex-alpha' format 은 8-hex (default)", () => {
    expect(serializeHexAlpha(v)).toBe("#4F46E52E");
  });

  it("'rgba' format 은 rgba(...) 로 직렬화", () => {
    expect(serializeHexAlpha(v, "rgba")).toBe("rgba(79, 70, 229, 0.18)");
  });
});

describe("hex-alpha — round-trip", () => {
  it("8-hex round-trip 동일성", () => {
    const original = "#4F46E52E";
    expect(serializeHexAlpha(parseHexAlpha(original), "hex-alpha")).toBe(original);
  });

  it("rgba → 8-hex → rgba round-trip 등가", () => {
    const v = parseHexAlpha("rgba(15, 23, 42, 0.18)");
    const hex = serializeHexAlpha(v, "hex-alpha");
    const back = parseHexAlpha(hex);
    expect(back.r).toBe(v.r);
    expect(back.g).toBe(v.g);
    expect(back.b).toBe(v.b);
    expect(back.a).toBeCloseTo(v.a, 2);
  });
});
