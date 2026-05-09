import type { BlueprintSession, PageSelection } from "./types";

function formatSections(sections: string[]): string {
  return sections.map((s) => `- ${s}`).join("\n");
}

function pageBlock(page: PageSelection): string {
  const status = page.templateMapping.status === "implemented"
    ? `✅ ${page.templateMapping.template}`
    : "⬜";
  const optional = page.optionalSections.length > 0
    ? `\n**선택 섹션**:\n${formatSections(page.optionalSections)}`
    : "";

  return `### ${page.id} — ${page.name}

| 항목 | 값 |
|---|---|
| variant | ${page.variant} |
| route | ${page.route} |
| layout | ${page.layout} |
| Template | ${status} |

**필수 섹션**:
${formatSections(page.requiredSections)}${optional}`;
}

function templateMappingTable(pages: PageSelection[]): string {
  const rows = pages.map((p) => {
    const tmpl = p.templateMapping.status === "implemented"
      ? `✅ ${p.templateMapping.template}`
      : "⬜";
    return `| ${p.id} | ${tmpl} | ${p.variant} |`;
  });
  return `## Template 매핑 표

| 페이지 | Template | variant |
|---|---|---|
${rows.join("\n")}`;
}

export function generateRequirements(session: BlueprintSession): string {
  const { appName, appType, nfr, selectedPages } = session;
  const today = new Date().toISOString().slice(0, 10);

  const pageBlocks = selectedPages.map(pageBlock).join("\n\n---\n\n");

  return `# ${appName} Requirements

## 메타

| 항목 | 값 |
|---|---|
| 앱 유형 | ${appType} |
| 생성일 | ${today} |
| 총 페이지 수 | ${selectedPages.length} |

## 비기능 요구사항 (NFR)

| 카테고리 | 항목 | 값 |
|---|---|---|
| 인증 | 방식 | ${nfr.auth.method} |
| 인증 | 소셜 제공자 | ${nfr.auth.socialProviders.join(", ") || "(없음)"} |
| 인증 | 세션 전략 | ${nfr.auth.sessionStrategy} |
| 다국어 | 기본 언어 | ${nfr.i18n.defaultLocale} |
| 다국어 | 지원 언어 | ${nfr.i18n.supportedLocales.join(", ")} |
| 테마 | 기본 테마 | ${nfr.theme.defaultTheme} |
| 성능 | Lighthouse 목표 | ${nfr.performance.targetLighthouseScore} |
| 보안 | CSP | ${nfr.security.csp} |
| 보안 | 인증 저장소 | ${nfr.security.authStorageMethod} |
| 호환성 | 대상 브라우저 | ${nfr.compatibility.targetBrowsers} |
| 접근성 | 등급 | ${nfr.compatibility.a11yLevel} |

## Page Specifications

${pageBlocks}

---

${templateMappingTable(selectedPages)}

## 다음 단계

- [ ] DESIGN.md 작성 (시각 디자인 명세)
- [ ] AGENT.md 작성 (AI 에이전트 지침)
- [ ] 미구현 Template 우선순위 결정
`;
}
