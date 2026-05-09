# Blueprint 질의서 프로토콜

> AI 에이전트가 새 앱 기획 시 실행하는 구조화된 질의 프로토콜.
> 3단계 질의를 통해 앱 유형 → 페이지 구성 → 세부 커스터마이징을 도출하고,
> 결과를 REQUIREMENTS.md 초안으로 자동 변환한다.
>
> **참조**: `schema/page-catalog.md` (페이지 카탈로그)

---

## 프로토콜 개요

### 실행 조건

- 사용자가 "새 앱을 만들고 싶다", "앱 기획을 도와줘" 등의 요청을 할 때 실행
- 에이전트는 이 프로토콜의 3단계를 순서대로 진행하며, 각 단계에서 사용자 응답을 수집한다

### 실행 원칙

1. **최소 질문**: 각 단계에서 핵심 질문만 한다. 세부사항은 기본값을 사용하고 나중에 조정
2. **추천 우선**: 앱 유형 선택 시 추천 세트를 먼저 제시하여 빠른 시작을 유도
3. **점진적 구체화**: Step 1은 큰 방향, Step 2는 페이지 구성, Step 3는 세부 조정
4. **카탈로그 참조**: 모든 페이지 ID, 섹션 이름은 `page-catalog.md`의 정의를 따른다

---

## Step 1: 앱 유형 선택

### 질문

```
어떤 유형의 앱을 만들고 싶으신가요?

1) SaaS (B2B 서비스) — 대시보드 + 관리 기능 중심
2) E-commerce (쇼핑몰) — 상품 목록 + 장바구니 + 결제
3) Social (소셜/커뮤니티) — 피드 + 프로필 + 소통
4) Content (콘텐츠/미디어) — 콘텐츠 소비 + 검색
5) Utility (도구/유틸리티) — 기능 중심, 최소 UI
6) Custom (직접 구성) — 빈 상태에서 시작
```

### 처리 규칙

| 응답 | 동작 |
|---|---|
| 1~5 선택 | `page-catalog.md`의 해당 앱 유형 추천 세트를 로드 → Step 2로 진행 |
| 6 (Custom) | 빈 페이지 목록으로 시작 → Step 2에서 직접 추가 |
| 앱 이름/설명 직접 입력 | 에이전트가 가장 적합한 유형을 추천 → 사용자 확인 후 진행 |

### 출력 (내부 상태)

```yaml
meta:
  appType: "saas"              # 선택된 앱 유형 ID
  appName: "SaaS Dashboard"    # 사용자 입력 또는 추천 이름
  name: "saas-dashboard"       # slug (kebab-case, appName 에서 유도)
recommendedPages: [...]        # page-catalog.md 추천 세트에서 로드
```

> `meta.name` 은 디렉토리/패키지 이름용 slug. `appName` 에서 소문자+하이픈 변환으로 자동 생성, 충돌 시 사용자에게 재확인.

---

## Step 1.5: 비기능 요구사항 (NFR)

> 인증 / i18n / 테마 등 **페이지와 무관한 앱 전체 설정** 을 빠르게 수집한다.
> 질의 대상이 작고 대부분 기본값이 동작하므로 일괄 확인 방식으로 진행.
>
> **체크리스트 — 모든 카테고리 응답 필수 (fail-fast)**:
> Step 1.5 의 6 카테고리 (인증 / 다국어 / 테마 / 성능 / 보안 / 호환성·접근성) 중 *하나라도 누락* 하면 Step 2 진행 불가. 기본값으로 진행하려면 명시적으로 "기본값" 응답을 받아야 한다 (암묵적 누락 금지).
>
> | 카테고리 | 필수 응답 | 기본값 |
> |---|---|---|
> | 1 인증 | method / socialProviders / sessionStrategy | email-password / [] / jwt-refresh |
> | 2 다국어 | defaultLocale / supportedLocales | ko / [ko] |
> | 3 테마 | defaultTheme / supportedThemes | light / [light] |
> | 4 성능 | targetLighthouseScore (선택) / coreWebVitalsBudget (선택) | LCP <2.5s / CLS <0.1 / INP <200ms (Lighthouse 90+ 권장) |
> | 5 보안 | csp 정책 수준 / authStorageMethod | strict-default / httpOnly cookie |
> | 6 호환성·접근성 | targetBrowsers / a11yLevel | last-2 evergreen / WCAG 2.1 AA |
>
> 카테고리 4~6 은 phase-5 회고 (F-01) 가 식별한 *spec.md 작성 단계 누락* 의 직접 회복 — Blueprint 응답에서 명시되어야 다운스트림 (Studio export, AGENT.md 의 자동 생성 절차) 이 가이드 가능.

