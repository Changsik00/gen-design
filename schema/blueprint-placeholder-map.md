# Blueprint Placeholder 기원 분류표

> `templates/DESIGN.md.template` (및 `REQUIREMENTS.md.template`, `AGENT.md.template`) 의 모든 placeholder 를 *기원* 별로 분류.
> 회고 F-02 정합화 — placeholder 가 어디에서 채워지는지 명확히 해서 다운스트림 자동화 (Studio Blueprint UI / agent prompt / Fill Executor) 가 입력 폼·추출·합성 정확히 구성 가능.

## 📋 기원 분류 (4 종)

| 기원 | 표기 | 채우는 시점 | 예시 |
|---|---|---|---|
| **B**lueprint 출력 | `B` | Blueprint Step 1 ~ 3 응답 | `{{meta.appName}}`, `{{theme.defaultTheme}}` |
| **D**esign 도구 추출 | `D` | Paper / Figma get_screenshot + 변환 | `{{colors.primary}}`, `{{typography.fontFamily.primary}}` |
| **I**18n 리소스 | `I` | `templates/assets/i18n/*.json` 추출 | `{{i18nKeys}}` 의 `{{key}}` / `{{defaultText}}` |
| **M**anual | `M` | 작성자 수동 입력 (디자이너 / agent prose) | `{{doRules}}`, `{{dontRules}}` |
| **R**untime | `R` | Fill Executor / 시스템 시각 | `{{date}}`, `{{techStack}}` |

> Studio Blueprint UI (`spec-6-05`) 는 본 표를 기준으로 입력 폼 자동 생성 — `B` 는 위저드 폼, `D` 는 디자인 도구 임포트 버튼, `I` 는 i18n 파일 업로드, `M` 은 textarea, `R` 은 비표시.

## 📋 placeholder 별 분류

### REQUIREMENTS.md.template

| Placeholder | 기원 | 입력 폼 후보 (spec-6-05) | 비고 |
|---|---|---|---|
| `{{meta.appName}}` | B | text input | Blueprint Step 1 |
| `{{meta.name}}` | B | text input (slug) | appName 자동 derive |
| `{{meta.appType}}` | B | radio (saas/ecommerce/...) | Blueprint Step 1 |
| `{{meta.pageCount}}` | R | (자동) | `finalPages.length` |
| `{{auth.method}}` | B | radio | Blueprint Step 1.5 NFR-auth |
| `{{auth.socialProviders}}` | B | checkbox group | 동일 |
| `{{auth.sessionStrategy}}` | B | radio | 동일 |
| `{{i18n.defaultLocale}}` | B | select | NFR-i18n |
| `{{i18n.supportedLocales}}` | B | multi-select | 동일 |
| `{{theme.defaultTheme}}` | B | radio | NFR-theme |
| `{{theme.supportedThemes}}` | B | checkbox group | 동일 |
| `{{performance.*}}` | B | number / select | NFR-perf (F-01 신설) |
| `{{security.*}}` | B | radio | NFR-sec (F-01 신설) |
| `{{compatibility.*}}` | B | text / radio | NFR-compat-a11y (F-01 신설) |
| `{{#each finalPages}}` (반복) | B | dynamic list | Blueprint Step 2~3 |
| `{{name}}` (페이지 내) | B | (auto from page-catalog) | 한글 표시명 |
| `{{category}}` | B | (auto, id prefix) | F-06 규칙 |
| `{{variant}}` | B | radio | Blueprint Step 3 |
| `{{route}}` | B | text + auto default | F-03 |
| `{{layout}}` | B | text + auto default | F-03 |
| `{{requiredSections}}` (each) | B | multi-select | Blueprint Step 3 |
| `{{optionalSections}}` (each) | B | multi-select | F-05 (`[]` / `'none'`) |
| `{{templateMapping.template}}` | B | (auto from id, F-06) | 또는 작성자 명시 |
| `{{templateMapping.status}}` | B | radio (`implemented` / `not-implemented`) | F-04 |
| `{{templateMapping.derivedFrom}}` (옵션) | B | text (Template 이름) | F-07 복제 시만 |
| `{{date}}` | R | (자동) | 시스템 시각 |

### DESIGN.md.template — 시각 디자인 (대부분 D)

