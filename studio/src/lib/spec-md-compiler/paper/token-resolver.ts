/**
 * Token placeholder resolver.
 *
 * 두 책임:
 * 1. spec.md 의 `{{token.path}}` placeholder 를 CSS var 참조로 변환.
 *    경로의 마지막 segment 가 CSS var 이름이 된다.
 *      semantic.color.light.primary → var(--primary)
 *      semantic.brand-2             → var(--brand-2)
 *
 * 2. tokens.json 을 paper-sync 의 resolveSemanticColors + paper-e2e 의 SIMPLE_TOKENS 로
 *    `:root { --x: ...; }` CSS 블록으로 만든다 (페이지 wrapper 의 inline <style> 에 주입).
 */

import { ALL_TOKENS, cssVarsBlock as cssVarsBlockFromE2e } from "../../paper-e2e/render-helpers";

/** dotted token path → `var(--lastSegment)`. */
export function tokenPathToCssVar(path: string): string {
  const segments = path.split(".");
  const name = segments[segments.length - 1];
  return `var(--${name})`;
}

/** `:root { --x: ...; --y: ...; }` 블록 — 모든 light + simple token. */
export function rootCssVars(): string {
  return cssVarsBlockFromE2e(ALL_TOKENS);
}

/** L4 인라인 토큰 override 의 string 값 (e.g. "{{token.brand-2}}") 도 var 로 정규화. */
export function normalizeInlineTokenString(raw: string): string {
  const m = raw.match(/^\{\{token\.([A-Za-z0-9._-]+)\}\}$/);
  if (!m) return raw;
  return tokenPathToCssVar(m[1]);
}

export { ALL_TOKENS };
