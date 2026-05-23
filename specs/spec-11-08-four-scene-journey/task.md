# Task List: spec-11-08

> 모든 task 는 한 commit 에 대응.

## Pre-flight
- [x] Spec ID 확정
- [x] spec / plan / task
- [x] 백로그 갱신
- [ ] Plan Accept

---

## Task 1: 브랜치 + pre-flight commit

## Task 2: scaffold v4 + 이지 페르소나 memory
- [ ] `experiments/dogfood-alpha-v4/` (taskboard) scaffold
- [ ] `.gd/memory/designer.md` (이지 2년차)
- [ ] `.gd/memory/project.md` (taskboard 프로젝트)
- [ ] Commit: `chore(spec-11-08): scaffold v4 + 이지 memory`

## Task 3: 신 1 — 로그인 (대화 + 컴파일 + doctor)
- [ ] `chats/scenes/login.chat.md` (이지 대화 거쳐 작성)
- [ ] `gd react login` → TSX
- [ ] `gd doctor` 검증
- [ ] `.gd/memory/decisions.md` entry 1
- [ ] 보고서 §1.1 트랜스크립트
- [ ] Commit: `feat(spec-11-08): scene 1 — login (form pattern 표준)`

## Task 4: 신 2 — 회원가입 (form 재사용)
- [ ] 동일 흐름 + *재사용 발견* 기록
- [ ] decisions.md entry 2
- [ ] 보고서 §1.2
- [ ] Commit: `feat(spec-11-08): scene 2 — signup (form reuse + Checkbox 추가)`

## Task 5: 신 3 — 대시보드 (StatCard 승격 후보)
- [ ] Card x 4 반복 → 3회 룰 발견
- [ ] decisions.md entry 3
- [ ] 보고서 §1.3
- [ ] Commit: `feat(spec-11-08): scene 3 — dashboard (StatCard composite 승격 검토)`

## Task 6: 신 4 — 마이페이지 (Avatar / Tabs 신규)
- [ ] 대시보드 Card 재사용 + Avatar + Tabs
- [ ] decisions.md entry 4
- [ ] 보고서 §1.4
- [ ] Commit: `feat(spec-11-08): scene 4 — mypage (multi-scene 패턴 + Avatar/Tabs 신규)`

## Task 7: 종합 보고서
- [ ] §2 누적 학습 매트릭스 (어휘 재사용 / 신규 / 승격)
- [ ] §3 decisions.md 추적
- [ ] §4 single-scene vs multi-scene 발견
- [ ] §5 phase-12 후보
- [ ] Commit: `docs(spec-11-08): write 4-scene journey report`

## Task 8: Ship
- [ ] 회귀 (studio 1064 / create-gd-react 28)
- [ ] walkthrough + pr_description
- [ ] Ship + Push + PR

---

## 진행 요약

| 항목 | 값 |
|---|---|
| 총 Task 수 | 8 |
| 신 수 | 4 (login / signup / dashboard / mypage) |
| 종료 조건 | 4 신 doctor 0 errors + decisions 4 entry |
