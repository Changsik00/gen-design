# phase-11: designer-onboarding-skill — npx 스킬 배포 + dogfooding alpha

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-11-{seq}-{slug}/spec.md` 에서 다룹니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-11` |
| **상태** | Planning |
| **시작일** | 2026-05-22 |
| **목표 종료일** | 2026-06-15 |
| **소유자** | dennis |
| **Base Branch** | `phase-11-designer-onboarding-skill` |

## 🎯 배경 및 목표

### 현재 상황

phase-10 까지 기술 자산 (chat.md grammar + Paper/React 컴파일러 + gen-design CLI 5명령 + a11y / E2E 검증) 은 90% 완성. 그러나 **실 사용자 (디자이너) 의 진입로가 없다**:

- 디자이너가 본 프로젝트를 *발견* → *설치* → *첫 chat.md* → *React 받기* 까지의 마찰이 큼
- vision.md §D4 의 "Figma → spec.md 어댑터" 는 점유율 0 함정 회피 전략이지만 *Figma plugin 등록 부담 + 디자이너 학습 비용* 큼
- vision.md §timing 의 "2027 상반기 alpha 진입" 보다 빠른 검증 채널 필요

### 목표 (Goal)

**`npx create-gd-react <name>` 한 줄로 시작 → Claude Code 스킬 가이드 → 첫 React 받기** — 디자이너 진입 마찰 0 에 가까운 채널 구축.

전략 피벗:
- 타깃: *Figma 디자이너* → ***Claude Code 를 쓰는 designer-publisher***
- 채널: Figma plugin → ***npm + Claude Code 스킬***
- 기본 가정: **고정 surface (FRONT.md / shadcn / Tailwind / cn / cva) 는 우리가 제공**, 디자이너는 *DESIGN.md / TOKEN.md / chat.md 3개만* 만진다.

### 성공 기준 (Success Criteria) — 정량 우선

1. `npx create-gd-react <name>` → 디렉토리 + Claude Code 스킬 + gen-design CLI + scaffold 가 5초 안에 설치 완료
2. 신규 사용자가 zero 상태에서 **첫 chat.md 작성 → React TSX 받기** 까지 *Claude Code 안에서만* 도달 가능 (외부 문서 참조 없이)
3. `gen-design doctor` 검증 — DESIGN/TOKEN/chat 정합 위반 시 *친절한 한국어 오류 메시지* + "Did you mean?" 제안
4. dennis 본인 dogfooding alpha — 디자이너 모드로 처음부터 로그인 신 React 받기 성공 (걸린 시간 측정)

## 🧩 작업 단위 (SPECs)

> 본 표는 phase 의 *작업 지도* 입니다. SPEC 은 *요점 + 방향성 + 참조* 까지만 적습니다.
> 자세한 spec/plan/task 는 `specs/spec-11-{seq}-{slug}/` 에서 작성합니다.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-11-01 — `create-gd-react` npm 패키지 + GitHub-hosted preset

- **요점**: `npx create-gd-react <name> [--preset <name>]` 실행 시 *디자이너용 React 프로젝트* 를 GitHub preset repo 에서 fetch → 한 번에 scaffold
- **아키텍처 (Hybrid — GitHub preset + npm CLI)**:
  ```
  ┌─────────────────────────────────┐         ┌─────────────────────────────────┐
  │ npm: @gd/create-gd-react        │         │ github.com/gen-design/presets   │
  │                                 │  fetch  │                                 │
  │  - CLI bin entry                ├────────►│  presets/                       │
  │  - preset resolver              │         │    ├── default/    (필수)       │
  │  - GitHub tarball downloader    │         │    ├── saas-dashboard/  (후속)  │
  │  - 후처리 (pkg.json rename 등)  │         │    └── landing/    (후속)       │
  │                                 │         │                                 │
  │  ✅ 작음 (~50KB)                │         │  ✅ npm publish 없이 갱신       │
  │  ✅ 첫 실행 시만 네트워크 필요  │         │  ✅ 여러 preset 분기 가능       │
  └─────────────────────────────────┘         └─────────────────────────────────┘
  ```
