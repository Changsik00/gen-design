# phase-6: Studio v1

> DESIGN.md 및 프로젝트 산출물 생성을 돕는 React 기반 웹앱.
> Studio 자체가 이 디자인 시스템을 사용하는 개밥먹기(dogfooding) 프로젝트.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-6` |
| **상태** | Planning |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

Phase 5 PoC에서 전체 파이프라인이 검증되면, 이 과정을 사람이 쉽게 사용할 수 있는 웹 UI로 제공해야 한다. Studio 자체가 Phase 2의 Page Template과 컴포넌트를 사용함으로써 시스템의 성숙도를 높인다.

### 목표 (Goal)

Blueprint 질의서, DESIGN.md 편집, 디자인 토큰 편집, 미리보기 기능을 제공하는 React 웹앱을 만든다. Studio의 UI는 우리 컴포넌트 라이브러리로 구축하여 dogfooding한다.

### 성공 기준 (Success Criteria) — 정량 우선

1. Blueprint 질의서 UI — 질문→응답→REQUIREMENTS.md 생성
2. DESIGN.md 편집 UI — Schema 섹션별 폼 입력 + 마크다운 미리보기
3. 디자인 토큰 편집기 — 색상 피커, 타이포 설정, 실시간 미리보기
4. Studio UI가 자체 컴포넌트 라이브러리로 구성 (dogfooding 비율 90%+)
5. 산출물 내보내기: DESIGN.md + REQUIREMENTS.md + AGENT.md + assets/ 번들

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
<!-- sdd:specs:end -->

### spec-6-001 — Studio 앱 셋업 (dogfooding)

- **요점**: 자체 컴포넌트 라이브러리 기반 Studio 앱 초기 구조
- **방향성**: Phase 1에서 셋업한 프로젝트 확장. 자체 DESIGN.md 작성(dogfooding). 라우팅, 레이아웃 구성
- **연관 모듈**: `studio/`

### spec-6-002 — Blueprint 질의서 UI

- **요점**: 구조화된 질의서를 웹 폼으로 제공
- **방향성**: Step-by-step 위저드 UI. 앱유형→페이지→variant 선택. 결과를 REQUIREMENTS.md로 내보내기
- **연관 모듈**: `studio/src/features/blueprint/`

### spec-6-003 — DESIGN.md 편집기

- **요점**: Schema 섹션별 폼 입력 + 마크다운 미리보기
- **방향성**: 각 섹션(색상, 타이포, 컴포넌트 등)을 구조화된 폼으로 입력. 실시간 DESIGN.md 미리보기
- **연관 모듈**: `studio/src/features/editor/`

### spec-6-004 — 토큰 편집기 + 미리보기

- **요점**: 디자인 토큰 시각적 편집 + 컴포넌트 실시간 미리보기
- **방향성**: 색상 피커, 타이포 슬라이더, 간격/반경 조절. 변경 시 컴포넌트 미리보기 실시간 반영
- **연관 모듈**: `studio/src/features/tokens/`

### spec-6-005 — 산출물 내보내기

- **요점**: 편집 결과를 프로젝트 파일 세트로 내보내기
- **방향성**: DESIGN.md + REQUIREMENTS.md + AGENT.md + assets/ (tokens.json, i18n/, images/) ZIP 다운로드 또는 디렉토리 생성
- **연관 모듈**: `studio/src/features/export/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: Blueprint → 내보내기 E2E

- **Given**: Studio에서 Blueprint 질의 시작
- **When**: 모든 질의 응답 → DESIGN.md 편집 → 토큰 조정 → 내보내기
- **Then**: 완성된 프로젝트 파일 세트가 유효한 Schema를 따름
- **연관 SPEC**: 전체

## 🔗 의존성

- **선행 phase**: phase-5 (PoC — 파이프라인 피드백 반영)
- **외부 시스템**: 없음
- **연관 ADR**: ADR-002 (Headless UI 선택)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Dogfooding 중 컴포넌트 부족 발견 | Studio 개발 지연 | Phase 2 보완 스펙으로 피드백 루프 |
| 에디터 UX 복잡도 | 사용성 저하 | MVP 우선, 반복 개선 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
