/**
 * gd doctor — 12 카테고리 정합 검증 (ADR-013 후보).
 *
 * 기존 6 (lint.ts 흡수): frontmatter / grammar / catalog-ref / shell-inherit / naming / compile
 * 신규 6:
 *   - token-ref     : DESIGN/chat 의 토큰 참조 ↔ TOKEN 정의
 *   - token-format  : DTCG 1.0 strict + shadcn 24 토큰 잠금
 *   - contrast      : WCAG 2.1 AA 8 페어 × 2 mode = 16 측정
 *   - scene-drift   : `// @gd:` annotation + chat/tsx mtime 비교
 *   - orphan-scene  : chat 없는 TSX (annotation 의 대상 파일 부재)
 *   - vocab-similar : 카탈로그 외 어휘 — Levenshtein "Did you mean?"
 */

export type DoctorCategory =
  // 기존 (lint 흡수)
  | "frontmatter"
  | "grammar"
  | "catalog-ref"
  | "shell-inherit"
  | "naming"
  | "compile"
  // 신규
  | "token-ref"
  | "token-format"
  | "contrast"
  | "scene-drift"
  | "orphan-scene"
  | "vocab-similar";

export type DiagSeverity = "error" | "warn" | "info";

export interface DoctorDiag {
  /** 카테고리 — 어떤 검증에서 발견됐는지 */
  category: DoctorCategory;
  /** 대상 파일 (workspace 상대 경로) */
  file: string;
  /** 라인 번호 — 모르면 0 */
  line: number;
  /** 심각도 — error 는 exitCode 1 유발 */
  severity: DiagSeverity;
  /** 한국어 한 줄 메시지 */
  message: string;
  /** "→ ..." 해결 방법 한 줄 (선택) */
  hint?: string;
}

export interface DoctorArgs {
  /** chat.md 디렉토리 (기본: ./playground/chats) */
  chatRoot?: string;
  /** templates 디렉토리 (기본: ./templates) */
  templatesRoot?: string;
  /** src 디렉토리 (기본: ./src) — scene-drift 검증용 */
  srcRoot?: string;
  /** compile 검증 skip */
  noCompile?: boolean;
  /** JSON 출력 (기계 처리) */
  json?: boolean;
  /** 도움말 */
  help?: boolean;
}

export interface DoctorResult {
  /** 모든 진단 (error + warn + info) */
  diags: DoctorDiag[];
  /** error 개수 (exitCode 결정) */
  errorCount: number;
  /** warn 개수 */
  warnCount: number;
  /** 측정 시간 (ms) */
  durationMs: number;
}
