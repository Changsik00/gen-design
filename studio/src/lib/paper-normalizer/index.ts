/**
 * paper-normalizer — Paper ↔ DESIGN.md ↔ React/CSS 표기 정규화 라이브러리.
 *
 * 5 카테고리 × parse/serialize 페어:
 * - C1 hex-alpha (color)
 * - C2 padding   (TODO)
 * - C3 line-height (TODO)
 * - C4 font-fallback (TODO)
 * - C5 border (TODO)
 *
 * 룰 명세: docs/paper-normalizer-rules.md
 */

export * from "./types";
export * from "./hex-alpha";
export * from "./padding";
export * from "./line-height";
export * from "./font-fallback";
