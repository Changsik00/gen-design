# Task List: spec-12-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-12.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-12-03-gd-tokens-query` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: tokens arg 파서 테스트 작성 (TDD Red)

### 2-1. 테스트 작성
- [ ] `packages/gd-cli/src/commands/__tests__/tokens-args.test.ts` 작성
  - list / find / show 서브명령 분기
  - `--category` 옵션 파싱
  - `--tokens-root` 옵션 파싱
  - `--help` 플래그
  - 알 수 없는 옵션 → error 반환
  - find 키워드 누락 → error 반환
  - show 이름 누락 → error 반환
- [ ] `cd packages/gd-cli && pnpm test tokens-args` → Fail 확인
- [ ] Commit: `test(spec-12-03): add failing tests for tokens arg parser`

---

## Task 3: tokens arg 파서 구현 (TDD Green)

### 3-1. parseTokensArgs 구현
- [ ] `packages/gd-cli/src/commands/tokens.ts` 생성 — `parseTokensArgs` 구현
- [ ] `cd packages/gd-cli && pnpm test tokens-args` → Pass 확인
- [ ] Commit: `feat(spec-12-03): implement tokens arg parser`

---

## Task 4: tokens 런타임 테스트 작성 (TDD Red)

### 4-1. 런타임 테스트 작성
- [ ] `packages/gd-cli/src/commands/__tests__/tokens-runtime.test.ts` 작성
  - `runTokens(["list"])` → stdout 에 토큰 수 ≥ 35 행 포함
  - `runTokens(["list", "--category", "color"])` → color 토큰만 출력, exitCode 0
  - `runTokens(["find", "primary"])` → `primary` / `primary-foreground` 매칭
  - `runTokens(["show", "background"])` → light / dark / description 포함
  - `runTokens(["show", "nonexistent"])` → exitCode 1
  - `runTokens(["--help"])` → exitCode 0, stdout 에 list/find/show 포함
- [ ] `cd packages/gd-cli && pnpm test tokens-runtime` → Fail 확인
- [ ] Commit: `test(spec-12-03): add failing tests for tokens runtime`

---

## Task 5: tokens 런타임 구현 (TDD Green)

### 5-1. loadTokens + formatList + formatShow 구현
- [ ] `tokens.ts` 에 `loadTokens` / `formatList` / `formatShow` / `runTokens` 구현
  - DTCG 파싱: `$value.light` / `$value.dark` (없으면 `$value` 단일값)
  - ANSI 컬럼: `process.stdout.isTTY && !process.env.NO_COLOR` 조건
  - show 시 CSS 변수명 (`--<name>`) 함께 표시
- [ ] `cd packages/gd-cli && pnpm test` → 전체 PASS 확인
- [ ] Commit: `feat(spec-12-03): implement tokens runtime (list/find/show)`

---

## Task 6: cli.ts 등록

### 6-1. 라우터 등록
- [ ] `packages/gd-cli/src/cli.ts` — `COMMANDS["tokens"]` + `COMMAND_DESCRIPTIONS["tokens"]` 추가
- [ ] `cd packages/gd-cli && pnpm test` → 전체 PASS (regression 없음)
- [ ] Commit: `feat(spec-12-03): register tokens command in cli router`

---

## Task 7: Ship

- [ ] 코드 품질 점검: `cd packages/gd-cli && pnpm tsc --noEmit`
- [ ] 전체 테스트: `cd packages/gd-cli && pnpm test` → 모두 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-12-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-12-03-gd-tokens-query`
- [ ] **PR 생성**: `gh pr create` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (브랜치 + 2×TDD쌍 + 등록 + Ship) |
| **예상 commit 수** | 6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-23 |