- **방향성**:
  - `packages/create-gd-react/` (npm publish 대상) — *fetcher 만*
  - GitHub repo `gen-design/presets` 신규 — 모든 scaffold 템플릿 호스팅
  - bin entry: `npx create-gd-react <name>` (기본) / `--preset <name>` (선택)
  - 동작:
    1. `<name>` 디렉토리 생성
    2. `https://github.com/gen-design/presets/archive/main.tar.gz` 다운로드 → `presets/<preset-name>/` 만 추출 (sparse)
    3. 후처리: `package.json` 의 `name` 필드 치환, `.gd/memory/MEMORY.md` 초기화, README.md 의 `{{project-name}}` placeholder 치환
    4. `pnpm install`
  - **preset repo 내용** (이번 phase 는 `default` 만):
    - 고정 surface 포함: `templates/FRONT.md` (잠금), shadcn registry, Tailwind config, `tsconfig.json`, `cn` + `cva` deps
    - 디자이너 surface: `chats/_shell.chat.md` + `chats/scenes/welcome.chat.md` + `templates/DESIGN.md` + `templates/TOKEN.md`
    - `.claude/skills/gd-*.md` 4종
    - `.gd/memory/MEMORY.md` 초기 인덱스
    - `README.md` (📖 진입점 — 아래 §scaffold README.md 구성 참조)
  - gen-design CLI 는 preset 의 `package.json` devDependency 로 명시 (`@gd/cli`) — preset 갱신 시 CLI 버전도 거기서 관리
  - 오프라인 대비: 네트워크 실패 시 안내 메시지 + (선택) `--offline` 플래그로 npm package 내 fallback default preset 사용
- **참조**:
  - `vision.md` §D3 (shadcn registry), §D4 (Paper *optional*)
  - `docs/handbook.md` §1 (4축 어휘), §7 (gen-design CLI 5명령)
  - degit / create-next-app `--example` 패턴
- **연관 모듈**: `packages/create-gd-react/` (npm), `github.com/gen-design/presets` (별도 repo)

### scaffold 의 표준 파일 위치 (디자이너가 외울 필요 없게 스킬이 알고 있어야 함)

```
<project>/
├── README.md                       # 📖 사용법 진입점 (Claude Code 외부에서도 동작)
├── chats/                          # 디자이너 surface
│   ├── _shell.chat.md              # 전역 외각 (sample 제공)
│   ├── scenes/                     # 화면 단위 chat
│   │   └── welcome.chat.md         # sample
│   └── components/                 # 재사용 component chat
├── templates/                      # 디자이너 surface
│   ├── DESIGN.md                   # Stitch 9 섹션 + 본 프로젝트 확장 (편집)
│   ├── TOKEN.md                    # DTCG 1.0 (편집)
│   ├── FRONT.md                    # 🔒 잠금 (어휘 카탈로그 — 자동 생성)
│   └── assets/
│       └── tokens/tokens.json      # Style Dictionary 원본
├── src/                            # 🔒 자동 생성 (디자이너 무수정)
│   ├── components/ui/              # shadcn registry
│   ├── lib/utils.ts                # cn() helper
│   └── scenes/                     # gen-design react 출력 위치 (// @gd: annotation)
├── .claude/skills/                 # 스킬 자동 로딩
│   ├── gd-start.md
│   ├── gd-chat.md
│   ├── gd-token.md
│   └── gd-design.md
├── .gd/memory/                     # 🧠 디스크 캐시 (디자이너 정보 누적)
│   └── MEMORY.md
├── components.json                 # 🔒 shadcn 설정
├── tailwind.config.ts              # 🔒 Tailwind
├── tsconfig.json                   # 🔒
└── package.json                    # `@gd/cli` devDependency
```

### scaffold 의 `README.md` 구성 (📖 진입점 — dennis 가 매번 설명 안 해도 되게)

> README.md 는 *문서가 아니라 진입점*. 30초 안에 "무엇을 어디서 만지고, 어떻게 React 받는지" 가 잡혀야 함. 스킬 (능동 가이드) 과 동일 정보를 *Claude Code 없이도* 전달.

