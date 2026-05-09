/**
 * paper-sync — tokens.json ↔ Paper 자동 동기화 PoC 라이브러리.
 *
 * 모듈 구성:
 * - types: TokenLeaf / ResolvedTokens / PaperStylePayload / TokensJson
 * - resolver: `{primitive.xxx}` 참조 해소
 * - converter: 해소된 토큰 → Paper update_styles 페이로드
 *
 * paper-normalizer (Paper ↔ DESIGN.md 값 정규화) 와 독립 라이브러리.
 */

export * from "./types";
export * from "./resolver";
export * from "./converter";
