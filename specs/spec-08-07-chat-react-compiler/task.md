# Task List: spec-08-07 — chat → React compiler (shell inherit + scene 통합)

> One Task = One Commit. TDD. dogfood TSX 출력이 *핵심 검증*.

## Pre-flight

- [x] sdd spec new — spec-08-07-chat-react-compiler
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [ ] `git checkout phase-08-chat-agent-flow && git pull --ff-only`
- [ ] `git checkout -b spec-08-07-chat-react-compiler`
- [ ] Commit: 없음

---

## Task 1: shell merge — TDD Red

- [ ] `studio/src/lib/chat-md-compiler/react/__tests__/shell-merge.test.ts` 신규
  - [ ] shell.exclude 비어있음 → 모든 shell components 유지
  - [ ] shell.exclude 에 BrandHeader → BrandHeader 제거
  - [ ] 중첩 shell body — 재귀 walk
  - [ ] `{{scene.content}}` placeholder → scene.structure.body 로 교체
  - [ ] placeholder 없는 shell → scene body 누락 (경고 없이)
  - [ ] 다중 placeholder → 같은 body 복제
  - [ ] frontmatter = scene 의 것 (shell 의 것 X)
  - [ ] narrative / history = scene 의 것
- [ ] 테스트 → Fail
- [ ] Commit: `test(spec-08-07): add failing tests for shell-merge`

---

## Task 2: shell merge — TDD Green

- [ ] `studio/src/lib/chat-md-compiler/react/shell-merge.ts` 신규
- [ ] `mergeShellAndScene(opts)` 구현 (walk + exclude + substitute)
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-07): implement shell-merge algorithm`

---

## Task 3: compileScene 진입점 — TDD Red+Green

- [ ] `studio/src/lib/chat-md-compiler/react/__tests__/compile-scene.test.ts` 신규
  - [ ] inherit=true → shell + scene merge → TSX
  - [ ] inherit=false → scene 단독 컴파일
  - [ ] scene 파일 없음 → 오류
  - [ ] shell 파일 없음 (inherit=true) → 오류
  - [ ] frontmatter 부재 → scene 단독
- [ ] `studio/src/lib/chat-md-compiler/react/compile-scene.ts` 신규
- [ ] `compileScene(slug, opts)` 구현
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-07): implement compileScene entry`

---

## Task 4: gen-design react CLI — args + runtime

- [ ] `studio/scripts/gen-design/__tests__/react-args.test.ts` 신규 (5+ 케이스)
- [ ] `studio/scripts/gen-design/__tests__/react-runtime.test.ts` 신규 (5+ 케이스 — slug / --chat-root / --output / --no-shell / 오류)
- [ ] `studio/scripts/gen-design/react.ts` 신규 — `parseReactArgs` + `runReact`
- [ ] gen-design router 에 `react` 추가
- [ ] router 테스트 보강
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-07): add gen-design react subcommand`

---

## Task 5: dogfood 통합 테스트 — playground login

- [ ] `studio/src/lib/chat-md-compiler/react/__tests__/react-dogfood.test.ts` 신규
  - [ ] playground/chats/scenes/login + _shell → compileScene → TSX
  - [ ] TSX 안 BrandHeader 미포함 (exclude 적용)
  - [ ] TSX 안 AppFooter 포함 (inherit)
  - [ ] TSX 안 LoginForm 포함 (scene content inject)
  - [ ] 결정성 (2회 hash 동일)
- [ ] Commit: `test(spec-08-07): add dogfood integration for login scene compile`

---

## Task 6: 회귀 안전 + 빌드 + manual CLI

- [ ] `cd studio && pnpm test` → ≥ 920 PASS
- [ ] `pnpm --filter studio build` → exit 0
- [ ] manual: `pnpm gen-design react login --chat-root playground/chats` → stdout TSX
- [ ] 출력 TSX 안 BrandHeader 없음 + AppFooter 있음 + LoginForm 있음 직접 grep
- [ ] 2회 실행 동일 (결정성)
- [ ] Commit 불필요

---

## Task 7: Ship

- [ ] **walkthrough.md 작성** — 8 핵심 결정 + dogfood TSX 결과 발췌 + 후속 spec 영향
- [ ] **pr_description.md 작성** — Before/After + 변경 파일 + commit 흐름
- [ ] **Ship Commit**: `docs(spec-08-07): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-07-chat-react-compiler`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (0~7) |
| **예상 commit 수** | 6~7 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-12 |
