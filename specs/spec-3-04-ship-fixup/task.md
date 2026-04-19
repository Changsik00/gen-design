# Task List: spec-3-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new ship-fixup` 완료)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] phase-3.md SPEC 표 spec-3-04 행 자동 추가됨 (sdd)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-3-04-ship-fixup` (base: `phase-3-app-blueprint`)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. pre-flight artifacts commit
- [x] `specs/spec-3-04-ship-fixup/{spec,plan,task}.md` + `backlog/{phase-3,queue}.md` 변경 커밋
- [x] Commit: `docs(spec-3-04): add spec/plan/task artifacts`

---

## Task 2: C1 — DESIGN.md.template 신설

### 2-1. 템플릿 파일 추가
- [x] `templates/DESIGN.md.template` 신설 — design-md-schema 14섹션 전부 포함
  - Section 1~9: 기존 DESIGN.md 9섹션 (Visual / Color / Typography / Component Stylings / Layout / Elevation / Do's & Don'ts / Responsive / Agent Prompt)
  - Section 10~14: 확장 (Naming / Page Specs / Composites / Token Mapping / i18n References)
  - Header: `{{appName}}` / `{{defaultTheme}}` / `{{supportedThemes}}` / assets 경로 안내
  - LoginPage 참고 예시 블록 포함
- [x] `README.md:114` 디렉토리 트리 일치 확인 예정 (Task 6 에서 README 정리 시)
- [x] Commit: `docs(spec-3-04): add DESIGN.md.template (C1)`

---

## Task 3: C3 — 변환 실행 주체 (Fill Executor) 명시

### 3-1. blueprint-protocol.md §3.5 추가
- [x] `schema/blueprint-protocol.md` 에 "변환 실행 주체 (Fill Executor)" 섹션 추가
  - 기본 주체: AI-direct-fill + 실행 순서 5단계
  - `{{var}}`, `{{obj.field}}`, `{{#each list}}...{{/each}}` 해석 규칙 각 1 예시 + 실제 입출력 쌍
  - 대체 주체: Handlebars CLI 실행 예시 1 케이스 + 선택 기준 표
- [x] Commit: `docs(spec-3-04): specify fill executor in blueprint-protocol (C3)`

---

## Task 4: C4 — Schema 정합 (질의서 YAML 에 12필드 추가)

### 4-1. blueprint-protocol.md schema 확장
- [x] Step 1 출력에 `meta.name` (slug) 추가
- [x] **Step 1.5 비기능 요구사항** 신설 (auth / i18n / theme 3 질문)
- [x] Step 3 출력을 **최종 통합 구조** 로 교체 (meta/auth/i18n/theme/finalPages)
- [x] finalPages 에 `name`, `category`, `componentPath` 추가
- [x] 자동 유도 필드 규칙 + DESIGN.md 전용 확장 필드 규칙 추가
- [x] 매핑 규칙 표 확장 (schema key ↔ placeholder 전체 21행) + 자동 주입/외부 소스 표 추가

### 4-2. 템플릿 placeholder nested 정합
- [x] `REQUIREMENTS.md.template` — 모든 placeholder 를 nested 접근으로 (`{{meta.appName}}`, `{{auth.method}}`, `{{theme.defaultTheme}}`, `{{#each finalPages}}`, `{{templateMapping.template}}`) 
- [x] `AGENT.md.template` — 동일 원칙 (schema 기반은 nested, 외부 주입은 literal 유지)
- [x] `DESIGN.md.template` — 헤더 meta/theme/i18n 를 nested 로, `{{#each pages}}` → `{{#each finalPages}}`
- [x] grep 검증: 세 템플릿의 모든 placeholder 가 schema 또는 자동 주입/literal 목록에 포함됨 확인
- [x] Commit: `docs(spec-3-04): align schema with template placeholders (C4)`

---

## Task 5: C2-1 — 파일 이주 (studio → templates/assets)

### 5-1. 파일 이주 (git mv)
- [x] `studio/src/i18n/ko.json` → `templates/assets/i18n/ko.json`
- [x] `studio/src/i18n/en.json` → `templates/assets/i18n/en.json`
- [x] `studio/tokens/tokens.json` → `templates/assets/tokens/tokens.json`
- [x] `studio/tokens/tokens-brand-b.json` → `templates/assets/tokens/tokens-brand-b.json`
  (※ plan 의 `tokens.dark.json`/`tokens.semantic.json` 은 실제 파일명과 달랐음 — 실제로는 `tokens-brand-b.json` 만 추가 토큰)
