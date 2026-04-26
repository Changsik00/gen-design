# TaskFlow Requirements

> Blueprint 질의서(`schema/blueprint-protocol.md`) 의 결과로 생성된 프로젝트 요구사항.
> 입력 YAML: `poc/app-a/blueprint-session.md` 의 "최종 통합 출력 YAML".
> 작성 주체: AI direct-fill (placeholder → 값 직접 치환).

## 메타

| 항목 | 값 |
|---|---|
| **앱 이름** | TaskFlow |
| **앱 slug** | `taskflow` |
| **앱 유형** | saas |
| **생성일** | 2026-04-26 |
| **총 페이지 수** | 5 |

---

## Page Specifications

> 각 페이지는 `schema/page-catalog.md` 의 ID 를 사용합니다.
> variant, 섹션 구성은 Blueprint 질의서 Step 2~3 의 결과입니다.

### auth-login — 로그인

| 항목 | 값 |
|---|---|
| **카테고리** | auth |
| **variant** | modal |
| **Template** | LoginPage ✅ |

**필수 섹션**:
- BrandHeader
- LoginForm
- SocialAuthBlock

**선택 섹션**:
- ForgotPasswordLink
- SignupPrompt

---

### auth-signup — 회원가입

| 항목 | 값 |
|---|---|
| **카테고리** | auth |
| **variant** | page |
| **Template** | SignupPage ✅ |

**필수 섹션**:
- BrandHeader
- SignupForm

**선택 섹션**:
- SocialAuthBlock
- TermsAgreement
- LoginPrompt

---

### dash-overview — 대시보드 개요

| 항목 | 값 |
|---|---|
| **카테고리** | dashboard |
| **variant** | page |
| **Template** | DashboardPage ✅ |

**필수 섹션**:
- DashboardHeader
- Sidebar
- StatCardGrid
- ActivityTable

**선택 섹션**:
- QuickActions

---

### profile-mypage — 마이페이지

| 항목 | 값 |
|---|---|
| **카테고리** | profile |
| **variant** | page |
| **Template** | MyPage ⬜ |

**필수 섹션**:
- ProfileHeader
- ProfileInfoCard
- ActivitySummary

**선택 섹션**:
- AvatarUpload

---

### common-error — 에러 (404/500)

| 항목 | 값 |
|---|---|
| **카테고리** | common |
| **variant** | page |
| **Template** | ErrorPage ⬜ |

**필수 섹션**:
- ErrorIcon
- ErrorMessage
- HomeButton

**선택 섹션**:
- (없음)

---

## Template 매핑 표

> ✅ = Phase 2 에서 구현 완료, ⬜ = 미구현 (spec-5-03 React 구현 단계에서 신규 작성)

| 페이지 | Template | 상태 | variant |
|---|---|---|---|
| auth-login | LoginPage | ✅ 구현 완료 | modal |
| auth-signup | SignupPage | ✅ 구현 완료 | page |
| dash-overview | DashboardPage | ✅ 구현 완료 | page |
| profile-mypage | MyPage | ⬜ 미구현 | page |
| common-error | ErrorPage | ⬜ 미구현 | page |

## 비기능 요구사항

### 인증

| 항목 | 값 |
|---|---|
| 인증 방식 | email-password |
| 소셜 로그인 | google, github |
| 세션 관리 | jwt-refresh |

### 다국어 (i18n)

| 항목 | 값 |
|---|---|
| 기본 언어 | en |
| 지원 언어 | en |
| 리소스 위치 | `poc/app-a/i18n/` (spec-5-03 단계에서 생성 예정) |

### 브랜딩 (Tokens)

| 항목 | 값 |
|---|---|
| 기본 테마 | light |
| 지원 테마 | light |
| 토큰 위치 | `poc/app-a/tokens.json` (spec-5-03 단계에서 생성 예정) |

---

## 다음 단계

- [x] DESIGN.md 작성 (시각 디자인 명세 — `schema/design-md-schema.md` 참조) — Task 4
- [x] AGENT.md 작성 (AI 에이전트 프로젝트 지침) — Task 5
- [ ] 미구현 Template (MyPage / ErrorPage) 신규 작성 — spec-5-03
- [ ] tokens.json 디자인 추출 및 반영 — spec-5-02 (Paper 시안) → spec-5-03
- [ ] i18n 리소스 (en) 작성 — spec-5-03

> Phase 5 PoC 후 앱 B (spec-5-04) 에서 본 REQUIREMENTS.md 의 i18n + 토큰만 교체하여 한국어 / 다른 브랜딩으로 재사용성 검증 예정.
