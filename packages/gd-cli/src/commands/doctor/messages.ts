/**
 * doctor 진단 메시지 템플릿 — 모두 한국어 + 해결 방법 한 줄.
 *
 * 형식 표준:
 *   message: "<무엇이 잘못됐는가, 한 줄>"
 *   hint:    "→ <어떻게 고치는가, 구체 명령 또는 대안>"
 */

import type { DoctorCategory, DoctorDiag, DiagSeverity } from "./types";

export function diag(
  category: DoctorCategory,
  severity: DiagSeverity,
  file: string,
  message: string,
  opts: { line?: number; hint?: string } = {},
): DoctorDiag {
  return {
    category,
    severity,
    file,
    line: opts.line ?? 0,
    message,
    hint: opts.hint,
  };
}

// ---------------------------------------------------------------------------
// token-format
// ---------------------------------------------------------------------------

export const tokenFormatMsg = {
  missingValue: (token: string): string =>
    `DTCG 토큰 ${token} 에 \`$value\` 필드가 없습니다.`,
  missingType: (token: string): string =>
    `DTCG 토큰 ${token} 에 \`$type\` 필드가 없습니다.`,
  invalidStructure: (): string =>
    `tokens.json 의 최상위가 객체가 아닙니다 (DTCG 형식 위반).`,
  missingShadcnToken: (name: string): string =>
    `shadcn 표준 토큰 --${name} 이 tokens.json 에 정의되어 있지 않습니다.`,
  lightDarkMismatch: (token: string, missing: "light" | "dark"): string =>
    `토큰 ${token} 에 ${missing} 모드 값이 없습니다 (light/dark 둘 다 필요).`,

  hintAddValue: "→ `$value`: \"oklch(...)\" 형식으로 값을 추가하세요.",
  hintAddType: "→ `$type`: \"color\" / \"dimension\" / \"fontFamily\" 중 하나로 추가하세요.",
  hintShadcnLock: "→ shadcn 표준 토큰 이름은 잠금입니다. 값만 조정하세요.",
  hintSyncMode: "→ light + dark 두 모드 값을 함께 정의하세요.",
} as const;

// ---------------------------------------------------------------------------
// token-ref
// ---------------------------------------------------------------------------

export const tokenRefMsg = {
  undefined: (token: string, foundIn: string): string =>
    `토큰 \`${token}\` 이 ${foundIn} 에서 사용됐지만 tokens.json 에 정의되어 있지 않습니다.`,

  hintDefineOrFix: (similar?: string): string =>
    similar
      ? `→ ${similar} 을 쓰시려는 건가요? 또는 tokens.json 에 정의하세요.`
      : "→ tokens.json 에 정의하거나 표준 토큰 이름으로 교체하세요.",
} as const;

// ---------------------------------------------------------------------------
// contrast
// ---------------------------------------------------------------------------

export const contrastMsg = {
  belowAA: (pair: string, ratio: number, mode: string): string =>
    `${mode} 모드 ${pair} 대비비 ${ratio.toFixed(2)}:1 — WCAG 2.1 AA 미달 (필요 4.5:1).`,

  suggest: (token: string, newValue: string, newRatio: number): string =>
    `→ ${token} 을 ${newValue} 로 조정하면 ${newRatio.toFixed(2)}:1 — AA PASS.`,

  cannotMeet: (token: string): string =>
    `→ ${token} 의 L 만 조정으로는 AA 달성 불가. 다른 색조 (hue) 검토 필요.`,
} as const;

// ---------------------------------------------------------------------------
// scene-drift / orphan-scene
// ---------------------------------------------------------------------------

export const driftMsg = {
  staleTsx: (chatPath: string, tsxPath: string): string =>
    `${chatPath} 가 ${tsxPath} 보다 최근 수정 — TSX 재컴파일 필요.`,

  hintRecompile: (chatPath: string): string =>
    `→ \`pnpm gd react ${chatPath}\` 재실행하세요.`,

  orphan: (tsxPath: string, expectedChatPath: string): string =>
    `${tsxPath} 의 \`// @gd:\` annotation 이 가리키는 ${expectedChatPath} 가 존재하지 않습니다 (orphan TSX).`,

  hintDeleteOrRestore: (chatPath: string): string =>
    `→ ${chatPath} 를 복구하거나, TSX 파일을 삭제하세요.`,

  unmanagedTsx: (tsxPath: string): string =>
    `${tsxPath} 에 \`// @gd:\` annotation 이 없습니다 — gd react 컴파일 결과가 아닐 수 있습니다.`,

  hintMoveOrAnnotate: "→ chat.md 에서 컴파일된 신이라면 `pnpm gd react <chat>` 재실행. 수동 신이라면 src/scenes/ 외부로 옮기세요.",
} as const;

// ---------------------------------------------------------------------------
// vocab-similar
// ---------------------------------------------------------------------------

export const vocabMsg = {
  unknownComponent: (name: string, file: string): string =>
    `${file} 에서 사용된 \`<${name}>\` 이 카탈로그에 없습니다.`,

  didYouMean: (name: string, candidates: string[]): string => {
    const list = candidates.map((c) => `\`<${c}>\``).join(", ");
    return `→ ${list} 을 쓰시려는 건가요?`;
  },

  noSuggestion: "→ FRONT.md 카탈로그를 확인하거나 Tier 3 composite 으로 승격을 검토하세요.",
} as const;

// ---------------------------------------------------------------------------
// CLI 출력 — 한국어 친화 포맷
// ---------------------------------------------------------------------------

export function formatDiag(d: DoctorDiag): string {
  const icon = d.severity === "error" ? "✗" : d.severity === "warn" ? "⚠" : "ℹ";
  const loc = d.line > 0 ? `${d.file}:${d.line}` : d.file;
  const head = `${icon} [${d.category}] ${loc}`;
  const lines = [head, `  ${d.message}`];
  if (d.hint) lines.push(`  ${d.hint}`);
  return lines.join("\n");
}

export function formatSummary(errorCount: number, warnCount: number, durationMs: number): string {
  if (errorCount === 0 && warnCount === 0) {
    return `✓ 모든 검증 통과 (${durationMs}ms)`;
  }
  const parts: string[] = [];
  if (errorCount > 0) parts.push(`✗ ${errorCount} errors`);
  if (warnCount > 0) parts.push(`⚠ ${warnCount} warnings`);
  return `${parts.join(", ")} (${durationMs}ms)`;
}
