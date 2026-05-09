/**
 * C3 — line-height: parse/serialize.
 *
 * 입력 단위:
 * - px: "24px" / "16.5px"
 * - unitless: "1.5" / "1"
 * - percent: "150%"
 *
 * serialize 는 입력 unit 보존. 변환 utility 별도 (toPx / toUnitless).
 *
 * 룰 명세: docs/paper-normalizer-rules.md §C3
 */

import type { LineHeight } from "./types";

const PX_RE = /^(-?\d+(?:\.\d+)?)px$/;
const UNITLESS_RE = /^(-?\d+(?:\.\d+)?)$/;
const PERCENT_RE = /^(-?\d+(?:\.\d+)?)%$/;

export function parseLineHeight(input: string): LineHeight {
  const s = input.trim();

  const px = s.match(PX_RE);
  if (px) return { value: Number(px[1]), unit: "px" };

  const percent = s.match(PERCENT_RE);
  if (percent) return { value: Number(percent[1]), unit: "percent" };

  const unitless = s.match(UNITLESS_RE);
  if (unitless) return { value: Number(unitless[1]), unit: "unitless" };

  throw new Error(`parseLineHeight: 알 수 없는 line-height 표기 — "${input}"`);
}

export function serializeLineHeight(v: LineHeight): string {
  switch (v.unit) {
    case "px":
      return `${v.value}px`;
    case "unitless":
      return `${v.value}`;
    case "percent":
      return `${v.value}%`;
  }
}

/** unit 무관 → px 절대값 변환. fontSize 는 px number. */
export function toPx(v: LineHeight, fontSize: number): number {
  switch (v.unit) {
    case "px":
      return v.value;
    case "unitless":
      return v.value * fontSize;
    case "percent":
      return (v.value / 100) * fontSize;
  }
}

/** unit 무관 → unitless 비율 변환. fontSize 는 px number. */
export function toUnitless(v: LineHeight, fontSize: number): number {
  switch (v.unit) {
    case "px":
      return v.value / fontSize;
    case "unitless":
      return v.value;
    case "percent":
      return v.value / 100;
  }
}
