# Task List: spec-11-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성
- [x] 백로그 업데이트 (phase-11.md SPEC 표 자동 갱신)
- [x] 사용자 Plan Accept
- [x] 브랜치 생성 (phase-11 base 에서)

---

## Task 1: 백로그 + spec 디렉토리 pre-flight commit
- [ ] Commit: `docs(spec-11-05): pre-flight spec plan task`

---

## Task 2: Fix #5 — dark destructive-foreground hotfix
- [ ] `tokens.json` 의 `destructive-foreground.$value.dark` 변경
- [ ] `globals.css` 의 `.dark { --destructive-foreground }` 동기
- [ ] Commit: `fix(spec-11-05): dark destructive-foreground 대비 WCAG AA PASS`

---

## Task 3: Fix #3 — doctor HTML 주석 제거 (TDD)
- [ ] vocab-similar.test.ts + token-ref.test.ts — HTML 주석 무시 테스트 (Red)
- [ ] check-vocab-similar.ts + check-token-ref.ts — `stripHtmlComments` 추가
- [ ] 테스트 PASS
- [ ] Commit: `fix(spec-11-05): doctor extractors skip HTML comments`

---

## Task 4: Fix #2 — annotation 경로 (TDD)
- [ ] react-annotation.test.ts — chatRoot 부모 기준 경로 검증 (Red)
- [ ] react.ts — `chatRelPath = relative(resolve(chatRoot, ".."), chatPath)`
- [ ] PASS
- [ ] Commit: `fix(spec-11-05): // @gd: annotation 경로를 chatRoot 부모 기준으로`

---

## Task 5: Fix #1 — gd-chat 스킬 펜스 제거
- [ ] gd-chat.md §7 본문 수정 (bare 형식 + 안티 패턴 + grammar 한계 안내)
- [ ] Commit: `fix(spec-11-05): gd-chat 스킬의 Structure bare 형식 명시`

---

## Task 6: 재dogfooding
- [ ] `experiments/dogfood-alpha/chats/scenes/login.chat.md` 펜스 제거
- [ ] `gd react` 재실행 → 결과 확인
- [ ] `gd doctor` 재실행 → 검증
- [ ] Commit: `chore(spec-11-05): re-run dogfooding — verify fixes work end-to-end`

---

## Task 7: 보고서 갱신
- [ ] `dogfooding-alpha-2026-05.md` §3.1 4건 ✅ + §4 #4 만 남기기 + §5 결론
- [ ] Commit: `docs(spec-11-05): update dogfooding report — 4/5 findings resolved`

---

## Task 8: Ship
- [ ] studio test --run (1055+) / create-gd-react test --run (28)
- [ ] walkthrough.md + pr_description.md
- [ ] Ship Commit
- [ ] Push + PR (--base phase-11-designer-onboarding-skill)
- [ ] PR #68 통합 안내

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **현재 단계** | Task 1 시작 직전 |
