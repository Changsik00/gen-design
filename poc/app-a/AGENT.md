# TaskFlow — AI Agent Guide

> AI 에이전트가 본 PoC 앱 (TaskFlow) 에서 코드를 생성할 때 따라야 할 지침.
> `DESIGN.md` (시각) + `REQUIREMENTS.md` (기능) 와 함께 3 종 세트로 사용.
>
> 본 문서는 spec-5-01 의 산출물이며, 후속 spec-5-02 (Paper 시안) 와 spec-5-03 (React 구현) 에서 참조된다.

---

## 1. 프로젝트 개요

| 항목 | 값 |
|---|---|
| **앱 이름** | TaskFlow |
| **패키지명** | `taskflow` |
| **앱 유형** | saas |
| **기술 스택** | React 19 + TypeScript + Tailwind CSS |
| **패키지 매니저** | pnpm |
| **PoC 위치** | `poc/app-a/` |

> Phase 5 PoC 단계 — 실제 앱 코드 (`poc/app-a/src/`) 는 spec-5-03 에서 생성.

## 2. 아키텍처 규칙

### 컴포넌트 계층 (3-Layer)

```
templates/          Layer 3: Page Template (페이지 단위)
    ↓ uses
composites/         Layer 2: Composite (기능 단위)
    ↓ uses
ui/                 Layer 1: Primitive (shadcn/ui)
```

- **계층 의존 방향**: templates → composites → ui (역방향 금지)
- **Primitive 수정 금지**: `ui/` 컴포넌트는 shadcn/ui CLI 로만 관리
- **슬롯 필수**: 모든 Page Template 은 `texts`, `variant` prop 을 반드시 받는다

### 디렉토리 구조 (spec-5-03 에서 적용)

```
poc/app-a/
├── src/
│   ├── components/
│   │   ├── ui/                    # Layer 1: Primitive (Phase 2 studio 의 ui/ 재사용)
│   │   ├── composites/            # Layer 2: Composite (Phase 2 + TaskFlow 신규)
│   │   └── templates/             # Layer 3: Page Template
│   │       ├── LoginPage/         # ✅ Phase 2 재사용
│   │       ├── SignupPage/        # ✅ Phase 2 재사용
│   │       ├── DashboardPage/     # ✅ Phase 2 재사용
│   │       ├── MyPage/            # ⬜ TaskFlow 신규
│   │       └── ErrorPage/         # ⬜ TaskFlow 신규
│   ├── app/                       # Vite + Router 부트
│   └── i18n/                      # 번역 리소스
├── tokens.json                    # 디자인 토큰 (spec-5-02 추출 → spec-5-03 반영)
├── i18n/en.json                   # 영어 리소스 (spec-5-03 작성)
└── DESIGN.md / REQUIREMENTS.md / AGENT.md  # 본 산출물 3 종
```

> 트리의 `LoginPage`, `MyPage` 등은 실제 디렉토리 이름이며 **literal** 입니다.

## 3. 코드 생성 규칙

### 스타일링

- **Tailwind CSS 유틸리티만 사용** — 인라인 스타일, CSS 모듈 금지
- **토큰 직접 참조 금지** — hex / oklch 값 하드코딩 대신 Tailwind 클래스 (`bg-primary`, `text-foreground`)
- **CSS 변수 참조** — `tokens.json → _tokens-*.css → Tailwind` 파이프라인 (Phase 1 에서 정립)
- **토큰 소스**: `poc/app-a/tokens.json` (spec-5-03 에서 생성)

### i18n

- **텍스트 하드코딩 금지** — 모든 사용자 대면 텍스트는 `texts` prop 에서 가져옴
- **i18n 키 형식**: `{page}.{section}.{element}.{property}` (DESIGN.md §14 참조)
- **리소스 위치**: `poc/app-a/i18n/{locale}.json` — 기본 언어 `en`
- **앱 B 재사용성 검증**: spec-5-04 에서 `ko.json` 만 추가하여 코드 변경 없이 한국어 앱으로 변환

### 테스트

- **TDD 원칙**: 테스트 먼저 작성 → 실패 확인 → 구현 → 통과
- **테스트 대상**: 렌더링, variant 전환, i18n 교체, 토큰 교체
- **명령**: `pnpm test` (Vitest)

