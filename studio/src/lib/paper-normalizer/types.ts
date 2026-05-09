/**
 * Paper-normalizer typed object 정의 — 5 카테고리.
 * 각 카테고리는 parse/serialize 페어 함수에서 입출력 객체로 사용된다.
 *
 * 룰 명세는 docs/paper-normalizer-rules.md 참조.
 */

/** C1 — color (hex / hex-alpha / rgba / oklch). r/g/b 는 0~255, a 는 0~1. */
export interface HexAlpha {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * C2 — padding. block / inline 각각 start / end (px number).
 * shorthand `40px` → block.start=block.end=inline.start=inline.end=40.
 * shorthand `padding-inline 14px` → inline.start=inline.end=14, block.*=0.
 */
export interface Padding {
  block: { start: number; end: number };
  inline: { start: number; end: number };
}

/**
 * C3 — line-height. discriminated union of unit (px / unitless / percent).
 * 변환은 toPx(v, fontSize) / toUnitless(v, fontSize) utility 사용.
 */
export type LineHeight =
  | { value: number; unit: "px" }
  | { value: number; unit: "unitless" }
  | { value: number; unit: "percent" };

/**
 * C4 — font fallback. quote 정규화 + fallback 분리 + generic family 추출.
 * primary 와 fallbacks 는 quote 제거된 family 이름. generic 은 누락 시 null
 * (serialize 단계에서 'sans-serif' 기본 보강).
 */
export interface FontFallback {
  primary: string;
  fallbacks: string[];
  generic: "sans-serif" | "serif" | "monospace" | null;
}

/**
 * C5 — border. shorthand 의 width / style / color 분해.
 * style 누락 시 null (serialize 시 'solid' 기본 보강). color 는 HexAlpha.
 */
export interface Border {
  width: number;
  style: "solid" | "dashed" | "dotted" | null;
  color: HexAlpha;
}
