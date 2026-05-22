# feat(spec-11-01): `create-gd-react` npm 패키지 + GitHub default preset

## Summary

- **`npx create-gd-react <name>`** — 디자이너용 React 프로젝트 한 줄 scaffold
- **Hybrid 아키텍처**: npm CLI (~50KB) + GitHub preset 호스팅 (`--offline` 시 번들 fallback)
- **41 파일 default preset**: Vite 7 + React 19 + shadcn/ui + zustand + jotai + TanStack Query + ky + Sentry + consola + react-i18next + react-hook-form + zod + date-fns + eslint 9 + prettier + vitest 4 + Playwright + lefthook
- **FRONT.md** (Agent Stack Guide 15 sections) + **AGENT.md** (명령형 행동 규칙)
- **`.claude/skills/gd-{start,chat,token,design}.md`** (placeholder — 본문은 spec-11-02)
- **`.gd/memory/MEMORY.md`** — 디자이너 정보 디스크 캐시 인덱스
- **lat.md 개념 차용**: TSX 출력에 `// @gd: chats/scenes/...` annotation (drift 감지 기반)

## 변경 파일

| 구분 | 위치 |
|---|---|
| 신규 패키지 | `packages/create-gd-react/` (workspace) |
| CLI 코드 | `src/{cli,fetcher,fallback,postprocess,messages,types,args}.ts` |
| 단위 테스트 | `__tests__/{cli,fetcher,fallback,postprocess}.test.ts` — 25 PASS |
| 통합 테스트 | `scripts/test-integration.sh` — 5/5 PASS |
| Default preset (41 files) | `presets-bundled/default/` |
| Workspace | `pnpm-workspace.yaml` — `packages/*` 추가 |

## 핵심 결정 반영 (phase-11.md §결정 기록)

| # | 결정 | 구현 |
|---|---|---|
| 1 | npx scaffold | `create-gd-react` bin |
| 2 | onboarding + 첫 React | scaffold + welcome sample |
| 3 | Paper optional | Paper 의존 X |
| 4 | 고정 vs 디자이너 surface | 명시 분리 |
| 6 | SKILL.md 신형 | frontmatter (name/description) |
| 7 | `gd-` prefix 일괄 | npx/CLI/skill 통일 |
| 9 | `.gd/memory/` 디스크 캐시 | MEMORY.md 인덱스 + 4 entries |
| 10 | lat.md 개념 차용 | TSX `// @gd:` annotation |
| 11 | preset GitHub + offline fallback | fetcher.ts + fallback.ts |
| 12 | README single entry point | 30초 / cheatsheet |
| 13 | FRONT.md = stack guide | 15 sections |
| 14 | React stack 일괄 고정 | preset/package.json |

## Test plan

- [x] `pnpm --filter create-gd-react test` → 25 passed (4 files)
- [x] `pnpm --filter create-gd-react build` → dist/cli.js 15.34 KB
- [x] `bash packages/create-gd-react/scripts/test-integration.sh` → 5/5 PASS
  - 41 파일 존재 검증
  - placeholder 치환 검증 (package.json name / README / .gd/memory)
  - `pnpm install` (4초) + `tsc --noEmit` (1초) PASS
- [x] `pnpm --filter studio test --run` → 998 passed (회귀 0)
- [x] `--offline` 모드 동작 확인
- [x] `--help`, `--version` 출력 확인

## 후속 작업

| 항목 | spec |
|---|---|
| `.claude/skills/gd-*.md` 본문 + 능동 동작 | spec-11-02 |
| `gd doctor` (DESIGN/TOKEN/chat 정합 + drift 감지) | spec-11-03 |
| dogfooding alpha 실증 (dennis 가 디자이너 모드로 zero → React) | spec-11-04 |
| GitHub preset repo 생성 + 실 fetch 검증 | phase-11 끝 |
| `@gd/cli` 분리 + npm publish | phase-12 |

🤖 Generated with [Claude Code](https://claude.com/claude-code)
