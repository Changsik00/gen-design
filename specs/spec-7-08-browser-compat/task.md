# Task List: spec-7-08

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] spec.md, plan.md, task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-7-08-browser-compat`
- [ ] Commit: 없음

---

## Task 2: node:fs 브라우저 번들 제거

- [ ] `spec-md/parser/index.ts` — `readFileSync` import + `parseFile` 제거
- [ ] `spec-md/parser/node.ts` 신규 — `parseFile` (Node 전용)
- [ ] `spec-md/lint/index.ts` — import 경로 `./node` 로 변경
- [ ] `spec-md-compiler/paper/compile.ts` — `readFileSync` import 제거, `CompileInput` path 오버로드 제거
- [ ] `spec-md-compiler/cli/spec-paper.ts` — `readFileSync` 직접 처리
- [ ] 영향받는 테스트 4개 수정 (compile.test.ts, compile-fixtures.test.ts, parse-api.test.ts)
- [ ] `pnpm test` → 655 PASS
- [ ] Commit: `fix(spec-7-08): node:fs 브라우저 번들 제거`

---

## Task 3: PaperImportPanel → catalog.json 연결

- [ ] `catalog.json` 형식 확인 → `CatalogMap` 변환 헬퍼 작성
- [ ] `PaperImportPanel.tsx` — `EMPTY_CATALOG` → 실 catalog import + 변환
- [ ] `pnpm test` → PASS
- [ ] Commit: `fix(spec-7-08): PaperImportPanel catalog.json 연결`

---

## Task 4: Ship

- [ ] `pnpm test` → 전체 PASS
- [ ] walkthrough.md 작성
- [ ] pr_description.md 작성
- [ ] Ship Commit
- [ ] Push + PR (`gh pr create --base phase-7-design-md`)

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 3 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
