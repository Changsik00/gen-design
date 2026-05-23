# Task List: spec-11-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-11.md SPEC 표 자동 갱신됨)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + monorepo 셋업

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-11-01-create-gd-react-scaffold`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. pnpm workspace 에 `packages/*` 추가
- [ ] `pnpm-workspace.yaml` 수정 — `packages` 항목에 `packages/*` 추가
- [ ] `packages/create-gd-react/` 디렉토리 생성 + `package.json` (deps: kleur, tar, devDeps: tsup, vitest, typescript)
- [ ] `tsconfig.json` (strict, ESM, target Node 20)
- [ ] `pnpm install` 실행 → workspace link 확인
- [ ] Commit: `chore(spec-11-01): add packages/create-gd-react workspace scaffold`

---

## Task 2: CLI 코어 — fetcher / postprocess / fallback / messages (TDD)

### 2-1. 메시지 + 타입 정의 (Red 준비)
- [ ] `src/messages.ts` — 한국어 메시지 모음
- [ ] `src/types.ts` — `ScaffoldOptions`, `Preset`
- [ ] Commit: `feat(spec-11-01): add messages and types for create-gd-react CLI`

### 2-2. fallback (offline preset 복사) — TDD
- [ ] `__tests__/fallback.test.ts` — fixture 디렉토리 → 복사 후 파일 존재 검증 (Red)
- [ ] `pnpm --filter create-gd-react test --run` → Fail
- [ ] `src/fallback.ts` — recursive copy 구현 (Green)
- [ ] 테스트 PASS 확인
- [ ] Commit: `feat(spec-11-01): implement offline fallback preset copy`

### 2-3. postprocess (placeholder 치환 + MEMORY.md 초기화) — TDD
- [ ] `__tests__/postprocess.test.ts` — fixture → 후처리 후 변환 결과 검증 (Red)
- [ ] `pnpm --filter create-gd-react test --run` → Fail
- [ ] `src/postprocess.ts` 구현 (Green)
- [ ] Commit: `feat(spec-11-01): implement postprocess for project name and memory init`

### 2-4. fetcher (GitHub tarball sparse extract) — TDD
- [ ] `__tests__/fetcher.test.ts` — fixture tarball (로컬 파일) → sparse extract 검증 (Red, 네트워크 없이)
- [ ] `src/fetcher.ts` 구현 — `tar.x` with filter (Green)
- [ ] Commit: `feat(spec-11-01): implement github tarball sparse extract`

### 2-5. cli.ts entry — 통합
- [ ] `src/cli.ts` — parseArgs + 흐름 (검증 → fetch/fallback → postprocess → install → 안내)
- [ ] `__tests__/cli.test.ts` — `--offline` 모드로 임시 디렉토리에 scaffold → 결과 검증
- [ ] `pnpm --filter create-gd-react build` → `dist/cli.js` 생성 확인
- [ ] Commit: `feat(spec-11-01): wire up cli.ts entry point with parseArgs`

---

## Task 3: presets-bundled/default/ — 인프라 + stack 파일

> 본 task 는 *코드 자체* 가 산출물. 디자이너가 받을 *고정 surface* 전부 작성.

### 3-1. 기본 React + Vite + TypeScript 셋업
- [ ] `presets-bundled/default/package.json` — phase-11.md §🎨 의 모든 deps
- [ ] `presets-bundled/default/vite.config.ts`, `tsconfig*.json`, `index.html`
- [ ] `presets-bundled/default/tailwind.config.ts`, `postcss.config.js`, `components.json`
- [ ] `presets-bundled/default/.eslintrc.cjs`, `.prettierrc.json`, `lefthook.yml`, `.gitignore`
- [ ] Commit: `feat(spec-11-01): add base React+Vite+TypeScript stack to default preset`

### 3-2. src/ infrastructure (lib / api / config / i18n / styles)
- [ ] `src/main.tsx`, `src/router.tsx`
- [ ] `src/lib/utils.ts` (cn), `src/lib/sentry.ts` (no-op fallback), `src/lib/logger.ts` (consola)
- [ ] `src/api/client.ts` (ky instance), `src/api/hooks/.gitkeep`
- [ ] `src/config/env.ts` (@env-kit/node-settings)
- [ ] `src/i18n/index.ts` + `locales/{ko,en}.json`
- [ ] `src/styles/globals.css` (Tailwind + CSS vars)
- [ ] Commit: `feat(spec-11-01): add src infrastructure (lib/api/config/i18n/styles)`

### 3-3. shadcn UI 기본 5종 + sample scene
- [ ] `src/components/ui/{button,card,input,label,separator}.tsx` (shadcn copy)
- [ ] `src/components/composites/.gitkeep`, `src/components/templates/.gitkeep`
- [ ] `src/stores/.gitkeep`, `src/types/.gitkeep`
- [ ] `src/scenes/welcome.tsx` — `// @gd:` annotation 포함 sample
- [ ] Commit: `feat(spec-11-01): add shadcn ui components and welcome scene sample`

### 3-4. chats/ + templates/ (DESIGN/TOKEN placeholder)
- [ ] `chats/_shell.chat.md` (frontmatter 만)
- [ ] `chats/scenes/welcome.chat.md` (3층 sample)
- [ ] `templates/DESIGN.md` (placeholder + 가이드 주석)
- [ ] `templates/TOKEN.md` (placeholder + 가이드 주석)
- [ ] `templates/assets/tokens/tokens.json` (DTCG 기본 — primary / bg / text / spacing)
- [ ] Commit: `feat(spec-11-01): add chats and templates placeholder files`

### 3-5. templates/FRONT.md — agent stack guide (가장 큰 산출물)
- [ ] `templates/FRONT.md` — phase-11.md §🎨 의 15 절 전체 (Stack / State / HTTP / Env / Sentry / Logger / Pre-check / i18n / Form/Date / E2E+a11y / DRY 룰 / 폴더 / Performance / 보안 / AGENT.md 안내)
- [ ] Commit: `feat(spec-11-01): write FRONT.md agent stack guide (15 sections)`

### 3-6. templates/AGENT.md — 행동 가이드
- [ ] `templates/AGENT.md` — FRONT.md 의 명령형 버전 (agent 가 코드 쓸 때 따라야 할 규칙)
- [ ] Commit: `feat(spec-11-01): write AGENT.md behavioral rules for agents`

### 3-7. .claude/skills/ placeholder + .gd/memory/ 초기 인덱스
- [ ] `.claude/skills/gd-{start,chat,token,design}.md` placeholder (한 줄 설명 + spec-11-02 에서 본문 예정 주석)
- [ ] `.gd/memory/MEMORY.md` placeholder 인덱스
- [ ] Commit: `feat(spec-11-01): add .claude/skills placeholders and .gd/memory index`

### 3-8. README.md (📖 진입점)
- [ ] `presets-bundled/default/README.md` — phase-11.md §scaffold README.md 구성 그대로 + `{{project-name}}` placeholder
- [ ] Commit: `feat(spec-11-01): write scaffold README.md entry point`

---

## Task 4: 통합 테스트 — 임시 디렉토리 scaffold → install → typecheck → build

### 4-1. 통합 테스트 스크립트 작성
- [ ] `packages/create-gd-react/scripts/test-integration.sh` — 임시 디렉토리에 scaffold + install + typecheck + build + test
- [ ] 로컬 실행 → 모든 단계 PASS
- [ ] Commit: `test(spec-11-01): add integration test for end-to-end scaffold flow`

### 4-2. 통합 테스트 결과 기록
- [ ] 실행 시간 측정 (각 step), 결과를 walkthrough.md 에 사용할 수 있는 형태로 stdout 기록
- [ ] Commit: 없음 (4-1 에 포함)

---

## Task 5: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter create-gd-react lint`
- [ ] 단위 테스트: `pnpm --filter create-gd-react test --run` → PASS
- [ ] 통합 테스트: `bash packages/create-gd-react/scripts/test-integration.sh` → PASS
- [ ] 기존 회귀: `pnpm --filter studio test --run` → 998 PASS 유지
- [ ] **walkthrough.md 작성** (증거 로그 + 통합 테스트 결과)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-11-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-11-01-create-gd-react-scaffold`
- [ ] **PR 생성**: `gh pr create --base phase-11-designer-onboarding-skill`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 |
| **예상 commit 수** | 14 (pre-flight 1 + Task 1-2 + Task 2: 5 + Task 3: 8 + Task 4: 1 + Task 5 ship: 1) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |

---

## 작업 의존성

```
Task 1 (workspace 셋업)
  ↓
Task 2 (CLI 코드 TDD)
  ↓
Task 3 (preset 콘텐츠 — 큰 작업, 8 commit)
  ↓
Task 4 (통합 테스트 — Task 2+3 결과 검증)
  ↓
Task 5 (Ship)
```
