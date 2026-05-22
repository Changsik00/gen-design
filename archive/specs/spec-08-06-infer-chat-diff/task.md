# Task List: spec-08-06 — inferChat diff 모드

> One Task = One Commit. TDD. Narrative 보존이 *핵심 검증* — dogfood 시뮬 필수.

## Pre-flight

- [x] sdd spec new — spec-08-06-infer-chat-diff
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [ ] `git checkout phase-08-chat-agent-flow && git pull --ff-only`
- [ ] `git checkout -b spec-08-06-infer-chat-diff`
- [ ] Commit: 없음

---

## Task 1: full-Document emit — TDD Red

- [ ] `studio/src/lib/paper-inference/__tests__/emit-document.test.ts` 신규
  - [ ] frontmatter serialize (top-level / nested / inline array / list)
  - [ ] title `# Name`
  - [ ] Narrative section
  - [ ] Structure section (` ```jsx ... ``` ` fence 포함)
  - [ ] History section
  - [ ] frontmatter 없는 legacy → body 만 (호환)
  - [ ] round-trip: parse(emit(doc)) ≈ doc (8+ 케이스)
- [ ] Commit: `test(spec-08-06): add failing tests for emitDocument`

---

## Task 2: full-Document emit — TDD Green

- [ ] `studio/src/lib/paper-inference/emit-document.ts` 신규 — `emitDocument()` + `emitFrontmatter()`
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-06): implement emitDocument with frontmatter and 3-layer sections`

---

## Task 3: diff 알고리즘 — TDD Red

- [ ] `studio/src/lib/paper-inference/__tests__/diff.test.ts` 신규
  - [ ] no-op (동일 tree → stats 0)
  - [ ] text 변경 (자식 MarkdownText / Placeholder 본문 다름)
  - [ ] variant 변경 (size sm → md)
  - [ ] component 추가
  - [ ] component 삭제
  - [ ] 혼합 변경
  - [ ] 빈 tree → 모두 added
  - [ ] 결정성 (같은 입력 → 같은 stats)
  - [ ] Narrative / History / frontmatter 보존 (3+)
- [ ] Commit: `test(spec-08-06): add failing tests for inferChatDiff`

---

## Task 4: diff 알고리즘 — TDD Green

- [ ] `studio/src/lib/paper-inference/diff.ts` 신규
  - [ ] `inferChatDiff()` 메인 함수
  - [ ] `diffStructure()` — name + variant 비교
  - [ ] `mergeDocs()` — old 의 fm/narrative/history + new 의 structure
  - [ ] History 자동 라인 생성 + appendHistory 옵션
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-06): implement inferChatDiff with preservation`

---

## Task 5: gen-design diff CLI — args + runtime

- [ ] `studio/scripts/gen-design/__tests__/diff-args.test.ts` — args 파서 6+ 케이스
- [ ] `studio/scripts/gen-design/__tests__/diff.test.ts` — runtime 6+ 케이스 (dry-run / --apply / --output / --no-history / 오류)
- [ ] `studio/scripts/gen-design/diff.ts` 신규 — `parseDiffArgs()` + `runDiff()`
- [ ] router 갱신 (`gen-design diff` 추가)
- [ ] router 테스트 보강
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-06): add gen-design diff subcommand`

---

## Task 6: 5 통합 시나리오 fixtures + 테스트

- [ ] `fixtures/diff-scenarios/A-text-only/{before.chat.md, new.tree.json}` (텍스트만 변경)
- [ ] `B-variant/` (variant 변경)
- [ ] `C-add/` (component 추가)
- [ ] `D-remove/` (component 삭제)
- [ ] `E-mixed/` (혼합)
- [ ] `studio/src/lib/paper-inference/__tests__/diff-scenarios.test.ts` — 5 시나리오 통합 테스트
  - [ ] 각 시나리오: diff → stats 기대값 일치
  - [ ] 각 시나리오: Narrative 영역 *bit-for-bit* 보존
  - [ ] 각 시나리오: History 새 라인 추가됨
- [ ] Commit: `test(spec-08-06): add 5 integration scenarios for diff mode`

---

## Task 7: dogfood 시뮬레이션 — login.chat.md

- [ ] `studio/src/lib/paper-inference/__tests__/diff-dogfood.test.ts` 신규
  - [ ] `playground/chats/scenes/login.chat.md` 로드
  - [ ] `fixtures/paper-trees/scenes/login.tree.json` 를 *변형* (예: LoginForm.default.md → LoginForm.default.lg)
  - [ ] diff → stats: variantChanges=1
  - [ ] Narrative 영역 *완전 동일* assertion
  - [ ] History 에 자동 라인 추가됨
- [ ] Commit: `test(spec-08-06): add dogfood simulation for login.chat.md evolution`

---

## Task 8: 회귀 안전 + 빌드 + manual CLI

- [ ] `cd studio && pnpm test` → ≥ 870 PASS
- [ ] `pnpm --filter studio build` → exit 0
- [ ] manual: `pnpm gen-design diff <chat> <tree>` (dry-run) → diff preview
- [ ] manual: `--apply` → /tmp 에 출력 + Narrative bit-for-bit 비교
- [ ] Commit 불필요 (변경 0)

---

## Task 9: Ship

- [ ] **walkthrough.md 작성** — 8 핵심 결정 + 5 시나리오 결과 + dogfood + ADR-010 D-3 호응
- [ ] **pr_description.md 작성** — Before/After + 변경 파일 + 후속 spec 연결
- [ ] **Ship Commit**: `docs(spec-08-06): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-06-infer-chat-diff`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (0~9) |
| **예상 commit 수** | 8~9 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-12 |