```markdown
# {{project-name}}

> gen-design 으로 시작한 React 프로젝트. chat.md → React TSX 결정적 컴파일.

## 30초 시작

1. Claude Code 에서 이 디렉토리 열기
2. 채팅창에 `/gd-start` 입력 → 스킬이 첫 신 (scene) 작성까지 가이드
3. `pnpm gd react chats/scenes/welcome.chat.md` → `src/scenes/welcome.tsx` 생성

## 만지는 곳 vs 안 만지는 곳

| ✏️ 디자이너가 만짐 | 🔒 자동 / 잠금 |
|---|---|
| `chats/*.chat.md` (화면 명세) | `src/components/ui/` (shadcn) |
| `templates/DESIGN.md` (디자인 가이드) | `templates/FRONT.md` (어휘 카탈로그) |
| `templates/TOKEN.md` (디자인 토큰) | `tailwind.config.ts`, `components.json` |
|  | `src/scenes/*.tsx` (gd react 출력) |

shadcn / Tailwind / cn / cva 를 *몰라도 됨* — 도구가 처리.

## 명령어 cheatsheet

| 무엇을 하고 싶나? | 명령 / 스킬 |
|---|---|
| 새 신(scene) 만들기 | Claude Code 에서 `/gd-chat` |
| 디자인 토큰 수정 | `/gd-token` (DTCG 가이드) |
| DESIGN.md 작성 | `/gd-design` (Stitch 9 섹션) |
| chat → React 컴파일 | `pnpm gd react <path>` |
| 정합 검증 (drift, 어휘, 대비비) | `pnpm gd doctor` |
| 처음부터 다시 안내 받기 | `/gd-start` |

## 도움이 필요할 때

- 무엇이 잘못된지 모를 때: `pnpm gd doctor` — 한국어로 알려줍니다.
- Claude Code 안에서: `/gd-start` 호출 → 어디서 막혔는지부터 추적.
- 4축 어휘 (chat / Paper / React / shadcn 일관성) 이해: `/gd-start` 가 §1 요약 제공.

---
🤖 Generated by `npx create-gd-react`. Powered by gen-design.
```

### spec-11-02 — `.claude/skills/` 번들 — DESIGN/TOKEN/chat 작성 가이드 + memory cache

- **요점**: Claude Code 안에서 *디자이너가 외부 문서 없이* chat.md / DESIGN.md / TOKEN.md 작성을 가이드받는 *능동 스킬* — 파일 위치를 알고, 포맷을 알고, 없으면 만들고, 사용자가 준 정보를 디스크에 캐싱.
- **방향성**:
  - scaffold 의 `.claude/skills/` 에 다음 SKILL.md 포함 (`gd-` prefix):
    - `gd-start`: 첫 실행 시 onboarding (자동 호출) — handbook §1+§4 요약 + 첫 chat.md walkthrough + `.gd/memory/` 초기화
    - `gd-chat`: chat.md 작성 가이드 — 3층 (Narrative + Structure + History) + 카탈로그 어휘 추천 + frontmatter 템플릿 자동 삽입
    - `gd-token`: TOKEN.md 작성 가이드 — DTCG 1.0 템플릿 + 색 대비 즉시 검증 + 토큰 명명 컨벤션
    - `gd-design`: DESIGN.md 작성 가이드 — Stitch 9 섹션 템플릿 + 본 프로젝트 확장 + i18n schema
  - **능동 스킬 행동 요건 (핵심)**:
    1. **파일 위치 알기**: 스킬이 scaffold 표준 경로 (`chats/scenes/*.chat.md`, `templates/DESIGN.md` 등) 를 명시적으로 알고 있음
    2. **포맷 템플릿 내장**: 신규 파일 생성 시 사용자에게 *비어있는 파일* 이 아닌 *예시 채워진 템플릿* 제공
    3. **없으면 만들기**: `chats/scenes/login.chat.md` 없는데 사용자가 "로그인 신 만들어줘" 하면 디렉토리 + 파일 자동 생성 (사용자 확인 한 번)
    4. **카탈로그 컨텍스트 자동 로딩**: `templates/FRONT.md` (Tier 2/3 컴포넌트 28개) + ARIA 93 roles 가 LLM 컨텍스트에 들어가 어휘 추천 / "Did you mean?" 가능
  - **`.gd/memory/` 디스크 캐시 (📌 D-2 핵심)**:
    - 위치: `<project>/.gd/memory/` (Claude Code 의 `.claude/projects/.../memory/` 와 동일 컨셉, 단 프로젝트 내부)
    - 구조:
      ```
      .gd/memory/
      ├── MEMORY.md         # 인덱스 (자동 갱신)
      ├── designer.md       # 디자이너 정보 (이름 / 톤 / 선호)
      ├── project.md        # 프로젝트 정보 (브랜드 / 타깃 유저 / 도메인)
      ├── decisions.md      # 디자인 결정 history (왜 brand color = X)
      └── feedback.md       # 누적 피드백 (디자이너가 거절한 제안 등)
      ```
    - 모든 `gd-*` 스킬은 *세션 시작 시* MEMORY.md 자동 로딩 → 디자이너가 과거에 알려준 정보 (브랜드 / 톤 / 제약) 를 잊지 않음
    - 새로운 정보 받을 때마다 해당 파일 append (Claude memory 패턴과 동일 — 단 프로젝트 단위)
    - `.gd/memory/` 는 git 추적 (팀원 공유) + `.gitignore` 옵션 (개인 모드)
- **참조**:
  - `docs/handbook.md` (전 섹션 — 스킬 본문의 원천)
  - `vision.md` §3-tier 어휘 카탈로그
  - Claude Code 의 auto memory 패턴 (`~/.claude/projects/*/memory/`)
- **연관 모듈**: scaffold `.claude/skills/gd-*.md`, scaffold `.gd/memory/` 초기 구조, FRONT.md 카탈로그 컨텍스트

### spec-11-03 — `gd doctor` — DESIGN/TOKEN/chat 정합 검증 + drift 감지

- **요점**: 디자이너 산출물 (DESIGN.md / TOKEN.md / chat.md) 의 *교차 정합* 검증 + chat.md ↔ TSX *drift 감지* + 친절한 한국어 오류 + "Did you mean?"
- **방향성**:
  - 신규 subcommand: `gd doctor` (기존 `gen-design lint` 의 superset)
  - 검증 항목:
    1. chat.md 가 FRONT.md 카탈로그 외 컴포넌트 사용 시 → 가장 가까운 카탈로그 컴포넌트 제안 (Levenshtein 거리)
    2. DESIGN.md 의 `{token.name}` 참조가 TOKEN.md 에 정의됐는지
    3. TOKEN.md 가 DTCG 1.0 strict 형식인지 (`$value` / `$type` 필수)
    4. token 색 대비 WCAG 2.1 AA 자동 측정 (primary on bg / muted-foreground 등 핵심 페어)
    5. 기존 `gen-design lint` 6 카테고리 (shell-inherit / catalog-mismatch / 등)
    6. React 출력 tsc compile 통과 (`pnpm tsc --noEmit`)
    7. **chat.md ↔ TSX drift 감지** (lat.md 개념 차용 — 결정 8):
       - `gen-design react` 출력 TSX 에 `// @gd: chats/scenes/login` annotation 자동 삽입
       - `gd doctor` 가 각 TSX 의 annotation 을 읽어 *chat.md mtime > TSX mtime* 이면 "chat 이 수정됐는데 TSX 재생성 안 됨" 보고
       - chat.md 가 사라졌는데 TSX 만 남으면 orphan 경고
  - 모든 오류 메시지 *한국어* + 해결 방법 한 줄 (예: `pnpm gd react chats/scenes/login.chat.md` 재실행 안내)
