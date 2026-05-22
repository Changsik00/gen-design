# {{project-name}} — FRONT.md (Agent Stack Guide)

> 🔒 **본 파일은 *고정 surface* 입니다.** 디자이너 / 사용자가 수정하지 않습니다.
> agent (Claude / Cursor 등) 가 *코드를 작성할 때 반드시 따라야 할 React stack 의 single source of truth* 입니다.
> 명령형 행동 규칙 / 안티 패턴은 별도 `AGENT.md` 참조.
>
> 본 문서의 모든 결정은 *외부에서 검증된 베스트 프랙티스* 를 기반으로 합니다. 주요 레퍼런스:
> - **[bulletproof-react](https://github.com/alan2207/bulletproof-react)** — Feature-based 폴더 구조 + unidirectional architecture
> - **[TkDodo's blog](https://tkdodo.eu/blog)** — TanStack Query 의 사실상 표준 best practices
> - **[shadcn/ui](https://ui.shadcn.com/)** — 컴포넌트 카탈로그 + cn / cva 패턴
> - **[Vite Guide](https://vite.dev/guide/)** — 빌드 / env / plugin 표준
> - **[Web Content Accessibility Guidelines (WCAG) 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)** — a11y 자동 기준

---

## 목차

0. [Rendering Strategy — SSG-first](#0-rendering-strategy--ssg-first)
1. [Stack 결정](#1-stack-결정)
2. [폴더 구조 — Feature-based + Unidirectional](#2-폴더-구조--feature-based--unidirectional)
3. [State Management — 4축 분리](#3-state-management--4축-분리)
4. [HTTP Client (ky) + TanStack Query](#4-http-client-ky--tanstack-query)
5. [환경변수 — @env-kit/node-settings](#5-환경변수--env-kitnode-settings)
6. [Sentry — DSN 없어도 자리잡기](#6-sentry--dsn-없어도-자리잡기)
7. [Logger (consola)](#7-logger-consola)
8. [Pre-check — 단일 명령 품질 게이트](#8-pre-check--단일-명령-품질-게이트)
9. [i18n — react-i18next + chat.md 통합](#9-i18n--react-i18next--chatmd-통합)
10. [Form (react-hook-form + zod)](#10-form-react-hook-form--zod)
11. [Date / Time / Async 유틸](#11-date--time--async-유틸)
12. [E2E + a11y (Playwright + axe)](#12-e2e--a11y-playwright--axe)
13. [DRY 룰 — `gd doctor` 가 검사하는 항목](#13-dry-룰--gd-doctor-가-검사하는-항목)
14. [Performance defaults](#14-performance-defaults)
15. [보안 defaults](#15-보안-defaults)
16. [TypeScript strict 패턴](#16-typescript-strict-패턴)
17. [에러 처리 전략](#17-에러-처리-전략)
18. [React 19 활용 가이드](#18-react-19-활용-가이드)
19. [테스트 피라미드](#19-테스트-피라미드)
20. [AGENT.md — 행동 규칙](#20-agentmd--행동-규칙)

---

## 0. Rendering Strategy — SSG-first

> **본 프로젝트는 SSG-first 아키텍처를 채택합니다.** SSR 의 운영 난이도 (Node 서버 / hydration mismatch / streaming 등) 를 회피하고, *정적 출력 + 클라이언트 hydration + TanStack Query 의 client fetch* 로 단순함을 우선합니다.

### 결정

- ✅ **SSG-first**: 빌드 시 정적 HTML 출력. 정적 호스팅 (Vercel / Netlify / S3 + CloudFront / Cloudflare Pages) 가능.
- ✅ **TanStack Query 로 client-side fetching**: 인증 / 동적 데이터는 hydration 후 client 가 fetch. 캐시 / 재시도 / loading state 표준화.
- ❌ **SSR 최소화**: 페이지 단위 SSR 안 함. 진짜 필요한 SEO / OG 메타는 *빌드 타임 SSG* 로 처리.
- ❌ **불필요한 hydration 복잡도 회피**: streaming SSR / Suspense boundary SSR 등 *SSR-specific 패턴* 도입 금지.
- 🟡 **Server Components 는 optional**: default 가 아님. `--preset next-app-router` 후속에서 *opt-in* 으로만.

### 구현 (Vite SPA → SSG)

본 default preset 은 **Vite SPA 빌드** — `pnpm build` 가 `dist/index.html` + JS bundle 생성. 정적 호스팅에 deploy 하면 그대로 SSG 와 동일한 UX.

페이지 prerender (SEO 필요 시):
- `vite-ssg` plugin 추가 → 라우트별로 빌드 시 HTML prerender
- `vite-plugin-pages` + sitemap 자동 생성

설치 (필요 시):
```bash
pnpm add -D vite-ssg
```

### 왜 SSG-first 인가?

| 항목 | SSG | SSR |
|---|---|---|
| 호스팅 | 정적 (CDN) | Node 서버 필요 |
| TTFB | 최단 | 서버 응답 대기 |
| 운영 부담 | 0 | 서버 관리 + 스케일링 |
| Hydration mismatch | 없음 (정적 HTML) | 빈번한 디버깅 |
| 인증 / 동적 데이터 | client fetch (TanStack Query) | 서버 세션 |
| SEO | 정적 출력 + meta tag | 동적 가능 |

**디자이너 페르소나** 에 SSR 운영은 과도. *publisher-ready ceiling* (→ vision.md §D6) 안에서 SSG 가 충분.

### 안티 패턴 (금지)

- ❌ Next.js `getServerSideProps` / RSC 의 server-only fetch — 본 preset 미지원
- ❌ `useEffect` 안에서 SEO meta 동적 변경 (검색엔진은 첫 HTML 만 봄)
- ❌ Hydration mismatch warning 무시 — 무조건 server / client 결과 일치
- ❌ `if (typeof window !== "undefined")` 패턴 남발 — SPA 에서는 항상 client

### SEO 필요 시 권장 접근

1. **정적 메타** (대부분 충분): `index.html` 에 OG / Twitter Card 메타 직접 작성
2. **route 별 메타**: `vite-ssg` 도입 → 빌드 시 라우트별 HTML prerender
3. **동적 메타**: `react-helmet-async` 로 client 측 변경 — 검색엔진은 못 보지만 share preview 는 client renderer 가 처리

---

## 1. Stack 결정

| 영역 | 선택 | 버전 | 결정 이유 |
|---|---|---|---|
| Build / Bundle | **Vite** | 7+ | ESM-first, dev HMR 100ms 미만, **SSG 빌드 (정적 HTML + JS bundle)**. CRA deprecated. SSR 회피 (→ §0). |
| React | **React** | 19+ | `use()` / Async Transitions / React Compiler 호환. Server Components 는 optional (default 아님, → §0). |
| TypeScript | strict + `noUncheckedIndexedAccess` | 5.9+ | 타입 안전성 최대, `arr[0]` 가 `T \| undefined` 로 강제 |
| Router | **React Router v7** | data API | data router 의 loader / action 패턴 / TanStack Router 보다 학습 곡선 ↓ |
| Image | `@unpic/react` (옵션 — 본 preset 미포함) | — | next/image 의 universal 버전. 추가 필요 시 install |

> 향후 `--preset next-app-router`: Next.js 15+ / App Router / next/image. SSG 모드 (`output: "export"`) 권장. RSC 는 *opt-in only*. 본 default preset 은 *Vite SSG-first*.

**왜 Vite SSG 인가?**
- 디자이너가 받는 *첫 번째 표면* — Server / SSR / RSC 복잡도 회피 (→ §0 Rendering Strategy)
- 정적 호스팅 (Vercel / Netlify / S3 + CloudFront / Cloudflare Pages) — 인프라 비용 0, TTFB 최단
- next preset 으로 후속 마이그레이션 가능 (chats / templates / FRONT.md / AGENT.md 그대로 호환)

---

## 2. 폴더 구조 — Feature-based + Unidirectional

bulletproof-react 의 *Unidirectional Codebase Architecture* 패턴 채택:

```
shared (components, lib, types, utils, api, stores)
    ↑
features
    ↑
app (main.tsx, router, scenes)
```

**규칙**: shared 는 어디서나 사용 가능 / features 는 shared 만 import / app 은 features + shared.

### 표준 디렉토리

```
src/
├── main.tsx                 # entry — StrictMode + Providers + Router
├── router.tsx               # React Router 설정 (lazy + Suspense)
├── scenes/                  # 🤖 gd react 자동 출력 — // @gd: chats/scenes/X
├── features/                # 도메인 묶음 — 한 기능에만 쓰는 모든 것
│   └── auth/
│       ├── api/             # API 함수 + Query 훅
│       │   ├── login.ts
│       │   └── hooks/
│       ├── components/      # 이 기능 전용 컴포넌트
│       ├── stores/          # 이 기능 전용 zustand store
│       ├── hooks/           # 이 기능 전용 훅
│       ├── types/           # 이 기능 전용 타입
│       └── utils/           # 이 기능 전용 유틸
├── components/
│   ├── ui/                  # 🔒 shadcn (locked) — Button / Card / Input 등
│   ├── composites/          # ✏️ Tier 3 — LoginForm / DashboardStats 등
│   └── templates/           # ✏️ 페이지 매크로 — AppShell / EmptyState
├── lib/                     # 순수 유틸 (cn / sentry / logger)
├── api/
│   ├── client.ts            # ky 인스턴스 — 모든 HTTP 의 진입점
│   ├── keys.ts              # queryKey factory (전역 도메인)
│   └── hooks/               # cross-feature query 훅
├── stores/                  # 전역 zustand store (auth / ui-mode)
├── config/env.ts            # 환경변수 single source
├── i18n/                    # i18next + locales/{ko,en}.json
├── types/                   # 공유 타입
└── styles/globals.css       # Tailwind + 토큰 CSS vars
```

### 안티 패턴 (금지)

- **Barrel files (`index.ts` 가 모든 걸 re-export)** — Vite tree-shaking 방해 + 순환 의존 위험. 직접 import 사용.
- **Feature 간 직접 import** — `features/auth/...` 에서 `features/billing/...` import 금지. 공유는 `shared` 로 승격 후 사용.
- **`components/` 에 도메인 컴포넌트** — `<LoginForm>` 은 `features/auth/components/` 또는 `components/composites/` (재사용 시).

### 새 도메인 추가 워크플로

1. `src/features/<domain>/` 생성 — components / api / stores / hooks 폴더만 (`.gitkeep`)
2. ESLint *boundaries* (선택) 로 features 간 import 차단 가능 — `.eslintrc` 의 `no-restricted-imports` rule

---

## 3. State Management — 4축 분리

**어떤 상태인가** 에 따라 *반드시* 다음 매핑을 따른다.

| 상태 종류 | 라이브러리 | 사용 기준 | 안티 패턴 |
|---|---|---|---|
| **서버 데이터** | **TanStack Query v5** | 모든 fetch 결과. 캐시 / 재시도 / invalidation 표준화. | `useState` 로 fetch 결과 보관 금지. `useEffect` 안 fetch 금지. |
| **클라이언트 글로벌** | **zustand v5** | 로그인 사용자 / UI 모드 / 모달 상태 | Context 남용 금지 (re-render 문제). prop drilling 시에만 store. |
| **아토믹 / 파인그레인** | **jotai v2** | 폼·필터 등 *상호 의존적 atom 들* | 첫 store 부터 jotai 금지 — zustand 가 거대화될 때만. |
| **로컬 컴포넌트** | `useState` / `useReducer` / `useRef` | 한 컴포넌트 안에서만 쓰는 상태 | — |

### TanStack Query 패턴 (TkDodo 표준)

**Query Key Factory** (계층적 + 중앙화):
```ts
// src/features/users/api/keys.ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilter) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

**Query 훅** (`useXQuery`):
```ts
// src/features/users/api/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../user";
import { userKeys } from "../keys";

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    staleTime: 30_000, // 30s — 대부분의 도메인 데이터
  });
```

**Mutation + Invalidation**:
```ts
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (data, vars) => {
    // 1) 변경된 detail 은 setQueryData 로 즉시 갱신
    queryClient.setQueryData(userKeys.detail(vars.id), data);
    // 2) list 는 invalidate (re-fetch)
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});
```

**staleTime 권장값**:
- `0` — 즉시 stale (자주 변하는 데이터)
- `30_000` (30s) — 일반 도메인 데이터 (기본값)
- `5 * 60_000` (5분) — 거의 안 변하는 메타데이터
- `Infinity` — 정적 데이터 (locale list 등)

### zustand 패턴

```ts
// src/stores/auth.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

// 사용 — selector 로 re-render 최소화
const user = useAuthStore((s) => s.user);
```

### jotai 사용 기준

- form 의 *서로 의존적 필드* — `emailAtom` + `passwordAtom` + `submitDisabledAtom` (computed)
- 그래프 / 트리 데이터 — 한 노드 변경이 전체 리렌더 유발 안 하게
- zustand 의 store 가 한 화면을 전부 차지할 때만 jotai 분해 검토

---

## 4. HTTP Client (ky) + TanStack Query

### ky 인스턴스 — 단일 진입점

**표준 위치**: `src/api/client.ts` — 모든 HTTP 요청이 이 인스턴스 통과.

```ts
import ky from "ky";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth";

export const api = ky.create({
  prefixUrl: env.PUBLIC_API_URL || undefined,
  timeout: 10_000,
  retry: { limit: 2, methods: ["get", "head", "options"] },
  hooks: {
    beforeRequest: [
      (req) => {
        const token = useAuthStore.getState().token;
        if (token) req.headers.set("authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      (req, _opts, res) => {
        if (!res.ok && res.status >= 500) {
          // Sentry 5xx 보고
          import("@/lib/sentry").then(({ captureHttpError }) =>
            captureHttpError(req, res),
          );
        }
      },
    ],
    beforeError: [
      (error) => {
        // 표준화된 APIError 로 변환
        return error;
      },
    ],
  },
});
```

### 도메인 함수 + Query 훅 분리

```ts
// src/features/users/api/user.ts — 순수 함수
export const fetchUser = (id: string) => api.get(`users/${id}`).json<User>();
export const updateUser = (input: UpdateUserInput) =>
  api.patch(`users/${input.id}`, { json: input }).json<User>();

// src/features/users/api/hooks/useUser.ts — TanStack Query wrap
// (위 §3 예시 참조)
```

### 안티 패턴

- ❌ 컴포넌트에서 `ky.get(...)` 직접 호출 — `api` 인스턴스만 사용
- ❌ `useEffect` 안 fetch — 항상 Query 훅
- ❌ `fetch()` 또는 `axios` 사용 — `ky` 만

---

## 5. 환경변수 — `@env-kit/node-settings`

> **`@env-kit/node-settings`** (Changsik00 작) — Vite / Next / dotenv-flow 컨벤션 호환. zod 기반 검증 + 자동 시크릿 감지 + K8s Secret 분리 + CLI (`validate` / `check` / `generate`).
> ref: https://github.com/changsik00/node-settings

### 정책

- Vite 의 `PUBLIC_` prefix env 만 client bundle 에 노출됨 (vite.config.ts envPrefix)
- **prefix 는 *definition 시점* 에 enforce** — 스키마가 prefix 위반 키 포함 시 build-time error
- zod schema 로 *런타임 검증* — 필수 키 누락 시 시작 거부 (`NodeSettingsError`)
- 모든 env 접근은 `src/config/env.ts` 를 거침 (직접 `import.meta.env.X` 금지)

### 표준 패턴

```ts
// src/config/env.ts
import { z } from "zod";
import { defineClientEnv } from "@env-kit/node-settings";

const clientEnvSchema = z.object({
  PUBLIC_API_URL: z.string().default(""),
  PUBLIC_SENTRY_DSN: z.string().default(""),
  PUBLIC_LOG_LEVEL: z.enum(["silent", "error", "warn", "info", "debug"]).optional(),
});

// 1) definition — prefix + schema 검증
const getClientEnv = defineClientEnv({ prefix: "PUBLIC_", schema: clientEnvSchema });

// 2) 호출 — Vite import.meta.env 를 raw source 로 전달
export const env = getClientEnv(import.meta.env as Record<string, string | undefined>);
export const MODE = (import.meta.env.MODE as string) ?? "development";
```

### `.env` 파일 계층 (Vite + dotenv-flow 컨벤션)

```
.env                # 모든 환경 공통 (커밋 OK)
.env.local          # 로컬 override (.gitignore — 시크릿 OK)
.env.development    # dev mode
.env.production     # prod mode
.env.[mode].local   # mode 별 로컬 override (.gitignore)
```

뒤 소스가 앞 소스를 덮어씀.

### 서버측 / build script 에서 사용 (선택)

Vite plugin / build script 에서 server 환경변수 (시크릿 포함) 가 필요할 때:

```ts
import { z } from "zod";
import { defineSettings, loadDotenvCascade } from "@env-kit/node-settings";

const settings = defineSettings({
  envSchema: z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string(),
    API_SECRET: z.string(),  // DEFAULT_SECRET_PATTERNS 자동 감지
  }),
  envKey: "NODE_ENV",
  defaults: { logLevel: "info" },
  perEnv: {
    production: { logLevel: "warn" },
  },
  build: (env, config) => ({
    db: { url: env.DATABASE_URL },
    apiSecret: env.API_SECRET,
    logLevel: config.logLevel,
  }),
});

const { env } = loadDotenvCascade();
export const serverConfig = settings(env);  // frozen + validated
```

### CLI 명령 (CI 통합)

```bash
# 검증 (CI 게이트)
npx node-settings validate .env.production

# 환경 완성도 (다환경 동시 검증)
npx node-settings check --env prod,stage

# K8s 매니페스트 자동 생성 (시크릿 분리)
npx node-settings generate k8s --name my-app --out k8s.yaml

# 환경변수 문서 자동 생성
npx node-settings generate docs --out ENV.md
```

### 런타임 오버라이드 (canary / 인시던트 대응)

```bash
APP_CONFIG_JSON='{"logLevel":"debug"}' node server.js
```

같은 이미지로 다른 설정 — canary 배포 / 장애 대응에 활용.

### 에러 처리

```ts
import { NodeSettingsError } from "@env-kit/node-settings";

try {
  const env = getClientEnv(rawEnv);
} catch (err) {
  if (err instanceof NodeSettingsError) {
    if (err.severity === "runtime") {
      // 운영자 대응 (환경변수 누락 / 잘못된 값)
      console.error(`env error: ${err.code}, docs: ${err.docsUrl}`);
    } else if (err.severity === "config") {
      // 개발자 대응 (스키마 정의 자체가 잘못됨)
    }
  }
  throw err;
}
```

---

## 6. Sentry — DSN 없어도 자리잡기

- **`@sentry/react`** 8+
- **표준 위치**: `src/lib/sentry.ts` — `initSentry()` 가 DSN 환경변수 없으면 **no-op**
- 로컬 dev 마찰 0 — DSN 환경변수 없어도 앱 동작
- production 빌드 시 자동으로 DSN 주입

### 패턴

```ts
import { initSentry, SentryErrorBoundary } from "@/lib/sentry";

// main.tsx
initSentry();
createRoot(rootEl).render(
  <SentryErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </SentryErrorBoundary>,
);
```

### 자동 capture 지점

- ky `afterResponse` hook → 4xx/5xx
- TanStack Query `QueryCache` onError → query 실패
- React Error Boundary → 렌더 실패
- unhandled rejection → window.onunhandledrejection

### DSN 주입

`.env.local` 또는 CI:
```
PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

> Sentry source map upload 는 production build script 에 별도 추가 (CI 에서만 실행).

---

## 7. Logger (consola)

- **`consola`** 3+ (Nuxt 팀, DX 친화, scoped logger)
- **표준 위치**: `src/lib/logger.ts`

### 패턴

```ts
// 전역
import { logger } from "@/lib/logger";
logger.info("app boot");
logger.debug("user state:", user);

// scoped (feature 별)
import { createLogger } from "@/lib/logger";
const log = createLogger("auth");
log.info("login attempt");
log.warn("session expired");
```

### 환경별 레벨

- `dev`: `debug` (모두 출력)
- `prod`: `warn` (warn / error 만)
- override: `.env.local` 의 `PUBLIC_LOG_LEVEL=info`

> production 빌드는 `__VITE_PROD__` define 으로 `debug` / `info` 자동 silent 가능 (Vite plugin 추가 시).

---

## 8. Pre-check — 단일 명령 품질 게이트

`pnpm precheck` 한 줄로 lint + typecheck + test 모두 실행.

| 검사 | 도구 | 명령 | 비고 |
|---|---|---|---|
| Lint | **eslint 9** (flat config) | `pnpm lint` | `@typescript-eslint`, `react`, `react-hooks`, `jsx-a11y` |
| Format | **prettier 3** + `eslint-config-prettier` | `pnpm format` | 충돌 방지 |
| Type | tsc strict + `noUncheckedIndexedAccess` | `pnpm typecheck` | `tsc --noEmit` |
| Test | **vitest 4** + RTL + `jest-dom` + `user-event 14` | `pnpm test` | jsdom 환경 |
| Git hook | **`lefthook`** | 자동 (pre-commit + pre-push) | husky 보다 4-5배 빠름 |

### Git Hook 자동화 (lefthook.yml)

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx}"
      run: pnpm eslint {staged_files}
    format:
      glob: "*.{ts,tsx,js,jsx,json,md,css}"
      run: pnpm prettier --check {staged_files}
    typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm typecheck

pre-push:
  commands:
    precheck:
      run: pnpm precheck
```

설치: `pnpm exec lefthook install` (git init 이후 자동).

---

## 9. i18n — react-i18next + chat.md 통합

- **`react-i18next` 15+** + `i18next-browser-languagedetector`
- **표준 위치**: `src/i18n/index.ts` + `src/i18n/locales/{ko,en}.json`
- 자동 감지 순서: `querystring` → `localStorage` → `navigator`

### 키 명명 규칙

```
<도메인>.<액션>.<속성>
```

예: `auth.login.email-label`, `dashboard.stats.total-users`, `error.network`.

### chat.md ↔ React 자동 변환

chat.md 의 placeholder 가 `gd react` 컴파일 시 `t()` 호출로 변환:

```chat
<Button>{{i18n.ko.welcome.cta}}</Button>
```
↓ `gd react` 컴파일
```tsx
const { t } = useTranslation();
<Button>{t("welcome.cta")}</Button>
```

### 안티 패턴

- ❌ 컴포넌트에 한국어 / 영어 하드코딩 — 모두 i18n 키
- ❌ 즉시 평가 (`t("foo")` 가 `null` 반환 시점) — 항상 hook 내 / Suspense fallback 처리

---

## 10. Form (react-hook-form + zod)

### 표준 조합

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(8, "8자 이상 입력하세요"),
});
type LoginInput = z.infer<typeof loginSchema>;

function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values);
  });

  return (
    <form onSubmit={onSubmit}>
      <Input {...form.register("email")} />
      {form.formState.errors.email && (
        <p role="alert">{form.formState.errors.email.message}</p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        로그인
      </Button>
    </form>
  );
}
```

### shadcn `<Form>` 통합

shadcn 의 `<Form>` 컴포넌트 사용 시 — `npx shadcn add form` 후 표준 패턴 사용. `<FormField>` + `<FormLabel>` + `<FormMessage>` 가 a11y 자동 처리.

### 안티 패턴

- ❌ uncontrolled form 직접 작성 — RHF 가 표준
- ❌ submit 핸들러에 zod 검증 없음 — 항상 resolver 통과
- ❌ `useState` 로 form state 관리 — RHF 의 ref-based 가 성능 ↑

---

## 11. Date / Time / Async 유틸

| 영역 | 라이브러리 | 사용 |
|---|---|---|
| Date / Time | **`date-fns` 4** | 트리쉐이킹, ESM. `import { format } from "date-fns"` |
| Timezone | `date-fns-tz` (추가 install) | TZ 지원 필요 시 |
| Async / Promise | native + `p-limit` (큰 배열 동시성 제한 시) | — |

### 안티 패턴

- ❌ `moment` — deprecated, 번들 ↑
- ❌ `dayjs` — date-fns 가 tree-shaking 우위
- ❌ `Date.now()` 비교로 시간 차 계산 — `differenceInMinutes` 등 명시 함수 사용

---

## 12. E2E + a11y (Playwright + axe)

### 셋업

- **`@playwright/test` 1.50+** + **`@axe-core/playwright` 4+**
- `e2e/smoke.spec.ts` — 라우트 로딩 검증 (각 신 200 OK + 렌더 완료)
- `e2e/a11y.spec.ts` — WCAG 2.1 AA 자동 스캔

### a11y 게이트 정책

```ts
const blocking = results.violations.filter(
  (v) => v.impact === "critical" || v.impact === "serious",
);
expect(blocking).toHaveLength(0);
```

- `critical` / `serious` → CI 실패 (게이트)
- `moderate` / `minor` → console.warn (수정 권장, 게이트 아님)

### 색 대비비 (WCAG 2.1 AA 기준)

| 텍스트 | 기준 |
|---|---|
| Normal text (< 18pt) | **4.5:1** |
| Large text (≥ 18pt / 14pt bold) | **3:1** |
| UI components / graphics | **3:1** |

`gd doctor` 가 토큰 페어를 자동 측정 + 미달 시 *가장 가까운 합격 컬러* 제안.

### 추천 라이브러리

- `@axe-core/playwright` — Playwright 통합
- `eslint-plugin-jsx-a11y` — 정적 분석 (이미 포함)
- Radix UI (shadcn 기반) — 컴포넌트 a11y 자동 처리

---

## 13. DRY 룰 — `gd doctor` 가 검사하는 항목

| 위반 | 감지 방법 | 권장 조치 |
|---|---|---|
| 같은 마크업 3회 이상 반복 | AST 패턴 매칭 | composite 승격 (`src/components/composites/<Name>/`) |
| 인라인 `style={{...}}` 사용 | `eslint-plugin-react/forbid-component-props` 또는 정규식 | Tailwind 클래스로 변환 |
| Magic number / hex / rem | 정규식 + token 매칭 | `templates/TOKEN.md` 토큰 참조 |
| 동일 type alias 중복 | tsc + AST | `src/types/<Name>.ts` 공유 |
| `useEffect` 안 직접 `fetch` | eslint custom rule | TanStack Query 훅으로 추출 |
| `useEffect` 안 직접 `setState` | `react-hooks/set-state-in-effect` | 이벤트 핸들러 분리 |
| `console.log` 잔존 | `no-console` rule | `logger.debug` 로 교체 |
| chat.md ↔ TSX drift | `// @gd:` annotation + mtime 비교 | `gd react <chat>` 재실행 |
| FRONT.md 카탈로그 외 컴포넌트 | catalog.json 매칭 + Levenshtein | 가장 가까운 카탈로그 컴포넌트 제안 |

---

## 14. Performance defaults

### Route-level lazy

```tsx
// src/router.tsx
const Login = lazy(() => import("./scenes/login"));
// → Suspense fallback 으로 wrap
```

각 신 (scene) 은 lazy import — 초기 번들 크기 ↓.

### `React.memo` 사용 기준

- ✅ 큰 리스트 아이템 (`Row`, `Card`) — props 가 같으면 리렌더 skip
- ✅ 자주 리렌더되는 부모의 자식
- ❌ 모든 컴포넌트에 적용 — 메모이제이션 자체 비용

### TanStack Query 설정

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s 캐시
      retry: 1,                 // 1회 재시도
      refetchOnWindowFocus: false,  // 데스크탑 앱 톤
    },
  },
});
```

### 가상 스크롤 (큰 리스트)

10,000+ items: `@tanstack/react-virtual` (필요 시 추가).

### Code splitting 전략

- Route 단위 — 기본 (위 lazy 패턴)
- Feature 단위 — `import("./features/dashboard")` (lazy 가능)
- Heavy lib — `import("monaco-editor")` 등 무거운 deps 는 동적 import

### React Compiler (선택)

React 19 호환. 수동 `useMemo` / `useCallback` 제거 가능. 추가 후 검토.

---

## 15. 보안 defaults

### 입력 sanitize

```ts
import DOMPurify from "isomorphic-dompurify";

const safe = DOMPurify.sanitize(userInput, { USE_PROFILES: { html: true } });
return <div dangerouslySetInnerHTML={{ __html: safe }} />;
```

> `dangerouslySetInnerHTML` *단독* 사용 절대 금지.

### 환경변수 분리

- `PUBLIC_` prefix 만 client bundle 노출 — Vite envPrefix 강제
- 서버 시크릿 (`API_SECRET` 등) 은 `defineSettings()` (서버측) 로만 접근
- `@env-kit/node-settings` 가 `DEFAULT_SECRET_PATTERNS` (PASSWORD / TOKEN / KEY / SECRET) 자동 감지 → K8s Secret 분리

### 외부 링크

```tsx
<a href={url} rel="noopener noreferrer" target="_blank">
```

ESLint `react/jsx-no-target-blank` rule 로 자동 강제.

### CSP / 헤더

- Vite SPA 는 정적 호스팅 — CSP 는 호스팅 platform 설정 (`vercel.json`, `_headers` 등)
- Next preset 후속에서 미들웨어로 자동화

### 의존성 보안

```bash
pnpm audit                    # 알려진 취약점 스캔
pnpm outdated                 # 업데이트 가능 항목
```

CI 에 통합 권장.

---

## 16. TypeScript strict 패턴

### 필수 옵션 (tsconfig.app.json)

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "verbatimModuleSyntax": true
}
```

### Utility types 활용

| 상황 | 패턴 |
|---|---|
| API 응답 일부만 사용 | `Pick<User, "id" \| "name">` |
| 필드 추가 | `User & { token: string }` |
| 모든 필드 옵션 | `Partial<User>` |
| 깊은 옵션 | `DeepPartial<User>` (`type-fest` 추가 install) |
| 함수 인자 타입 추출 | `Parameters<typeof fetchUser>` |
| 함수 반환 타입 추출 | `ReturnType<typeof useUser>` |
| zod schema → 타입 | `z.infer<typeof userSchema>` |

### 안티 패턴

- ❌ `any` — `unknown` 후 type guard
- ❌ `as` 캐스팅 남용 — 정말 필요할 때만
- ❌ `// @ts-ignore` — `// @ts-expect-error` 와 *왜 그런지 한 줄 주석* 필수

---

## 17. 에러 처리 전략

### 4 계층 분리

| 계층 | 위치 | 책임 |
|---|---|---|
| **API** | `src/api/client.ts` 의 `beforeError` | HTTP 에러 → 표준 `APIError` 변환 |
| **Query** | `QueryClient.QueryCache.onError` | 전역 Query 실패 → Sentry + toast |
| **Component** | `<ErrorBoundary>` | 렌더 실패 → fallback UI |
| **Form** | `react-hook-form` + zod | 입력 검증 → field-level 메시지 |

### React Error Boundary

```tsx
import { SentryErrorBoundary } from "@/lib/sentry";

<SentryErrorBoundary
  fallback={({ error, resetError }) => (
    <ErrorFallback error={error} onReset={resetError} />
  )}
>
  <App />
</SentryErrorBoundary>
```

### TanStack Query Global Error Handler

```ts
new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // toast 또는 Sentry
      if (query.state.data === undefined) {
        // 처음 fetch 실패 — 사용자에게 표시
        toast.error("불러오기 실패");
      }
    },
  }),
});
```

### 사용자 친화 메시지

- 모든 에러 메시지는 *한국어* + *해결 방법 한 줄*
- 기술 스택 누설 금지 (`SQL error` 같은 거 노출 X)
- i18n 키 사용 (`error.network`, `error.unauthorized`)

---

## 18. React 19 활용 가이드

### 새 hooks / API

| API | 용도 | 예시 |
|---|---|---|
| `use(promise)` | Promise / Context 직접 unwrap | Suspense 와 통합 |
| `useActionState` | form action + 상태 통합 | `<form action={action}>` 패턴 |
| `useFormStatus` | 자식에서 부모 form 의 pending 읽기 | `<SubmitButton>` 안에서 |
| `useOptimistic` | 낙관적 업데이트 | mutation 즉시 반영 |
| `useTransition` | non-blocking 상태 전환 | tab switch 등 |

### Async Transitions

```tsx
const [isPending, startTransition] = useTransition();

const onSubmit = () => {
  startTransition(async () => {
    await mutation.mutateAsync(input);
  });
};
```

### Server Components (Next preset 후속)

- RSC 는 `--preset next-app-router` 에서만 — SPA preset 은 client only
- 마이그레이션 시 `"use client"` directive 로 점진 적용

### 안티 패턴

- ❌ `forwardRef` 새로 작성 — React 19 는 ref 를 prop 으로 직접 전달 가능
- ❌ `useEffect` 로 fetch — `use()` + Suspense
- ❌ 수동 `useMemo` 남용 — React Compiler 가 자동 처리 (적용 시)

---

## 19. 테스트 피라미드

### 분포 권장

```
      ▲ E2E (Playwright)
     / \  — 6 라우트 smoke + 핵심 user flow
    /   \
   / 통합 (RTL + MSW)
  /  ───  — feature 단위, network mock
 /
/ 단위 (vitest)  — 유틸 / 훅 / store / pure function
─────────────────
```

비율: 단위 70% / 통합 20% / E2E 10%.

### 단위 테스트 (vitest)

- 순수 함수 / 유틸 (`cn`, date 포맷)
- zustand store
- TanStack Query 훅 (queryClient mock 으로)

### 통합 테스트 (RTL + MSW)

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

it("로그인 성공 → /dashboard 이동", async () => {
  server.use(
    http.post("/api/login", () => HttpResponse.json({ token: "x" })),
  );

  render(<LoginPage />, { wrapper: TestProviders });
  await userEvent.type(screen.getByLabelText("이메일"), "a@b.c");
  await userEvent.type(screen.getByLabelText("비밀번호"), "pw12345678");
  await userEvent.click(screen.getByRole("button", { name: "로그인" }));

  expect(await screen.findByText("환영합니다")).toBeInTheDocument();
});
```

### E2E (Playwright)

- 6 라우트 smoke (이미 셋업)
- 핵심 user flow 1-2 개 (회원가입 → 첫 액션)
- a11y 자동 스캔 (이미 셋업)

### 안티 패턴

- ❌ 구현 detail 테스트 — 사용자 관점 (role / label / text) 으로 query
- ❌ snapshot 남용 — 가독성 ↓, 변경 시 진단 어려움. 단순 출력에만.
- ❌ E2E 가 단위 테스트 대체 — 느림 + 플레이키

---

## 20. AGENT.md — 행동 규칙

본 FRONT.md 는 *stack 결정 + 패턴* 만 담는다. *agent 가 코드 작성 시 따라야 할 명령형 규칙* (❌금지 + ✅필수) 은 별도 `templates/AGENT.md` 참조.

---

## 외부 레퍼런스 (보강용)

### 아키텍처 / 패턴
- [bulletproof-react](https://github.com/alan2207/bulletproof-react) — feature-based 아키텍처
- [React Patterns](https://react-patterns.com/) — 일반 React 패턴 모음
- [Epic Web by Kent C. Dodds](https://www.epicweb.dev/) — 풀스택 React 패턴

### State / Data
- [TkDodo's blog (TanStack Query maintainer)](https://tkdodo.eu/blog) — TanStack Query best practices
- [zustand docs](https://zustand.docs.pmnd.rs/) — 공식 가이드
- [jotai docs](https://jotai.org/) — atomic state

### UI / Component
- [shadcn/ui docs](https://ui.shadcn.com/docs) — 컴포넌트 카탈로그
- [Radix UI](https://www.radix-ui.com/) — 헤드리스 + a11y 기반
- [Tailwind CSS](https://tailwindcss.com/docs) — 유틸리티 클래스

### Form / Validation
- [React Hook Form docs](https://react-hook-form.com/) — 폼 라이브러리
- [Zod docs](https://zod.dev/) — 스키마 검증

### Build / Tooling
- [Vite Guide](https://vite.dev/guide/) — 빌드 / env / plugin
- [@env-kit/node-settings](https://github.com/changsik00/node-settings) — 환경변수 + K8s
- [lefthook](https://lefthook.dev/) — Git hooks (husky 대체)

### Performance
- [web.dev / Core Web Vitals](https://web.dev/articles/vitals) — 성능 측정 기준
- [React Compiler](https://react.dev/learn/react-compiler) — 자동 메모이제이션

### Accessibility
- [WCAG 2.1 AA Quickref](https://www.w3.org/WAI/WCAG21/quickref/) — 기준 점검
- [The A11y Project](https://www.a11yproject.com/) — 실무 체크리스트
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) — 정적 검사

### Testing
- [Testing Library Guide](https://testing-library.com/docs/) — 사용자 관점 테스트
- [Playwright](https://playwright.dev/) — E2E
- [MSW (Mock Service Worker)](https://mswjs.io/) — network mock

### 한국어 자료
- [React Query 시작하기 (Velog)](https://velog.io/@boyeon_jeong/tags/react-query)
- [Effective TypeScript (번역)](https://github.com/danvk/effective-typescript) — 타입 베스트 프랙티스
