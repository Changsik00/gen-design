import type { PaperStylePayload, ResolvedTokens } from "./types";

const CSS_VAR_PREFIX_RE = /^--/;

/**
 * 해소된 CSS 변수 레코드를 Paper `update_styles` 페이로드 배열로 변환한다.
 *
 * 한 토큰 = 한 페이로드. nodePattern 은 `--` 접두 제거 후의 키 이름.
 * styles.fill 에 값 할당 (현 PoC 단계는 fill 만 대상).
 */
export function tokensToPaperPayloads(
  resolved: ResolvedTokens,
): PaperStylePayload[] {
  return Object.entries(resolved).map(([cssVar, value]) => ({
    nodePattern: cssVar.replace(CSS_VAR_PREFIX_RE, ""),
    styles: { fill: value },
  }));
}