### 질문

```
앱 전체 설정을 확인합니다 (기본값으로 진행하려면 Enter):

[인증]
1) 인증 방식
   a) email-password ← 기본
   b) social-only (소셜 로그인만)
   c) passwordless (매직 링크 / OTP)
   d) enterprise (SSO / OAuth)

2) 소셜 로그인 제공자 (복수 선택, 없으면 빈 배열)
   [ ] google  [ ] github  [ ] apple  [ ] kakao  [ ] naver

3) 세션 전략
   a) jwt-refresh ← 기본
   b) cookie-session
   c) none

[다국어]
4) 지원 언어 (쉼표 구분, 기본: ko)
5) 기본 언어 (기본: 첫 번째)

[테마]
6) 지원 테마 (복수 선택, 기본: light)
   [ ] light  [ ] dark  [ ] auto (system)
7) 기본 테마 (기본: light)

[성능 (NFR-perf)]
8) Lighthouse 목표 점수 (기본: 90)
9) Core Web Vitals 예산
   - LCP (기본: 2.5s)
   - CLS (기본: 0.1)
   - INP (기본: 200ms)

[보안 (NFR-sec)]
10) CSP 정책 수준
    a) strict-default ← 기본 (default-src 'self', 인라인 차단)
    b) relaxed (인라인 허용 — 마이그레이션 한정)
11) 인증 토큰 저장 위치
    a) httpOnly cookie ← 기본
    b) localStorage (XSS 위험 인정)
    c) memory only (새로고침 시 재로그인)

[호환성 / 접근성 (NFR-compat-a11y)]
12) 대상 브라우저 (기본: last-2 evergreen)
13) 접근성 등급 (기본: WCAG 2.1 AA)
    a) WCAG 2.1 AA ← 기본
    b) WCAG 2.1 AAA (요구 시)
    c) AA-best-effort (실험적 PoC 한정)
```

### 처리 규칙

| 응답 | 동작 |
|---|---|
| Enter (기본값) | 모든 항목을 기본값으로 확정 → Step 2 로 진행 |
| 일부 변경 | 변경된 항목만 적용, 나머지는 기본값 → Step 2 로 진행 |
| 충돌 (예: `default` 가 `supported` 에 없음) | 즉시 재질문 |

### 출력 (내부 상태)

```yaml
auth:
  method: "email-password"
  socialProviders: ["google", "github"]
  sessionStrategy: "jwt-refresh"
i18n:
  defaultLocale: "ko"
  supportedLocales: ["ko", "en"]
theme:
  defaultTheme: "light"
  supportedThemes: ["light", "dark"]
performance:
  targetLighthouseScore: 90
  coreWebVitalsBudget:
    lcp: "2.5s"
    cls: 0.1
    inp: "200ms"
security:
  csp: "strict-default"
  authStorageMethod: "httpOnly-cookie"
compatibility:
  targetBrowsers: "last-2 evergreen"
  a11yLevel: "WCAG-2.1-AA"
```

> **검증 (F-01 fail-fast)**: 위 6 카테고리 (auth / i18n / theme / performance / security / compatibility) 의 모든 키가 출력 YAML 에 존재해야 한다. `scripts/validate-blueprint.mjs` 가 누락 검사.

---

## Step 2: 페이지 구성 확인

### 질문

추천 세트를 기반으로 페이지 목록을 제시하고 확인을 받는다.

