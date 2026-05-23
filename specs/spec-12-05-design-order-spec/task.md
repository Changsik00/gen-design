# Task List: spec-12-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (phase-12.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-12-05-design-order-spec` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: order.ts 파서 — TDD Red (order-args.test.ts)

- [ ] `packages/gd-cli/src/commands/__tests__/order-args.test.ts` 작성 (12 케이스)
  - parseOrderFile: 유효한 .order.md → OrderSpec
  - validation 규칙 매핑 (required / email / min / max)
  - actions 매핑 (form-submit / nav)
  - 파일 없음 → null
  - validateOrderSpec 오류 감지
- [ ] 테스트 실행 → 전부 Red 확인
- [ ] Commit: `test(spec-12-05): order-args red — parseOrderFile and validateOrderSpec`

---

## Task 3: order.ts 파서 — Green (parseOrderFile 구현)

- [ ] `packages/gd-cli/src/commands/order.ts` 구현:
  - `parseOrderFile(path): OrderSpec | null` — YAML frontmatter 파싱
  - `validateOrderSpec(spec): string[]` — 필드 타입 검증
  - 인터페이스: `ZodRule` / `ActionSpec` / `DataSpec` / `OrderSpec`
- [ ] `pnpm test` → order-args.test.ts 전부 Green
- [ ] Commit: `feat(spec-12-05): implement parseOrderFile and validateOrderSpec`

---

## Task 4: order-runtime — TDD Red (order-runtime.test.ts)

- [ ] `packages/gd-cli/src/commands/__tests__/order-runtime.test.ts` 작성 (10 케이스)
  - generateOrderTsx: zod schema 생성 (email / min / required)
  - useForm binding 생성
  - onSubmit fetch 생성 (form-submit → POST endpoint)
  - nav action → 주입 없음 (scope 외)
  - `.order.md` 없는 씬 → 기존 TSX 동일
- [ ] 테스트 실행 → 전부 Red 확인
- [ ] Commit: `test(spec-12-05): order-runtime red — generateOrderTsx and compileSceneWithOrder`

---

## Task 5: order-runtime — Green (generateOrderTsx + react.ts 통합)

- [ ] `order.ts` 에 추가:
  - `generateOrderTsx(spec: OrderSpec): OrderTsxChunks`
  - `OrderTsxChunks`: imports / schemaDecl / formInit / onSubmit
- [ ] `react.ts` 수정:
  - `parseOrderFile` + `generateOrderTsx` import
  - `runReact` 내부: `<slug>.order.md` 탐지 → 있으면 OrderTsxChunks 주입
- [ ] `pnpm test` → order-runtime.test.ts 전부 Green, 기존 테스트 회귀 없음
- [ ] Commit: `feat(spec-12-05): generateOrderTsx and react integration`

---

## Task 6: gd-chat.md §5.8 추가

- [ ] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` 수정:
  - §5.7 다음에 §5.8 삽입 — `.order.md` draft 생성 가이드
  - §12 종료 조건: §5.8 항목 추가
- [ ] Commit: `feat(spec-12-05): add §5.8 order-md draft guide to gd-chat`

---

## Task 7: v5 시뮬레이션 검증

- [ ] `experiments/dogfood-alpha-v5/chats/scenes/login.order.md` 작성
  - validation: email + password
  - actions: submit (POST /auth/login), signup-link (nav /signup)
- [ ] `gd react login` 실행 시뮬 → TSX zod schema + useForm 포함 확인
- [ ] `experiments/dogfood-alpha-v5/transcripts/scene-6-order.md` 작성
- [ ] Commit: `docs(spec-12-05): v5 order-spec simulation transcript`

---

## Task 8: Ship

- [ ] 최종 검토: `gd-chat.md` 행수 확인 / DoD 체크
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-12-05): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-12-05-design-order-spec`
- [ ] **PR 생성**: `gh pr create` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 (브랜치 + 2×TDD Red + 2×Green + 스킬 + 시뮬 + Ship) |
| **예상 commit 수** | 7 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-23 |
