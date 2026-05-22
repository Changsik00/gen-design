/**
 * checkVocabSimilar — chat.md 의 카탈로그 외 컴포넌트 어휘 검출 + Levenshtein "Did you mean?"
 *
 * - chat.md 의 <PascalCase /> 태그만 추출 (소문자 html 태그 제외, 코드 블록 무시)
 * - 카탈로그 (FRONT.md / catalog.json) 에 없는 어휘 → 진단
 * - Levenshtein 거리 ≤ 3 (또는 segment 매칭) 의 카탈로그 항목 제안
 * - 유사 후보 없으면 "FRONT.md 카탈로그 / Tier 3 승격 안내"
 *
 * 단, 본 검증은 `catalog-ref` 와 일부 중복 — 본 함수는 *"Did you mean?" 제안에 특화*.
 */

import type { DoctorDiag } from "./types";
import { diag, vocabMsg } from "./messages";
import { findSimilar } from "./levenshtein";

// PascalCase 컴포넌트 태그: <X> / <X /> / <XY>
// (X 는 대문자로 시작, 이후는 알파넘)
const TAG_RE = /<([A-Z][A-Za-z0-9]*)\b/g;

function stripCodeBlocks(text: string): string {
  return text.replace(/```[\s\S]*?```/g, "");
}

export function extractChatComponents(text: string): string[] {
  const stripped = stripCodeBlocks(text);
  const set = new Set<string>();
  for (const m of stripped.matchAll(TAG_RE)) {
    if (m[1]) set.add(m[1]);
  }
  return Array.from(set);
}

export function checkVocabSimilar(
  chatFiles: Array<{ path: string; content: string }>,
  catalog: Set<string>,
): DoctorDiag[] {
  const diags: DoctorDiag[] = [];

  for (const { path, content } of chatFiles) {
    const used = extractChatComponents(content);
    for (const name of used) {
      if (catalog.has(name)) continue;

      const similar = findSimilar(name, catalog, { maxDist: 3, topN: 3 });
      const hint =
        similar.length > 0 ? vocabMsg.didYouMean(name, similar) : vocabMsg.noSuggestion;

      diags.push(
        diag("vocab-similar", "error", path, vocabMsg.unknownComponent(name, path), {
          hint,
        }),
      );
    }
  }

  return diags;
}
