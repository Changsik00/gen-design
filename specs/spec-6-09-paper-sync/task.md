# Task List: spec-6-09

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + 타입/테스트 (TDD Red)

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-6-09-paper-sync`

### 1-2. 타입 + TDD Red
- [x] `studio/src/lib/paper-sync/types.ts`
- [x] `studio/src/lib/paper-sync/__tests__/resolver.test.ts` (실패)
- [x] `studio/src/lib/paper-sync/__tests__/converter.test.ts` (실패)
- [x] Commit: `test(spec-6-09): add failing resolver and converter tests`

---

## Task 2: resolver + converter 구현 (TDD Green)

- [x] `studio/src/lib/paper-sync/resolver.ts`
- [x] `studio/src/lib/paper-sync/converter.ts`
- [x] `studio/src/lib/paper-sync/index.ts`
- [x] 테스트 Pass 확인
- [x] Commit: `feat(spec-6-09): implement paper-sync resolver and converter`

---

## Task 3: PoC 실행 + poc-report.md

- [x] Paper MCP 도구로 토큰 적용 테스트 (get_basic_info → update_styles → get_screenshot)
- [x] `specs/spec-6-09-paper-sync/poc-report.md` 작성 (결과 + Go/No-Go)
- [x] Commit: `docs(spec-6-09): add poc-report with go/no-go evaluation`

---

## Task 4: Ship

- [ ] `pnpm --filter studio run build`
- [ ] `pnpm --filter studio test` — 전체 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit** + **Push** + **PR 생성**
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 3 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-09 |
