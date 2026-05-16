# Task List: spec-08-04 — chat.md grammar 확장

> One Task = One Commit. TDD (Red → Green) 우선.

## Pre-flight

- [x] sdd spec new — spec-08-04-chat-md-grammar
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [ ] `git checkout phase-08-chat-agent-flow && git pull --ff-only`
- [ ] `git checkout -b spec-08-04-chat-md-grammar`
- [ ] Commit: 없음

---

## Task 1: AST 타입 확장 (additive)

- [ ] `parser/ast-types.ts` 수정
  - [ ] `ChatFrontmatter` 인터페이스 추가
  - [ ] `NarrativeSection` / `StructureSection` / `HistorySection` 추가
  - [ ] `Document` 에 `frontmatter`/`title`/`narrative`/`structure`/`history` 필드 추가
  - [ ] `Document.body` 를 optional + `@deprecated` 로 표시
- [ ] 기존 테스트 type 호환 확인 (TypeScript 컴파일 PASS — 의미 변경 X)
- [ ] Commit: `feat(spec-08-04): extend AST types with frontmatter and 3 sections`

---

## Task 2: Frontmatter grammar — TDD Red

- [ ] `parser/__tests__/frontmatter.test.ts` 신규
  - [ ] top-level k:v (string / number / boolean / null)
  - [ ] quoted string (single + double)
  - [ ] inline array (`[a, b, c]`)
  - [ ] nested object (2-space indent)
  - [ ] comment 무시
  - [ ] 잘못된 indent → ParseError
  - [ ] frontmatter 없는 입력 → `frontmatter: null`
- [ ] 테스트 실행 → Fail 확인 (grammar 미구현)
- [ ] Commit: `test(spec-08-04): add failing tests for frontmatter parser`

---

## Task 3: Frontmatter grammar — TDD Green

- [ ] `grammar/chat-md.ts` 수정
  - [ ] `Frontmatter` rule 추가 (`---` 펜스 + lines)
  - [ ] `FmKey` / `FmValue` (string / number / boolean / null / array / inline object)
  - [ ] indent-based nesting helper (action block)
  - [ ] `parseFmTree(lines)` 헬퍼 추가
- [ ] `Document` rule 갱신 — `Frontmatter? Title? Section*`
- [ ] frontmatter 테스트 PASS 확인
- [ ] Commit: `feat(spec-08-04): implement frontmatter grammar`

---

## Task 4: 3-layer section grammar — TDD Red

- [ ] `parser/__tests__/sections.test.ts` 신규
  - [ ] `## 💬 Narrative` / `## Narrative` 둘 다 인식
  - [ ] Structure 안 ` ```jsx ... ``` ` → ComponentTag parse
  - [ ] History markdown 보존
  - [ ] 순서 자유 (Structure → Narrative → History 도 OK)
  - [ ] 섹션 없는 legacy → `body` 노출
  - [ ] 부 헤딩 (`### `) 영역 안 보존
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-08-04): add failing tests for 3-layer sections`

---

## Task 5: 3-layer section grammar — TDD Green

- [ ] `grammar/chat-md.ts` 수정
  - [ ] `Title` rule (single H1)
  - [ ] `Section` / `SectionHeading` rule
  - [ ] `classifySection(name)` 헬퍼 — Narrative/Structure/History/Other
  - [ ] `splitSections(sections, loc)` 헬퍼 — 분류 + 통합
  - [ ] Structure 본문에서 fenced code block (` ```jsx `) 안 ComponentTag 파싱
- [ ] sections 테스트 PASS 확인
- [ ] Commit: `feat(spec-08-04): implement 3-layer section grammar`

---

## Task 6: Schema validation — TDD Red

- [ ] `parser/__tests__/schema.test.ts` 신규
  - [ ] shell type — applies 필수, shell.* 금지
  - [ ] scene type — identity 필수, prefix 검증
  - [ ] component type — catalog.tier/family 필수
  - [ ] 잘못된 type → suggestion 포함
  - [ ] frontmatter 없으면 schema 검증 skip
- [ ] 테스트 실행 → Fail 확인
- [ ] Commit: `test(spec-08-04): add failing tests for chat schema validation`

---

## Task 7: Schema validation — TDD Green

- [ ] `parser/schema.ts` 신규 — `validateChatSchema(ast): ParseError[]`
- [ ] `parser/index.ts` — `parse()` 에 schema 단계 통합 (opts.skipSchema 옵션)
- [ ] schema 테스트 PASS 확인
- [ ] Commit: `feat(spec-08-04): implement chat schema validation`

---

## Task 8: 후속 spec 영향 사전 정리 (compile 경로 호환)

- [ ] `chat-md-compiler/` 안 `Document.body` 사용처 검색
- [ ] `Document.structure?.body ?? Document.body ?? []` 안전 폴백 적용
- [ ] 기존 컴파일러 테스트 PASS 유지
- [ ] Commit: `refactor(spec-08-04): use structure.body with backward-compat fallback`

---

## Task 9: fixtures-regression 확장

- [ ] `__tests__/fixtures-regression.test.ts` 수정
  - [ ] `playground/chats/` 6 파일 추가
  - [ ] `fixtures/chats/` frontmatter 있는 파일 자동 인식
  - [ ] frontmatter 있는 파일 → schema 검증 PASS 단언
- [ ] 회귀 PASS 확인
- [ ] Commit: `test(spec-08-04): extend fixtures-regression with playground/chats`

---

## Task 10: 회귀 안전 + 빌드 검증

- [ ] `cd studio && pnpm test` → 전체 PASS (≥ 755)
- [ ] `pnpm --filter studio build` → exit 0
- [ ] 신규 테스트 수 + 통과 수 기록
- [ ] Commit 불필요 (변경 0)

---

## Task 11: Ship

- [ ] **walkthrough.md 작성** — 5 결정 (frontmatter / sections / schema / shell-record-only / backward-compat) + 신규 AST 그림
- [ ] **pr_description.md 작성** — Before/After + 신규 테스트 수치 + 후속 spec 영향
- [ ] **Ship Commit**: `docs(spec-08-04): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-04-chat-md-grammar`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 12 (0~11) |
| **예상 commit 수** | 9~10 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
