# Task List: spec-11-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-11.md SPEC 표 자동 갱신됨)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1.
- [ ] `git checkout -b spec-11-04-dogfooding-alpha`

---

## Task 2: zero state scaffold (실 명령) — `experiments/dogfood-alpha/` 생성

### 2-1.
- [ ] `node packages/create-gd-react/dist/cli.js dogfood-alpha --offline --no-install` 을 임시 디렉토리에서 실행
- [ ] 결과 디렉토리를 `experiments/dogfood-alpha/` 로 복사
- [ ] 시간 측정 + 명령 횟수 기록 (보고서 §1 정량 표 입력)
- [ ] `.gitignore` 가 node_modules/dist 자동 제외하는지 확인
- [ ] Commit: `chore(spec-11-04): scaffold dogfood-alpha as experiments dir`

---

## Task 3: `/gd-start` 시뮬레이션 — memory entries 채움

### 3-1.
- [ ] `experiments/dogfood-alpha/.gd/memory/designer.md` 본문 — *디자이너 페르소나 표준 답변* append
- [ ] `experiments/dogfood-alpha/.gd/memory/project.md` 본문 — *프로젝트 페르소나 표준 답변* append
- [ ] 본 simulation 의 단계별 시간 / 막힘 / 헷갈림 기록 (메모)
- [ ] Commit: `feat(spec-11-04): populate .gd/memory via gd-start simulation`

---

## Task 4: `/gd-chat` 시뮬레이션 — login.chat.md 작성

### 4-1.
- [ ] `experiments/dogfood-alpha/chats/scenes/login.chat.md` 작성
  - frontmatter (type/name/identity/shell.inherit/created)
  - Narrative (의도) — 디자이너 페르소나의 *왜* 답변
  - Structure (카탈로그 어휘 — Card + Form + Input + Label + Button + i18n placeholder)
  - History (첫 작성 한 줄)
- [ ] 작성 중 막힘 기록
- [ ] Commit: `feat(spec-11-04): write login.chat.md via gd-chat simulation`

---

## Task 5: `gd react` — TSX 생성 (실 명령)

### 5-1.
- [ ] `pnpm --filter studio exec tsx scripts/gen-design.ts react login --chat-root experiments/dogfood-alpha/chats --output experiments/dogfood-alpha/src/scenes/login.tsx` 실행
- [ ] 생성 TSX 확인 (`// @gd:` annotation + 컴파일 결과)
- [ ] 시간 측정 / 에러 확인
- [ ] Commit: `feat(spec-11-04): compile login.tsx via gd react`

---

## Task 6: `gd doctor` — 정합 검증 (실 명령)

### 6-1.
- [ ] `pnpm --filter studio exec tsx scripts/gen-design.ts doctor --chat-root experiments/dogfood-alpha/chats --templates-root experiments/dogfood-alpha/templates` 실행
- [ ] 결과 캡처 (PASS 또는 진단 목록)
- [ ] 진단이 *친절한 한국어 + 해결 명령* 인지 확인
- [ ] 막힘 / 모호 항목 기록
- [ ] Commit: `chore(spec-11-04): run gd doctor against dogfood-alpha`

---

## Task 7: 보고서 작성 — `experiments/dogfooding-alpha-2026-05.md`

### 7-1.
- [ ] §0 Disclaimer (편향 인지)
- [ ] §1 정량 측정 표 (단계별 시간 / 명령 횟수 / 에러)
- [ ] §2 단계별 정성 기록 (5 단계)
- [ ] §3 발견 사항:
  - 3.1 진짜 막힘 (외부 디자이너 가정)
  - 3.2 알고 있어서 우회
  - 3.3 스킬 본문 부정확 / 모호
  - 3.4 handbook / FRONT.md / AGENT.md 누락
- [ ] §4 phase-12 후보 (우선순위 표)
- [ ] §5 결론
- [ ] Commit: `docs(spec-11-04): write dogfooding alpha report 2026-05`

---

## Task 8: backlog/queue.md icebox 갱신 (선택)

### 8-1.
- [ ] phase-12 후보 중 *명확한* 항목들을 icebox 에 추가 (예: `@gd/cli` 분리, `gd api`, 실 외부 디자이너 alpha)
- [ ] Commit: `chore(spec-11-04): add phase-12 candidates to icebox`

---

## Task 9: Ship

- [ ] 회귀: `pnpm --filter studio test --run` (1055 PASS)
- [ ] 회귀: `pnpm --filter create-gd-react test --run` (28 PASS)
- [ ] **walkthrough.md 작성** — dogfooding 시각 증거 + 보고서 요약
- [ ] **pr_description.md 작성** — 핵심 발견 + phase-12 후보
- [ ] **Ship Commit**
- [ ] **Push**
- [ ] **PR 생성**: `--base phase-11-designer-onboarding-skill`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 |
| **예상 commit 수** | 9 (pre-flight 1 + Task 1-8 + ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |

---

## 작업 의존성

```
Task 1 (브랜치)
  ↓
Task 2 (scaffold)
  ↓
Task 3 (gd-start)
  ↓
Task 4 (gd-chat)
  ↓
Task 5 (gd react)
  ↓
Task 6 (gd doctor)
  ↓
Task 7 (보고서)
  ↓
Task 8 (icebox, 옵션)
  ↓
Task 9 (Ship)
```
