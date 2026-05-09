/**
 * C4 — font fallback: parse/serialize.
 *
 * 입력 형식: CSS font-family 표기. 쉼표 구분. quote (single/double) 자유.
 * - "'Inter', system-ui, sans-serif"
 * - "Inter, system-ui, sans-serif"
 * - 'Inter, system-ui'        (generic 누락 — null)
 *
 * 출력 형식: primary 는 공백 포함 시 single quote 강제, fallbacks 는 unquoted
 * (단어 1개) / quoted (공백 포함). generic 누락 시 'sans-serif' 기본 보강.
 *
 * 룰 명세: docs/paper-normalizer-rules.md §C4
 */

import type { FontFallback } from "./types";

const GENERIC_SET = new Set(["sans-serif", "serif", "monospace"]);

function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  return t;
}

export function parseFontFallback(input: string): FontFallback {
  const s = input.trim();
  if (!s) throw new Error("parseFontFallback: 빈 입력");

  const parts = s.split(",").map(stripQuotes).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) throw new Error(`parseFontFallback: 가족명 없음 — "${input}"`);

  const last = parts[parts.length - 1];
  let generic: FontFallback["generic"] = null;
  let body = parts;

  if (GENERIC_SET.has(last)) {
    generic = last as FontFallback["generic"];
    body = parts.slice(0, -1);
  }

  if (body.length === 0) {
    throw new Error(`parseFontFallback: primary family 없이 generic 만 — "${input}"`);
  }

  const [primary, ...fallbacks] = body;
  return { primary, fallbacks, generic };
}

function quoteFamily(name: string): string {
  // 공백 포함 또는 영문/숫자/하이픈 외 문자 포함 시 single quote
  return /^[A-Za-z0-9-]+$/.test(name) ? name : `'${name}'`;
}

export function serializeFontFallback(v: FontFallback): string {
  const generic = v.generic ?? "sans-serif"; // 누락 시 보강
  const families = [v.primary, ...v.fallbacks].map(quoteFamily);
  return [...families, generic].join(", ");
}
