# Task List: spec-5-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> phase-4 W4 부채 (Task 통합 위반) 의 직접적 후속 — 본 spec 도 엄격 준수.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 + 디렉토리 생성 (`sdd spec new pipeline-retro`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (자동)
- [x] 사용자 Plan Accept (`/hk-plan-accept`) — 2026-05-05

---

## Task 1: 입력 인용 인덱스 작성

본 task 는 회고 본문에 들어갈 모든 인용의 실재 여부를 미리 검증한다. `docs/poc-retro.md` 를 시드로 작성하되 **§0 메타 + §1 단계별 회고 표 머리만** 채운다.

- [x] phase-5 의 4 spec walkthrough + 부속 문서 (`drift-report.md`, `paper-normalizer-functions.md`, `visual-comparison.md`, `reuse-report.md`) 모두 read
- [x] phase-4 부채 4 항목 (W2/W4/C4/A4) 의 원본 정의 read (`backlog/queue.md`)
- [x] `docs/poc-retro.md` 신규 — §0 메타 + §1 표 머리 + 인용 인덱스 부록 (어떤 spec 의 어떤 파일에서 어떤 사실을 인용하는지 1 행씩)
- [x] Commit: `docs(spec-5-05): seed poc-retro skeleton with citation index`

---

## Task 2: §1 단계별 회고 표 작성

5 단계 (Foundation / Token / Page Template / Blueprint / 협업 Flow) 의 "잘된 점 / 깨진 점 / 다음 액션" 컬럼 채움.

- [x] Foundation: pnpm workspace + vite alias array + 토큰 파이프라인 (spec-5-03 의 vite.config alias 패턴 등)
- [x] Token: tokens.json → CSS 변수 → React 자동, color-only 변경으로 새 제품 부팅 (spec-5-04)
- [x] Page Template: 12 composites + 3 templates, `texts` props pattern 으로 i18n 격리, hardcode 2 건 누수 (spec-5-04)
- [x] Blueprint: spec-5-01 의 DESIGN.md 14 섹션 schema, REQUIREMENTS.md 페이지 카탈로그
- [x] 협업 Flow: Paper ↔ DESIGN.md 수동 transcribe, Paper → React 단방향 자동, 양방향 미구현
- [x] Commit: `docs(spec-5-05): write stage-by-stage retro table`

---

## Task 3: §2 발견사항 카탈로그 작성

phase-5 의 모든 hardcode / drift / gap / duplication 을 표로. 출처 + 위치 + 영향 + 권장 + 우선순위 컬럼.

- [x] grep 으로 phase-5 산출물 훑어 시드 카탈로그 (plan.md 시드) 보강
- [x] 각 항목에 출처 (파일:라인 or 영역) 명시
- [x] 영향 (사용자 / 시스템) 1 줄
- [x] 권장 액션 1 줄
- [x] 우선순위 (P1/P2/P3) + 1 줄 근거
- [x] 12 항목 (P1 5 / P2 4 / P3 3)
- [x] Commit: `docs(spec-5-05): catalog hardcode/drift/gap findings from phase-5`

---

## Task 4: §3 phase-6 todo 리스트

§2 의 권장 액션을 phase-6 단위 작업으로 묶고 ROI 추정.

- [x] §2 의 권장을 묶어 todo 8 개 (TODO-01 ~ TODO-08)
- [x] 각 todo: 동기 / 예상 산출물 / 예상 spec 수 / 의존성 / ROI 우선순위 권장 (P1/P2/P3 + 1 줄 근거)
- [x] todo 간 의존 관계 명시 (mermaid 다이어그램)
- [x] Commit: `docs(spec-5-05): write phase-6 todo list with roi prioritization`

---

## Task 5: §4 phase-4 부채 평결

W2/W4/C4/A4 각 항목에 phase-5 결과로 평결.

- [x] W2 (6 단계 프로토콜 4 단계 미실측) — partial (Stage 3/4 흡수, Stage 5/6 잔여)
- [x] W4 (One Task = One Commit 위반) — absorbed (58 commit 분리)
- [x] C4 (phase-ship.md 템플릿 부재) — absorbed (harness-kit 0.6.2 추가)
- [x] A4 (critique 미실행) — open (phase-6 강제 메커니즘 필요)
- [x] Commit: `docs(spec-5-05): adjudicate phase-4 retrospective debts`

---

## Task 6: 정합성 검증

- [-] `wc -l docs/poc-retro.md` — 357 (NF 800~1500 미달, 정직 보고 — walkthrough §4 에 기록)
- [x] 카탈로그 항목 5 개 무작위 spot-check — 5/5 PASS (C-05 path 정정 후, fix commit 1 건)
- [x] §1 컬럼 행 수 균형 (각 5 행 — 1 헤더 + 1 separator + 3 데이터)
- [x] phase-6 todo 모두 ROI 근거 1 줄 보유 (8/8)
- [x] phase-4 부채 4 항목 모두 평결
- [x] Commit: `fix(spec-5-05): correct sidebar path in catalog C-05` (검증 중 발견 — 별도 fix commit)

---

## Task 7: Ship

- [x] **walkthrough.md** + **pr_description.md** 작성
- [ ] Ship commit
- [ ] Push (사용자 confirm 1 회)
- [ ] `gh pr create --base main`
- [ ] PR URL 보고

---

## Task 8: phase-5 종료 처리 (Post-Merge)

> 사용자 머지 확인 후

- [ ] `git checkout main && git pull --ff-only`
- [ ] 브랜치 삭제 (local + remote)
- [ ] `sdd ship` (spec-5-05 → Merged)
- [ ] backlog sync commit + push
- [ ] `sdd phase done 5` — phase-5 종료 (success criteria 4/4 충족)
- [ ] phase-6 alignment 시작 안내

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 6 (Task 1~5 + Ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-05 |
