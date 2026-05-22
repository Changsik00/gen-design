# phase-5: PoC 검증 (End-to-End)

> Schema + Token + Page Template + Blueprint + 협업 Flow 전체 파이프라인을 실제 앱으로 검증한다.
> 동일 컴포넌트로 브랜딩만 바꿔 두 번째 앱을 만들어 재사용성을 증명한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-5` |
| **상태** | Done (2026-05-05) |
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
| `spec-5-01` | app-a-blueprint | P1 | Merged | `specs/spec-5-01-app-a-blueprint/` |
| `spec-5-02` | app-a-paper-design | P1 | Merged | `specs/spec-5-02-app-a-paper-design/` |
| `spec-5-03` | app-a-react-impl | P? | Merged | `specs/spec-5-03-app-a-react-impl/` |
| `spec-5-04` | app-b-reusability | P? | Merged | `specs/spec-5-04-app-b-reusability/` |
| `spec-5-05` | pipeline-retro | P? | Merged | `specs/spec-5-05-pipeline-retro/` |
<!-- sdd:specs:end -->

> **재구성 이력 (2026-04-26)**: 원안 spec-5-001 (앱 A 전 과정) 을 단일 PR 단위로 분할.
> Blueprint → Paper → React 의 3 단계로 spec-5-01/02/03 분리, 앱 B / 회고는 spec-5-04/05 로 이동.

### spec-5-01 — 앱 A Blueprint 응답 및 정의 산출물

- **요점**: Blueprint 질의서로 샘플 앱 A 를 정의하고 DESIGN.md + REQUIREMENTS.md 작성
- **방향성**: 로그인 / 회원가입 / 대시보드 / 마이페이지 포함 SaaS 앱. Phase 3 의 Blueprint 질의서를 따라 Page 카탈로그 / 공통 토큰 / i18n 키 정의.
- **산출물**: `poc/app-a/DESIGN.md`, `poc/app-a/REQUIREMENTS.md` (Page 별 variant / state / 데이터 모델 명세 포함)
- **검증 포인트**: Blueprint → DESIGN.md 변환의 누락 / 모호성 측정 (Phase 3 협업 Flow Stage 2 ~ 3 실측)
- **연관 모듈**: `poc/app-a/`

### spec-5-02 — 앱 A Paper 시안 + Settings 신설 + 원본 의도 보존 검증

- **요점**: spec-5-01 의 DESIGN.md 를 입력으로 Paper MCP 디자인 시안 생성 (5 페이지: Login / Signup / Dashboard / MyPage + **신설 Settings**) + 원본 의도 보존 사이클 검증
- **방향성**: 4 개 기존 페이지는 **AI 자동 생성** 으로 진행, **Settings 신설 페이지**는 Designer 가 직접 Paper 에서 그린 후 AI 추출 → 원본 의도 보존 측정. Settings 는 Toggle / Select / Slider / Section / Group list 등 다양한 입력·구성 컴포넌트로 토큰(spacing / radius / state color) 광폭 자극.
- **핵심 검증** (Phase 4 W2 부분 흡수):
  - **원본 의도 보존 검증 (최우선)** — Designer 가 직접 그린 Settings 를 AI 추출 DESIGN.md 와 대조. 의도 → 저장 → 복원 완전 사이클.
  - **새 페이지·컴포넌트·토큰 폭 확장** — 기존 4 페이지에서 부족한 form-heavy 컴포넌트군을 Settings 에서 한꺼번에 자극.
  - **DESIGN.md TODO(spec-5-02) 채우기** — 색 hex / 그림자값 / 정확한 size 단위.
- **산출물**: Paper artboard URL + `poc/app-a/design-extract/*.md` (5 페이지) + DESIGN.md Settings 섹션 보강 + drift 측정 결과 표
- **연관 모듈**: `poc/app-a/`, Paper MCP
- **Icebox 이전 결정 (2026-04-27)**: LoginPage variant 확장 / DashboardPage 왕복 drift — 사용자 방향 전환("기존 페이지 재활용 ❌, 새 페이지에서 검증") 에 따라 `backlog/queue.md` Icebox 로 보류. 추후 필요 시 spec-x 또는 phase-6 으로 승격.

### spec-5-03 — 앱 A React 구현 및 시각적 일치도 검증

- **요점**: spec-5-02 의 디자인 시안을 React 코드로 구현하고 시각적 일치도 검증
- **방향성**: Phase 2 Page Template 활용. 상호작용 state (hover / focus / disabled) 동기화 검증.
- **검증 포인트**: 디자인 시안 ↔ 렌더링 결과 시각 비교, 토큰 / i18n 적용 검증
- **산출물**: `poc/app-a/src/` (React 코드), 스크린샷 비교 표
- **연관 모듈**: `poc/app-a/`

### spec-5-04 — 앱 B 재사용성 검증

- **요점**: 앱 A 의 Page Template 을 토큰 + i18n 만 교체하여 다른 앱으로 변환
- **방향성**: 다른 브랜드 색상 + 다른 언어 (영어 → 한국어 등). 코드 변경 최소화 검증, 공유 코드 비율 80%+ 측정.
- **산출물**: `poc/app-b/` (별도 토큰 + i18n + 진입 페이지), 공유 비율 측정 보고
- **연관 모듈**: `poc/app-b/`

### spec-5-05 — 파이프라인 회고 및 개선 보고서

- **요점**: PoC 과정에서 발견된 병목·불편·개선점 문서화 → Phase 6 Studio v1 입력
- **방향성**: Foundation / Token / Page Template / Blueprint / 협업 Flow 각 단계별 피드백 + Phase 4 회고 부채 (W2 / W4 / C4 / A4) 재점검.
- **산출물**: `docs/poc-retro.md`
- **연관 모듈**: `docs/`

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 앱 A End-to-End

- **Given**: Blueprint 질의 응답 완료
- **When**: DESIGN.md 생성 → Paper 시안 → React 코드 생성
- **Then**: 로그인, 회원가입, 대시보드 화면이 정상 렌더링
- **연관 SPEC**: spec-5-01 → spec-5-02 → spec-5-03

### 시나리오 2: 토큰 교체 재사용

- **Given**: 앱 A의 코드베이스
- **When**: tokens.json + i18n JSON만 교체
- **Then**: 앱 B가 다른 브랜딩·언어로 정상 렌더링, 코드 변경 없음
- **연관 SPEC**: spec-5-04

## 🔗 의존성

- **선행 phase**: phase-4 (협업 Flow 정의)
- **외부 시스템**: Paper MCP

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| Paper MCP의 디자인 품질이 기대 이하 | 디자인↔코드 비교가 무의미 | 수동 보정 허용, 자동화율을 별도 측정 |
| 재사용성 80% 목표 미달 | Page Template 설계 재검토 필요 | 미달 원인 분석 → Phase 2 보완 스펙 생성 |

## 🏁 Phase Done 조건

- [x] 모든 SPEC 이 merge — 5/5 (spec-5-01 PR #19 / 5-02 PR #21 / 5-03 PR #22 / 5-04 PR #23 / 5-05 PR #24)
- [x] 통합 테스트 전 시나리오 PASS — 시나리오 1 (앱 A E2E): spec-5-01~03 전 과정 완주, 시나리오 2 (토큰 교체 재사용): spec-5-04 검증
- [x] 성공 기준 정량 측정 결과 — `poc/app-b/reuse-report.md` (87.1% 코드 재사용, 토큰 26% 변경, i18n 73 키 1:1)
- [x] 사용자 최종 승인 — 2026-05-05 (PR #24 머지 + `sdd phase done 5` 사용자 confirm)

## 📊 검증 결과 (phase 완료 시 작성)

### Success Criteria 검증

| # | 기준 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 앱 A: Blueprint → DESIGN.md → Paper 시안 → React 코드 전 과정 완료 | ✅ | `poc/app-a/{REQUIREMENTS,DESIGN,AGENT}.md`, `poc/app-a/design-extract/*.md` (5), `poc/app-a/src/` (6 라우트) |
| 2 | 앱 B: 동일 구조 + 토큰/i18n 만 교체로 다른 브랜딩·언어 렌더링 | ✅ | `poc/app-b/` (FlowDesk / 플로우데스크), `poc/app-b/reuse-report.md` §3 |
| 3 | 앱 A↔B 공유 코드 비율 80%+ | ✅ | `poc/app-b/reuse-report.md` §1.3 — 코드만 87.1% / 데이터 포함 79.8% |
| 4 | 디자인 시안 ↔ React 시각 일치도 검증 | ⚠️ PASS (제한적) | `poc/app-a/visual-comparison.md` — 6 페이지 중 5 페이지 ⚠️ 부분일치 (Sidebar 16px / page bg / brand panel / MyPage 2col→1col / SettingsGroup Card wrapper drift). 자동 visual regression 부재. **phase-6 의 측정 정의 객관화 필요** |
| 5 | 협업 Flow 전 단계 실행 완료 (디자인→추출→생성→리뷰→수정→승인) | ⚠️ partial | Stage 3 (Blueprint, spec-5-01) + Stage 4 (Compose, spec-5-02/03) 흡수 측정. Stage 5 (review) / Stage 6 (handoff) 미측정 → phase-7 보존 (`docs/poc-retro.md` §4.4) |
| 6 | 파이프라인 개선 포인트 목록 작성 (→ Phase 6 입력) | ✅ | `docs/poc-retro.md` §3 — 8 todo (TODO-01~08) + ROI 우선순위 |

### 통합 테스트 시나리오 결과

| # | 시나리오 | 결과 | 증거 |
|:---:|---|:---:|---|
| 1 | 앱 A End-to-End (Blueprint 응답 → DESIGN.md → Paper → React) | ✅ PASS | spec-5-01 ~ spec-5-03 모두 Merged. studio 115 + app-a 5 tests PASS. visual-comparison 정성 표 작성 |
| 2 | 토큰 교체 재사용 (앱 A 코드 → tokens.json + i18n JSON 교체 → 앱 B) | ✅ PASS | spec-5-04 Merged. `poc/app-b/` 6 라우트 모두 한국어 + emerald primary 렌더링. studio 코드 변경 0 |

### Stats

- **Files changed**: 145 (5 spec 누적)
- **Lines**: +12,500 / -800 (대부분 신규 — studio 컴포넌트 12, app-a/b 페이지 12, design-extract 5, 회고 1)
- **Test suites**: 32 (studio 30 + app-a 1 + app-b 1) — 125 checks total (115 + 5 + 5)
- **Specs**: 5 / 5 완료, 0 이연
- **Commits to main (first-parent)**: 11 (5 spec PR merges + 6 chore syncs)

### 회고 / Follow-up

전체 회고: `docs/poc-retro.md` (357 줄, 4 섹션 + 인용 인덱스)
- §2 카탈로그 12 항목 (P1 5 / P2 4 / P3 3)
- §3 phase-6 todo 8 개 (TODO-01 ~ TODO-08)
- §4 phase-4 부채 평결 (W4/C4 absorbed, W2 partial, A4 open)

추가 비판적 감사 (2026-05-05, 독립 Opus 감사자): Critical 6 + Warning 8 + Blind Spot 10 발견. 주요 결과:
- 회고 카탈로그의 hardcode 가 2 건이 아니라 **4 건** (DashboardPage `appName="Admin"`, VariantWrapper `triggerLabel="Open"` 추가)
- F-09 (DESIGN.md §12 9 composite) 가 spec-5-03 첫 task 약속이었으나 *조용히 누락* → DESIGN.md §12 가 SSOT 역할 부분 실패
- spec-5-05 자체가 §5.3 (Premature Execution) Zero Tolerance 위반의 산물 (본문 7 commit 후 spec/plan/task retroactive 추가)
- 본 phase done 직전에 phase-ship.md 템플릿 미사용 → 본 갱신으로 사후 보강

Phase-6 시작 전 처리 완료 항목 (이번 갱신 시점):
1. **A4** 본 phase-5.md Phase Done 4 체크박스 + 검증 결과 (이 commit)
2. **A5** queue.md phase-5 행 정정 (다음 commit)
3. **A2** docs/poc-retro.md §2 카탈로그 hardcode 4 건으로 갱신 (다음 commit)
4. **A6** phase-6.md success criteria 갱신 (다음 commit)
5. **A3** F-09 9 composite 누락을 phase-6 입력 메모로 명시 (다음 commit)
