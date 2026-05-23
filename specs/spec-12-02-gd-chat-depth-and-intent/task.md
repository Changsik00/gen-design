# Task List: spec-12-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md / plan.md / task.md 작성
- [x] 백로그 업데이트 (phase-12.md SPEC 표)
- [ ] 사용자 Plan Accept
- [ ] 브랜치 생성 (phase-12 base 에서)

---

## Task 1: pre-flight commit
- [ ] Commit: `docs(spec-12-02): pre-flight spec plan task`

---

## Task 2: gd-chat.md 본문 강화
- [ ] §5.5 대화 깊이 checklist 삽입
- [ ] §7.5 Input → validation 의도
- [ ] §7.6 Button → 버튼 의도 (4 옵션)
- [ ] §11 안티 패턴 2 항목 추가
- [ ] §12 종료 조건 5 단계 checkbox
- [ ] ≤ 400 줄 확인
- [ ] Commit: `feat(spec-12-02): gd-chat depth checklist + validation/button intent`

---

## Task 3: 이지 v5 시뮬레이션 — 신 1 (로그인)
- [ ] `experiments/dogfood-alpha-v5/` scaffold
- [ ] 이지 v5 페르소나 memory
- [ ] `transcripts/scene-1-login.md` (≥ 5 turn)
- [ ] `chats/scenes/login.chat.md` + `gd react` + `gd doctor`
- [ ] decisions.md — validation + 버튼 의도 entry
- [ ] Commit: `feat(spec-12-02): scene 1 (login) — v5 depth simulation`

---

## Task 4: 신 2 (회원가입)
- [ ] `transcripts/scene-2-signup.md` (≥ 5 turn)
- [ ] signup.chat.md + 컴파일 + 검증
- [ ] decisions entry
- [ ] Commit: `feat(spec-12-02): scene 2 (signup) — form reuse + dialog`

---

## Task 5: 신 3 (대시보드)
- [ ] `transcripts/scene-3-dashboard.md` (≥ 5 turn)
- [ ] dashboard.chat.md + 컴파일 + 검증
- [ ] decisions entry — 버튼 의도 (nav)
- [ ] Commit: `feat(spec-12-02): scene 3 (dashboard) — button intent (nav)`

---

## Task 6: 신 4 (마이페이지)
- [ ] `transcripts/scene-4-mypage.md` (≥ 5 turn)
- [ ] mypage.chat.md + 컴파일 + 검증
- [ ] decisions entry — 다중 의도
- [ ] Commit: `feat(spec-12-02): scene 4 (mypage) — multi intent`

---

## Task 7: 종합 보고서
- [ ] `experiments/dogfooding-alpha-v5-depth-2026-05.md` (~300 줄)
- [ ] v4 vs v5 비교
- [ ] Commit: `docs(spec-12-02): v5 depth report`

---

## Task 8: Ship
- [ ] walkthrough + pr_description
- [ ] studio + @gd/cli + create-gd-react 테스트 회귀 확인
- [ ] sdd ship + push + PR (`--base phase-12-conversation-depth-and-orchestration`)

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **현재 단계** | Pre-flight (Plan Accept 대기) |
