/**
 * C1 — color: parse/serialize HexAlpha.
 * 입력 형식: 6-hex (#RRGGBB), 8-hex (#RRGGBBAA), rgb(r,g,b), rgba(r,g,b,a), oklch(...).
 * 출력 형식 옵션: 'hex' | 'hex-alpha' | 'rgba'.
 *
 * 룰 명세: docs/paper-normalizer-rules.md §C1
 */

import { converter, parse as culoriParse } from "culori";
import type { HexAlpha } from "./types";

const HEX6_RE = /^#([0-9a-fA-F]{6})$/;
const HEX8_RE = /^#([0-9a-fA-F]{8})$/;
const RGB_RE = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const RGBA_RE = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/;

const toRgb = converter("rgb");

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function parseHexAlpha(input: string): HexAlpha {
  const s = input.trim();

  const hex6 = s.match(HEX6_RE);
  if (hex6) {
    const v = hex6[1];
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
      a: 1,
    };
  }

  const hex8 = s.match(HEX8_RE);
  if (hex8) {
    const v = hex8[1];
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
      a: parseInt(v.slice(6, 8), 16) / 255,
    };
  }

  const rgb = s.match(RGB_RE);
  if (rgb) {
    return {
      r: clamp255(Number(rgb[1])),
      g: clamp255(Number(rgb[2])),
      b: clamp255(Number(rgb[3])),
      a: 1,
    };
  }

  const rgba = s.match(RGBA_RE);
  if (rgba) {
    return {
      r: clamp255(Number(rgba[1])),
      g: clamp255(Number(rgba[2])),
      b: clamp255(Number(rgba[3])),
      a: clamp01(Number(rgba[4])),
    };
  }

  // fallback: culori 로 oklch / lab / lch / 기타 CSS 색 형식 처리
  const parsed = culoriParse(s);
  if (parsed) {
    const rgbColor = toRgb(parsed);
    if (rgbColor) {
      return {
        r: clamp255(rgbColor.r * 255),
        g: clamp255(rgbColor.g * 255),
        b: clamp255(rgbColor.b * 255),
        a: clamp01(rgbColor.alpha ?? 1),
      };
    }
  }

  throw new Error(`parseHexAlpha: 알 수 없는 색 표기 — "${input}"`);
}

function toHex2(n: number): string {
  return clamp255(n).toString(16).padStart(2, "0").toUpperCase();
}

export type HexAlphaFormat = "hex" | "hex-alpha" | "rgba";

export function serializeHexAlpha(
  v: HexAlpha,
  format: HexAlphaFormat = "hex-alpha",
): string {
  switch (format) {
    case "hex":
      return `#${toHex2(v.r)}${toHex2(v.g)}${toHex2(v.b)}`;
    case "hex-alpha":
      return `#${toHex2(v.r)}${toHex2(v.g)}${toHex2(v.b)}${toHex2(v.a * 255)}`;
    case "rgba": {
      const a = Math.round(clamp01(v.a) * 1000) / 1000;
      return `rgba(${clamp255(v.r)}, ${clamp255(v.g)}, ${clamp255(v.b)}, ${a})`;
    }
  }
}
