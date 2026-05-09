/**
 * Fixture 회귀 테스트.
 *
 * 입력은 `poc/app-a/design-extract/` 5 페이지에서 관찰된 표기 중
 * 표준 CSS string 형태 (또는 표준화 가능한 형태) 만 다룬다.
 * `padding 20×22` 같은 prose 표기 (×separator) 는 본 라이브러리 Out of Scope
 * — 추출은 별도 spec (Studio import 단계).
 *
 * 각 케이스는 명시 expected 와 round-trip 등가성을 검증.
 */

import { describe, it, expect } from "vitest";
import {
  parseHexAlpha,
  serializeHexAlpha,
  parsePadding,
  serializePadding,
  parseBorder,
  serializeBorder,
  parseFontFallback,
  serializeFontFallback,
  parseLineHeight,
  serializeLineHeight,
} from "..";

describe("fixture: poc/app-a/design-extract/auth-login.md", () => {
  it("Indigo Primary #4F46E5 → 6-hex round-trip", () => {
    const v = parseHexAlpha("#4F46E5");
    expect(serializeHexAlpha(v, "hex")).toBe("#4F46E5");
  });

  it("Slate-900 #0F172A (modal backdrop)", () => {
    expect(parseHexAlpha("#0F172A")).toEqual({ r: 0x0f, g: 0x17, b: 0x2a, a: 1 });
  });

  it("Focus ring #4F46E52E (8-hex with alpha 2E ≈ 0.18)", () => {
    const v = parseHexAlpha("#4F46E52E");
    expect(v.a).toBeCloseTo(0x2e / 255, 4);
    // round-trip: 8-hex 는 정확 보존
    expect(serializeHexAlpha(v, "hex-alpha")).toBe("#4F46E52E");
  });

  it("modal padding '40px' → 1-value shorthand 보존", () => {
    expect(serializePadding(parsePadding("40px"))).toBe("40px");
  });
});

describe("fixture: poc/app-a/design-extract/auth-signup.md", () => {
  it("box-shadow rgba(15, 23, 42, 0.18) ↔ #0F172A2E 등가", () => {
    const fromRgba = parseHexAlpha("rgba(15, 23, 42, 0.18)");
    const fromHex = parseHexAlpha("#0F172A2E");
    expect(fromRgba.r).toBe(fromHex.r);
    expect(fromRgba.g).toBe(fromHex.g);
    expect(fromRgba.b).toBe(fromHex.b);
    expect(fromRgba.a).toBeCloseTo(fromHex.a, 1);
  });

  it("border 1px #E2E8F0 — style 생략 입력 → 'solid' 보강", () => {
    expect(serializeBorder(parseBorder("1px #E2E8F0"))).toBe("1px solid #E2E8F0");
  });
});

describe("fixture: poc/app-a/design-extract/dash-overview.md", () => {
  it("Sidebar width 240px (회고 C-05) — px parse 등가", () => {
    // 본 spec 은 width/height parse 함수 없음. 단순 px 정수 처리는 padding 의 1-value 와 등가
    // padding 240px 와 같이 다뤄지지는 않으나 px 정수 추출 패턴 가능 확인
    expect(parsePadding("240px")).toEqual({
      block: { start: 240, end: 240 },
      inline: { start: 240, end: 240 },
    });
  });

  it("Card border 1px #E2E8F0 + shadow #0F172A0A round-trip", () => {
    expect(serializeBorder(parseBorder("1px solid #E2E8F0"))).toBe("1px solid #E2E8F0");
    expect(serializeHexAlpha(parseHexAlpha("#0F172A0A"), "hex-alpha")).toBe("#0F172A0A");
  });
});

describe("fixture: poc/app-a/design-extract/profile-mypage.md", () => {
  it("ProfileAvatar shadow rgba(67, 56, 202, 0.18) → 8-hex alpha 정합", () => {
    const v = parseHexAlpha("rgba(67, 56, 202, 0.18)");
    const hex = serializeHexAlpha(v, "hex-alpha");
    // alpha 0.18 ≈ 0x2E (46/255)
    expect(hex.endsWith("2E")).toBe(true);
  });

  it("AvatarUpload border 1px solid #FEE2E2 (outline danger)", () => {
    const v = parseBorder("1px solid #FEE2E2");
    expect(v.color).toEqual({ r: 0xfe, g: 0xe2, b: 0xe2, a: 1 });
  });
});

describe("fixture: poc/app-a/design-extract/settings-overview.md", () => {
  it("Settings group border 1px solid #E2E8F0 round-trip", () => {
    const original = "1px solid #E2E8F0";
    expect(serializeBorder(parseBorder(original))).toBe(original);
  });

  it("Form padding-inline 14px → 명시 inline-only", () => {
    expect(parsePadding("padding-inline 14px")).toEqual({
      block: { start: 0, end: 0 },
      inline: { start: 14, end: 14 },
    });
  });
});

describe("fixture: 공통 — typography (fixture 외 표준 입력)", () => {
  it("font-family 'Inter', system-ui, sans-serif 표준 round-trip", () => {
    expect(
      serializeFontFallback(parseFontFallback("Inter, system-ui, sans-serif")),
    ).toBe("Inter, system-ui, sans-serif");
  });

  it("line-height 1.5 표준 round-trip", () => {
    expect(serializeLineHeight(parseLineHeight("1.5"))).toBe("1.5");
  });
});
