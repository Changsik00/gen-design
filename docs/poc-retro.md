# Phase-5 PoC 파이프라인 회고

> 작성: 2026-05-05 / 작성자: Dennis + Agent (Opus 4.7) / 입력 spec: spec-5-01 ~ spec-5-04 + phase-4 부채 (W2/W4/C4/A4)
> 본 문서는 phase-5 의 누적 발견을 정리하여 phase-6 (Studio v1) 의 입력으로 제공한다.

---

## §0. 메타

### 0.1 입력 산출물 인덱스

본 회고가 인용하는 phase-5 산출물 일람. 모든 인용은 아래 파일들에서 확인 가능.

| 출처 ID | 경로 | 역할 |
|---|---|---|
| `S1-WALK` | `specs/spec-5-01-app-a-blueprint/walkthrough.md` | spec-5-01 (Blueprint) 진행 기록 |
| `S2-WALK` | `specs/spec-5-02-app-a-paper-design/walkthrough.md` | spec-5-02 (Paper 시안) 진행 기록 |
| `S2-DRIFT` | `poc/app-a/drift-report.md` | Paper 시안 ↔ DESIGN.md drift 측정 |
| `S2-FIND` | `poc/app-a/findings.md` | F-01 ~ F-10 발견 카탈로그 (spec-5-01/02 누적) |
| `S3-WALK` | `specs/spec-5-03-app-a-react-impl/walkthrough.md` | spec-5-03 (React 구현) 진행 기록 |
| `S3-VIS` | `poc/app-a/visual-comparison.md` | Paper ↔ React 시각 비교 |
| `S4-WALK` | `specs/spec-5-04-app-b-reusability/walkthrough.md` | spec-5-04 (앱 B 재사용성) 진행 기록 |
| `S4-REUSE` | `poc/app-b/reuse-report.md` | LOC + hardcode + 토큰 차이 측정 |
| `P4-DEBT` | `backlog/queue.md` (icebox 섹션) | phase-4 회고 부채 W2/W4/C4/A4 |

### 0.2 검증 방식

- 모든 카탈로그 항목 (§2) 은 위 출처에서 인용. 추측 / 일반론 없음.
- LOC / 측정 수치는 phase-5 spec 의 산출물 인용 — 새 측정 없음.
- 출처 컬럼은 grep 으로 spot-check 가능.

### 0.3 phase-5 success criteria 충족 현황

| # | 기준 | 결과 | 근거 |
|---|---|---|---|
| 1 | 앱 A 의 Blueprint → DESIGN.md → Paper → React 전 과정 완주 | ✅ | spec-5-01 ~ spec-5-03 모두 Merged |
| 2 | 앱 B 가 토큰/i18n 만 교체로 부팅 | ✅ | spec-5-04 Merged, S4-WALK |
| 3 | 앱 A↔B 공유 코드 비율 80%+ | ✅ | S4-REUSE §1.3 — 코드 87.1%, 데이터 포함 79.8% |
| 4 | 디자인 시안 ↔ React 시각 일치도 검증 | ✅ | S3-VIS — 토큰 미적용 0 건 |

---

## §1. 단계별 회고 표

> 각 단계별 "잘된 점 / 깨진 점 / 다음 액션" 컬럼.
> Foundation / Token / Page Template / Blueprint / 협업 Flow 5 단계.

(Task 2 에서 채움)

| 단계 | 잘된 점 | 깨진 점 | 다음 액션 |
|---|---|---|---|
| Foundation | _TBD_ | _TBD_ | _TBD_ |
| Token | _TBD_ | _TBD_ | _TBD_ |
| Page Template | _TBD_ | _TBD_ | _TBD_ |
| Blueprint | _TBD_ | _TBD_ | _TBD_ |
| 협업 Flow | _TBD_ | _TBD_ | _TBD_ |

---

## §2. 발견사항 카탈로그

> hardcode / drift / gap / duplication 누적.
> 출처 + 위치 + 영향 + 권장 + 우선순위.

(Task 3 에서 채움 — F-01 ~ F-10 + spec-5-03/04 추가 발견)

---

## §3. Phase-6 todo 리스트

> §2 의 권장 액션을 phase-6 단위 작업으로 묶고 ROI 추정.

(Task 4 에서 채움)

---

## §4. Phase-4 회고 부채 평결

