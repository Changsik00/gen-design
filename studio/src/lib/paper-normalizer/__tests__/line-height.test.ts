import { describe, it, expect } from "vitest";
import {
  parseLineHeight,
  serializeLineHeight,
  toPx,
  toUnitless,
} from "../line-height";

describe("parseLineHeight — 3 단위", () => {
  it("px 단위", () => {
    expect(parseLineHeight("24px")).toEqual({ value: 24, unit: "px" });
  });

  it("unitless", () => {
    expect(parseLineHeight("1.5")).toEqual({ value: 1.5, unit: "unitless" });
  });

  it("percent", () => {
    expect(parseLineHeight("150%")).toEqual({ value: 150, unit: "percent" });
  });

  it("정수 unitless", () => {
    expect(parseLineHeight("2")).toEqual({ value: 2, unit: "unitless" });
  });
});

describe("parseLineHeight — 경계", () => {
  it("잘못된 단위 (em) 시 throw", () => {
    expect(() => parseLineHeight("1.5em")).toThrow();
  });

  it("빈 문자열 시 throw", () => {
    expect(() => parseLineHeight("")).toThrow();
  });
});

describe("serializeLineHeight — unit 보존", () => {
  it("px 보존", () => {
    expect(serializeLineHeight({ value: 24, unit: "px" })).toBe("24px");
  });

  it("unitless 보존 (단위 없음)", () => {
    expect(serializeLineHeight({ value: 1.5, unit: "unitless" })).toBe("1.5");
  });

  it("percent 보존", () => {
    expect(serializeLineHeight({ value: 150, unit: "percent" })).toBe("150%");
  });
});

describe("toPx / toUnitless 변환 utility (fontSize=16)", () => {
  const fs = 16;

  it("px → px (그대로)", () => {
    expect(toPx({ value: 24, unit: "px" }, fs)).toBe(24);
  });

  it("unitless 1.5 × 16 = 24", () => {
    expect(toPx({ value: 1.5, unit: "unitless" }, fs)).toBe(24);
  });

  it("150% × 16 = 24", () => {
    expect(toPx({ value: 150, unit: "percent" }, fs)).toBe(24);
  });

  it("toUnitless 24px / 16 = 1.5", () => {
    expect(toUnitless({ value: 24, unit: "px" }, fs)).toBe(1.5);
  });

  it("toUnitless 150% → 1.5", () => {
    expect(toUnitless({ value: 150, unit: "percent" }, fs)).toBe(1.5);
  });
});

describe("line-height — round-trip", () => {
  it("3 단위 모두 round-trip 동일성", () => {
    expect(serializeLineHeight(parseLineHeight("24px"))).toBe("24px");
    expect(serializeLineHeight(parseLineHeight("1.5"))).toBe("1.5");
    expect(serializeLineHeight(parseLineHeight("150%"))).toBe("150%");
  });
});