## 4. Page Template 참조

> REQUIREMENTS.md 의 Page Specifications 와 DESIGN.md 의 확장 섹션 (§11~14) 을 참조하여 구현합니다.

### 구현 시 체크리스트

1. REQUIREMENTS.md 에서 해당 페이지의 variant, 필수 / 선택 섹션 확인
2. DESIGN.md §11 (Page Specifications) 에서 Section → Block 구조 확인
3. DESIGN.md §12 (Composite Components) 에서 재사용 Composite 확인
4. DESIGN.md §13 (Token Mapping) 에서 디자인 토큰 매핑 확인 — `TODO(spec-5-02)` 항목은 먼저 채워야 함
5. DESIGN.md §14 (i18n References) 에서 텍스트 키 확인
6. `schema/design-component-mapping.md` 에서 DESIGN.md → 코드 매핑 참조

### Template 매핑

| REQUIREMENTS.md 페이지 | 코드 컴포넌트 | Template 상태 |
|---|---|---|
| auth-login | `@/components/templates/LoginPage` | implemented |
| auth-signup | `@/components/templates/SignupPage` | implemented |
| dash-overview | `@/components/templates/DashboardPage` | implemented |
| profile-mypage | (spec-5-03 신규) | not-implemented |
| common-error | (spec-5-03 신규) | not-implemented |

> Phase 2 에서 구현된 3 종 (Login / Signup / Dashboard) 은 `studio/src/components/templates/` 에서 import 또는 복제. spec-5-03 단계에서 결정.

## 5. 커밋 규칙

- **형식**: `<type>(spec-5-XX): <설명>` (모두 소문자)
- **타입**: feat, fix, refactor, test, docs, chore, style, perf
- **One Task = One Commit** (`.harness-kit/agent/constitution.md` §8)
- **커밋 spec ID**: 작업 중인 spec 의 ID (예: spec-5-02 / spec-5-03 등)

## 6. 참조 문서

| 문서 | 위치 | 역할 |
|---|---|---|
| DESIGN.md | `poc/app-a/DESIGN.md` | 시각 디자인 명세 (TaskFlow) |
| REQUIREMENTS.md | `poc/app-a/REQUIREMENTS.md` | 기능 요구사항 (TaskFlow) |
| Blueprint 세션 | `poc/app-a/blueprint-session.md` | 본 산출물의 입력 YAML 출처 |
| Findings | `poc/app-a/findings.md` | spec-5-01 작성 중 발견한 결함 / 모호성 |
| Page Catalog | `schema/page-catalog.md` | 페이지 유형 카탈로그 |
| Blueprint Protocol | `schema/blueprint-protocol.md` | 앱 기획 질의서 (3 단계) |
| Design Schema | `schema/design-md-schema.md` | DESIGN.md 작성 규격 (14 섹션) |
| Component Mapping | `schema/design-component-mapping.md` | DESIGN.md → 코드 매핑 |
| Architecture | `studio/src/components/ARCHITECTURE.md` | 3 계층 아키텍처 가이드 |
| Phase 5 본문 | `backlog/phase-5.md` | 본 PoC 의 스펙 트리 |

## 7. 본 PoC 한정 운영 규약

> spec-5-02 / 5-03 / 5-04 진행 시 본 항목을 우선 따른다.

1. **Findings 갱신 의무**: 본 spec 또는 후속 spec 에서 템플릿 / 스키마 / 프로토콜 결함을 발견하면 `poc/app-a/findings.md` 에 추가. 결함 자체의 *수정* 은 phase-5 회고 (spec-5-05) 또는 phase-6 에서 일괄 처리.
2. **TODO(spec-5-02 / spec-5-03) 마커**: DESIGN.md 의 미완 항목은 해당 spec 에서 반드시 채워 빈 marker 가 0 이 되도록 한다.
3. **재사용성 우선**: 신규 Composite / Template 추가 시 Phase 2 의 기존 Atom / Composite 와 충돌 / 중복하지 않는지 먼저 확인.
4. **앱 B 호환성**: 모든 산출물은 i18n 키 + 토큰만 교체하면 다른 언어 / 브랜드로 동작하도록 작성. 영어 텍스트 / 인디고 색상의 직접 참조 금지.
