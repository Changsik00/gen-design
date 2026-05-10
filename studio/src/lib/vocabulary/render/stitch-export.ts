/**
 * Stitch DESIGN.md 0.1 subset export — 본 프로젝트 superset 에서 *Stitch 호환*
 * 부분만 추출. Stitch CLI 검증기 PASS 가능한 형태.
 *
 * Stitch 9 섹션 (§1~9) 만 보존. 본 프로젝트 확장 (§10~12) 제거.
 * Stitch CLI: `stitch lint design.md` 호환.
 *
 * ADR-004 D-1 (Stitch superset 결정) — 호환 export 함수.
 */

import { renderDesignMd, type RenderDesignMdOptions } from "./design-md";

/**
 * 본 프로젝트 DESIGN.md (superset) → Stitch DESIGN.md 0.1 (subset).
 *
 * 차이:
 * - frontmatter 의 `supersetOf` 제거
 * - §10~12 (extension 섹션) 제거
 * - AUTO-GENERATED 헤더는 유지 (Stitch 도 markdown 주석 허용)
 */
export function exportStitchSubset(options: RenderDesignMdOptions): string {
  const fullMd = renderDesignMd(options);

  // 1) §10 부터 끝까지 잘라내기
  const truncatedAtExtension = stripFromHeading(fullMd, /^## 10\. /m);

  // 2) frontmatter 의 supersetOf 라인 제거 (Stitch schema 에 없는 키)
  const stitchCompatible = truncatedAtExtension.replace(
    /^supersetOf: stitch-design-md\/0\.1\n/m,
    "",
  );

  // 3) frontmatter 의 schema 를 Stitch 표준으로
  return stitchCompatible.replace(
    /^schema: design-md\/0\.1\n/m,
    "schema: stitch-design-md/0.1\n",
  );
}

function stripFromHeading(md: string, headingPattern: RegExp): string {
  const idx = md.search(headingPattern);
  if (idx === -1) return md;
  return md.slice(0, idx).trimEnd() + "\n";
}
