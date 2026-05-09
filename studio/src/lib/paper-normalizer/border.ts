/**
 * C5 — border: parse/serialize.
 *
 * 입력 형식:
 * - shorthand: "1px solid #E2E8F0"
 * - style 생략: "1px #E2E8F0" (style → null, serialize 시 'solid' 기본)
 *
 * 출력 형식: shorthand 강제 (`width style color` 순서). style null 시 'solid'.
 *
 * 룰 명세: docs/paper-normalizer-rules.md §C5
 */

import { parseHexAlpha, serializeHexAlpha } from "./hex-alpha";
import type { Border } from "./types";

const STYLE_SET = new Set(["solid", "dashed", "dotted"] as const);
const PX_RE = /^(-?\d+(?:\.\d+)?)px$/;

export function parseBorder(input: string): Border {
  const s = input.trim();
  const tokens = s.split(/\s+/);

  if (tokens.length < 2) {
    throw new Error(`parseBorder: width 와 color 가 모두 필요 — "${input}"`);
  }

  // 첫 토큰: width (px)
  const widthMatch = tokens[0].match(PX_RE);
  if (!widthMatch) {
    throw new Error(`parseBorder: 첫 토큰은 px width 여야 함 — "${input}"`);
  }
  const width = Number(widthMatch[1]);

  // 두 번째가 style 인 경우 vs color 인 경우
  let style: Border["style"] = null;
  let colorTokens: string[];

  if (STYLE_SET.has(tokens[1] as Border["style"] & string)) {
    style = tokens[1] as Border["style"];
    colorTokens = tokens.slice(2);
  } else {
    colorTokens = tokens.slice(1);
  }

  if (colorTokens.length === 0) {
    throw new Error(`parseBorder: color 토큰 없음 — "${input}"`);
  }

  const color = parseHexAlpha(colorTokens.join(" "));
  return { width, style, color };
}

export function serializeBorder(v: Border): string {
  const style = v.style ?? "solid"; // 누락 시 'solid' 기본
  return `${v.width}px ${style} ${serializeHexAlpha(v.color, "hex")}`;
}
