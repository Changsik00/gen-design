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
appType: "saas"           # 선택된 앱 유형 ID
appName: ""               # (선택) 사용자가 지정한 앱 이름
recommendedPages: [...]   # page-catalog.md 추천 세트에서 로드
```

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

### 출력 (내부 상태)

```yaml
finalPages:
  - id: "auth-login"
    variant: "modal"
    requiredSections:
      - "BrandHeader"
      - "LoginForm"
      - "SocialAuthBlock"
    optionalSections:
      - "ForgotPasswordLink"
    templateMapping:
      template: "LoginPage"
      status: "implemented"    # implemented | not-implemented
  # ...
```

---

## Output: REQUIREMENTS.md 매핑 규칙

질의 완료 후, 수집된 데이터를 REQUIREMENTS.md 초안으로 변환한다.

### 변환 규칙

| 질의 데이터 | REQUIREMENTS.md 위치 |
|---|---|
| `appType` | 문서 상단 메타 (`앱 유형: SaaS`) |
| `appName` | 문서 제목 (`# {appName} Requirements`) |
| `finalPages[].id` | `## Page Specifications` 하위 `### {pageId}` 섹션 |
| `finalPages[].variant` | 각 페이지 섹션의 `variant:` 속성 |
| `finalPages[].requiredSections` | 각 페이지의 `필수 섹션` 목록 |
| `finalPages[].optionalSections` | 각 페이지의 `선택 섹션` 목록 |
| `finalPages[].templateMapping` | Template 매핑 표에 반영 |

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
