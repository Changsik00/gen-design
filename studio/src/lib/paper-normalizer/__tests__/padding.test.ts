import { describe, it, expect } from "vitest";
import { parsePadding, serializePadding } from "../padding";

describe("parsePadding — shorthand 1~4 value", () => {
  it("1-value: 모두 동일", () => {
    expect(parsePadding("40px")).toEqual({
      block: { start: 40, end: 40 },
      inline: { start: 40, end: 40 },
    });
  });

  it("2-value: block | inline", () => {
    expect(parsePadding("20px 16px")).toEqual({
      block: { start: 20, end: 20 },
      inline: { start: 16, end: 16 },
    });
  });

  it("3-value: top | inline | bottom", () => {
    expect(parsePadding("8px 16px 12px")).toEqual({
      block: { start: 8, end: 12 },
      inline: { start: 16, end: 16 },
    });
  });

  it("4-value: top | right | bottom | left", () => {
    expect(parsePadding("8px 16px 12px 24px")).toEqual({
      block: { start: 8, end: 12 },
      inline: { start: 24, end: 16 },
    });
  });
});

describe("parsePadding — keyword 변형", () => {
  it("padding-inline 만 (회고 예시 14)", () => {
    expect(parsePadding("padding-inline 14px")).toEqual({
      block: { start: 0, end: 0 },
      inline: { start: 14, end: 14 },
    });
  });

  it("padding-block 만", () => {
    expect(parsePadding("padding-block 8px")).toEqual({
      block: { start: 8, end: 8 },
      inline: { start: 0, end: 0 },
    });
  });
});

describe("parsePadding — 경계", () => {
  it("0 값 5-value 시 throw", () => {
    expect(() => parsePadding("8px 16px 12px 24px 4px")).toThrow();
  });

  it("px 단위 누락 시 throw", () => {
    expect(() => parsePadding("40")).toThrow(/잘못된 px 값/);
  });

  it("빈 문자열 시 throw", () => {
    expect(() => parsePadding("")).toThrow();
  });
});

describe("serializePadding — shorthand 자동 단축", () => {
  it("모두 동일 → 1-value", () => {
    expect(
      serializePadding({
        block: { start: 40, end: 40 },
        inline: { start: 40, end: 40 },
      }),
    ).toBe("40px");
  });

  it("block 동일 + inline 동일 → 2-value", () => {
    expect(
      serializePadding({
        block: { start: 20, end: 20 },
        inline: { start: 16, end: 16 },
      }),
    ).toBe("20px 16px");
  });

  it("inline 만 동일 → 3-value", () => {
    expect(
      serializePadding({
        block: { start: 8, end: 12 },
        inline: { start: 16, end: 16 },
      }),
    ).toBe("8px 16px 12px");
  });

  it("모두 다름 → 4-value", () => {
    expect(
      serializePadding({
        block: { start: 8, end: 12 },
        inline: { start: 24, end: 16 },
      }),
    ).toBe("8px 16px 12px 24px");
  });
});

describe("serializePadding — logical / physical 형식", () => {
  const v = {
    block: { start: 8, end: 12 },
    inline: { start: 24, end: 16 },
  };

  it("logical 은 padding-block / padding-inline 분리", () => {
    expect(serializePadding(v, "logical")).toBe(
      "padding-block: 8px 12px; padding-inline: 24px 16px;",
    );
  });

  it("physical 은 4-value padding shorthand", () => {
    expect(serializePadding(v, "physical")).toBe("padding: 8px 16px 12px 24px;");
  });
});

describe("padding — round-trip", () => {
  it("4-value round-trip 동일성", () => {
    const original = "8px 16px 12px 24px";
    expect(serializePadding(parsePadding(original))).toBe(original);
  });

  it("padding-inline 14px → 3-value (block 0 / inline 14 / block 0)", () => {
    // inline-only 케이스는 round-trip 시 명시적 0 표기되므로 입력과 다름
    const v = parsePadding("padding-inline 14px");
    // block 0, inline 14 만 명시 → 4-value 도 아니고 표현 형식이 다름. expected:
    expect(serializePadding(v)).toBe("0px 14px");
  });
});