| Placeholder (그룹) | 기원 | 입력 폼 후보 | 비고 |
|---|---|---|---|
| `{{visualTheme.description}}` | D | (Paper/Figma 추출 텍스트) | get_screenshot + 서술 |
| `{{#each visualTheme.keyCharacteristics}}` | D | list (extracted) | Mood / atmosphere |
| `{{designName}}` | D | text (designer 명시) | Paper 파일 이름 등 |
| `{{#each colors.primary}}` / `.neutral` / `.status` | D | color picker (group) | Paper variable / Figma styles |
| `{{#each quickColors}}` | D | color list | 추출된 highlight |
| `{{cssVar}}` / `{{tailwindClass}}` / `{{value}}` (token map) | D | code (auto from tokens.json) | tokens.json bridge |
| `{{#each typography.hierarchy}}` | D | typography editor | font/size/weight/lh/ls |
| `{{level}}` / `{{font}}` / `{{size}}` / `{{lineHeight}}` / `{{letterSpacing}}` / `{{weight}}` / `{{usage}}` | D | (typography row) | 동일 그룹 |
| `{{typography.fontFamily.primary}}` / `.monospace` | D | font picker | paper-normalizer C4 활용 |
| `{{layout.grid.columns}}` / `.maxWidth` | D | number input | Paper layout extract |
| `{{layout.spacing.baseUnit}}` / `.scale` | D | number input | tokens.json |
| `{{responsive.collapsingStrategy}}` | D | text | designer prose |
| `{{#each breakpoints}}` | D | breakpoint table | tokens.json |
| `{{#each elevation}}` | D | shadow editor | paper-normalizer 미래 카테고리 |
| `{{#each tokenMapping.colors}}` / `.radius` / `.spacing` / `.typography` | D | (auto from tokens.json) | bridge |
| `{{role}}` / `{{name}}` / `{{hex}}` (token map) | D | (auto) | 동일 |
| `{{#each composites}}` (per page) | D | composite editor | 페이지별 |
| `{{section}}` / `{{block}}` / `{{element}}` / `{{type}}` / `{{reusable}}` | D | composite row | 동일 |
| `{{#each elements}}` (per composite) | D | element list | 동일 |
| `{{#each variants}}` / `{{variantName}}` / `{{props}}` | D | variant editor | 동일 |
| `{{#each componentStylings}}` | D | component styling editor | per element |
| `{{layout}}` (composite 내) / `{{padding}}` / `{{shadow}}` / `{{radius}}` / `{{background}}` / `{{width}}` / `{{treatment}}` / `{{text}}` / `{{change}}` | D | (per composite) | paper-normalizer C2/C5 활용 |
| `{{#each sections}}` (per page) | B+D | (Blueprint section 이름 + Design 매핑) | hybrid |

### DESIGN.md.template — i18n 슬롯 (I)

| Placeholder | 기원 | 입력 폼 후보 | 비고 |
|---|---|---|---|
| `{{#each i18nKeys}}` | I | i18n file uploader | `templates/assets/i18n/*.json` |
| `{{key}}` / `{{defaultText}}` / `{{context}}` (i18n row) | I | (auto from json) | per key |

### DESIGN.md.template — Designer 가이드 (M)

| Placeholder | 기원 | 입력 폼 후보 | 비고 |
|---|---|---|---|
| `{{#each doRules}}` | M | textarea (list) | Designer prose |
| `{{#each dontRules}}` | M | textarea (list) | 동일 |
| `{{use}}` | M | (per rule) | 동일 |
| `{{#each examplePrompts}}` | M | textarea (list) | 디자이너 / agent 명시 |

### AGENT.md.template — 메타 / 자동 (R)

| Placeholder | 기원 | 비고 |
|---|---|---|
| `{{techStack}}` | R | 프로젝트 설정 상수 (`React 19 + TypeScript + Tailwind CSS`) |
| `{{packageManager}}` | R | `pnpm` |
| `{{testCommand}}` | R | `pnpm test` |
| `{{specId}}` | R | 프로젝트 settings 기본값 |
| `{{PageName}}` | (literal) | 디렉토리 트리 예시 — *치환 대상 아님* |
| `{{componentPath}}` | B | F-04 룰 (status implemented 시 `@/components/templates/{template}`) |

## 🚫 분류 제외 (Helper / 시스템)

다음은 placeholder 가 아닌 Handlebars helper 또는 iteration variable — 분류 대상 아님.

| 표기 | 의미 |
|---|---|
| `{{this}}` | each iteration 의 현재 값 |
| `{{/each}}` | each 닫기 |
| `{{*.* }}` (와일드카드 노트) | nested 접근 표기 (예: `{{meta.*}}`) — 실제 placeholder 는 더 깊은 키 |

## 📌 다운스트림 자동화 가이드

### Studio Blueprint UI (spec-6-05)

본 분류표를 기준으로 입력 폼 자동 생성:

```typescript
// 의사코드
import placeholderMap from "@/schema/blueprint-placeholder-map.md"; // parsed

placeholderMap.entries.forEach(({ placeholder, origin, formCandidate }) => {
  switch (origin) {
    case "B": renderBlueprintFormField(placeholder, formCandidate); break;
    case "D": renderDesignToolImporter(placeholder); break;
    case "I": renderI18nFileUploader(placeholder); break;
    case "M": renderTextareaField(placeholder); break;
    case "R": /* 자동 — UI 미표시 */ break;
  }
});
```

### agent prompt 인용

LLM agent 가 새 페이지 / 새 시각 디자인 추출 시 본 표를 reference. 예:
- agent: "Paper export 의 `--color-primary` 를 어떻게 처리?"
  → 분류표 `{{colors.primary}}` 행 보고 origin=D, paper-normalizer C1 (hex-alpha) 호출.

### Fill Executor

`B` / `R` 만 자동 치환. `D` / `I` / `M` 는 작성자 입력 또는 추출 단계 완료 후 별도 fill.

## 🔗 관련 자료

- 원본: `templates/DESIGN.md.template` (314 lines), `REQUIREMENTS.md.template`, `AGENT.md.template`
- protocol: `schema/blueprint-protocol.md` §변환 규칙 (placeholder 매핑)
- 회고: `docs/poc-retro.md` §F-02 (50%+ placeholder 가 디자인 도구 추출에 의존)
- 향후: `spec-6-05` (Blueprint UI), `spec-6-06` (DESIGN.md 편집기) 의 입력 폼 토대
