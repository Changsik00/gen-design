# Task List: spec-13-04

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout phase-13-vertical-slice && git pull`
- [x] `git checkout -b spec-13-04-gd-extract`
- Commit: 없음

---

## Task 2 — 테스트 작성 (TDD Red)

`extract.test.ts` 작성 → 테스트 실패 확인.

- [ ] `packages/gd-cli/src/commands/__tests__/extract.test.ts` 신규 작성:
  - `parseExtractArgs` — `<file>`, `--all`, `--dry-run`, `--chat-root` 파싱
  - `parseSectionYaml` — Scenarios/API YAML 추출
  - `generateMswHandlers` — loaded/loading/error 각 타입별 handler 형식
  - `generateApiSpec` — API spec Markdown 형식
  - v2 frontmatter 없는 파일 → skip + 경고
  - 잘못된 YAML → exit 1
- [ ] `pnpm --filter @gd/cli test` → 테스트 실패 확인
- [ ] Commit: `test(spec-13-04): add failing tests for gd extract command`

---

## Task 3 — extract.ts 구현 (TDD Green)

- [ ] `packages/gd-cli/src/commands/extract.ts` 신규 구현:
  - `parseExtractArgs(argv)` — 인수 파싱
  - `parseSectionYaml(content, keyword)` — 섹션 YAML 추출
  - `generateMswHandlers(slug, scenarios, apis)` — MSW v2 TypeScript 생성
  - `generateApiSpec(slug, apis)` — API spec Markdown 생성
  - `runExtract(argv, opts)` — 진입점 (파일 읽기/쓰기)
- [ ] `pnpm --filter @gd/cli test` → 모든 테스트 PASS
- [ ] Commit: `feat(spec-13-04): implement gd extract — chat.md v2 → MSW handlers + API spec`

---

## Task 4 — CLI 등록

- [ ] `packages/gd-cli/src/cli.ts`에 `extract` 명령 추가
- [ ] `pnpm --filter @gd/cli test` → PASS 유지
- [ ] `pnpm --filter @gd/cli typecheck` → PASS
- [ ] Commit: `feat(spec-13-04): register extract command in CLI`

---

## Task 5 — 예시 파일로 수동 검증

- [ ] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`로 실제 실행
- [ ] 생성된 `.msw.ts` + `.api-spec.md` 확인
- [ ] Commit: `docs(spec-13-04): add generated examples from dashboard.chat.md`

---

## Task 6 — Ship

- [x] 전체 테스트 PASS 확인
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-13-04): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-13-04-gd-extract`
- [ ] **PR 생성**: `phase-13-vertical-slice` 타겟
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-29 |
