/**
 * paper-sync — tokens.json ↔ Paper 자동 동기화를 위한 타입.
 *
 * resolver: `{primitive.xxx}` 참조를 실제 값으로 재귀 해소
 * converter: 해소된 토큰을 Paper `update_styles` 페이로드로 변환
 *
 * paper-normalizer (Paper ↔ DESIGN.md 값 정규화) 와 독립 — 상호 import 없음.
 */

export interface TokenLeaf {
  $value: string;
  $type?: string;
}

/** 참조 해소 결과 — CSS 변수명 (--primary 등) → 실제 값. */
export type ResolvedTokens = Record<string, string>;

export interface PaperStylePayload {
  nodePattern: string;
  styles: Record<string, string>;
}

export interface TokensJson {
  primitive: Record<string, unknown>;
  semantic: {
    color: {
      light: Record<string, TokenLeaf>;
      dark: Record<string, TokenLeaf>;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