```
[{appType}] 앱의 추천 페이지 구성입니다:

● 필수
  - auth-login (로그인) — modal
  - auth-signup (회원가입) — page
  - dash-overview (대시보드 개요) — page
  - profile-settings (설정) — page
  - common-error (에러) — page

○ 권장
  - auth-forgot-pw (비밀번호 찾기) — modal
  - dash-analytics (분석) — page
  - common-onboarding (온보딩) — modal

△ 선택
  - (해당 앱 유형의 선택 항목)

이대로 진행할까요?
  1) 그대로 진행 → Step 3
  2) 페이지 추가/제거 후 진행
```

### 처리 규칙

| 응답 | 동작 |
|---|---|
| 1 (그대로) | 추천 세트를 확정 → Step 3로 진행 |
| 2 (추가/제거) | 사용자와 대화하며 페이지 추가/제거. 추가 시 카탈로그 전체 목록에서 선택 |
| 특정 페이지 언급 | "장바구니도 추가해줘" → `commerce-cart` 추가 후 재확인 |

### 추가/제거 시 참조 형식

```
추가 가능한 페이지 (현재 미선택):

[auth]
  - auth-verify (인증 코드 확인) — page, modal

[dashboard]
  - dash-analytics (분석 상세) — page

[profile]
  - profile-mypage (마이페이지) — page

[content]
  - content-list (목록) — page
  - content-detail (상세) — page, modal
  - content-search (검색) — page, modal

[commerce]
  - commerce-cart (장바구니) — page, bottom-sheet
  - commerce-checkout (결제) — page
  - commerce-orders (주문 내역) — page

[common]
  - common-landing (랜딩) — page
  - common-onboarding (온보딩) — page, modal
  - common-notifications (알림) — page, bottom-sheet

추가할 페이지를 알려주세요 (ID 또는 이름).
```

### 출력 (내부 상태)

```yaml
selectedPages:
  - id: "auth-login"
    priority: "required"      # required | recommended | optional
    defaultVariant: "modal"
  - id: "auth-signup"
    priority: "required"
    defaultVariant: "page"
  # ...
```

---

## Step 3: Variant/섹션 커스터마이징

### 질문

선택된 각 페이지에 대해 variant와 섹션을 확인한다. **일괄 확인**을 기본으로 하고, 사용자가 원할 때만 개별 조정한다.

```
선택된 페이지의 기본 구성입니다:

| 페이지 | variant | 필수 섹션 | 선택 섹션 (기본 OFF) |
|---|---|---|---|
| auth-login | modal | BrandHeader, LoginForm, SocialAuthBlock | ForgotPasswordLink, SignupPrompt, FooterLinks |
| auth-signup | page | BrandHeader, SignupForm | SocialAuthBlock, TermsAgreement, LoginPrompt |
| dash-overview | page | DashboardHeader, Sidebar, StatCardGrid, ActivityTable | ChartArea, QuickActions |
| ... | ... | ... | ... |

이대로 진행할까요?
  1) 그대로 확정
  2) 페이지별 세부 조정
```

### 처리 규칙

| 응답 | 동작 |
|---|---|
| 1 (그대로) | 기본 구성 확정 → Output 생성 |
| 2 (세부 조정) | 조정할 페이지를 묻고, 해당 페이지의 variant 변경 / 선택 섹션 ON/OFF 조정 |
| 특정 변경 요청 | "로그인을 page로 바꿔줘" → auth-login variant를 page로 변경 |

### 세부 조정 형식

```
[auth-login] 조정:

variant 선택:
  1) page (split-screen 전체 화면)
  2) modal (현재) ← 기본값
  3) bottom-sheet (모바일 하단 시트)

선택 섹션 ON/OFF:
  [x] ForgotPasswordLink — 비밀번호 찾기 링크
  [ ] SignupPrompt — 회원가입 유도 텍스트
  [ ] FooterLinks — 약관/개인정보 링크
  [ ] RememberMe — 로그인 상태 유지 체크박스

변경할 항목을 알려주세요 (없으면 Enter).
```

### 출력 (최종 통합 구조)

