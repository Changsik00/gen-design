# phase-2: Page Template 시스템

> shadcn/ui에 없는 것: 페이지 단위 재사용 컴포넌트.
> Primitive → Composite → Page Template 3계층 아키텍처를 구축하고,
> LoginPage/SignupPage를 Radix와 React Aria 양쪽으로 구현하여 Headless UI를 최종 선택한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-2` |
| **상태** | Planning |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

shadcn/ui는 Button, Card, Dialog 등 Primitive 수준의 컴포넌트를 제공하지만, LoginPage나 SignupPage 같은 **페이지 단위 재사용 컴포넌트**는 없다. 새 앱을 만들 때마다 로그인 페이지를 처음부터 조립해야 한다. 또한 Headless UI 라이브러리(Radix vs React Aria) 선택이 미확정이므로, 실제 Page Template 구현을 통해 비교 판단한다.

### 목표 (Goal)

1. Primitive → Composite → Page Template 3계층 아키텍처를 설계한다
2. Auth 템플릿(LoginPage, SignupPage)을 Radix와 React Aria 양쪽으로 구현하여 비교한다
3. 비교 결과로 Headless UI를 최종 선택한다 (→ ADR-002)
4. Dashboard 템플릿을 선택된 라이브러리로 구현한다
5. 토큰/i18n 교체로 브랜딩·언어 전환이 작동함을 검증한다

### 성공 기준 (Success Criteria) — 정량 우선

1. 3계층 아키텍처 설계 문서 존재
2. LoginPage: Radix 버전 + React Aria 버전 구현 완료
3. ADR-002 작성 — AI 친화성, 코드량, 접근성, DX 비교 근거로 최종 선택
4. 선택된 라이브러리로 Page Template 3종 이상 (LoginPage, SignupPage, DashboardPage)
5. 각 Page Template variant 지원 (page / modal / bottom-sheet)
6. 토큰 교체 → 브랜딩 변경, i18n 교체 → 언어 변경 동작 확인

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
<!-- sdd:specs:end -->

### spec-2-001 — Page Template 아키텍처 설계

- **요점**: Primitive → Composite → Page Template 3계층 구조와 토큰/i18n 슬롯 설계
- **방향성**: 각 계층의 책임 분리, 토큰 슬롯(디자인), i18n 슬롯(텍스트), variant 슬롯(표현 방식) 인터페이스 정의. shadcn/ui registry 모델 참고
- **연관 모듈**: `studio/src/components/`

### spec-2-002 — Auth 템플릿 (Radix vs React Aria 비교)

- **요점**: LoginPage를 Radix와 React Aria 양쪽으로 구현하여 비교
- **방향성**: 동일한 디자인 토큰, 동일한 Tailwind 스타일, 동일한 기능. AI 코드 생성 품질, 코드량(LOC), 접근성, 키보드 지원, DX 비교. 결과를 ADR-002로 문서화
  ```
  LoginPage (Page Template)
  ├── BrandHeader         ← 로고, 앱 이름 (토큰 슬롯)
  ├── LoginForm           ← Composite (이메일, 비밀번호, 기억하기)
  ├── SocialAuthBlock     ← Composite (Google, Apple, Kakao — 슬롯)
  ├── ForgotPasswordLink  ← Primitive
  ├── SignupPrompt        ← i18n ("계정이 없으신가요?")
  └── FooterLinks         ← Primitive (약관, 개인정보)
  ```
- **연관 모듈**: `studio/src/components/`, `docs/decisions/ADR-002-headless-ui.md`

### spec-2-003 — Dashboard 템플릿

- **요점**: 선택된 Headless UI로 DashboardPage 구현
- **방향성**: OverviewPage (StatCard, RecentActivity, Chart 영역). variant: full-page / sidebar-layout
- **연관 모듈**: `studio/src/components/templates/`

### spec-2-004 — 토큰/i18n 교체 검증

- **요점**: Page Template의 토큰·i18n 교체로 브랜딩·언어가 바뀌는지 실증
- **방향성**: 브랜드 A 토큰 → 브랜드 B 토큰 교체 시 UI 변경 확인. 한국어 → 영어 i18n 교체 시 텍스트 변경 + 레이아웃 유지 확인. variant(page→modal) 전환 확인
- **연관 모듈**: `studio/src/components/templates/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Radix vs React Aria 동등 비교

- **Given**: 동일 디자인 토큰, 동일 Tailwind 스타일의 LoginPage
- **When**: Radix 버전과 React Aria 버전을 나란히 렌더링
- **Then**: 시각적으로 동일, 접근성/키보드 테스트 결과 비교 가능
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
- **연관 ADR**: ADR-001 (Headless UI 유보 결정), ADR-002 (이 Phase에서 생성 예정)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Radix↔React Aria 비교가 공정하지 않을 수 있음 | 잘못된 선택 | 동일 시나리오(LoginPage) 기준, AI 코드 생성 실험 추가 |
| Page Template 추상화가 과도해질 수 있음 | 유연성 저하, 사용 부담 증가 | 최소 슬롯으로 시작, PoC (Phase 5)에서 검증 후 확장 |
| variant(page/modal/bottom-sheet) 구현 복잡도 | 개발 시간 초과 | page variant 먼저, 나머지는 점진적 추가 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] ADR-002 작성 완료
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
