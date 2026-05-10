/**
 * Paper layer name → catalog 컴포넌트 매칭.
 *
 * - exact: catalog 에 동일 이름 (대소문자 포함) 존재
 * - fuzzy: Levenshtein distance ≤ 2 인 후보 중 가장 가까운 것
 */

export interface MatchResult {
  matched: boolean;
  exact: boolean;
  /** 0 = exact, 1-2 = fuzzy, null = 미매칭 */
  distance: number | null;
  /** fuzzy 매칭 시 catalog 의 실제 이름 */
  suggestion: string | null;
}

const MAX_FUZZY_DISTANCE = 2;

export function matchByName(name: string, catalog: string[]): MatchResult {
  if (!name) {
    return { matched: false, exact: false, distance: null, suggestion: null };
  }

  if (catalog.includes(name)) {
    return { matched: true, exact: true, distance: 0, suggestion: null };
  }

  let bestDistance = Infinity;
  let bestMatch: string | null = null;

  for (const candidate of catalog) {
    const d = levenshtein(name, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      bestMatch = candidate;
    }
  }

  if (bestDistance <= MAX_FUZZY_DISTANCE) {
    return {
      matched: true,
      exact: false,
      distance: bestDistance,
      suggestion: bestMatch,
    };
  }

  return { matched: false, exact: false, distance: null, suggestion: null };
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  // prev[j] = dp[i-1][j], curr[j] = dp[i][j]
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  const curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    prev = curr.slice();
  }
  return prev[n];
}
