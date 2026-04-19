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
- [ ] `schema/blueprint-protocol.md` 에 "변환 실행 주체 (Fill Executor)" 섹션 추가
  - 기본 주체: AI-direct-fill
  - `{{var}}`, `{{#each list}}...{{/each}}`, nested `{{obj.field}}` 해석 규칙 (각 1 예시)
  - 대체 주체: Handlebars CLI 실행 예시 1 케이스
- [ ] Commit: `docs(spec-3-04): specify fill executor in blueprint-protocol (C3)`

---

## Task 4: C4 — Schema 정합 (질의서 YAML 에 12필드 추가)

### 4-1. blueprint-protocol.md Step 3 YAML 보강
- [ ] Step 3 출력 YAML 예시에 누락 12필드 추가:
  - `meta.appName`, `meta.name`, `meta.pageCount`
  - `auth.method`, `auth.socialProviders`, `auth.sessionStrategy`
  - `i18n.defaultLocale`, `i18n.supportedLocales`
  - `theme.defaultTheme`, `theme.supportedThemes`
  - `pages[].category`, `pages[].componentPath`
- [ ] 매핑 표 (질의서 응답 ↔ placeholder) 에 12 행 추가
- [ ] `REQUIREMENTS.md.template` / `AGENT.md.template` placeholder 와 1:1 매칭 grep 검증

### 4-2. 템플릿 placeholder 불일치 수정
- [ ] `REQUIREMENTS.md.template` / `AGENT.md.template` 에서 schema 와 어긋난 placeholder 조정 (필요시)
- [ ] Commit: `docs(spec-3-04): align schema with template placeholders (C4)`

---

## Task 5: C2-1 — 파일 이주 (studio → templates/assets)

### 5-1. 파일 복사 + 원본 제거
- [ ] `studio/src/i18n/ko.json` → `templates/assets/i18n/ko.json`
- [ ] `studio/src/i18n/en.json` → `templates/assets/i18n/en.json`
- [ ] `studio/tokens/tokens.json` → `templates/assets/tokens/tokens.json`
- [ ] `studio/tokens/tokens.dark.json` → `templates/assets/tokens/tokens.dark.json`
- [ ] `studio/tokens/tokens.semantic.json` → `templates/assets/tokens/tokens.semantic.json`
- [ ] `studio/src/i18n/` 디렉토리 제거 (빈 상태), `studio/tokens/` 도 동일 (빈 상태면 제거)
- [ ] `.gitkeep` 파일 정리
- [ ] Commit: `refactor(spec-3-04): migrate i18n/tokens to templates/assets (C2)`

---

## Task 6: C2-2 — Vite alias + tsconfig + import 경로 변경

### 6-1. 빌드 설정 수정
- [ ] `studio/vite.config.ts` 에 `@assets` alias 추가 (→ `../templates/assets`)
- [ ] `studio/tsconfig.app.json` (또는 `tsconfig.json`) `paths` 에 `"@assets/*"` 추가
- [ ] `pnpm tokens` 스크립트가 `templates/assets/tokens/` 를 읽도록 경로 수정 (필요시)

### 6-2. 소스 import 경로 일괄 변경
- [ ] `studio/src/**/*.{ts,tsx}` 의 i18n import → `@assets/i18n/*`
- [ ] 토큰 JSON import → `@assets/tokens/*`

### 6-3. templates/assets/README.md 정리
- [ ] "studio 참조 방식 (향후)" 섹션의 3-옵션 나열 → **Vite alias 단일 결정** 으로 교체 (symlink / 빌드 복사 기각 근거 포함 또는 삭제)
- [ ] "현재 상태" 블록 문구를 "본 spec(spec-3-04) 에서 완료" 로 갱신, 경로 표에 `✓ 완료` 표기

### 6-4. 빌드/테스트 검증
- [ ] `pnpm --dir studio build` PASS 확인
- [ ] `pnpm --dir studio test` PASS 확인
- [ ] Commit: `refactor(spec-3-04): studio references templates/assets via @assets alias (C2)`

---

## Task 7: FR6 — 잔재 정리

### 7-1. uninstall backup 제거 + .gitignore 갱신
- [ ] `.harness-uninstall-backup-20260417-135520/` 디렉토리 제거
- [ ] `.gitignore` 에 `.harness-uninstall-backup-*/` 패턴 추가
- [ ] Commit: `chore(spec-3-04): cleanup uninstall backup and update gitignore (FR6)`

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
