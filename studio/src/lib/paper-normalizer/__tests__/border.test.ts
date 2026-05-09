import { describe, it, expect } from "vitest";
import { parseBorder, serializeBorder } from "../border";

describe("parseBorder — shorthand 변형", () => {
  it("정상 shorthand (1px solid #E2E8F0)", () => {
    const v = parseBorder("1px solid #E2E8F0");
    expect(v.width).toBe(1);
    expect(v.style).toBe("solid");
    expect(v.color).toEqual({ r: 0xe2, g: 0xe8, b: 0xf0, a: 1 });
  });

  it("style 생략 — 회고 예시 '1px #E2E8F0'", () => {
    const v = parseBorder("1px #E2E8F0");
    expect(v.width).toBe(1);
    expect(v.style).toBeNull();
    expect(v.color).toEqual({ r: 0xe2, g: 0xe8, b: 0xf0, a: 1 });
  });

  it("dashed style", () => {
    const v = parseBorder("2px dashed #FF0000");
    expect(v.style).toBe("dashed");
  });

  it("color rgba 입력 가능", () => {
    const v = parseBorder("1px solid rgba(79, 70, 229, 0.18)");
    expect(v.color.a).toBeCloseTo(0.18);
  });

  it("color 8-hex alpha 보존", () => {
    const v = parseBorder("1px solid #4F46E52E");
    expect(v.color.a).toBeCloseTo(0x2e / 255, 4);
  });
});

describe("parseBorder — 경계", () => {
  it("width 만 있고 color 없음 시 throw", () => {
    expect(() => parseBorder("1px")).toThrow(/width 와 color 가 모두 필요/);
  });

  it("width 가 px 없음 시 throw", () => {
    expect(() => parseBorder("1 solid #E2E8F0")).toThrow(/첫 토큰은 px width/);
  });

  it("빈 문자열 시 throw", () => {
    expect(() => parseBorder("")).toThrow();
  });
});

describe("serializeBorder — shorthand 강제 + style 보강", () => {
  it("정상 shorthand 직렬화", () => {
    expect(
      serializeBorder({
        width: 1,
        style: "solid",
        color: { r: 0xe2, g: 0xe8, b: 0xf0, a: 1 },
      }),
    ).toBe("1px solid #E2E8F0");
  });

  it("style null → 'solid' 기본 보강", () => {
    expect(
      serializeBorder({ width: 1, style: null, color: { r: 0xe2, g: 0xe8, b: 0xf0, a: 1 } }),
    ).toBe("1px solid #E2E8F0");
  });

  it("dashed 보존", () => {
    expect(
      serializeBorder({ width: 2, style: "dashed", color: { r: 0xff, g: 0x00, b: 0x00, a: 1 } }),
    ).toBe("2px dashed #FF0000");
  });
});

describe("border — round-trip", () => {
  it("style 명시 round-trip 동일성", () => {
    const original = "1px solid #E2E8F0";
    expect(serializeBorder(parseBorder(original))).toBe(original);
  });

  it("style 생략 입력 → 'solid' 보강 (등가 변환)", () => {
    expect(serializeBorder(parseBorder("1px #E2E8F0"))).toBe("1px solid #E2E8F0");
  });
});
