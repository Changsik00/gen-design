# phase-5: PoC 검증 (End-to-End)

> Schema + Token + Page Template + Blueprint + 협업 Flow 전체 파이프라인을 실제 앱으로 검증한다.
> 동일 컴포넌트로 브랜딩만 바꿔 두 번째 앱을 만들어 재사용성을 증명한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-5` |
| **상태** | Planning |
| **시작일** | TBD |
| **목표 종료일** | TBD |
| **소유자** | Dennis |
| **Base Branch** | 없음 |

## 🎯 배경 및 목표

### 현재 상황

Phase 1~4에서 Foundation, Page Template, Blueprint, 협업 Flow가 완성되면, 이것이 실제로 동작하는지 end-to-end 검증이 필요하다. 특히 "토큰만 바꾸면 브랜딩이, i18n만 바꾸면 언어가 바뀐다"는 핵심 가설을 실증해야 한다.

### 목표 (Goal)

1. Blueprint 질의서로 샘플 앱 A를 정의하고, DESIGN.md → 디자인 시안(Paper) → React 코드까지 생성
2. 동일 Page Template에 토큰/i18n만 교체하여 앱 B를 생성하여 재사용성 증명
3. 협업 Flow 프로토콜을 실제로 실행하여 유효성 검증
4. 파이프라인의 병목과 개선점을 문서화

### 성공 기준 (Success Criteria) — 정량 우선

1. 앱 A: Blueprint → DESIGN.md → Paper 시안 → React 코드 전 과정 완료
2. 앱 B: 앱 A와 동일 구조, 토큰/i18n만 교체하여 다른 브랜딩·언어로 렌더링
3. 앱 A↔B 간 공유 코드 비율 80% 이상
4. 디자인 시안 ↔ React 코드 시각적 일치도 검증
5. 협업 Flow 전 단계 실행 완료 (디자인→추출→생성→리뷰→수정→승인)
6. 파이프라인 개선 포인트 목록 작성 (→ Phase 6 입력)

## 🧩 작업 단위 (SPECs)

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
<!-- sdd:specs:end -->

### spec-5-001 — 앱 A 정의 및 산출물 생성

- **요점**: Blueprint로 샘플 앱 정의 → DESIGN.md + REQUIREMENTS.md 생성
- **방향성**: 로그인/회원가입/대시보드/마이페이지 포함 SaaS 앱. Paper MCP로 디자인 시안, React 코드 생성. 협업 Flow 전 단계 실행
- **연관 모듈**: `poc/app-a/`

### spec-5-002 — 앱 B (재사용성 검증)

- **요점**: 앱 A의 Page Template을 토큰/i18n만 교체하여 다른 앱으로 변환
- **방향성**: 다른 브랜드 색상, 다른 언어(영어→한국어 등). 코드 변경 최소화 검증
- **연관 모듈**: `poc/app-b/`

### spec-5-003 — 파이프라인 회고 및 개선 보고서

- **요점**: PoC 과정에서 발견된 병목·불편·개선점 문서화
- **방향성**: Foundation/Token/Page Template/Blueprint/협업 Flow 각 단계별 피드백. Studio v1 요구사항 도출
- **연관 모듈**: `docs/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 앱 A End-to-End

- **Given**: Blueprint 질의 응답 완료
- **When**: DESIGN.md 생성 → Paper 시안 → React 코드 생성
- **Then**: 로그인, 회원가입, 대시보드 화면이 정상 렌더링
- **연관 SPEC**: spec-5-001

### 시나리오 2: 토큰 교체 재사용

- **Given**: 앱 A의 코드베이스
- **When**: tokens.json + i18n JSON만 교체
- **Then**: 앱 B가 다른 브랜딩·언어로 정상 렌더링, 코드 변경 없음
- **연관 SPEC**: spec-5-002

## 🔗 의존성

- **선행 phase**: phase-4 (협업 Flow 정의)
- **외부 시스템**: Paper MCP

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Paper MCP의 디자인 품질이 기대 이하 | 디자인↔코드 비교가 무의미 | 수동 보정 허용, 자동화율을 별도 측정 |
| 재사용성 80% 목표 미달 | Page Template 설계 재검토 필요 | 미달 원인 분석 → Phase 2 보완 스펙 생성 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge
- [ ] 통합 테스트 전 시나리오 PASS
- [ ] 성공 기준 정량 측정 결과
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)
