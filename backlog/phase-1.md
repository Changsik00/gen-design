# phase-1: Foundation (기반 셋업)

> 기존 도구와 표준을 조합하여 프로젝트 기반을 구축한다.
> Stitch/awesome-design-md 포맷 분석→확장, shadcn/ui+Tailwind 셋업, W3C DTCG+Style Dictionary 파이프라인.
> 자체 발명을 최소화하고, 검증된 도구를 채택한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-1` |
| **상태** | In Progress |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

DESIGN.md 포맷(Stitch/awesome-design-md), 디자인 토큰 표준(W3C DTCG), Headless UI 생태계(shadcn/ui+Radix)가 이미 성숙해 있다. 이를 처음부터 만드는 것은 낭비이며, 우리의 핵심 차별점(Page Template, Blueprint, 협업 Flow)에 집중하기 위해 기반을 빠르게 조립해야 한다.

### 목표 (Goal)

1. DESIGN.md 포맷을 분석하고, 우리 목적(디자인→코드 브릿지)에 필요한 확장 포인트를 정의한다
2. React + Tailwind + shadcn/ui 프로젝트를 셋업한다
3. W3C DTCG 토큰 + Style Dictionary 파이프라인을 구성한다

### 성공 기준 (Success Criteria) — 정량 우선

1. DESIGN.md 확장 명세 문서 존재 (`schema/` 내): 기존 9섹션 + 확장 섹션(중간 언어, 페이지 명세, 컴포넌트 매핑) 정의
2. React + Vite + TypeScript + Tailwind + shadcn/ui 프로젝트 빌드/실행 가능
3. 샘플 tokens.json → Style Dictionary → Tailwind config 파이프라인 동작 확인
4. i18n 텍스트 리소스 JSON 구조 정의 및 샘플 1종 작성

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-1-001` | design-md-schema | P? | Active | `specs/spec-1-001-design-md-schema/` |
| `spec-1-002` | react-project-setup | P? | Active | `specs/spec-1-002-react-project-setup/` |
| `spec-1-003` | design-token-pipeline | P? | Active | `specs/spec-1-003-design-token-pipeline/` |
<!-- sdd:specs:end -->

### spec-1-001 — DESIGN.md 포맷 분석 및 확장 정의

- **요점**: 기존 Stitch/awesome-design-md 9섹션 구조를 분석하고, 우리만의 확장 포인트를 정의
- **방향성**: 66개 레퍼런스에서 공통 패턴 도출. 확장 섹션 추가: 중간 언어(Page > Section > Block > Element), 페이지 명세, 복합 컴포넌트 참조, 토큰↔Tailwind 매핑, i18n 참조 방식. 기존 포맷과 호환 유지
- **참조**: `design-md-collection/`, Stitch 공식 문서
- **연관 모듈**: `schema/`

### spec-1-002 — React 프로젝트 셋업

- **요점**: Vite + React + TypeScript + Tailwind + shadcn/ui 프로젝트 초기화
- **방향성**: studio/ 디렉토리에 프로젝트 생성. shadcn/ui CLI로 기본 컴포넌트 설치. Radix UI 기본 채택 (React Aria는 Phase 2에서 LoginPage 비교 후 최종 결정 → ADR-002)
- **연관 모듈**: `studio/`

### spec-1-003 — 디자인 토큰 파이프라인 구성

- **요점**: W3C DTCG 포맷 토큰 + Style Dictionary → Tailwind config 파이프라인
- **방향성**: DTCG 표준(`.tokens.json`) 준수. Style Dictionary 설정으로 Tailwind CSS 변수 자동 생성. 시맨틱 토큰(primary, secondary) ↔ 원시 토큰(hex) 2계층. i18n 텍스트 리소스 JSON 구조 병행 정의
- **참조**: W3C DTCG 스펙, Style Dictionary 문서
- **연관 모듈**: `studio/`, `templates/assets/tokens/`, `templates/assets/i18n/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 토큰 파이프라인 E2E

- **Given**: 샘플 tokens.json (DTCG 포맷)
- **When**: Style Dictionary 빌드 실행
- **Then**: Tailwind config에 토큰 값이 CSS 변수로 반영, React 앱에서 사용 가능
- **연관 SPEC**: spec-1-002, spec-1-003

### 시나리오 2: DESIGN.md 확장 포맷 유효성

- **Given**: 기존 awesome-design-md 파일 (예: stripe.md)
- **When**: 확장 Schema로 변환 시도
- **Then**: 기존 9섹션 그대로 + 확장 섹션(중간 언어, 페이지 명세) 추가 가능. 기존 정보 손실 없음
- **연관 SPEC**: spec-1-001

## 🔗 의존성

- **선행 phase**: 없음 (첫 번째 Phase)
- **외부 시스템**: 없음
- **연관 ADR**: ADR-001 (Phase 재구성)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Style Dictionary 설정 복잡도 | 파이프라인 구축 시간 증가 | 최소 설정으로 시작, 점진적 확장 |
| DESIGN.md 확장이 기존 포맷과 충돌 | 생태계 호환성 저하 | 확장은 별도 섹션으로 추가, 기존 섹션 수정 금지 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