Step 1 ~ Step 3 결과를 다음 구조로 병합한다. 이 YAML 이 **Fill Executor 의 입력** 이 된다.

```yaml
meta:
  appName: "SaaS Dashboard"
  name: "saas-dashboard"         # slug
  appType: "saas"
  pageCount: 4                   # finalPages.length 자동 계산

auth:
  method: "email-password"
  socialProviders: ["google", "github"]
  sessionStrategy: "jwt-refresh"

i18n:
  defaultLocale: "ko"
  supportedLocales: ["ko", "en"]

theme:
  defaultTheme: "light"
  supportedThemes: ["light", "dark"]

finalPages:
  - id: "auth-login"
    name: "로그인"                                           # 한글 표시 이름
    category: "auth"                                         # page-catalog 카테고리
    variant: "modal"
    route: "/auth/login"                                     # F-03: 명시 또는 `/{id}` 자동 (slash 변환)
    layout: "centered-card"                                  # F-03: 명시 또는 variant 기반 자동
    componentPath: "@/components/templates/LoginPage"        # studio alias 기준 import 경로
    requiredSections:
      - "BrandHeader"
      - "LoginForm"
      - "SocialAuthBlock"
    optionalSections:                                        # F-05: 빈 시 [] 또는 'none' literal
      - "ForgotPasswordLink"
    templateMapping:
      template: "LoginPage"
      status: "implemented"                                  # F-04: 'implemented' | 'not-implemented' literal 만 허용
  # ... (다른 페이지)
```

#### `templateMapping.status` 어휘 정합성 (F-04)

machine-readable status (YAML) 와 사용자-facing display (마크다운 / README) 를 분리:

| YAML status (machine) | 마크다운 표 (display) | 한국어 (display) | 의미 |
|---|---|---|---|
| `implemented` | `✅ {Template}` | `구현 완료` | Phase 2 또는 본 phase 의 Template 으로 즉시 합류 가능 |
| `not-implemented` | `⬜` | `미구현` | 향후 phase 에서 작성 — `componentPath` 는 빈 문자열 |

**룰**:
1. YAML 출력 (Blueprint Step 3 / REQUIREMENTS.md 의 frontmatter 등) 은 `implemented` / `not-implemented` literal 만 허용. validator 가 그 외 어휘 (`✅`, `구현 완료`, `complete` 등) 를 발견하면 fail.
2. 마크다운 표 / prose 는 readability 위해 `✅` / `⬜` / `구현 완료` 등 자유롭게 표기 가능 — validator 검증 대상 아님.
3. `templateMapping.status` 와 `componentPath` 의 정합: `status: implemented` 면 `componentPath` 는 `@/components/templates/{template}` 형식. `not-implemented` 면 빈 문자열.

#### 자동 유도 필드 (F-03 갱신)

- `meta.pageCount` ← `finalPages.length`
- `finalPages[].name` ← `page-catalog.md` 의 한글 이름 컬럼
- `finalPages[].category` ← `page-catalog.md` 의 카테고리 (id 앞 접두어 기준: `auth-*` → auth, `dash-*` → dashboard 등)
- `finalPages[].componentPath` ← `@/components/templates/{templateMapping.template}` (status == implemented 시), 미구현이면 빈 문자열
- **`finalPages[].route`** (F-03): 작성자 명시 우선, 미명시 시 `/{id 의 첫 segment 제거 + slash 변환}` (예: `auth-login` → `/auth/login`). 단순 `/{id}` 도 허용.
- **`finalPages[].layout`** (F-03): 작성자 명시 우선, 미명시 시 `variant` 기반 자동 (`page` → `default`, `modal` → `centered-card`, `bottom-sheet` → `sheet`). 작성자가 임의 layout 이름 명시 가능.

#### DESIGN.md 전용 확장 필드 (선택)

DESIGN.md.template 이 추가로 사용하는 페이지 상세 필드. Blueprint Step 1~3 에서 수집되지 않으면 아래 기본값을 적용한다.

