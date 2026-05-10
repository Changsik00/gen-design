/**
 * per-node 신뢰도 점수 [0, 1].
 *
 * 점수표:
 *   1.0 — exact match + style align
 *   0.85 — exact match (스타일 미정렬)
 *   0.7  — fuzzy distance ≤ 1
 *   0.5  — fuzzy distance ≤ 2
 *   0.3  — partial (예: 이름 fragment 일치)
 *   0.0  — 미매칭
 */

import type { MatchResult } from "./component-matcher";

export interface StyleAlignResult {
  aligned: boolean;
}

export interface ScoreInput {
  match: MatchResult;
  /** 스타일 정렬 여부 (외부에서 판단 후 주입) */
  styleAlign?: StyleAlignResult;
}

export function score(input: ScoreInput): number {
  const { match, styleAlign } = input;

  if (!match.matched) return 0.0;

  if (match.exact) {
    return styleAlign?.aligned ? 1.0 : 0.85;
  }

  if (match.distance !== null) {
    if (match.distance <= 1) return 0.7;
    if (match.distance <= 2) return 0.5;
  }

  return 0.3;
}