- **참조**:
  - `studio/scripts/gen-design/lint.ts` (확장 대상)
  - `docs/external-alpha-1.md` C-1~C-4 (디자이너가 실제 막힌 지점들)
  - https://www.lat.md/ (source annotation + drift check 컨셉)
- **연관 모듈**: `packages/gd-cli/src/doctor.ts`, `gen-design react` 의 TSX 출력 (annotation 삽입)

### spec-11-04 — Dogfooding alpha — dennis 가 디자이너 모드로 zero → React

- **요점**: phase-11 의 *실증 spec* — dennis 본인이 본 npx 스킬을 *처음 보는 디자이너* 입장에서 사용해 첫 React 받기
- **방향성**:
  - 임시 디렉토리에서 `npx create-gd-react dogfood-alpha` 실행
  - Claude Code 안에서 스킬 가이드 따라 *로그인 신* chat.md 작성 (Paper 사용 안 함)
  - `gen-design react` 로 TSX 생성
  - `gen-design doctor` 통과 확인
  - 실행 시간 / 막힌 지점 / handbook 누락 항목 모두 기록
  - 결과물: `experiments/dogfooding-alpha-2026-06.md` — 정성 + 정량 보고서
- **참조**:
  - `docs/external-alpha-1.md` (이전 agent role-play alpha, 본 alpha 는 *실 사용자* 1차)
- **연관 모듈**: `experiments/` (보고서 산출물)

## 🎨 FRONT.md — React Stack Agent Guide 명세 (spec-11-01 입력)

> FRONT.md 는 *디자이너용 카탈로그* 가 아니라 ***agent 용 React stack 가이드*** — 한 번에 좋은 코드 나오게 모든 결정을 박아둠. spec-11-01 이 본 명세를 기반으로 실제 `templates/FRONT.md` 작성.

