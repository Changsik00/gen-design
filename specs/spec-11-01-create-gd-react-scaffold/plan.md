# Plan: spec-11-01 — `create-gd-react` npm package + GitHub default preset

## 📋 Branch Strategy

- 신규 브랜치: `spec-11-01-create-gd-react-scaffold`
- 시작 지점: `phase-11-designer-onboarding-skill` (phase base branch — 첫 ship 시 자동 생성)
- 첫 task 가 브랜치 생성 수행

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **GitHub preset repo 신규 생성**: `github.com/<owner>/gen-design-presets` 신규 repo 필요. 이번 spec 은 *npm package 안 fallback default preset (`presets-bundled/`) 만* 작업. 실제 GitHub repo fetch 동작은 phase-11 끝 또는 phase-12 에서.
> - [ ] **monorepo 위치**: `create-gd-react` 패키지를 현 `gen-design` repo 의 `packages/create-gd-react/` 에 둠 (pnpm workspace 추가)
> - [ ] **`@gd/cli` 분리**: 이번 spec 은 vendored copy — `studio/scripts/gen-design.ts` 의 필요 명령 (`react`, `lint`) 코드를 preset 의 `node_modules/@gd/cli` 가 아닌 `node_modules/.bin/gd` 로 vendored. 실 npm publish 분리는 phase-12 후보.

> [!WARNING]
> - [ ] npm 이름 선점: unscoped `create-gd-react` 사용 가능 여부 검토 (실 publish 는 phase 끝에서)
> - [ ] `pnpm-workspace.yaml` 에 `packages/*` 추가 시 기존 `studio/`, `app-a/` 영향 확인

## 🎯 핵심 전략

### 아키텍처

```
gen-design (현 repo, monorepo)
├── pnpm-workspace.yaml         # packages/* 추가
└── packages/
    └── create-gd-react/        # 신규
        ├── src/
        │   ├── cli.ts          # bin entry (Node 20 parseArgs)
        │   ├── fetcher.ts      # GitHub tarball fetch + sparse extract
        │   ├── postprocess.ts  # placeholder 치환 + .gd/memory 초기화
        │   ├── fallback.ts     # --offline: presets-bundled 복사
        │   └── messages.ts     # 한국어 안내
        ├── presets-bundled/    # 가장 큰 산출물
        │   └── default/        # FRONT.md 명세대로 전체 stack
        ├── __tests__/
        ├── package.json
        └── tsconfig.json
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|---|---|---|
| CLI 의존성 | Node 20 native `parseArgs` + `kleur` + `tar` 만 | 외부 deps 최소, ~50KB |
| Tarball fetch | `https://github.com/<repo>/archive/main.tar.gz` 직접 | git CLI 의존 X |
| Sparse extract | `tar.x` 의 `filter` 옵션으로 `presets/<name>/` 만 추출 | 전체 tarball 받아도 디스크 사용 최소 |
| 후처리 | placeholder 치환 + 초기 파일 생성 | preset 은 *템플릿*, 변환은 CLI 책임 |
| Offline fallback | `presets-bundled/default/` 를 npm package 안에 포함 | 첫 사용 보장 (네트워크 / GitHub 다운 시) |
| Build tool | `tsup` (esbuild 기반) | 빠른 ESM 단일 파일 출력 |
| Test | `vitest` (기존 프로젝트 일관성) | 학습 비용 0 |

### ADR 후보

- [x] `ADR-011-create-gd-react-stack` — Vite + React 19 + 전체 stack 일괄 결정. 본 spec 머지 시 작성.

## 📂 Proposed Changes

### 1. monorepo 셋업

#### [MODIFY] `pnpm-workspace.yaml`

```yaml
packages:
  - studio
  - app-a
  - packages/*    # 신규
```

### 2. CLI 패키지 (packages/create-gd-react/)

#### [NEW] `package.json`

```json
{
  "name": "create-gd-react",
  "version": "0.1.0",
  "description": "Scaffold a React project with gen-design (gd) integrated",
  "type": "module",
  "bin": { "create-gd-react": "./dist/cli.js" },
  "files": ["dist", "presets-bundled"],
  "engines": { "node": ">=20" },
  "dependencies": { "kleur": "^4.1.5", "tar": "^7.4.3" },
  "devDependencies": { "typescript": "^5.7.0", "vitest": "^4.0.0", "tsup": "^8.3.0", "@types/node": "^22.0.0" },
  "scripts": {
    "build": "tsup src/cli.ts --format esm --target node20 --clean --shims",
    "test": "vitest run",
    "lint": "eslint .",
    "prepublishOnly": "pnpm build"
  }
}
```

#### [NEW] `src/cli.ts` (entry)

- `parseArgs` 로 args 파싱
- 흐름: 검증 → fetch/fallback → postprocess → install → 안내

#### [NEW] `src/fetcher.ts` (GitHub fetch)

- `https.get` → stream → `tar.x` with filter
- 5초 타임아웃, 실패 시 errorNetwork 메시지

#### [NEW] `src/postprocess.ts`

- `package.json` name 치환
- `README.md` `{{project-name}}` 치환
- `.gd/memory/MEMORY.md` 인덱스 작성

#### [NEW] `src/fallback.ts`

- `presets-bundled/<preset>/` → 대상 디렉토리로 recursive copy

#### [NEW] `src/messages.ts`

- 한국어 메시지 모음 (success / errorNetwork / errorDirExists / nextSteps)

