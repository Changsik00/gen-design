# Walkthrough: spec-5-01

> Blueprint 질의서를 실제로 가동하여 샘플 SaaS 앱 (TaskFlow) 의 정의 산출물 4 종 (`blueprint-session.md`, `REQUIREMENTS.md`, `DESIGN.md`, `AGENT.md`) + 회고 자료 (`findings.md`) 를 작성한 작업 기록.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Phase 5 spec 구성이 단일 PR 단위로 과대 (원안 spec-5-001 = Blueprint + Paper + React 전 과정) | (A) 현행 유지 (B) 5 spec 으로 분할 | (B) 5 spec 분할 | constitution §5.1 "One Spec = One PR" 준수 + spec-4-03 회고 W4 (Task 통합 유혹) 학습 반영. spec-5-01/02/03/04/05 로 재구성 |
| 첫 spec 의 슬러그 | `app-a-blueprint` / `app-a-poc` / `app-a-end-to-end` | `app-a-blueprint` | 분할된 범위 (Blueprint 단계만) 와 일치하는 가장 좁은 표현 |
| 앱 A 컨셉 | 사용자에게 직접 입력 받음 / agent 가 1 안 제안 | agent 1 안 제안 (TaskFlow / SaaS / 인디고+청록) | spec.md 작성 효율 + Plan Accept 단계에서 사용자가 수정 가능 |
| 페이지 구성 | 추천 9 종 그대로 / 5 종 축소 | 5 종 (login / signup / dashboard / mypage / error) | spec.md 명시 5 종 + spec-4-02 의 LoginPage 단일 한계 보완을 위해 다양성 확보. 단순화는 Phase 5 PoC 가설 검증 목표와 일치 |
| DESIGN.md 의 Visual 정확값 (hex / shadow 등) | 임의 값으로 채움 / TODO 마커 | TODO(spec-5-02) 마커 | Phase 4 회고 W2 "Blueprint vs Compose 측정 분리" 부채 반영. 시각 디자인은 Paper 추출 단계에서 채움이 정공법 |
| 발견한 결함 / 모호성 | 즉시 수정 / 기록만 | 기록만 (findings.md) | 본 spec 범위 보호. 수정은 spec-5-05 회고 또는 phase-6 일괄 처리 (Idea Capture Gate 정신) |
| Pre-flight 산출물 commit 분리 | 단일 scaffold commit / 산출물별 분리 | 단일 scaffold commit | spec-4-03 의 `7b6a355 docs(spec-4-03): scaffold spec/plan/task and reactivate phase-4` 컨벤션 일치 |

## 💬 사용자 협의

- **주제**: phase-5 시작 시 선행 정리 범위
  - 사용자 의견: `.gitignore` 중복 + queue.md 마커 불일치 정리 후 phase-5 진입
  - 합의: `.gitignore` 원복 (Icebox 의 harness-kit follow-up 으로 분리), `sdd phase done phase-4` 실행했으나 idempotent 미준수로 원복 후 수동 마커 갱신
- **주제**: phase-5 spec 재구성
  - 사용자 의견: 옵션 A (5 spec 분할) 채택
  - 합의: spec-5-01/02/03/04/05 로 재구성. phase-5.md 본문 + sdd:specs 마커 갱신
- **주제**: spec-5-01 의 슬러그 선택
  - 사용자 의견: `app-a-blueprint`
  - 합의: 좁은 범위 (Blueprint 단계만) 시그널 → phase-5.md spec 표 + spec 디렉토리 / 브랜치 명에 반영
- **주제**: Plan Accept
  - 사용자 의견: "1" → Plan Accept
  - 합의: Strict Loop 진입, 8 task 순차 진행

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: 해당 없음 — 본 spec 은 코드 산출물이 없는 문서 PoC 이므로 단위 테스트 부재 (plan.md §"검증 계획" 참조)
- **결과**: N/A

#### 통합 테스트
- **결과**: N/A — Integration Test Required = no. Phase 통합 테스트 시나리오 1 의 첫 단계로서 후속 spec 에서 누적 검증 예정

### 2. 수동 검증 (Task 7 자기검증 체크리스트)

1. **Action**: `grep -c '{{' poc/app-a/REQUIREMENTS.md poc/app-a/DESIGN.md poc/app-a/AGENT.md poc/app-a/blueprint-session.md`
   - **Result**: 모두 0. findings.md 의 6 개는 placeholder 예시 (`{{...}}` 형식 자체에 대한 설명) 로 의도적
2. **Action**: 4 종 산출물의 Page ID 와 `schema/page-catalog.md` 대조
   - **Result**: REQUIREMENTS / DESIGN / AGENT 의 5 종 (auth-login / auth-signup / dash-overview / profile-mypage / common-error) 모두 카탈로그 존재. blueprint-session 의 추가 5 종 (제거 후보) 도 모두 카탈로그 존재
3. **Action**: DESIGN.md i18n 키 카운트 — `grep -cE '^\| \`(login|signup|dashboard|mypage|error|nav|app|auth)\.' poc/app-a/DESIGN.md`
   - **Result**: 47 키 (5 페이지 + nav + app + auth 네임스페이스 모두 커버)
4. **Action**: DESIGN.md 토큰 표기 규약 확인 — `grep -cE '\-\-(color|font|space|radius)' poc/app-a/DESIGN.md`
   - **Result**: 35 회 CSS 변수 참조. Phase 1 컨벤션 (`tokens.json → _tokens-*.css → Tailwind`) 일치. 정확 hex 는 의도적 TODO(spec-5-02)
5. **Action**: findings.md 항목 수 확인
   - **Result**: 7 항목 (gap 3 / placeholder-mismatch 2 / ambiguity 2). 최소 3 항목 요구 충족
6. **Action**: 4 종 산출물 상호 일관성 시각 검토 (페이지 / 토큰 / i18n 키 표기)
   - **Result**: 동일 페이지 ID / 동일 i18n 키 네임스페이스 일관 사용. drift 0

## 🔍 발견 사항

본 spec 의 핵심 산출물 중 하나인 `findings.md` 자체가 발견 사항의 정식 등재처. 7 항목 등재.

추가로 본 spec 진행 중 발견한 메타 항목 (findings 미등재):

- **`sdd phase done` idempotent 미준수**: 두 번 실행하면 done 섹션에 중복 행이 추가됨. harness-kit 0.6.0 한계 — harness-kit upstream 이슈 후보
- **`sdd spec new` 의 marker append 동작**: 짧은 ID (`spec-5-01`) 가 phase 파일 본문 (예: 섹션 헤더) 에 이미 등장하면 marker 표에 행이 append 되지 않음. spec.md 본문 / 섹션 헤더와 marker 표를 같은 grep 으로 검사하는 한계

## 🚧 이월 항목

- DESIGN.md 의 정확 hex / shadow / size 값 → spec-5-02 (Paper 추출)
- tokens.json + i18n/en.json 작성 → spec-5-03 (React 구현)
- MyPage / ErrorPage Composite + Template 정의 → spec-5-03
- findings.md 의 7 항목 처리 → spec-5-05 (회고) 및 phase-6 (Studio v1)
- harness-kit upstream 이슈 (sdd phase done idempotent / sdd spec new marker) → 별도 spec-x 또는 harness-kit 본가 PR

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Claude Opus 4.7) + Dennis |
| **작성 기간** | 2026-04-26 (단일 세션) |
| **최종 commit** | `c6f39eb` (findings 등재) |
| **본 spec 의 commit 수** | 7 (scaffold + chore + 5 docs) — One Task = One Commit 준수 |
