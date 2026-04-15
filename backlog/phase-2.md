# phase-2: Page Template 시스템

> shadcn/ui에 없는 것: 페이지 단위 재사용 컴포넌트.
> Primitive → Composite → Page Template 3계층 아키텍처를 구축하고,
> LoginPage/SignupPage를 Radix와 React Aria 양쪽으로 구현하여 Headless UI를 최종 선택한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-2` |
| **상태** | In Progress |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

shadcn/ui는 Button, Card, Dialog 등 Primitive 수준의 컴포넌트를 제공하지만, LoginPage나 SignupPage 같은 **페이지 단위 재사용 컴포넌트**는 없다. 새 앱을 만들 때마다 로그인 페이지를 처음부터 조립해야 한다. 또한 Headless UI 라이브러리(Radix vs React Aria) 선택이 미확정이므로, 실제 Page Template 구현을 통해 비교 판단한다.

### 목표 (Goal)

1. Primitive → Composite → Page Template 3계층 아키텍처를 설계한다
2. shadcn/ui(Radix) 확정 — ADR-003로 결정 문서화
3. Auth 템플릿(LoginPage, SignupPage)을 shadcn/ui로 구현한다
4. Dashboard 템플릿을 구현한다
5. 토큰/i18n 교체로 브랜딩·언어 전환이 작동함을 검증한다

### 성공 기준 (Success Criteria) — 정량 우선

1. 3계층 아키텍처 설계 문서 존재
2. ADR-003 작성 — shadcn/ui(Radix) 확정 근거 문서화
3. Page Template 3종 이상 (LoginPage, SignupPage, DashboardPage) shadcn/ui로 구현
4. 각 Page Template variant 지원 (page / modal / bottom-sheet)
5. 토큰 교체 → 브랜딩 변경, i18n 교체 → 언어 변경 동작 확인

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-2-001` | page-template-arch | P? | Active | `specs/spec-2-001-page-template-arch/` |
| `spec-2-002` | auth-templates | P? | Active | `specs/spec-2-002-auth-templates/` |
<!-- sdd:specs:end -->

### spec-2-001 — Page Template 아키텍처 설계

- **요점**: Primitive → Composite → Page Template 3계층 구조와 토큰/i18n 슬롯 설계
- **방향성**: 각 계층의 책임 분리, 토큰 슬롯(디자인), i18n 슬롯(텍스트), variant 슬롯(표현 방식) 인터페이스 정의. shadcn/ui registry 모델 참고
- **연관 모듈**: `studio/src/components/`

### spec-2-002 — Auth 템플릿 (LoginPage + SignupPage)

- **요점**: shadcn/ui로 LoginPage, SignupPage 구현
- **방향성**: 3계층 아키텍처 적용. 토큰 슬롯, i18n 슬롯, variant 슬롯 인터페이스 구현
  ```
  LoginPage (Page Template)
  ├── BrandHeader         ← 로고, 앱 이름 (토큰 슬롯)
  ├── LoginForm           ← Composite (이메일, 비밀번호, 기억하기)
  ├── SocialAuthBlock     ← Composite (Google, Apple, Kakao — 슬롯)
  ├── ForgotPasswordLink  ← Primitive
  ├── SignupPrompt        ← i18n ("계정이 없으신가요?")
  └── FooterLinks         ← Primitive (약관, 개인정보)
  ```
- **연관 모듈**: `studio/src/components/`

### spec-2-003 — Dashboard 템플릿

- **요점**: shadcn/ui로 DashboardPage 구현
- **방향성**: OverviewPage (StatCard, RecentActivity, Chart 영역). variant: full-page / sidebar-layout
- **연관 모듈**: `studio/src/components/templates/`

### spec-2-004 — 토큰/i18n 교체 검증 + Paper 디자인 매칭

- **요점**: Page Template의 토큰·i18n 교체로 브랜딩·언어가 바뀌는지 실증 + Paper 디자인과의 스타일 일치
- **방향성**: 브랜드 A 토큰 → 브랜드 B 토큰 교체 시 UI 변경 확인. 한국어 → 영어 i18n 교체 시 텍스트 변경 + 레이아웃 유지 확인. variant(page→modal) 전환 확인
- **연관 모듈**: `studio/src/components/templates/`
- **spec-2-002에서 발견된 이슈**:
  - Paper "Login" 아트보드는 split-screen 풀 레이아웃 (다크 브랜딩 좌측 패널 + 우측 폼, 보라색 CTA, "or continue with" 구분선)
  - Paper "LoginPage — DESIGN.md E2E Test" 아트보드는 카드 중앙 레이아웃 (현재 구현과 구조 동일)
  - 현재 shadcn/ui 기본 사이즈가 compact (h-8 버튼, 작은 input, 400px Card) — Paper 디자인은 더 넉넉한 사이즈/패딩
  - tokens.json 값이 shadcn 기본값이며 Paper 디자인에서 추출한 값이 아님 → Paper에서 컬러/사이즈/스페이싱 추출 후 tokens.json 반영 필요
  - **결정 필요**: 어느 Paper 디자인을 기준으로 스타일 매칭할지 (split-screen vs 카드 중앙)

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Auth Page Template 렌더링

- **Given**: shadcn/ui 기반 LoginPage + SignupPage
- **When**: 기본 토큰으로 렌더링
- **Then**: 3계층 구조 적용, 접근성/키보드 동작 정상
- **연관 SPEC**: spec-2-002

### 시나리오 2: 토큰 교체 테마 변경

- **Given**: 기본 토큰으로 렌더링된 LoginPage
- **When**: 다른 브랜드 토큰 JSON으로 교체
- **Then**: 동일한 구조, 다른 브랜딩
- **연관 SPEC**: spec-2-004

### 시나리오 3: variant 전환

- **Given**: LoginPage가 `page` variant로 렌더링
- **When**: variant를 `modal`로 변경
- **Then**: 동일한 내용이 모달로 렌더링, 기능 동일
- **연관 SPEC**: spec-2-004

## 🔗 의존성

- **선행 phase**: phase-1 (Foundation — 프로젝트 셋업, 토큰 파이프라인)
- **외부 시스템**: 없음
- **연관 ADR**: ADR-001 (Phase 재구성), ADR-003 (shadcn/ui 확정 — 이 Phase에서 생성)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| shadcn/ui 추상화 한계 발견 | 템플릿 구현 차질 | 필요 시 Radix 직접 사용으로 보완 |
| Page Template 추상화가 과도해질 수 있음 | 유연성 저하, 사용 부담 증가 | 최소 슬롯으로 시작, PoC (Phase 5)에서 검증 후 확장 |
| variant(page/modal/bottom-sheet) 구현 복잡도 | 개발 시간 초과 | page variant 먼저, 나머지는 점진적 추가 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] ADR-003 작성 완료
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