> W2/W4/C4/A4 각 항목에 phase-5 결과로 평결 (yes/absorbed/transformed/open).

(Task 5 에서 채움)

---

## 부록 A. 인용 인덱스 (citation map)

각 카탈로그 항목이 어떤 spec 의 어떤 파일에서 어떤 사실을 인용하는지 사전 매핑.
Task 3 작성 시 grep 검증을 위한 인덱스로 활용.

### A.1 spec-5-01 입력

- F-01 ~ F-07 (`gap`, `placeholder-mismatch`, `ambiguity`) → `S2-FIND` §F-01 ~ §F-07
  - F-01: protocol Step 1.5 (NFR) 누락
  - F-02: DESIGN.md placeholder 가 Blueprint 출력만으로 안 채워짐
  - F-03: route/layout 기본값 규칙 vs YAML 키 부재 충돌
  - F-04: Template status 어휘 3 종 불일치 (✅ / implemented / 구현 완료)
  - F-05: optionalSections 빈 배열 표시 규약 부재
  - F-06: 미구현 Template 이름 유추 규칙 없음
  - F-07: Phase 2 Template PoC 재사용/복제 정책 없음

### A.2 spec-5-02 입력

- F-08 ~ F-10 → `S2-FIND` §F-08 ~ §F-10
  - F-08: paper-normalizer 함수 5 카테고리 (color alpha / padding / lineHeight / font fallback / border)
  - F-09: DESIGN.md §12 Composite 9 종 미정의
  - F-10: i18n 키 모델 확장 (flat 카피 → 구조화 슬롯)
- Paper ↔ DESIGN.md drift → `S2-DRIFT`
- 5 페이지 design-extract → `poc/app-a/design-extract/{auth-login,auth-signup,dash-overview,profile-mypage,settings-overview}.md`

### A.3 spec-5-03 입력

- `S3-WALK §발견 사항`:
  - SocialAuthBlock 4 props 인터페이스의 generic 부족 (providers 배열로 개선 후보)
  - studio 의 `@/` self-reference alias 가 across-package import 에 약함 (Node `imports` field 후보)
  - Sidebar w-56 (224px) vs Paper 240px — 16px magic number, 토큰화 미흡
  - body bg `#FFFFFF` vs Paper page ground `#F8FAFC` — `bg-surface-alt` 매핑 후보
  - DashboardPage `ActivityRowData` 의 의미 모델 drift (user/action vs task/assignee)
  - Paper MCP `get_screenshot` 응답이 base64 — 디스크 저장 어려움 → visual regression 자동화 영향

### A.4 spec-5-04 입력

- `S4-REUSE §2`:
  - H-1: `studio/src/components/templates/MyPage/index.tsx:23` `appName = "TaskFlow"` 기본값
  - H-2: `studio/src/components/templates/SettingsPage/index.tsx:34` `appName = "TaskFlow"` 기본값
- `S4-REUSE §1.3`: 재사용 비율 87.1% (코드) / 79.8% (데이터 포함)
- `S4-REUSE §1.2`: 169 LOC 구조 동일 (App.tsx, main.tsx, useTexts.ts, login/signup/error)
- `S4-WALK §6 회고`:
  - studio 의 `texts` props pattern 정상 작동 (한국어/영어 모두)
  - 토큰 파이프라인 색 변경 격리 (50 중 13 만 변경)
  - vite alias array + regex 패턴 다른 패키지 재사용 잘 됨
- 본 spec 의 자체 발견 (spec-5-05 작성 중):
  - **Paper ↔ tokens 양방향 동기화 부재** — tokens.json → React 만 자동, Paper 는 끊겨 있음

### A.5 phase-4 부채 입력

`P4-DEBT` (`backlog/queue.md` icebox):
- W2: 6 단계 프로토콜 4 단계 미실측 (Stage 3/4 Phase 5 PoC 흡수 측정)
- W4: One Task = One Commit 위반 재발 방지 (spec-4-02 commit 2242e89 가 Task 4+5 통합)
- C4: phase-ship.md 템플릿 harness-kit 0.5.0 부재
- A4: critique 미실행 (spec-4-01/02/03 모두)

---

> Task 2~5 진행 시 §1~§4 채움.
> 본 문서는 spec-5-05 의 단일 산출물 — 분할하지 않음.