### 1. Stack 결정 (preset 별)

| 영역 | `default` preset (이번 phase) | `next-app-router` preset (phase-12 후보) |
|---|---|---|
| Bundler / Build | **Vite 7+** | **Next.js 15+ (App Router)** |
| React | 19+ | 19+ |
| TypeScript | strict | strict |
| Router | **React Router v7** (data API) | App Router (file-based + RSC) |
| Image | `@unpic/react` | `next/image` |

### 2. State Management 룰 (3축 분리 — 어떤 상황에 무엇)

| 상태 종류 | 라이브러리 | 사용 기준 |
|---|---|---|
| **서버 데이터** | **TanStack Query v5+** | 모든 서버 데이터. *절대* useState 로 fetch 결과 보관 금지. 캐시·재시도·invalidation 표준화. |
| **클라이언트 글로벌** | **zustand v5+** | 로그인 사용자 / UI 모드 / 모달 상태 등 store 단위 글로벌 |
| **아토믹 / 파인그레인** | **jotai v2+** | 폼·필터 등 *상호 의존적 atom 들* — zustand store 가 거대화될 때만 |
| **로컬 컴포넌트** | useState / useReducer | 한 컴포넌트 안에서만 쓰는 상태 |

### 3. HTTP Client

- **`ky` (fetch wrapper)** — retry / timeout / interceptors 기본 제공, 13KB
- 표준 위치: `src/api/client.ts` (단일 ky instance, 베이스 URL + 공통 헤더)
- `src/api/<domain>.ts` — 도메인별 함수 (`fetchUser`, `createOrder`)
- `src/api/hooks/use<X>.ts` — TanStack Query 훅 (`useUser`, `useCreateOrder`)
- 인터셉터: `beforeRequest` (auth header), `afterResponse` (Sentry 4xx/5xx 보고)

### 4. 환경변수 — `@env-kit/node-settings`

- npm: https://www.npmjs.com/package/@env-kit/node-settings
- 표준 위치: `src/config/env.ts` — 모든 env 접근의 single source
- 타입 안전 + 런타임 검증 (필수 키 missing 시 시작 거부)
- 표준 키: `PUBLIC_API_URL`, `PUBLIC_SENTRY_DSN`, `PUBLIC_LOG_LEVEL` (vite: `VITE_` prefix)
- 서버 전용 키 (next preset): `INTERNAL_API_SECRET` 등 — public 분리 enforce

### 5. Sentry (DSN 없어도 자리잡기)

- `@sentry/react` 7+
- 표준 위치: `src/lib/sentry.ts` — `init()` 함수가 DSN 환경변수 없으면 **no-op** (로컬 dev 마찰 0)
- `<ErrorBoundary fallback={...}>` 루트 wrap
- TanStack Query `onError` + ky `afterResponse` 자동 capture
- Source map upload 는 build script 에 옵션 (CI 에서만)

### 6. Logger

- **`consola` 4+** (DX 친화 — Nuxt 팀, 컬러 출력)
- 표준 위치: `src/lib/logger.ts` — `createLogger(scope)` 헬퍼
- 환경별 레벨: dev=debug, prod=warn (env 로 override)
- production 빌드 시 자동 silent (DOM logger 노출 방지)

### 7. Pre-check (품질 게이트 — `pnpm precheck` 단일 명령)

| 검사 | 도구 | 명령 |
|---|---|---|
| Lint | **eslint 9 (flat config)** + `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` | `pnpm lint` |
| Format | **prettier 3** + `eslint-config-prettier` (충돌 방지) | `pnpm format` |
| Type | tsc | `pnpm typecheck` (= `tsc --noEmit`) |
| Test | **vitest 4** + `@testing-library/react` + `jest-dom` + `user-event` v14 | `pnpm test` |
| Git hook | **`lefthook`** (husky 보다 빠름, 단일 yml) | `lefthook install` 자동 실행 |
| pre-commit | `lefthook` → lint-staged 패턴 (변경 파일만 lint + format + typecheck) | 자동 |
| pre-push | `pnpm precheck` 전체 | 자동 |

> 위 모두 scaffold 가 사전 설정. 디자이너는 `pnpm precheck` 한 줄만 알면 됨.

### 8. i18n

- **`react-i18next` 16+** + `i18next-browser-languagedetector`
- 표준 위치: `src/i18n/index.ts` + `src/i18n/locales/{ko,en}.json`
- chat.md 의 `{{i18n.ko.email-label}}` placeholder → `gd react` 가 `t('email-label')` 로 컴파일