| 필드 | 소스 / 기본값 |
|---|---|
| `finalPages[].description` | `page-catalog.md` 의 Description 컬럼 |
| `finalPages[].sections` | `requiredSections + optionalSections` 를 Section/Block 2차원 구조로 전개 (매핑 규칙은 `page-catalog.md` 의 Section 컬럼 참조) |

> `route` / `layout` 은 §자동 유도 필드 로 이동 (F-03).

#### `optionalSections` 빈 배열 표시 규약 (F-05)

작성자가 선택 섹션을 모두 OFF 한 경우 표기 통일:

| 표기 | 의미 | 권장도 |
|---|---|---|
| `[]` | 빈 YAML 배열 | 허용 (machine-friendly) |
| `'none'` | 명시 literal | 권장 (작성자 의도 명확) |
| omit | 키 자체 누락 | **금지** (validator fail) |

룰:
1. validator 는 `[]` 와 `'none'` 둘 다 빈 상태로 인식.
2. 키 누락은 fail — 작성자가 의도적으로 비웠음을 표시할 수 없음 (단순 빠뜨림 vs 의도 빈 상태 구분 불가).
3. 마크다운 표시 (`REQUIREMENTS.md` 페이지 블록의 "선택 섹션") 는 빈 시 "(없음)" 또는 "—" 자유.

---

## Output: REQUIREMENTS.md 매핑 규칙

질의 완료 후, 수집된 데이터를 REQUIREMENTS.md 초안으로 변환한다.

### 변환 규칙 (schema key ↔ placeholder)

Fill Executor 가 이 표의 매핑을 따라 `REQUIREMENTS.md.template`, `DESIGN.md.template`, `AGENT.md.template` 를 치환한다.
placeholder 는 nested 접근(`{{obj.field}}`) 을 사용한다 (Fill Executor 의 해석 규칙 2 참조).

| Schema Key | Placeholder (템플릿) | 대상 템플릿 |
|---|---|---|
| `meta.appName` | `{{meta.appName}}` | 모두 |
| `meta.name` | `{{meta.name}}` | AGENT.md (패키지명) |
| `meta.appType` | `{{meta.appType}}` | REQUIREMENTS / AGENT |
| `meta.pageCount` | `{{meta.pageCount}}` | REQUIREMENTS |
| `auth.method` | `{{auth.method}}` | REQUIREMENTS |
| `auth.socialProviders` | `{{auth.socialProviders}}` | REQUIREMENTS |
| `auth.sessionStrategy` | `{{auth.sessionStrategy}}` | REQUIREMENTS |
| `i18n.defaultLocale` | `{{i18n.defaultLocale}}` | REQUIREMENTS / DESIGN / AGENT |
| `i18n.supportedLocales` | `{{i18n.supportedLocales}}` | REQUIREMENTS / DESIGN |
| `theme.defaultTheme` | `{{theme.defaultTheme}}` | REQUIREMENTS / DESIGN |
| `theme.supportedThemes` | `{{theme.supportedThemes}}` | REQUIREMENTS / DESIGN |
| `finalPages[].id` | `{{#each finalPages}} {{id}}` | 모두 |
| `finalPages[].name` | `{{name}}` (각 페이지 블록 내) | REQUIREMENTS / DESIGN |
| `finalPages[].category` | `{{category}}` | REQUIREMENTS |
| `finalPages[].variant` | `{{variant}}` | REQUIREMENTS / DESIGN |
| `finalPages[].route` | `{{route}}` | REQUIREMENTS / AGENT |
| `finalPages[].layout` | `{{layout}}` | REQUIREMENTS / DESIGN |
| `finalPages[].componentPath` | `{{componentPath}}` | AGENT |
| `finalPages[].requiredSections` | `{{#each requiredSections}}` | REQUIREMENTS / DESIGN |
| `finalPages[].optionalSections` | `{{#each optionalSections}}` | REQUIREMENTS / DESIGN |
| `finalPages[].templateMapping.template` | `{{templateMapping.template}}` | REQUIREMENTS / AGENT |
| `finalPages[].templateMapping.status` | `{{templateMapping.status}}` | REQUIREMENTS / AGENT |

