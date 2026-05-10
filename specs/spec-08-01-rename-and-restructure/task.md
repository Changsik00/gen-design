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

- [ ] `mkdir -p chats/scenes chats/components`
- [ ] `touch chats/scenes/.gitkeep chats/components/.gitkeep`
- [ ] Commit: `chore(spec-08-01): scaffold chats/ directory for production briefs`

---

## Task 2: spec/ 28 fixture 분류 + rename → fixtures/chats/

- [ ] `mkdir -p fixtures/chats/scenes fixtures/chats/components`
- [ ] 7 scene fixture: `git mv spec/{name}-page.spec.md fixtures/chats/scenes/{name}.chat.md`
  - dashboard / error / login / my / settings / signup
- [ ] variant-wrapper: `git mv spec/variant-wrapper.spec.md fixtures/chats/components/variant-wrapper.chat.md` (templates 이지만 *page* 아닌 케이스)
- [ ] 21 component fixture: `git mv spec/{name}.spec.md fixtures/chats/components/{name}.chat.md`
- [ ] `rmdir spec/`
- [ ] Commit: `refactor(spec-08-01): split spec/ → fixtures/chats/{scenes,components}/`

---

## Task 3: studio fixtures.generated.ts 입력 경로 갱신

- [ ] `studio/scripts/generate-fixtures-index.ts` 의 SPEC_DIR / 패턴을 `fixtures/chats/{scenes,components}/*.chat.md` 로
- [ ] `pnpm --filter studio fixtures:gen` 실행 → fixtures.generated.ts 갱신
- [ ] 실패 시 경로 오류 진단
- [ ] Commit: `feat(spec-08-01): point fixtures index at fixtures/chats/`

---

## Task 4: studio/src/lib/spec-md/ → chat-md/ rename

- [ ] `git mv studio/src/lib/spec-md studio/src/lib/chat-md`
- [ ] grep 일괄 — `from "@/lib/spec-md"` → `from "@/lib/chat-md"` (전체 코드베이스)
- [ ] grep 일괄 — `from "../spec-md"` 등 상대 경로 — chat-md 로
- [ ] 빌드 검증 — 미해소 import 0
- [ ] Commit: `refactor(spec-08-01): rename studio/lib/spec-md → chat-md`

---

## Task 5: studio/src/lib/spec-md-compiler/ → chat-md-compiler/ rename

- [ ] `git mv studio/src/lib/spec-md-compiler studio/src/lib/chat-md-compiler`
- [ ] grep 일괄 — `spec-md-compiler` → `chat-md-compiler` (전체)
- [ ] 빌드 검증
- [ ] Commit: `refactor(spec-08-01): rename studio/lib/spec-md-compiler → chat-md-compiler`

---

## Task 6: inferSpec → inferChat rename

- [ ] `studio/src/lib/paper-inference/infer.ts`: `export function inferSpec` → `inferChat`
- [ ] grep 호출부 일괄 — 호출/import/test 모두
- [ ] 빌드 + 테스트 검증
- [ ] Commit: `refactor(spec-08-01): rename inferSpec → inferChat`

---

## Task 7: 7 templates *Page → *Scene rename

- [ ] `git mv studio/src/components/templates/{Login,Dashboard,My,Signup,Settings,Error}Page.tsx → {...}Scene.tsx` (6 개 — VariantWrapper 는 이름 그대로)
- [ ] 각 컴포넌트 파일 안의 export name + 함수명 갱신
- [ ] `studio/src/lib/{chat-md-compiler}/paper/component-registry.ts`: import + COMPONENT_REGISTRY 키 + COMPONENT_IMPORT_PATHS 키 일괄
- [ ] 모든 fixture (28 chat.md) 안 `<LoginPage>` → `<LoginScene>` 등 (단 fixture 의 *내용* 변경은 시맨틱 변경이지만 컴포넌트 이름 변경은 형식 갱신)
- [ ] catalog 자동 추출 재실행 (`pnpm extract:vocabulary` 같은 명령 — 확인 필요)
- [ ] 테스트 검증 — fixture 결정성 hash 가 깨질 수 있음 (이름 변경 = 출력 변경) → expected fixture 갱신
- [ ] Commit: `refactor(spec-08-01): rename 6 templates *Page → *Scene + catalog`

---

## Task 8: package.json CLI scripts rename

- [ ] `studio/package.json`: scripts `spec-react` → `chat-react`, `spec-paper` → `chat-paper`, `paper-to-spec` → `paper-to-chat`
- [ ] 변경 후 `pnpm chat-react fixtures/chats/scenes/login.chat.md` 작동 검증
- [ ] Commit: `feat(spec-08-01): rename pnpm CLI scripts spec-* → chat-*`

---

## Task 9: handbook + README 어휘 grep 갱신

- [ ] `docs/handbook.md`: *spec.md* (디자인 의미) → *chat.md*. *spec/* → *chats/* 또는 *fixtures/chats/*.
- [ ] *Page* (컴포넌트 어휘 맥락) → *Scene*
- [ ] `README.md`: spec.md 등장 어휘 갱신
- [ ] `*.chat.md` 확장자 패턴으로 grammar 예시 코드 갱신
- [ ] *full 재작성 X* — 시나리오 / 새 컴포넌트 워크플로 / agent 절 추가는 spec-8-02
- [ ] Commit: `docs(spec-08-01): vocabulary substitution spec → chat in handbook + README`

---

## Task 10: 회귀 게이트 검증

- [ ] `cd studio && pnpm test` → 724/724 PASS 기대 (단 fixture rename 으로 expected snapshot 일부 갱신 가능)
- [ ] `pnpm --filter studio build` → exit 0
- [ ] ts-diagnose 28/28 critical 0 — 경로 변경된 후에도
- [ ] 회귀 발견 시 stop + 원인 분석 + fix
- [ ] Commit (필요 시): `fix(spec-08-01): repair regressions discovered in gate`

---

## Task 11: Ship

- [ ] **walkthrough.md 작성** — rename 의 광범위 변경 + git mv 활용 + 발견된 회귀 (있다면) 기록
- [ ] **pr_description.md 작성** — Before/After 표 + 회귀 게이트 결과 + Out of scope 명시
- [ ] **Ship Commit**: `docs(spec-08-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-01-rename-and-restructure`
- [ ] **PR 생성**: `gh pr create` (base = main; 단 phase-08 base branch `phase-08-chat-agent-flow` 가 sdd ship 시 자동 생성되면 base 갱신)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 12 (0~11) |
| **예상 commit 수** | 약 10~12 (Task 0 = 0 commit, Task 10 가능 0 commit) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
