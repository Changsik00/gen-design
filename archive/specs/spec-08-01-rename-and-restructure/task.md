# Task List: spec-08-01

> One Task = One Commit. 매 commit 직후 본 파일 갱신.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 + 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] phase-08.md SPEC 표 자동 갱신
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성 + PoC 6 파일 cherry-pick

- [x] `git checkout -b spec-08-01-rename-and-restructure` (base = main)
- [x] `git cherry-pick 6d8c8cd` (PoC commit ff20eed 로 적용 — playground/chats/ 6 파일)
- [x] Commit: cherry-pick 자체 (ff20eed)

---

## Task 1: chats/ 빈 디렉토리 신설

- [x] `mkdir -p chats/scenes chats/components` + `.gitkeep`
- [x] Commit: `chore(spec-08-01): scaffold chats/ directory for production briefs` (ad595cf)

---

## Task 2: spec/ 28 fixture 분류 + rename → fixtures/chats/

- [x] 6 scene fixture (dashboard/error/login/my/settings/signup) → fixtures/chats/scenes/
- [x] variant-wrapper → fixtures/chats/components/ (templates 이지만 *page* 아닌 케이스)
- [x] 21 component fixture → fixtures/chats/components/
- [x] `rmdir spec/`
- [x] Commit: `refactor(spec-08-01): split spec/ → fixtures/chats/{scenes,components}/` (7b17fcd)

---

## Task 3: studio fixtures.generated.ts 입력 경로 갱신

- [x] generate-fixtures-index.ts 패턴 갱신 (FIXTURES_ROOT + scenes/components 분리)
- [x] `pnpm fixtures:gen` → 28 fixture 인식 OK
- [x] Commit: `feat(spec-08-01): point fixtures index at fixtures/chats/` (77f8d6f)

---

## Task 4: studio/src/lib/spec-md/ → chat-md/ rename

- [x] git mv + import 경로 일괄
- [x] grammar 파일 spec-md.ts → chat-md.ts + SPEC_MD_GRAMMAR → CHAT_MD_GRAMMAR
- [x] 빌드 검증 OK
- [x] Commit: `refactor(spec-08-01): rename studio/lib/spec-md → chat-md` (fecc90c)

---

## Task 5: studio/src/lib/spec-md-compiler/ → chat-md-compiler/ rename

- [x] git mv + sed 일괄 + package.json path 정정
- [x] 빌드 검증 OK
- [x] Commit: `refactor(spec-08-01): rename studio/lib/spec-md-compiler → chat-md-compiler` (5b6da43)

---

## Task 6: inferSpec → inferChat rename

- [x] 7 호출 site sed 일괄
- [x] 빌드 검증 OK
- [x] Commit: `refactor(spec-08-01): rename inferSpec → inferChat` (a90af7c)

---

## Task 7: 6 templates *Page → *Scene rename + catalog

- [x] git mv 6 디렉토리 (Login/Dashboard/My/Signup/Settings/Error)
- [x] 함수명 + 타입 + 테스트 sed 일괄 (PageTemplateVariant → SceneTemplateVariant)
- [x] 28 fixture 의 `<LoginPage>` → `<LoginScene>` 일괄
- [x] `pnpm vocab` → catalog.json + spec-schema.json + FRONT.md + DESIGN.md + DESIGN.stitch.md 자동 갱신
- [x] deriveComponentName 의 .chat.md 인식 추가
- [x] 회귀 발견 4 건 fix (test expectation, kebab test, fixtures-regression, etc.)
- [x] Commit: `refactor(spec-08-01): rename 6 templates *Page → *Scene + catalog auto-extract` (99ca837)

---

## Task 8: package.json CLI scripts rename

- [x] spec-lint → chat-lint, spec-paper → chat-paper, spec-react → chat-react, paper-to-spec → paper-to-chat
- [x] `pnpm chat-react fixtures/chats/scenes/login.chat.md` 작동 검증
- [x] Commit: `feat(spec-08-01): rename pnpm CLI scripts spec-* → chat-*` (513c9c6)

---

## Task 9: handbook + README + schema 어휘 grep 갱신

- [x] handbook §1-§8 어휘 sed (spec.md → chat.md, spec/ → chats/, spec-md → chat-md, CLI 이름)
- [x] harness-kit context 의 spec.md 보존 (line 110, 187 — `specs/spec-X-Y/spec.md` work artifact)
- [x] handbook 머리부분에 *어휘 변경 (spec-08-01)* 노트 추가
- [x] README + schema/design-component-mapping.md 의 *Page → *Scene
- [x] full 재작성은 spec-8-02 명시
- [x] Commit: `docs(spec-08-01): vocabulary substitution spec → chat in handbook + README` (f9bd3e0)

---

## Task 10: 회귀 게이트 검증

- [x] `pnpm test` → 725/725 PASS (회귀 0 + 신규 테스트 +1)
- [x] `pnpm --filter studio build` → exit 0 (built in 200ms)
- [x] ts-diagnose 28/28 critical 0 — 전체 test 안에 포함
- [x] 발견된 회귀는 Task 7 안에서 fix (별도 commit 불필요)

---

## Task 11: Ship

- [x] **walkthrough.md 작성** — 10 결정 + 4 발견 사항 + 사용자 협의 2건
- [x] **pr_description.md 작성** — Before/After 표 + 회귀 게이트 결과 + 11 후속 spec 라인업
- [ ] **Ship Commit**: `docs(spec-08-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-01-rename-and-restructure`
- [ ] **PR 생성**: `gh pr create` (base = main — phase-08 base branch `phase-08-chat-agent-flow` 는 sdd ship 시 생성)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 12 (0~11) |
| **예상 commit 수** | 약 10~12 (Task 0 = 0 commit, Task 10 가능 0 commit) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
