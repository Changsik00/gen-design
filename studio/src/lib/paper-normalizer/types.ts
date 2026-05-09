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