### 9. Form / Date

- Form: **`react-hook-form` 7+ + `zod` 4+** (zodResolver 표준 조합)
- Date: **`date-fns` 4+** (트리쉐이킹) — dayjs 보다 ESM 친화

### 10. E2E + a11y

- **`@playwright/test` 1.50+** + **`@axe-core/playwright`** (phase-10 의 패턴 그대로 적용)
- `e2e/smoke.spec.ts` (라우트 로딩) + `e2e/a11y.spec.ts` (WCAG 2.1 AA)
- scaffold 안 sample 1건씩 제공 — 디자이너는 추가만

### 11. DRY 룰 (gd doctor 가 검사하는 항목)

| 위반 | 감지 방법 | 권장 조치 |
|---|---|---|
| 같은 마크업 3회 이상 반복 | AST 패턴 매칭 (jscodeshift) | composite 승격 후보 (Tier 3 카탈로그) |
| 인라인 style 사용 | `eslint-plugin-react/forbid-component-props` | Tailwind 클래스 사용 |
| Magic number (px / hex / rem) | 정규식 + token 매칭 | TOKEN.md 토큰 참조 |
| 동일 type alias 중복 정의 | tsc + AST | `src/types/` 공유 |
| useEffect 안 직접 fetch | eslint custom rule | TanStack Query 훅 |
| useEffect 안 setState 직접 | `react-hooks/set-state-in-effect` (phase-10 에서 채택) | 이벤트 핸들러 분리 |

### 12. 폴더 구조 (feature-based + shared layer)

```
src/
├── main.tsx              # entry (Vite) / app/layout.tsx (Next)
├── router.tsx            # React Router 설정 (Vite preset)
├── scenes/               # 🤖 gd react 자동 출력 — // @gd: chats/scenes/X
├── features/             # 도메인 기능 묶음 (auth, billing, ...)
│   └── auth/
│       ├── components/
│       ├── api/
│       ├── stores/
│       └── hooks/
├── components/
│   ├── ui/               # 🔒 shadcn (locked)
│   ├── composites/       # ✏️ Tier 3 카탈로그 (vocab 추출 대상)
│   └── templates/        # ✏️ 페이지 매크로
├── lib/                  # 순수 유틸 (cn, sentry, logger, env validator)
├── api/
│   ├── client.ts         # ky 인스턴스
│   └── hooks/            # TanStack Query 훅
├── stores/               # zustand store 들
├── config/
│   └── env.ts            # @env-kit/node-settings
├── i18n/
│   ├── index.ts
│   └── locales/{ko,en}.json
├── types/                # 공유 타입
└── styles/
    └── globals.css       # Tailwind + 토큰 CSS vars
```

### 13. Performance defaults

- Route-level lazy (`React.lazy` + `<Suspense>`) 자동 설정
- `React.memo` 는 *큰 리스트 아이템* / *자주 리렌더되는 컴포넌트* 만 (전역 적용 금지)
- TanStack Query: `staleTime` 표준값 (`30s` 일반 / `Infinity` 정적 데이터)
- 큰 list: `@tanstack/react-virtual`

### 14. 보안 defaults

- 사용자 HTML 입력: **`isomorphic-dompurify`**
- env: `PUBLIC_` prefix 만 client bundle 노출 (vite-plugin-env-prefix 강제)
- 외부 링크: `rel="noopener noreferrer"` 자동 (eslint rule)

### 15. AGENT.md (FRONT.md 의 동반 — 산출물 형태)

