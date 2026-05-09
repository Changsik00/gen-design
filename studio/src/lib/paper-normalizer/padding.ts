/**
 * C2 — padding: parse/serialize.
 *
 * 입력 형식:
 * - shorthand 1-value: "40px"
 * - shorthand 2-value: "20px 16px" (block | inline)
 * - shorthand 3-value: "8px 16px 12px" (top | inline | bottom)
 * - shorthand 4-value: "8px 16px 12px 24px" (top | right | bottom | left)
 * - inline-only: "padding-inline 14px"
 * - block-only:  "padding-block 8px"
 *
 * 출력 형식: 'shorthand' (default), 'logical', 'physical'.
 *
 * 룰 명세: docs/paper-normalizer-rules.md §C2
 */

import type { Padding } from "./types";

const PX_RE = /^(-?\d+(?:\.\d+)?)px$/;
const PADDING_INLINE_RE = /^padding-inline\s+(.+)$/;
const PADDING_BLOCK_RE = /^padding-block\s+(.+)$/;

function parsePxValue(s: string): number {
  const m = s.trim().match(PX_RE);
  if (!m) throw new Error(`parsePadding: 잘못된 px 값 — "${s}"`);
  return Number(m[1]);
}

export function parsePadding(input: string): Padding {
  const s = input.trim();

  const inlineOnly = s.match(PADDING_INLINE_RE);
  if (inlineOnly) {
    const v = parsePxValue(inlineOnly[1]);
    return { block: { start: 0, end: 0 }, inline: { start: v, end: v } };
  }

  const blockOnly = s.match(PADDING_BLOCK_RE);
  if (blockOnly) {
    const v = parsePxValue(blockOnly[1]);
    return { block: { start: v, end: v }, inline: { start: 0, end: 0 } };
  }

  const parts = s.split(/\s+/).map(parsePxValue);

  switch (parts.length) {
    case 1:
      return {
        block: { start: parts[0], end: parts[0] },
        inline: { start: parts[0], end: parts[0] },
      };
    case 2:
      return {
        block: { start: parts[0], end: parts[0] },
        inline: { start: parts[1], end: parts[1] },
      };
    case 3:
      return {
        block: { start: parts[0], end: parts[2] },
        inline: { start: parts[1], end: parts[1] },
      };
    case 4:
      return {
        // CSS shorthand: top, right, bottom, left → block.start=top, inline.end=right, block.end=bottom, inline.start=left
        block: { start: parts[0], end: parts[2] },
        inline: { start: parts[3], end: parts[1] },
      };
    default:
      throw new Error(`parsePadding: 1~4 값만 허용 — "${input}"`);
  }
}

export type PaddingFormat = "shorthand" | "logical" | "physical";

function px(n: number): string {
  return `${n}px`;
}

export function serializePadding(v: Padding, format: PaddingFormat = "shorthand"): string {
  const { block, inline } = v;

  switch (format) {
    case "shorthand": {
      // 4 모두 같음 → 1-value
      if (
        block.start === block.end &&
        inline.start === inline.end &&
        block.start === inline.start
      ) {
        return px(block.start);
      }
      // block 좌우 같고 inline 좌우 같음 → 2-value (block inline)
      if (block.start === block.end && inline.start === inline.end) {
        return `${px(block.start)} ${px(inline.start)}`;
      }
      // inline 좌우 같음 → 3-value (top inline bottom)
      if (inline.start === inline.end) {
        return `${px(block.start)} ${px(inline.start)} ${px(block.end)}`;
      }
      // 4-value (top right bottom left)
      return `${px(block.start)} ${px(inline.end)} ${px(block.end)} ${px(inline.start)}`;
    }
    case "logical":
      return `padding-block: ${px(block.start)} ${px(block.end)}; padding-inline: ${px(inline.start)} ${px(inline.end)};`;
    case "physical":
      return `padding: ${px(block.start)} ${px(inline.end)} ${px(block.end)} ${px(inline.start)};`;
  }
}