### 자동 주입 / 외부 소스 (Schema 외부)

Blueprint 질의로 수집되지 않지만 템플릿에 등장하는 placeholder 는 다음 소스에서 주입한다.

| Placeholder | 소스 | 주입 시점 |
|---|---|---|
| `{{date}}` | 시스템 시각 | Fill 시 현재 날짜로 자동 치환 |
| `{{techStack}}` | 프로젝트 설정 (상수) | `"React 19 + TypeScript + Tailwind CSS"` 기본 |
| `{{packageManager}}` | 프로젝트 설정 (상수) | `"pnpm"` 기본 |
| `{{testCommand}}` | 프로젝트 설정 (상수) | `"pnpm test"` 기본 |
| `{{specId}}` | 프로젝트 settings | 새 프로젝트 부트스트랩 시 기본값 `"spec-00-00"` |
| `{{PageName}}` | 디렉토리 트리 예시 literal | **치환 대상 아님** — 문서에서 예시 placeholder 로 유지 |
| DESIGN.md 시각 디자인 필드 (`{{visualTheme.*}}`, `{{colors.*}}`, `{{typography.*}}` 등) | 디자인 도구 (Paper / Figma) 추출 | Phase 4 ~ 7 파이프라인 |

### REQUIREMENTS.md 출력 구조

```markdown
# {appName} Requirements

## 메타

| 항목 | 값 |
|---|---|
| 앱 유형 | {appType} |
| 생성일 | {date} |
| 총 페이지 수 | {count} |

## Page Specifications

### auth-login — 로그인

| 항목 | 값 |
|---|---|
| variant | modal |
| Template | LoginPage ✅ |

**필수 섹션**:
- BrandHeader
- LoginForm
- SocialAuthBlock

**선택 섹션**:
- ForgotPasswordLink

---

### dash-overview — 대시보드 개요

| 항목 | 값 |
|---|---|
| variant | page |
| Template | DashboardPage ✅ |

**필수 섹션**:
- DashboardHeader
- Sidebar
- StatCardGrid
- ActivityTable

---

(... 각 페이지 반복 ...)

## Template 매핑 표

| 페이지 | Template | 상태 | variant |
|---|---|---|---|
| auth-login | LoginPage | ✅ 구현 완료 | modal |
| auth-signup | SignupPage | ✅ 구현 완료 | page |
| dash-overview | DashboardPage | ✅ 구현 완료 | page |
| auth-forgot-pw | — | ⬜ 미구현 | modal |
| ... | ... | ... | ... |

## 다음 단계

- [ ] DESIGN.md 작성 (시각 디자인 명세)
- [ ] AGENT.md 작성 (AI 에이전트 지침)
- [ ] 미구현 Template 우선순위 결정
```

### Template 매핑 표 생성 규칙

1. `finalPages`를 순회하며 각 페이지의 `id`를 `page-catalog.md` 요약 테이블의 `Template 상태`와 매칭
2. ✅ 표시된 페이지는 `구현 완료` + 해당 Template 이름 기재
3. ⬜ 표시된 페이지는 `미구현` + Template 이름 빈칸
4. 매핑 표는 REQUIREMENTS.md 하단에 자동 추가

---

## 변환 실행 주체 (Fill Executor)

> Step 3 의 출력 YAML 로 `templates/*.template` 파일들을 채우는 **실행 주체**를 정의한다.
> 템플릿은 `{{var}}`, `{{#each list}}...{{/each}}`, `{{obj.field}}` 형식의 placeholder 를 사용한다 (Handlebars 문법 하위 집합).

### 기본 주체: AI 에이전트 direct-fill

사람 개입 없이 AI 에이전트가 질의 결과 YAML 을 읽고 placeholder 를 직접 치환한다.
외부 런타임 / 스크립트가 필요 없고, AI 에이전트의 구조적 파싱 능력에 의존한다.

#### placeholder 해석 규칙