### 3. presets-bundled/default/ (preset 콘텐츠 — 가장 큰 작업)

> 전체 파일 목록은 spec.md FR §8 참고. 핵심:

#### [NEW] `presets-bundled/default/package.json`

phase-11.md §🎨 FRONT.md 명세의 *모든 deps* 박힘:
- runtime: `react@19`, `react-dom@19`, `react-router@7`, `@tanstack/react-query@5`, `zustand@5`, `jotai@2`, `ky@1`, `@sentry/react@8`, `consola@4`, `@env-kit/node-settings@latest`, `react-i18next@16`, `i18next@24`, `react-hook-form@7`, `zod@4`, `date-fns@4`, `isomorphic-dompurify@2`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
- shadcn 기본 5종 deps: `@radix-ui/react-slot`, `@radix-ui/react-separator`, `@radix-ui/react-label`
- dev: `vite@7`, `@vitejs/plugin-react@4`, `typescript@5.7`, `tailwindcss@3`, `@tailwindcss/vite@4`, `postcss`, `autoprefixer`, `eslint@9`, `@typescript-eslint/*`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`, `prettier@3`, `vitest@4`, `@testing-library/react@16`, `@testing-library/jest-dom`, `@testing-library/user-event@14`, `jsdom`, `@playwright/test@1.50`, `@axe-core/playwright`, `lefthook`
- scripts: `dev`, `build`, `preview`, `test`, `typecheck`, `lint`, `format`, `precheck`, `gd`

#### [NEW] `presets-bundled/default/vite.config.ts`

- React plugin + Tailwind Vite plugin + path alias (`@` → `src`)
- env prefix: `PUBLIC_`

#### [NEW] `presets-bundled/default/src/`

`spec.md FR §8` 의 모든 파일 — 각 파일은 *작동하는 최소 보일러플레이트*:
- `lib/sentry.ts`: DSN 없으면 console.log no-op
- `lib/logger.ts`: consola scope wrapper
- `api/client.ts`: ky instance (베이스 URL = env.PUBLIC_API_URL || '')
- `config/env.ts`: @env-kit/node-settings 사용 + 타입 export
- `scenes/welcome.tsx`: `// @gd: chats/scenes/welcome.chat.md` annotation 포함 sample

#### [NEW] `presets-bundled/default/templates/FRONT.md`

> 본 spec 의 *가장 중요한 산출물*. phase-11.md §🎨 의 모든 결정을 *agent 가 읽고 행동할 수 있는 형태* 로 작성. ~15 절 (Stack / State / HTTP / Env / Sentry / Logger / Pre-check / i18n / Form/Date / E2E+a11y / DRY 룰 / 폴더 구조 / Performance / 보안 / AGENT.md 안내).

#### [NEW] `presets-bundled/default/templates/AGENT.md`

> FRONT.md 의 *명령형 행동 가이드*. "agent 가 코드를 작성할 때 반드시 따라야 할 규칙":
> - "서버 데이터는 반드시 TanStack Query 훅으로 감쌀 것"
> - "useEffect 안 setState 금지"
> - "직접 fetch 금지 — `src/api/client.ts` 의 ky instance 사용"
> 등.

#### [NEW] `presets-bundled/default/chats/`

- `_shell.chat.md`: 빈 shell (frontmatter 만)
- `scenes/welcome.chat.md`: 환영 신 sample (3층 구조 예시)

#### [NEW] `presets-bundled/default/.claude/skills/gd-*.md` (4종 placeholder)

본 spec 은 *placeholder + 한 줄 설명* 만. 본문은 spec-11-02.

### 4. 테스트

#### [NEW] `__tests__/cli.test.ts`

- 임시 디렉토리 `mkdtempSync` → `--offline` 모드 호출 → 결과 디렉토리 검증
- README.md placeholder 치환 확인
- `.gd/memory/MEMORY.md` 생성 확인

#### [NEW] `__tests__/postprocess.test.ts`

- fixture 디렉토리 → 후처리 → 변환 결과 확인

## 🧪 검증 계획

### 단위 테스트
```bash
pnpm --filter create-gd-react test --run
```

### 통합 테스트 (Integration Test Required = yes)
```bash
# 1. CLI 빌드
pnpm --filter create-gd-react build

# 2. 임시 디렉토리에 scaffold
TMPDIR=$(mktemp -d)
node packages/create-gd-react/dist/cli.js "$TMPDIR/gd-test" --offline --no-install

# 3. install + typecheck + build
cd "$TMPDIR/gd-test"
pnpm install
pnpm typecheck
pnpm build
pnpm test
```

### 수동 검증 시나리오
1. `pnpm pack` 후 `npx <tarball> /tmp/my-app --offline` → `/tmp/my-app/` 생성
2. `/tmp/my-app/README.md` 읽기 → 30초 안에 워크플로 이해 가능 여부 측정
3. `cd /tmp/my-app && pnpm install && pnpm dev` → Vite dev server 8.3 정상 기동, welcome scene 표시
4. `pnpm typecheck` PASS
5. `pnpm test` PASS

## 🔁 Rollback Plan

- `packages/create-gd-react/` 디렉토리 통째 삭제
- `pnpm-workspace.yaml` 의 `packages/*` 추가 패턴 제거
- npm publish 안 한 상태이므로 외부 영향 0

## 📦 Deliverables 체크

- [x] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