- [x] `studio/tokens/build.mjs` 는 이주하지 않음 (studio 전용 빌드 스크립트) — 경로 수정은 Task 6
- [x] `studio/src/i18n/` 빈 디렉토리 제거
- [x] `templates/assets/i18n/.gitkeep`, `templates/assets/tokens/.gitkeep` 제거 (실제 파일 추가됨)
- [x] Commit: `refactor(spec-3-04): migrate i18n/tokens to templates/assets (C2)`

---

## Task 6: C2-2 — Vite alias + tsconfig + import 경로 변경

### 6-1. 빌드 설정 수정
- [x] `studio/vite.config.ts` 에 `@assets` alias 추가 (→ `../templates/assets`)
- [x] `studio/vitest.config.ts` 에 동일 alias 추가 (테스트 일관성)
- [x] `studio/tsconfig.app.json` + `tsconfig.json` paths 에 `"@assets/*"` 추가
- [x] `studio/tokens/build.mjs` — `readFileSync` 경로를 `../../templates/assets/tokens/` 로 수정 (Node 스크립트는 alias 미적용, 상대 경로)

### 6-2. 소스 import 경로 변경
- [x] `studio/src/lib/i18n.ts`: `@/i18n/{ko,en}.json` → `@assets/i18n/{ko,en}.json` (i18n 참조 파일은 이 하나뿐)
- [x] 토큰 JSON 은 TS import 없음 (build.mjs 에서만 읽음 — 6-1 에서 처리)

### 6-3. templates/assets/README.md 정리
- [x] "studio 참조 방식 (향후)" 3-옵션 나열 제거
- [x] Vite alias 단일 결정으로 교체 + 기각 근거 (symlink / 빌드 복사) 표로 보존
- [x] 이주 상태 표에 `✓` 완료 표기, studio 실제 설정 snippet 포함

### 6-4. 빌드/테스트 검증
- [x] `pnpm --dir studio tokens` PASS
- [x] `pnpm --dir studio build` PASS (vite 149ms, 1906 modules)
- [x] `pnpm -s exec vitest run` PASS (12 files / 63 tests)
- [x] Commit: `refactor(spec-3-04): studio references templates/assets via @assets alias (C2)`

---

## Task 7: FR6 — 잔재 정리

### 7-1. .gitignore 에 uninstall backup 패턴 추가
- [x] `.gitignore` 에 `.harness-uninstall-backup-*/` 패턴 추가 (git status 에서 untracked 제거됨 확인)
- [-] `.harness-uninstall-backup-20260417-135520/` 디렉토리 물리 삭제: **사용자 판단으로 이월** (rm -rf 권한 거부됨 — harness upgrade 롤백용 백업이라 사용자가 보관 여부 결정)
- [x] Commit: `chore(spec-3-04): ignore harness uninstall backup dirs (FR6)`

---

## Task 8: FR5 — PR #14 body 정직 채점 (pr_description.md 먼저)

### 8-1. pr_description.md 에 교체 본문 작성
- [ ] `specs/spec-3-04-ship-fixup/pr_description.md` 초안 작성 (spec-3-04 단독 PR body)
- [ ] Phase PR #14 용 교체 본문은 **Task 9 Ship 단계**에서 `walkthrough.md` 작성 후 갱신

### 8-2. 상태 기록
- [ ] 본 task 는 "문서 초안 + 계획 기록" 단계. 실제 `gh pr edit 14` 는 Task 9 Ship 완료 후 실행
- [ ] Commit: 없음 (Task 9 에서 walkthrough/pr_description 과 함께 ship commit)

---

## Task 9: Ship (spec-3-04 단독 PR + phase PR #14 body 갱신)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 품질 점검: `pnpm --dir studio build` + `pnpm --dir studio test` 최종 PASS
- [ ] **walkthrough.md 작성** (C1~C4 + FR5/FR6 증거 로그)
- [ ] **pr_description.md 작성** (spec-3-04 단독 PR 용)
- [ ] **Ship Commit**: `docs(spec-3-04): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-3-04-ship-fixup`
- [ ] **spec-3-04 PR 생성**: base = `phase-3-app-blueprint`, `/hk-pr-gh` 또는 `gh pr create`
- [ ] **사용자 알림**: spec-3-04 PR URL 보고
- [ ] (사용자 merge 후) **phase PR #14 body 갱신**: `gh pr edit 14 --body-file <phase-14-body>` 로 `3 PASS / 2 PARTIAL / 2 FAIL` 블록 반영

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 (Pre-flight 제외) |
| **예상 commit 수** | 7 (Task 1 브랜치 생성 제외, Task 8 은 commit 없음, Task 9 ship commit 1개) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-04-19 |