**1) 단순 치환: `{{var}}`**
- 현재 컨텍스트(루트 또는 `{{#each}}` 블록 내부) 에서 `var` 키를 찾아 그 값으로 치환한다.
- 값이 스칼라(string/number/boolean) 이면 그대로, 배열이면 쉼표 구분 문자열로 직렬화한다.

```yaml
# 입력
appName: "SaaS Dashboard"
defaultTheme: "light"
```
```markdown
# 템플릿
# {{appName}} — Design System
기본 테마: {{defaultTheme}}
```
```markdown
# 출력
# SaaS Dashboard — Design System
기본 테마: light
```

**2) 중첩 접근: `{{obj.field}}`**
- 점 표기법으로 중첩 객체 필드에 접근한다.

```yaml
# 입력
typography:
  fontFamily:
    primary: "Inter, sans-serif"
```
```markdown
# 템플릿
Primary: {{typography.fontFamily.primary}}
```
```markdown
# 출력
Primary: Inter, sans-serif
```

**3) 반복 블록: `{{#each list}}...{{/each}}`**
- `list` 가 배열이면 각 요소를 새 컨텍스트로 삼아 블록을 반복 렌더링한다.
- 블록 내부에서 `{{field}}` 는 "현재 요소의 field", `{{this}}` 는 "현재 요소 전체" 를 의미한다.

```yaml
# 입력
pages:
  - id: auth-login
    variant: modal
  - id: dash-overview
    variant: page
```
```markdown
# 템플릿
{{#each pages}}
- {{id}} ({{variant}})
{{/each}}
```
```markdown
# 출력
- auth-login (modal)
- dash-overview (page)
```

#### direct-fill 실행 순서

1. 템플릿 파일을 읽고 placeholder 를 스캔한다.
2. Step 3 출력 YAML 의 최상위 키와 placeholder 를 매칭한다.
3. 누락 키가 있으면 **즉시 사용자에게 질문** (fail fast — 빈 값으로 진행 금지).
4. 치환 결과를 `DESIGN.md`, `REQUIREMENTS.md`, `AGENT.md` 로 저장한다.
5. placeholder 해석이 모호한 경우(nested `{{#each}}` 중첩 3단계 이상 등) → 대체 주체로 폴백.

### 대체 주체: Handlebars CLI (선택)

placeholder 복잡도가 높거나 대량 배치 생성이 필요하면 `handlebars` CLI 로 실행할 수 있다.

```bash
# YAML 을 JSON 으로 변환 후 템플릿 렌더링
npx js-yaml output.yaml > output.json
npx handlebars templates/DESIGN.md.template --data output.json > DESIGN.md
```

- 장점: 결정론적 출력, 대량 처리.
- 단점: 런타임 설치 필요, YAML 키 오타 시 빈 치환으로 통과.
- **권장**: PoC 단계(Phase 5)에서 정확도 벤치마크가 필요할 때만 사용. 평상시에는 direct-fill.

### Fill Executor 선택 기준

| 상황 | 권장 주체 |
|---|---|
| 단일 앱 생성 (대화 흐름 내) | **AI-direct-fill** |
| 여러 앱 배치 생성 | Handlebars CLI |
| placeholder 변환 정확도 검증 | Handlebars CLI (결정론적) |
| 누락 필드 있는 초기 기획 | **AI-direct-fill** (대화로 보완) |

---

## 프로토콜 실행 요약

```
┌─────────────────────────────────────────────┐
│ Step 1: 앱 유형 선택                          │
│   → 추천 세트 로드                            │
├─────────────────────────────────────────────┤
│ Step 2: 페이지 구성 확인                       │
│   → 추가/제거 → 페이지 목록 확정               │
├─────────────────────────────────────────────┤
│ Step 3: variant/섹션 커스터마이징              │
│   → 일괄 확인 또는 개별 조정 → 최종 구성 확정    │
├─────────────────────────────────────────────┤
│ Output: REQUIREMENTS.md 초안 생성              │
│   → 매핑 규칙에 따라 자동 변환                  │
│   → Template 매핑 표 포함                      │
└─────────────────────────────────────────────┘
```
