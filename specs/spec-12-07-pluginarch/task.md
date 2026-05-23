# Task List: spec-12-07

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (phase-12.md SPEC 표 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-12-07-pluginarch` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: `registry/` 모듈 신규 + TDD Red

- [ ] `studio/src/lib/chat-md-compiler/registry/metadata.ts` 신규 — 기존 `COMPONENT_IMPORT_PATHS` 내용
- [ ] `studio/src/lib/chat-md-compiler/registry/index.ts` 신규 — `ComponentRegistry` 인터페이스 + `createDefaultRegistry()`
- [ ] `studio/src/lib/chat-md-compiler/react/__tests__/compile.test.ts` 에 커스텀 레지스트리 케이스 추가 (Red)
- [ ] 테스트 실행 → N개 Red 확인
- [ ] Commit: `test(spec-12-07): registry DI red — custom registry in compile`

---

## Task 3: DI 적용 — Green

- [ ] `studio/src/lib/chat-md-compiler/react/compile.ts` — `CompileInput.registry?` 추가, `createDefaultRegistry()` fallback
- [ ] `studio/src/lib/chat-md-compiler/react/imports-builder.ts` — `registry` 매개변수 추가 (default)
- [ ] `pnpm test` (studio) → 전체 Green, 회귀 없음
- [ ] Commit: `feat(spec-12-07): react compiler DI — ComponentRegistry injectable`

---

## Task 4: `paper/component-registry-metadata.ts` re-export + 정합

- [ ] `studio/src/lib/chat-md-compiler/paper/component-registry-metadata.ts` — `registry/metadata.ts` re-export 로 교체
- [ ] `studio/src/lib/chat-md-compiler/paper/component-registry.ts` — `registry/metadata.ts` 직접 import 갱신
- [ ] `pnpm test` 전체 → Green (studio + gd-cli + create-gd-react)
- [ ] Commit: `refactor(spec-12-07): paper/component-registry-metadata re-export from registry/`

---

## Task 5: `gd-start.md` §2 디자인 도구 선택 단계 추가

- [ ] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-start.md` 수정:
  - 기존 §1 다음에 §2 삽입 — Paper / Figma / 손작성 선택 안내
  - 선택에 따라 이후 흐름 분기 설명
- [ ] Commit: `feat(spec-12-07): gd-start §2 design tool selection`

---

## Task 6: Ship

- [ ] 최종 검토: DoD 체크 / 테스트 전체 PASS
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-12-07): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-12-07-pluginarch`
- [ ] **PR 생성**: `gh pr create` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (브랜치 + registry + Red + Green + re-export/gd-start + ship) |
| **예상 commit 수** | 5 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-23 |