- scaffold 는 `templates/AGENT.md` 도 포함
- 내용: "agent 가 이 프로젝트에서 코드를 작성할 때 따라야 할 규칙" — 위 §1~§14 의 *행동 가이드 버전*
- 예: "서버 데이터는 *반드시* TanStack Query 훅으로 감싼 후 사용. 직접 `fetch` 또는 `useState(...)` 금지"

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 배포 형태 | (A) npx scaffold / (B) Claude Code plugin marketplace / (C) 둘 다 | (A) npx scaffold | 첫 사용자 (dennis) 가 *새 프로젝트* 시작이 가장 짧은 경로. plugin 은 phase-12 후보 |
| scope | (A) onboarding + 첫 React / (B) 전체 워크플로 (Paper 포함) / (C) 배포만 | (A) onboarding + 첫 React | dogfooding 가능한 최소 닫힌 루프. Paper 시각화는 spec-11-02 의 optional 단계 |
| Paper MCP 의존성 | required / optional | optional | 진입 장벽 최소화. 4축 정합의 시각 거울 (Paper) 은 *있으면 보너스*, 없어도 chat → React 가능해야 함 |
| 고정 surface vs 디자이너 surface | 명시 분리 | 분리 | 디자이너는 shadcn/Tailwind/cn/cva 를 *몰라도 동작*. scaffold 가 모든 인프라 고정 제공. 디자이너는 DESIGN.md/TOKEN.md/chat.md 3개만 만짐 |
| gen-design CLI 패키징 | (A) 별도 npm package / (B) scaffold 안 vendored copy | (A) 별도 npm package `@gd/cli` | 업데이트 채널 확보. 디자이너는 `pnpm update @gd/cli` 로 도구 업데이트 가능 |
| 스킬 포맷 | (A) 신형 SKILL.md / (B) 슬래시 커맨드 | (A) SKILL.md | 자동 로딩 강점 — 디자이너가 명령 외울 필요 없음 |
| 일괄 prefix | (A) gd-* / (B) gen-design-* / (C) gendesign | (A) `gd-` prefix | 짧음 + 일관성. handbook §7 에 이미 `gd` alias 존재. npx: `create-gd-react`, skill: `/gd-start`, CLI: `gd doctor` |
| 스킬의 *수동성* vs *능동성* | 문서 / 능동 도구 | 능동 도구 | 스킬이 파일 위치를 알고, 포맷 템플릿 내장, 없으면 자동 생성 (확인 후), 디자이너가 *무엇이 어디 있어야 하는지* 외울 필요 없음 |
| 사용자 정보 잊혀짐 방지 | session 의존 / 디스크 캐시 | `.gd/memory/` 디스크 캐시 | Claude Code session 압축 시 정보 손실 → 프로젝트 내부 `.gd/memory/` 에 디자이너 / 프로젝트 / 결정 / 피드백 누적. 모든 `gd-*` 스킬 자동 로딩 |
| lat.md (knowledge graph) 적용 | (A) lat 의존 / (B) 개념만 차용 / (C) 미적용 | (B) 개념만 차용 | lat 의 *source annotation + drift check + wiki link* 를 `gd doctor` 와 `gen-design react` 출력에 흡수. 디자이너에게 별도 도구 학습 0. ref: https://www.lat.md/ |
| preset 호스팅 위치 | (A) npm 번들 / (B) GitHub fetch / (C) Hybrid | (C) Hybrid → 기본 GitHub, `--offline` 시 npm fallback | npm package 가벼움 (~50KB) + 템플릿 업데이트가 npm publish 없이 가능 + 여러 preset 분기. 네트워크 실패는 fallback default preset 으로 대응. preset repo: `github.com/gen-design/presets` |
| README.md (scaffold 진입점) | (A) 산출물에 포함 / (B) 별도 docs | (A) scaffold 안 README.md 가 사용법의 single entry point | dennis 가 매번 사용법 설명 안 해도 되게 — 30초 안에 "무엇을 만지고 안 만지는지 + 명령어 cheatsheet + `/gd-start` 호출 안내" 가 잡혀야 함. Claude Code 없이도 동작 |
| FRONT.md scope | (A) 디자이너용 어휘 카탈로그만 / (B) React stack agent guide 통합 | (B) Agent stack guide 통합 | FRONT.md 가 카탈로그 + stack 결정 (state/http/router/test/lint/sentry/i18n/env/...) 모두 포함. agent 가 한 번에 좋은 코드 내게 함. 본 phase §🎨 절에 명세 |
| React stack 결정 일괄 | 개별 선택 / preset 고정 | preset 고정 | Vite + React 19 + zustand + jotai + TanStack Query + ky + react-i18next + react-hook-form + zod + date-fns + sentry + consola + @env-kit/node-settings + eslint 9 + prettier 3 + vitest 4 + lefthook + playwright. 디자이너는 선택 0건 |

## 🧪 통합 테스트 시나리오

### 시나리오 1: `npx create-gd-react` zero → React

- **Given**: 빈 디렉토리 + Claude Code 설치만 된 상태 (Paper MCP 없음)
- **When**: `npx create-gd-react dogfood-alpha` 실행 → Claude Code 진입 → 스킬 가이드 따라 첫 chat.md (로그인 신) 작성 → `pnpm gd react chats/scenes/login.chat.md`
- **Then**: `src/scenes/login.tsx` 가 컴파일 가능한 shadcn-style TSX 로 생성됨. `pnpm tsc --noEmit` 통과.
- **연관 SPEC**: spec-11-01, spec-11-02, spec-11-04

