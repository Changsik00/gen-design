# Task List: spec-08-05 — Paper MCP adapter (`gen-design paper-import`)

> One Task = One Commit. TDD 우선. 첫 gen-design CLI 진입점 신설.

## Pre-flight

- [x] sdd spec new — spec-08-05-paper-mcp-adapter
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [ ] `git checkout phase-08-chat-agent-flow && git pull --ff-only`
- [ ] `git checkout -b spec-08-05-paper-mcp-adapter`
- [ ] Commit: 없음

---

## Task 1: Identity 파서 — TDD Red

- [ ] `studio/src/lib/paper-inference/__tests__/identity.test.ts` 신규
  - [ ] `[chat:scenes/login]` → kind="scene", slug="login", expectedPath="chats/scenes/login.chat.md"
  - [ ] `[chat:components/empty-state]` → kind="component"
  - [ ] `[chat:_shell]` → kind="shell", slug="_shell"
  - [ ] `BrandHeader` (마커 없음) → null
  - [ ] `[chat:invalid/foo]` (잘못된 kind) → null
  - [ ] `[chat:scenes/CamelCase]` (대문자 slug) → null
  - [ ] layer name 안에 *마커 + 다른 텍스트* (예: `[chat:scenes/x] / 1024`) → 추출 OK
  - [ ] 빈 문자열 / null-like → null
  - [ ] 마커 다중 발견 시 첫번째만
  - [ ] 결정성 (같은 입력 → 같은 출력)
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-08-05): add failing tests for parseIdentity`

---

## Task 2: Identity 파서 — TDD Green

- [ ] `studio/src/lib/paper-inference/identity.ts` 신규
- [ ] `IdentityRef` 인터페이스 + `parseIdentity()` 구현
- [ ] `IDENTITY_RE` / `SHELL_RE` 정규식
- [ ] 모든 identity 테스트 PASS
- [ ] Commit: `feat(spec-08-05): implement parseIdentity for layer names`

---

## Task 3: PaperTreeNode 타입 확장 (비파괴)

- [ ] `studio/src/lib/paper-inference/tree-types.ts` 수정
  - [ ] `identity?: IdentityRef` 필드 추가 (optional)
- [ ] 기존 코드 영향 0 — TypeScript 컴파일 PASS 확인
- [ ] Commit: `feat(spec-08-05): extend PaperTreeNode with optional identity field`

---

## Task 4: validate / enrich — TDD Red

- [ ] `studio/src/lib/paper-inference/__tests__/validate.test.ts` 신규
  - [ ] 구조 검증 (id/name/component 누락 → ValidationError)
  - [ ] identity 컨벤션 (잘못된 kind → warning)
  - [ ] 중복 identity 경고 (한 tree 안 같은 marker 2회)
  - [ ] 정상 tree → ok
- [ ] `studio/src/lib/paper-inference/__tests__/enrich.test.ts` 신규
  - [ ] 모든 노드 walk + identity 자동 채움
  - [ ] 중첩 노드도 처리
  - [ ] 마커 없는 노드는 identity 부재 (undefined)
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-08-05): add failing tests for validate and enrich`

---

## Task 5: validate / enrich — TDD Green

- [ ] `studio/src/lib/paper-inference/validate.ts` 신규 (`validateTree`)
- [ ] `studio/src/lib/paper-inference/enrich.ts` 신규 (`enrichWithIdentity`)
- [ ] 테스트 PASS 확인
- [ ] Commit: `feat(spec-08-05): implement validate and enrich`

---

## Task 6: matchPaperToChat 헬퍼 — TDD Red+Green (소형)

- [ ] `studio/src/lib/paper-inference/__tests__/match.test.ts` 신규
  - [ ] match (tree identity ↔ 실제 chat 파일)
  - [ ] tree-only (chat 파일 부재)
  - [ ] chat-only (tree 안 layer 부재)
  - [ ] empty tree → []
