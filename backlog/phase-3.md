# phase-3: App Blueprint

> 아무도 안 만든 영역: 요구사항 → 컴포넌트 매핑.
> 페이지 카탈로그 + 구조화된 질의서로 앱 기획을 가이드하고,
> 기존 Page Template 자원을 활용해 일관된 산출물을 생성한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-3` |
| **상태** | Planning |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

Phase 2에서 Page Template이 완성되면, 새 앱을 만들 때 "어떤 페이지가 필요하고, 각 페이지를 어떻게 구성할지"를 체계적으로 가이드해야 한다. 현재 이 영역은 도구 생태계에서 **완전히 공백**이다. 요구사항→코드 사이의 구조적 가이드가 없어, 결과물의 일관성이 사람 경험에 의존한다.

### 목표 (Goal)

1. 앱 유형별 페이지 카탈로그를 만든다 (auth, dashboard, profile, content, common 등)
2. 구조화된 질의서로 앱 유형 → 페이지 → variant를 체계적으로 선택하게 한다
3. 선택 결과를 REQUIREMENTS.md + DESIGN.md + AGENT.md 세트로 자동 구조화한다
4. REQUIREMENTS.md의 페이지/섹션이 Phase 2의 Page Template과 자동 매핑되게 한다

### 성공 기준 (Success Criteria) — 정량 우선

1. 페이지 카탈로그: 최소 5개 카테고리, 각 카테고리 2종 이상, 각 페이지 variant 2개 이상
2. Blueprint 질의서 프로토콜 문서 완성
3. 질의서 결과 → REQUIREMENTS.md 초안 자동 생성 가능
4. REQUIREMENTS.md → Page Template 매핑 표 생성 가능
5. DESIGN.md + REQUIREMENTS.md + AGENT.md 템플릿 세트 완성
6. i18n/tokens 리소스가 `templates/assets/`에 위치하고, studio가 이를 참조하는 구조
7. DESIGN.md 섹션 → Page Template 컴포넌트/슬롯 매핑 명세 존재

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-3-01` | page-catalog | P? | Merged | `specs/spec-3-01-page-catalog/` |
| `spec-3-02` | blueprint-questionnaire | P? | Merged | `specs/spec-3-02-blueprint-questionnaire/` |
| `spec-3-03` | template-set | P? | Merged | `specs/spec-3-03-template-set/` |
<!-- sdd:specs:end -->

### spec-3-001 — 페이지 카탈로그 정의

- **요점**: 앱에서 흔히 쓰이는 페이지 유형과 variant를 카탈로그화
- **방향성**:
  ```
  pages/
  ├── auth/      login, signup, forgot-pw, verify
  ├── dashboard/ overview, analytics
  ├── profile/   my-page, settings
  ├── content/   list, detail, search
  ├── commerce/  cart, checkout, order-history
  └── common/    landing, onboarding, error, notifications
  ```
  각 페이지에 variant(page/modal/bottom-sheet 등), 필수/선택 섹션, Phase 2 Page Template 매핑 정의
- **연관 모듈**: `schema/`, `templates/`

### spec-3-002 — Blueprint 질의서 설계

- **요점**: 앱 기획 시 체계적으로 질문하는 구조화된 질의서
- **방향성**: 앱 유형(SaaS/E-commerce/Social/Content/Utility) → 인증 방식 → 페이지별 variant 선택 → 섹션 구성. 선택 결과가 REQUIREMENTS.md로 자동 구조화. AI 에이전트가 질의서를 실행하는 프로토콜 포함
- **연관 모듈**: `templates/REQUIREMENTS.md.template`

### spec-3-003 — 산출물 템플릿 세트 + 리소스 분리

- **요점**: DESIGN.md, REQUIREMENTS.md, AGENT.md 템플릿 최종 확정 + 앱 종속 리소스를 템플릿 레벨로 분리
- **방향성**: Blueprint 결과를 반영한 프로젝트 생성 템플릿. assets 디렉토리 구조(i18n JSON, 토큰 JSON, 이미지) 포함. Schema 확장 섹션(Phase 1)과 정합
- **phase-2에서 발견된 구조 이슈**:
  - i18n 리소스가 `studio/src/i18n/`에 앱 종속 — `templates/assets/i18n/`으로 이동 필요
  - tokens.json이 `studio/tokens/`에 앱 종속 — `templates/assets/tokens/`으로 이동 필요
  - 여러 앱을 생성하려면 빌드 시 템플릿에서 앱으로 복사/참조하는 구조 필요
- **DESIGN.md ↔ 컴포넌트 연결 설계**:
  - DESIGN.md의 섹션(Component Stylings, Page Specifications 등)이 Page Template의 어떤 컴포넌트/슬롯에 매핑되는지 정의
  - AI가 DESIGN.md를 읽고 적절한 Page Template + 토큰 + i18n을 조합할 수 있는 명세
- **연관 모듈**: `templates/`, `schema/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Blueprint → REQUIREMENTS.md 생성

- **Given**: "SaaS 대시보드 앱" 유형으로 Blueprint 질의 응답 완료
- **When**: 질의서 결과를 처리
- **Then**: 대시보드, 로그인(모달), 회원가입(멀티스텝), 마이페이지가 포함된 REQUIREMENTS.md 생성. 각 페이지가 Page Template과 매핑
- **연관 SPEC**: spec-3-002, spec-3-003

## 🔗 의존성

- **선행 phase**: phase-2 (Page Template 시스템 — 매핑 대상 컴포넌트)
- **외부 시스템**: 없음

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| 페이지 카탈로그가 특정 앱 유형에 편향 | 범용성 저하 | PoC (Phase 5)에서 다양한 앱 유형으로 검증 |
| 질의서가 너무 길어져 사용성 저하 | 사용자 이탈 | 필수 질문만 코어, 나머지는 선택적 심화로 분리 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
