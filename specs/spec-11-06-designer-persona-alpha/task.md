# Task List: spec-11-06

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 업데이트 (phase-11.md 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + pre-flight commit
- [ ] `git checkout -b spec-11-06-designer-persona-alpha`
- [ ] pre-flight commit (spec/plan/task)

---

## Task 2: scaffold — `experiments/dogfood-alpha-v2/`
- [ ] `node packages/create-gd-react/dist/cli.js taskflow --offline --no-install` 실행
- [ ] 결과를 `experiments/dogfood-alpha-v2/` 로 복사
- [ ] 시간 측정 + 명령 횟수 기록
- [ ] Commit: `chore(spec-11-06): scaffold dogfood-alpha-v2 (taskflow) for 미경 persona`

---

## Task 3: `/gd-start` 미경 roleplay → memory entries
- [ ] `designer.md`: 미경 페르소나 답변 strict (Figma 5년차 / React 0 / 시각 우선)
- [ ] `project.md`: TaskFlow / 1인 개발자 SaaS / 스타트업 초기 / formal-friendly
- [ ] Commit: `feat(spec-11-06): populate .gd/memory via 미경 roleplay`

---

## Task 4: `/gd-chat` 미경 roleplay → dashboard.chat.md
- [ ] `chats/scenes/dashboard.chat.md` 작성 — Narrative + Structure (Card x3 + List) + History
- [ ] Structure 는 **bare 형식** (spec-11-05 fix #1 적용 확인)
- [ ] 카탈로그 어휘만 사용 (Card / Button / Input 등 shadcn Tier 2)
- [ ] Commit: `feat(spec-11-06): write dashboard.chat.md as 미경 (bare structure)`

---

## Task 5: `gd react` 컴파일
- [ ] `pnpm --filter studio exec tsx scripts/gen-design.ts react dashboard --chat-root .../v2/chats --output .../v2/src/scenes/dashboard.tsx --no-shell`
- [ ] 결과 TSX 확인 — `// @gd: chats/scenes/dashboard.chat.md` annotation + 본문 컴파일
- [ ] 시간 + bytes 측정
- [ ] Commit: `feat(spec-11-06): compile dashboard.tsx via gd react`

---

## Task 6: `gd doctor` 검증
- [ ] `pnpm --filter studio exec tsx scripts/gen-design.ts doctor --chat-root .../v2/chats --templates-root .../v2/templates` 실행
- [ ] 진단 캡처
- [ ] 미경 입장에서 *친절한 한국어 메시지* 평가
- [ ] Commit: `chore(spec-11-06): run gd doctor on v2 dogfood`

---

## Task 7: (옵션) `pnpm install + pnpm dev` 시각 확인
- [ ] `experiments/dogfood-alpha-v2/` 에서 `pnpm install` (시간 측정)
- [ ] `pnpm dev` 기동 시도 — Vite 정상 / 오류 캡처
- [ ] (가능 시) 브라우저에서 dashboard 시각 확인
- [ ] 측정 결과를 보고서 §1 에 기록
- [ ] Commit: `chore(spec-11-06): visual verification (pnpm dev) — optional`

---

## Task 8: 보고서 작성 — `experiments/dogfooding-alpha-v2-2026-05.md`
- [ ] §0 미경 페르소나 + *알고 / 모름* 표
- [ ] §1 정량 (v1 과 비교)
- [ ] §2 단계별 미경 트랜스크립트 (실제 답변 / 막힘)
- [ ] §3 발견 사항:
  - 3.1 v1 에서 spec-11-05 가 해소한 항목 *검증* (Structure 컴파일 ✓ 등)
  - 3.2 v2 신규 발견 (미경 roleplay 로만 보이는 막힘)
  - 3.3 agent (Claude) 가 *미경 깨고 dennis 모드 돌아간 횟수*
- [ ] §4 phase-12 후보 갱신
- [ ] §5 결론 — 외부 alpha 가능성 평가
- [ ] Commit: `docs(spec-11-06): write dogfooding alpha v2 report (미경 persona)`

---

## Task 9: Ship
- [ ] 회귀: studio test 1059 / create-gd-react 28
- [ ] walkthrough.md + pr_description.md
- [ ] Ship Commit
- [ ] Push + PR (--base phase-11-designer-onboarding-skill)
- [ ] PR #68 자동 갱신 안내

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-23 |
