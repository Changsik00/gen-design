# Task List: spec-13-07

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] phase-13.md spec 표 + 성공기준 갱신
- [ ] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout -b spec-13-07-frontmd-realign-responsive`
- Commit: 없음

---

## Task 2 — FRONT.md 반응형 강제 섹션 추가

- [x] preset `templates/FRONT.md` — Responsive Strategy 섹션 신규
- [x] §26 Anti-Patterns 표에 반응형 안티패턴 행 추가
- [ ] Commit: `docs(spec-13-07): add responsive strategy section to FRONT.md`

---

## Task 3 — FRONT.md gd react → LLM 생성 정합

- [x] §4 scenes 주석 / §8.2 흐름도 / §16 i18n / §25 표준화 — gd react 참조 제거 → LLM 생성
- [ ] Commit: `docs(spec-13-07): realign FRONT.md from gd react to LLM generation`

---

## Task 4 — AGENT.md 정합화

- [x] preset `templates/AGENT.md` — LLM 생성 워크플로 + v2 레이어 + 반응형 규칙
- [ ] Commit: `docs(spec-13-07): realign AGENT.md workflow + add responsive rules`

---

## Task 5 — repo root templates 정합

- [-] `templates/FRONT.md` (auto-gen 카탈로그, gd react 참조 0) / root AGENT.md 미존재 → 정합 대상 아님 (Pass)
- [ ] Commit: `docs(spec-13-07): sync repo root templates with preset`

---

## Task 6 — 반응형 실증 (todo 앱)

- [x] `todo-persona/src/scenes/*.tsx` 5화면 반응형 수정 (grid-cols-1 sm:... 등)
- [x] 375px E2E 작성 + PASS 확인
- [ ] Commit: `test(spec-13-07): responsive todo app + 375px mobile e2e (실증)`
  - 참고: todo-persona 는 git 미추적. 커밋은 E2E 결과 로그를 walkthrough 에 첨부

---

## Task 7 — Ship

- [x] **walkthrough.md 작성** (gd react 잔재 0 확인 + 375px E2E 증거)
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-13-07): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-13-07-frontmd-realign-responsive`
- [x] **PR 생성**: `phase-13-vertical-slice` 타겟
- [x] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 |
| **예상 commit 수** | 6 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-29 |
