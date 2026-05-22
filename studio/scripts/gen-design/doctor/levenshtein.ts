/**
 * Levenshtein 거리 — 두 문자열 사이의 최소 편집 거리.
 * "Did you mean?" 제안에 사용.
 *
 * 28 catalog × N 후보 정도 비교 — 단순 DP 충분.
 */

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const m = a.length;
  const n = b.length;
  // 한 줄 DP — O(min(m, n)) 공간
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        (prev[j] ?? 0) + 1, // delete
        (curr[j - 1] ?? 0) + 1, // insert
        (prev[j - 1] ?? 0) + cost, // replace
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n] ?? 0;
}

/**
 * 후보 목록에서 target 과 가장 가까운 항목 N 개 반환.
 *
 * 두 가지 점수:
 *  1. Levenshtein 거리
 *  2. *Segment prefix 매칭* — shadcn 토큰 ("foo-bar-baz") 의 약어 (예: "muted-fg" ↔ "muted-foreground")
 *     같은 길이의 segment 가 모두 prefix 면 score = 1 로 보정 (Levenshtein 결과 무시)
 *
 * → "muted-fg" 가 "muted-foreground" 의 후보로 잡힘.
 */
export function findSimilar(
  target: string,
  candidates: string[] | Set<string>,
  opts: { maxDist?: number; topN?: number } = {},
): string[] {
  const { maxDist = 3, topN = 3 } = opts;
  const list = candidates instanceof Set ? Array.from(candidates) : candidates;
  const tLower = target.toLowerCase();
  const tSegs = tLower.split("-");

  const scored: Array<{ name: string; score: number }> = [];
  for (const c of list) {
    const cLower = c.toLowerCase();
    if (cLower === tLower) continue;

    let score = levenshtein(tLower, cLower);

    // Segment-level 매칭 — shadcn 토큰 약어 인식
    // 같은 segment 수 + 첫 segment 일치 면 score = 2 로 보정
    // (예: "muted-fg" ↔ "muted-foreground" — Levenshtein 8 이지만 첫 segment "muted" 일치)
    const cSegs = cLower.split("-");
    if (tSegs.length === cSegs.length && tSegs[0] === cSegs[0]) {
      score = Math.min(score, 2);
    }

    if (score <= maxDist) scored.push({ name: c, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, topN).map((x) => x.name);
}