- [ ] 테스트 → Fail
- [ ] `studio/src/lib/paper-inference/match.ts` 신규 (`matchPaperToChat`)
- [ ] 테스트 → Pass
- [ ] Commit: `feat(spec-08-05): implement matchPaperToChat helper`

---

## Task 7: paper-import CLI args 파서 — TDD Red+Green

- [ ] `studio/scripts/gen-design/__tests__/paper-import-args.test.ts` 신규
  - [ ] 기본 file 인자
  - [ ] `--validate-only` / `--from-stdin` / `--output` / `--chain inferChat` / `--threshold 0.7`
  - [ ] 잘못된 사용 → error
- [ ] `studio/scripts/gen-design/paper-import.ts` 신규 — args 파서 부분만
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-05): implement paper-import args parser`

---

## Task 8: paper-import CLI runtime — TDD Green

- [ ] `paper-import.ts` 의 `runPaperImport()` 본체 구현
  - [ ] tree 로드 (file / stdin)
  - [ ] validate
  - [ ] enrich
  - [ ] chain inferChat (옵션)
  - [ ] output 저장 / stdout
- [ ] `studio/scripts/gen-design/__tests__/paper-import.test.ts` — runtime 시나리오 테스트
  - [ ] validate-only PASS
  - [ ] enrichment 정확성
  - [ ] chain inferChat 결과 chat.md 확인
- [ ] 테스트 PASS
- [ ] Commit: `feat(spec-08-05): implement paper-import runtime with chain support`

---

## Task 9: gen-design 진입점 + package.json

- [ ] `studio/scripts/gen-design.ts` 신규 — subcommand 라우터
- [ ] `studio/package.json` `gen-design` script 추가
- [ ] `studio/scripts/__tests__/gen-design.test.ts` — 라우터 테스트 (도움말 / 미지의 명령 / paper-import 라우팅)
- [ ] `pnpm --filter studio gen-design --help` 수동 검증
- [ ] Commit: `feat(spec-08-05): add gen-design CLI entry with subcommand router`

---

## Task 10: tree.json fixture 6 개

- [ ] `fixtures/paper-trees/_shell.tree.json` (AppShell)
- [ ] `fixtures/paper-trees/scenes/{login,main}.tree.json`
- [ ] `fixtures/paper-trees/components/{brand-header,app-footer,empty-state}.tree.json`
- [ ] 각 fixture 의 layer name 에 `[chat:type/slug]` 마커
- [ ] Commit: `test(spec-08-05): add 6 paper-tree fixtures aligned with playground/chats`

---

## Task 11: Round-trip 통합 테스트

- [ ] `studio/src/lib/paper-inference/__tests__/round-trip.test.ts` 신규
  - [ ] 6 fixture 각각: tree → paper-import → inferChat → chat.md
  - [ ] frontmatter.identity 가 fixture 의 layer marker 와 매칭
  - [ ] Structure body 의 ComponentInstance 가 tree 의 자식 구조와 매칭
- [ ] Commit: `test(spec-08-05): add round-trip integration tests for 6 fixtures`

---

## Task 12: 회귀 안전 + 빌드 검증

- [ ] `cd studio && pnpm test` → 전체 PASS (≥ 800)
- [ ] `pnpm --filter studio build` → exit 0
- [ ] `pnpm gen-design paper-import fixtures/paper-trees/scenes/login.tree.json --validate-only` → exit 0
- [ ] `pnpm gen-design paper-import fixtures/paper-trees/scenes/login.tree.json --chain inferChat` → 정상 chat.md
- [ ] Commit 불필요 (변경 0)

---

## Task 13: Ship

- [ ] **walkthrough.md 작성** — 5 결정 (단일 CLI / subcommand 모듈화 / identity 컨벤션 / MCP 직접 X / 비파괴 확장) + dogfooding gate 의미
- [ ] **pr_description.md 작성** — Before/After + commit 흐름 + 후속 spec 연결점
- [ ] **Ship Commit**: `docs(spec-08-05): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-05-paper-mcp-adapter`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 14 (0~13) |
| **예상 commit 수** | 11~12 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
