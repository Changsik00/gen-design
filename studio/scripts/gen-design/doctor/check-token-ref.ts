/**
 * checkTokenRef — DESIGN/chat 의 토큰 참조 ↔ tokens.json 정의 검증.
 *
 * - DESIGN.md 의 `{token.name}` 참조 추출 (코드 블록 제외)
 * - chat.md 의 Tailwind 토큰 클래스 추출 (bg-primary / text-X / border-X 등)
 * - tokens.json 정의 집합과 교차 검증
 * - 미정의 시 진단 + Levenshtein "Did you mean?"
 */

import type { DoctorDiag } from "./types";
import { diag, tokenRefMsg } from "./messages";
import { findSimilar } from "./levenshtein";

// DESIGN.md 의 `{token-name}` placeholder — 중괄호 안에 알파넘 + 하이픈 + 점만 허용
const DESIGN_TOKEN_RE = /\{([a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)?)\}/gi;

// 코드 블록 (` ``` ` 또는 ` ` `) 제거 후 검사
function stripCodeBlocks(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "");
}

// HTML 주석 제거 (spec-11-05 fix #3) — false positive 회피
function stripHtmlComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

export function extractDesignMdTokenRefs(text: string): string[] {
  const stripped = stripHtmlComments(stripCodeBlocks(text));
  const set = new Set<string>();
  for (const m of stripped.matchAll(DESIGN_TOKEN_RE)) {
    // `{primary}` → primary, `{color.primary}` → color.primary
    // 최종 segment 만 사용 (토큰 평탄화 이름과 매칭)
    const ref = m[1] ?? "";
    if (!ref) continue;
    const last = ref.split(".").pop()!;
    set.add(last);
  }
  return Array.from(set);
}

// Tailwind 토큰 prefix — 이들이 따르는 단어가 토큰 이름
const TAILWIND_TOKEN_PREFIXES = [
  "bg",
  "text",
  "border",
  "fill",
  "stroke",
  "ring",
  "outline",
  "from",
  "to",
  "via",
  "decoration",
  "divide",
  "placeholder",
  "accent",
  "caret",
];

const PREFIX_PATTERN = TAILWIND_TOKEN_PREFIXES.join("|");
// `focus-visible:ring-ring` 같이 하이픈 포함 variant prefix 도 매치
const CLASS_PATTERN = new RegExp(
  `(?:^|[\\s"'\`(])(?:[a-z][a-z0-9-]*:)*(${PREFIX_PATTERN})-([a-z][a-z0-9-]*)`,
  "gi",
);

// shadcn 표준 토큰 이름만 추출 — 나머지 (red-500 같은 Tailwind 기본 색) 는 통과
const SHADCN_TOKEN_PATTERN = /^([a-z]+(?:-[a-z]+)*)$/;

export function extractChatMdTokenClasses(text: string): string[] {
  // HTML 주석 + 코드 블록 제거 (spec-11-05 fix #3)
  const stripped = stripHtmlComments(stripCodeBlocks(text));
  const set = new Set<string>();
  for (const m of stripped.matchAll(CLASS_PATTERN)) {
    const tokenName = m[2] ?? "";
    if (!tokenName) continue;
    if (!SHADCN_TOKEN_PATTERN.test(tokenName)) continue;
    // Tailwind 기본 색 (red-500 / blue-700 등) 제외 — 숫자 segment 포함
    if (/-\d+$/.test(tokenName)) continue;
    set.add(tokenName);
  }
  return Array.from(set);
}

export function checkTokenRef(
  designMdContent: string,
  designMdPath: string,
  chatFiles: Array<{ path: string; content: string }>,
  defined: Set<string>,
): DoctorDiag[] {
  const diags: DoctorDiag[] = [];

  // DESIGN.md 의 토큰 참조 검증
  const designRefs = extractDesignMdTokenRefs(designMdContent);
  for (const ref of designRefs) {
    if (!defined.has(ref)) {
      const similar = findSimilar(ref, defined, { maxDist: 3, topN: 1 });
      diags.push(
        diag("token-ref", "error", designMdPath, tokenRefMsg.undefined(ref, "DESIGN.md"), {
          hint: tokenRefMsg.hintDefineOrFix(similar[0]),
        }),
      );
    }
  }

  // chat.md 들의 Tailwind 토큰 클래스 검증
  for (const { path, content } of chatFiles) {
    const refs = extractChatMdTokenClasses(content);
    for (const ref of refs) {
      if (!defined.has(ref)) {
        const similar = findSimilar(ref, defined, { maxDist: 3, topN: 1 });
        diags.push(
          diag("token-ref", "error", path, tokenRefMsg.undefined(ref, "chat.md"), {
            hint: tokenRefMsg.hintDefineOrFix(similar[0]),
          }),
        );
      }
    }
  }

  return diags;
}