### 시나리오 0 (선결): README.md 만 읽고도 닫힌 루프 도달

- **Given**: 빈 디렉토리, Claude Code 미사용 (curl 로 npm registry 만 접근)
- **When**: `npx create-gd-react my-app` 후 `my-app/README.md` 만 읽고 따라함
- **Then**: 30초 안에 "무엇을 만지고 무엇을 만지지 않는지" 이해 + `/gd-start` 호출 경로 발견. dennis 가 추가 설명 0건으로 *디자이너 모드 진입* 가능.
- **연관 SPEC**: spec-11-01 (README.md 의 내용 자체가 산출물)

### 시나리오 2: 잘못된 어휘 자동 감지

- **Given**: chat.md 에 `<MyCustomBtn>` (FRONT.md 미존재) 또는 잘못된 토큰 참조 `{spacing.huge}` 작성
- **When**: `pnpm gd doctor`
- **Then**: 한국어 오류 + "Did you mean?" 제안 (`Button` / `spacing.xl`) + 해결 방법 한 줄
- **연관 SPEC**: spec-11-03

### 시나리오 4: chat.md ↔ TSX drift 감지

- **Given**: 디자이너가 `chats/scenes/login.chat.md` 수정 후 `gd react` 재실행 잊음
- **When**: `pnpm gd doctor`
- **Then**: "login.chat.md (수정 5분 전) > login.tsx (수정 10분 전) — 재생성 필요. `pnpm gd react chats/scenes/login.chat.md` 실행" 안내
- **연관 SPEC**: spec-11-03

### 시나리오 3: 디자이너 surface 만 만져도 React 받기

- **Given**: scaffold 직후 상태
- **When**: 디자이너가 `templates/DESIGN.md`, `templates/TOKEN.md`, `chats/scenes/welcome.chat.md` 만 편집 (shadcn / Tailwind / cn / cva / FRONT.md 무수정)
- **Then**: `pnpm gen-design react` 가 TSX 출력, doctor PASS
- **연관 SPEC**: spec-11-01, spec-11-02, spec-11-03

## 🔗 의존성

- **선행 phase**: phase-10 (검증 자동화 — a11y / E2E gate)
- **외부 시스템**: npm registry (publish), Node.js >= 24
- **연관 ADR**:
  - ADR-009 (gen-design CLI 단일 진입점)
  - ADR-010 (chat 승격 Hybrid)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| gen-design CLI 를 npm package 로 분리 시 monorepo 의존성 끊기 작업량 큼 | spec-11-01 일정 지연 | 첫 publish 는 *최소 명령만* (paper-import / react / doctor) — 나머지는 phase-12 |
| scaffold 가 너무 opinionated 하면 다양한 use case 불가 | 채택 부진 | 첫 alpha 는 *opinionated 강하게* — feedback 후 옵션화 (다음 phase) |
| 신형 SKILL.md 포맷의 Claude Code 호환성 변화 | 스킬 로딩 실패 | 슬래시 커맨드 backup 도 같이 ship — 디자이너가 명시 호출도 가능 |
| dennis 본인 dogfooding 이 *편향* (이미 시스템 알고 있음) | alpha 신뢰도 ↓ | spec-11-04 보고서에 *알고 있던 우회 경로* 와 *진짜 막혔던 지점* 분리 기록 |
| GitHub preset fetch 실패 (네트워크 / rate limit) | 첫 `npx` 실행 실패 | npm package 안에 fallback default preset 번들 + `--offline` 플래그 + 친절한 오류 메시지 ("github.com 접근 불가 — `--offline` 로 재시도") |
| README.md 가 너무 길어 디자이너가 안 읽음 | onboarding 실패 | 30초 cap — "30초 시작" 섹션이 *3 step 이내*. 자세한 가이드는 `/gd-start` 스킬로 위임 |

## 🏁 Phase Done 조건

- [ ] spec-11-01 ~ spec-11-04 모두 Merged
- [ ] `npx create-gd-react <name>` 실제 npm registry 에 publish + 동작 확인
- [ ] 통합 테스트 시나리오 1~3 모두 PASS
- [ ] dogfooding-alpha 보고서 작성 완료 + 식별된 핵심 막힘 지점 ≥ 3건
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, dogfooding alpha 보고서 요약 -->
