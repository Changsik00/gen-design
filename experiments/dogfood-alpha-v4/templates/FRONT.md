# taskboard — FRONT.md (Agent Stack Guide)

> 🔒 **본 파일은 *고정 surface* 입니다.** 디자이너 / 사용자가 수정하지 않습니다.
> agent (Claude / Cursor 등) 가 *코드를 작성할 때 반드시 따라야 할* React stack 의 *single source of truth* 입니다.
> 명령형 행동 규칙 / 안티 패턴 요약 / 코드 패턴 예시는 별도 `AGENT.md` 참조.
>
> **Version**: 2026.05 / **Target**: SSG-first React 19+ / **Philosophy**: AI-Agent-friendly architecture

---

## 목차

1. [Core Philosophy](#1-core-philosophy)
2. [Rendering Strategy — SSG-first](#2-rendering-strategy--ssg-first)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure — Feature-based + Unidirectional](#4-folder-structure--feature-based--unidirectional)
5. [State Management — 5축 분리](#5-state-management--5축-분리)
6. [Fetch Strategy](#6-fetch-strategy)
7. [TanStack Query Rules](#7-tanstack-query-rules)
8. [Mock-first API Contract (MSW)](#8-mock-first-api-contract-msw) ⭐
9. [Component Architecture & Patch Strategy](#9-component-architecture--patch-strategy) ⭐
10. [Styling Strategy](#10-styling-strategy)
11. [환경변수 — @env-kit/node-settings](#11-환경변수--env-kitnode-settings)
12. [Error Handling Strategy](#12-error-handling-strategy)
13. [Logger (consola)](#13-logger-consola)
14. [Monitoring — Sentry + PostHog](#14-monitoring--sentry--posthog)
15. [Pre-check — 품질 게이트](#15-pre-check--품질-게이트)
16. [i18n — react-i18next + chat.md 통합](#16-i18n--react-i18next--chatmd-통합)
17. [Form + Date / Async](#17-form--date--async)
18. [Accessibility (WCAG 2.1 AA)](#18-accessibility-wcag-21-aa)
19. [E2E + a11y (Playwright + axe)](#19-e2e--a11y-playwright--axe)
20. [Testing Pyramid](#20-testing-pyramid)
21. [Performance defaults](#21-performance-defaults)
22. [보안 defaults](#22-보안-defaults)
23. [TypeScript strict 패턴](#23-typescript-strict-패턴)
24. [React 19 활용 가이드](#24-react-19-활용-가이드)
25. [AI-Agent Compatibility Rules](#25-ai-agent-compatibility-rules) ⭐
26. [Anti-Patterns 모음](#26-anti-patterns-모음) ⭐
27. [Recommended Defaults](#27-recommended-defaults)
28. [Final Principle — Keep it boring](#28-final-principle--keep-it-boring)
29. [AGENT.md 안내](#29-agentmd-안내)

레퍼런스: [bulletproof-react](https://github.com/alan2207/bulletproof-react) · [TkDodo's blog](https://tkdodo.eu/blog) · [shadcn/ui](https://ui.shadcn.com/) · [Vite Guide](https://vite.dev/guide/) · [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 1. Core Philosophy

본 프로젝트는 *디자이너 / agent 와의 페어 작업* 을 우선합니다. 그래서 *복잡함을 의도적으로 제거*합니다.

**우선순위 (순서대로):**

1. **Predictability** — 같은 입력 → 같은 출력. 결정적 변환.
2. **Debuggability** — 무엇이 잘못됐는지 *즉시* 알 수 있을 것.
3. **Simplicity** — 두 방법이 있으면 *단순한 쪽*.
4. **Maintainability** — 6개월 후 다시 봐도 이해 가능할 것.
5. **AI-Agent-friendly** — agent 가 *명확히 매핑 가능*한 구조.

**의도적으로 회피:**

- 불필요한 아키텍처 복잡도
- hydration mismatch / streaming SSR 문제
- 상태 경계 모호함 (서버 ↔ 클라이언트)
- fetch 행위 불일치 (axios + fetch 혼용 등)
- 장기 유지보수 부담

---

## 2. Rendering Strategy — SSG-first

### 결정

| 원칙 | 내용 |
|---|---|
| ✅ **SSG-first** | 빌드 시 정적 HTML. 정적 호스팅 (Vercel / Netlify / S3 + CloudFront / Cloudflare Pages) |
| ✅ **Client fetching default** | 동적 데이터는 *hydration 후 client* 가 fetch (TanStack Query) |
| ❌ **SSR 최소화** | 페이지 단위 SSR 안 함. Server Components 는 *opt-in only* |
| ❌ **불필요한 hydration 복잡도 회피** | streaming SSR / Suspense boundary SSR 등 SSR-specific 패턴 도입 금지 |

### Flow

```
Static HTML (빌드 시 출력)
   ↓
Client Hydration
   ↓
TanStack Query fetch (필요 시)
   ↓
Cache Management
```

### SSR 사용 허용 조건 (예외)

SSR 은 *오직* 다음 경우에만:

1. SEO 가 *결정적으로 필수* — 검색 트래픽이 비즈니스 핵심
2. 인증을 *반드시 서버 측에서* 해소해야 함 — 세션 hijack 방지 등
3. 개인화가 *법적/규제 의무* — GDPR opt-in 같은 경우
4. 보안 요구사항이 서버 렌더링 강제

→ 위 조건 미달 시 **무조건 SSG**.

### 왜 SSG 인가?

| 항목 | SSG | SSR |
|---|---|---|
| 호스팅 | 정적 (CDN) | Node 서버 + 스케일링 |
| TTFB | 최단 (CDN edge) | 서버 응답 대기 |
| 운영 부담 | 0 | 인프라 관리 |
| Hydration mismatch | 없음 (정적 HTML) | 빈번한 디버깅 |
| 인증 / 동적 데이터 | client fetch (TanStack Query) | 서버 세션 |
| AI 디버깅 친화도 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 구현

본 default preset 은 **Vite SPA 빌드** — `pnpm build` 가 `dist/index.html` + JS bundle 생성. 정적 호스팅에 deploy 하면 그대로 SSG 와 동일한 UX.

라우트 prerender (SEO 시):
```bash
pnpm add -D vite-ssg
# 또는 vite-plugin-pages + sitemap
```

---

## 3. Tech Stack

| 영역 | 선택 | 버전 | 결정 이유 |
|---|---|---|---|
| **Build / Bundle** | Vite | 7+ | ESM-first, SSG 빌드, dev HMR < 100ms. CRA deprecated. |
| **React** | React | 19+ | `use()` / Async Transitions / React Compiler 호환 |
| **TypeScript** | strict + `noUncheckedIndexedAccess` | 5.9+ | 타입 안전 최대 |
| **Router** | React Router | v7 (data API) | loader/action 패턴, 학습 곡선 ↓ |
| **UI** | shadcn/ui + Tailwind 4 + cva + cn (clsx + tailwind-merge) | — | 복사 소유 모델 (§8) |
| **State (server)** | TanStack Query | v5 | 캐시/재시도/invalidation 표준 |
| **State (global)** | zustand | v5 | store 단위, selector 패턴 |
| **State (지역 / Context 대체, optional)** | jotai | v2 | 지역 scope 의 fine-grained 리렌더 최적화. Context API 대체 |
| **Form** | react-hook-form + zod | 7 + 4 | ref-based + 스키마 검증 |
| **HTTP** | ky (fetch wrapper) | 1+ | retry/timeout/interceptors 기본 |
| **Env** | @env-kit/node-settings | 1+ | 자작 — zod + 시크릿 자동 감지 + K8s |
| **Error Boundary** | react-error-boundary (옵션) + Sentry ErrorBoundary | — | 4 계층 분리 (§11) |
| **i18n** | react-i18next | 15+ | chat.md `{{i18n.ko.X}}` 호환 |
| **Date** | date-fns | 4+ | ESM, 트리쉐이킹 |
| **Async sanitize** | isomorphic-dompurify | 2+ | XSS 방어 |
| **Logger** | consola | 3+ | scoped, dev/prod 분리 |
| **Monitoring** | @sentry/react + posthog-js | 8+ / latest | crash + product analytics |
| **Test (unit)** | vitest + RTL + jest-dom + user-event v14 | 4+ | jsdom 환경 |
| **Test (mock)** | MSW | 2+ | network level mock |
| **Test (e2e)** | Playwright + @axe-core/playwright | 1.50+ | 6 라우트 smoke + a11y |
| **Lint / Format** | eslint 9 (flat) + prettier 3 | — | jsx-a11y / react-hooks 포함 |
| **Git hook** | lefthook | 1+ | husky 보다 4-5배 빠름 |

> 향후 `--preset next-app-router`: Next.js 15+ App Router / SSG 모드 (`output: "export"`) 권장 / next/image.

---

## 4. Folder Structure — Feature-based + Unidirectional

bulletproof-react 의 *Unidirectional Codebase Architecture*:

```
shared (components, lib, types, utils, stores)
    ↑
features
    ↑
app (main.tsx, router, scenes)
```

**규칙**: shared 는 어디서나 / features 는 shared 만 import / app 은 features + shared.

### 표준 디렉토리

```
src/
├── main.tsx                 # entry — StrictMode + Providers + Router
├── router.tsx               # React Router 설정 (lazy + Suspense)
├── scenes/                  # 🤖 gd react 자동 출력 — // @gd: chats/scenes/X
│
├── features/                # 도메인 묶음 (대부분의 코드가 여기)
│   └── auth/
│       ├── api/             # 이 기능의 API 함수 + Query 훅
│       ├── components/      # 이 기능 전용 컴포넌트
│       ├── hooks/           # 이 기능 전용 훅
│       ├── stores/          # 이 기능의 *지역* zustand (필요 시)
│       ├── atoms/           # (옵션) jotai — *지역 scope*, Context API 대체
│       ├── providers/       # (옵션) 이 feature 의 Provider (jotai scope 시작점 등)
│       ├── schemas/         # zod 스키마
│       └── types/
│
├── components/              # 전역 공유 UI (도메인 무관)
│   ├── ui/                  # 🔒 shadcn (patch 정책 §9)
│   ├── composites/          # ✏️ Tier 3 — LoginForm 등 (3회 룰로 승격)
│   └── templates/           # ✏️ 페이지 매크로 — AppShell 등
│
├── lib/                     # 도메인 무관 인프라
│   ├── http/                # HTTP 인프라
│   │   ├── client.ts        # ky 인스턴스
│   │   ├── errors.ts        # AppError 표준 타입
│   │   ├── auth.ts          # 토큰/인증 인터셉터
│   │   └── interceptors.ts  # 로그/Sentry 후크
│   ├── query/               # TanStack QueryClient + 글로벌 error
│   ├── monitoring/          # Sentry + PostHog 초기화
│   ├── utils.ts             # cn
│   └── logger.ts            # consola
│
├── mocks/                   # MSW — API contract single source (§8)
│   ├── browser.ts           # dev mode worker
│   ├── server.ts            # vitest node
│   ├── fixtures/            # 결정적 시드 데이터
│   └── handlers/            # http handler + zod schema
│       ├── index.ts         # aggregation
│       └── <domain>.ts
│
├── stores/                  # *진짜 전역* zustand (auth / ui-mode 만)
├── hooks/                   # 전역 공유 훅 (useLocalStorage 등)
├── providers/               # *전역* Provider 만 (Theme / QueryClient / I18nextProvider)
│                            #   — jotai Provider 는 features/<f>/providers/ 에 둠 (지역)
├── config/env.ts            # 환경변수 single source
├── i18n/                    # i18next + locales/{ko,en}.json
├── styles/globals.css       # Tailwind + 토큰 CSS vars
├── types/                   # *진짜 공유* 타입 (도메인 별 타입은 features/<f>/types/)
└── tests/                   # 테스트 유틸 (TestProviders / RTL render wrapper)
```

> **`src/api/` 는 두지 않음.** API 호출 인프라 = `src/lib/http/` / 도메인 API = `features/<f>/api/`. 두 곳으로 충분.

### 지역 vs 전역 — 결정 룰

| 종류 | 지역 (`features/<f>/...`) | 전역 (`src/...`) |
|---|---|---|
| **API 함수 / Query 훅** | 항상 (도메인 = feature) | ❌ 두지 않음 |
| **컴포넌트** | feature 전용 — 항상 지역 | 도메인 무관 + 재사용 3회 ↑ → `components/composites/` |
| **zustand store** | feature 안에서만 쓰면 지역 | 진짜 글로벌 (auth / theme 등) |
| **jotai atoms** | 항상 지역 (Provider scope) | ❌ 전역 두지 않음 |
| **hooks** | feature 전용 | 도메인 무관 utility |
| **schemas / types** | 도메인 → features/<f>/ | 공유 (User / ID 등) |

→ *의심되면 features 안에 먼저 두기.* 3회 이상 쓰이면 전역으로 승격.

### 금지 안티 패턴

- ❌ **Barrel files (`index.ts` 가 모두 re-export)** — Vite tree-shaking 방해 + 순환 의존
- ❌ **Feature 간 직접 import** — 공유는 `components/` / `lib/` / `stores/` 로 승격 후 사용
- ❌ **`components/` 에 도메인 컴포넌트** — `<LoginForm>` 은 `features/auth/components/`. 재사용되면 `composites/` 로 승격.
- ❌ **`src/atoms/` 또는 `src/api/` 디렉토리 생성** — 위 룰 위반
- ❌ **전역 jotai atom + Provider 없이 사용** — Context 대체의 의도 무력화

---

## 5. State Management — 5축 분리

**어떤 상태인가** 에 따라 *반드시* 다음 매핑.

| 축 | 라이브러리 | 사용 기준 | 안티 패턴 |
|---|---|---|---|
| **1. 서버 데이터** | **TanStack Query v5** | 모든 fetch 결과. 캐시 / 재시도 / invalidation. | `useState` 로 보관 / `useEffect` 안 fetch / Zustand 에 캐시 |
| **2. 클라이언트 글로벌** | **zustand v5** | 인증 / UI 모드 / 모달 / 위저드 step | 서버 데이터 보관 / Context 남용 |
| **3. 지역 atomic (옵션, Context API 대체)** | **jotai v2** | *지역 scope* 에서 상호 의존적 atom 들 / canvas / editor / 폼 필터. Provider 로 트리 분리. | 전역으로 사용 금지 / 첫 store 부터 jotai 금지 |
| **4. 로컬** | `useState` / `useReducer` / `useRef` | 한 컴포넌트 안 | — |
| **5. URL** | React Router `searchParams` | filter / pagination / sorting / tab / 검색 | local state 에 보관 |

### 5.1 서버 상태 룰

서버 상태 특징: 비동기 / 캐시 가능 / stale 가능 / 화면 간 공유.

**룰:**
- 서버 데이터를 zustand 에 *복제 금지*
- API 응답을 *수동 캐시 금지*
- 동기화 보다는 *query invalidation* 으로 처리

### 5.2 클라이언트 글로벌 (zustand) 룰

**zustand 가 *보관해선 안 되는* 것:**

- ❌ API 응답 (→ TanStack Query)
- ❌ 서버 캐시
- ❌ 페이지네이션 데이터
- ❌ 가져온 리스트
- ❌ 인증 *토큰* (httpOnly cookie 권장, 어쩔 수 없으면 메모리 only)
- ❌ Query 데이터 복제

**예시 (좋음):**
```ts
// src/stores/ui-mode.ts
import { create } from "zustand";
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setTheme: (t: "light" | "dark") => void;
}
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (t) => set({ theme: t }),
}));
```

### 5.3 jotai 사용 기준 — 지역 / Context API 대체

> jotai 는 **전역 상태 라이브러리가 아닙니다.** *Context API 의 대체* — 컴포넌트 트리의 *지역 scope* 에서 fine-grained 리렌더 최적화를 제공합니다.

**위치**: `src/features/<feature>/atoms/` *만* — 전역 `src/atoms/` 두지 않음.

**사용 시점:**
- visual / canvas / editor — 자주 변하는 fine-grained 상태
- spreadsheet-like UI
- atom dependency graph 가 유의미한 경우 (`derivedAtom` 등)
- 폼 / 필터 등 *상호 의존적* 상태 묶음 (한 feature 안)
- 컴포넌트 트리의 *일부 subtree* 만 상태를 공유 — Context API 대체

**Provider 로 scope 분리** (Context 대체의 핵심):

```tsx
// src/features/editor/atoms/index.ts
import { atom } from "jotai";
export const canvasZoomAtom = atom(1);
export const selectedNodeAtom = atom<string | null>(null);

// src/features/editor/EditorRoot.tsx
import { Provider } from "jotai";

export function EditorRoot() {
  return (
    <Provider>            {/* ← scope 시작 — 이 subtree 안에서만 atom 유효 */}
      <Toolbar />
      <Canvas />
      <Inspector />
    </Provider>
  );
}
```

→ 같은 `canvasZoomAtom` 도 다른 Provider 안에서는 *별개 인스턴스*. Context Provider 와 동일 모델.

**금지:**
- ❌ 전역 `src/atoms/` 디렉토리 — feature 별 *지역 atoms/* 만
- ❌ 인증 / UI 모드 등 *진짜 전역* 상태에 jotai — zustand 사용
- ❌ 첫 store 부터 jotai — zustand 가 단순한 경우 항상 우선
- ❌ Provider 없이 atom 전역 import 후 사용 — scope 의도 무력화

### 5.4 폼 상태 룰

- **반드시 react-hook-form** 사용. 수동 `useState` form 금지.
- **검증은 zod** 만. 수동 if-else 검증 금지.
- 스키마는 *공유 가능*하면 `src/features/<feature>/schemas/` 에서 export.

### 5.5 URL 상태 룰

navigable 한 UI 상태는 *URL 이 source of truth*:

```ts
import { useSearchParams } from "react-router";

function UserList() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const filter = params.get("filter") ?? "all";

  const { data } = useQuery({
    queryKey: userKeys.list({ page, filter }),
    queryFn: () => fetchUsers({ page, filter }),
  });

  return <Pagination page={page} onChange={(p) => setParams({ page: String(p), filter })} />;
}
```

→ URL 공유 / 뒤로가기 / 북마크 가능. **local state 로 보관하지 말 것.**

---

## 6. Fetch Strategy

### 6.1 Single HTTP Client

애플리케이션은 **단 하나의 HTTP client 추상화** 를 사용한다.

- 선택: **`ky`** (fetch wrapper) — retry/timeout/interceptors/hooks
- **금지**: axios + fetch 혼용, 직접 `fetch()`, 중복 retry 로직, 일관성 없는 timeout

### 6.2 API Layer 구조

```
src/lib/http/
├── client.ts         # ky 인스턴스 (싱글톤)
├── errors.ts         # AppError 표준 타입 + 변환
├── auth.ts           # 토큰 인터셉터
└── interceptors.ts   # 로그 / Sentry 후크

src/api/              # (선택, cross-feature 도메인)
src/features/<feat>/api/  # 도메인별 (대부분)
```

**Flow**: UI → hooks → api → http client. UI 가 fetch 직접 호출 *금지*.

### 6.3 표준 에러 형태 (AppError)

모든 HTTP 에러는 *정규화*된다:

```ts
// src/lib/http/errors.ts
export interface AppError {
  code: string;        // 'network' | 'unauthorized' | 'not-found' | ...
  message: string;     // i18n 키 또는 한국어 사용자 메시지
  status?: number;     // HTTP status (있을 때)
  cause?: unknown;     // 원본 에러
}

export function toAppError(err: unknown): AppError {
  // ky HTTPError, Error, unknown → AppError 표준화
  ...
}
```

→ raw backend error 를 UI 에 *직접 노출 금지*.

### 6.4 Retry 정책

| 상황 | 재시도 |
|---|---|
| 네트워크 실패 | ✅ |
| 5xx (일시적) | ✅ |
| 검증 에러 (400) | ❌ |
| 인증 실패 (401) | ❌ |
| 비즈니스 로직 에러 (422) | ❌ |

ky 기본:
```ts
retry: { limit: 2, methods: ["get", "head", "options"] }
```

### 6.5 Timeout 정책

**모든 요청은 timeout 정의 필수.** 무한 대기 *금지*.

- 일반 GET: 10s
- 업로드 / 무거운 POST: 30s
- streaming: 별도 처리 (timeout 비활성화 시 명시 주석)

---

## 7. TanStack Query Rules

### Query Key Factory (TkDodo 표준)

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

**룰:**
- 항상 배열 + as const
- *generic → specific* 순서
- `useQuery` 와 `useInfiniteQuery` 에 *동일 키 사용 금지*
- 키는 deterministic — `["random"]` 금지

### staleTime 기준

| 유형 | 권장 값 |
|---|---|
| 정적 config | `Infinity` |
| 메타데이터 (locale list 등) | `5 * 60_000` (5분) |
| 일반 도메인 데이터 | `30_000` (30s) — 기본 |
| 실시간 대시보드 | `0` |

### Mutation + Invalidation

```ts
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (data, vars) => {
    // detail 은 setQueryData 로 즉시 갱신
    queryClient.setQueryData(userKeys.detail(vars.id), data);
    // list 는 invalidate
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});
```

**룰:**
- *상위 레벨* 무효화 (`userKeys.all`) 는 신중히
- *선택적 업데이트*: 활성 쿼리는 `setQueryData`, 나머지는 invalidate
- 전체 캐시 reset 금지 (`queryClient.clear()`) — 인증 변경 시에만

### 글로벌 Error Handler

```ts
// src/lib/query/client.ts
new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // toast 또는 Sentry
      if (query.state.data === undefined) {
        toast.error(toAppError(error).message);
      }
    },
  }),
});
```

---

## 8. Mock-first API Contract (MSW) ⭐

> **MSW handler 는 단순 *테스트 모킹* 이 아니라 *API contract 의 single source of truth*.**
> chat.md 가 화면을 정의하면, 그 화면이 필요로 하는 API 가 MSW handler (+ zod schema) 로 추출되고, **백엔드는 그 schema 를 보고 구현**합니다. 디자이너는 백엔드 없이 *실제 동작하는 React* 를 즉시 받습니다.

### 8.1 5축 어휘 정합 (vision.md 의 4축 → 5축으로 확장)

```
[디자이너 작성]   chat.md 의 <Component variant="x">
        ≡
[Paper 시각]      Paper 노드 + layer-name anchor
        ≡
[React 출력]      shadcn/ui 컴포넌트 + composites
        ≡
[LLM 학습]        shadcn 이름 = LLM 훈련 데이터 풍부
        ≡
[API contract]    MSW handler + zod schema  ← NEW
                  ↓
                  OpenAPI / 백엔드 구현 stub
```

### 8.2 흐름

```
chat.md (화면 명세 — 디자이너)
   │
   ├── gd react   → src/scenes/X.tsx (UI 코드)
   │
   └── gd api     → src/mocks/handlers/<domain>.ts (MSW handler + zod schema)
                         │
                         ├── 개발 (dev / test 에서 MSW 가 응답)
                         ├── 프로토타이핑 (백엔드 없이 화면 동작)
                         ├── e2e 테스트 (Playwright + MSW)
                         └── 백엔드 contract (schema → OpenAPI export 가능)
```

> 💡 `gd api` 는 phase-12 후속 명령. spec-11-01 은 *MSW 셋업과 contract 정책* 만 박음.

### 8.3 MSW handler 표준 구조

```ts
// src/mocks/handlers/users.ts
import { http, HttpResponse } from "msw";
import { z } from "zod";

// API contract — schema 가 곧 백엔드 spec
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;

export const usersListSchema = z.object({
  items: z.array(userSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});

export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    const user: User = {
      id: params.id as string,
      name: "Test User",
      email: "t@example.com",
    };
    return HttpResponse.json(userSchema.parse(user));  // 응답이 contract 따르는지 자체 검증
  }),

  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    return HttpResponse.json(usersListSchema.parse({
      items: [{ id: "u1", name: "A", email: "a@b.c" }],
      total: 1,
      page,
    }));
  }),
];
```

**룰:**
- handler 는 *반드시* schema 정의 + `schema.parse()` 로 응답 자체 검증
- type 은 `z.infer<typeof schema>` 로 자동 추론 — 별도 type 정의 금지
- handler 는 *순수* — DB / 외부 호출 없음 (in-memory fixture)
- 응답 시간 시뮬레이션은 `delay()` 사용

### 8.4 폴더 구조

```
src/mocks/
├── browser.ts          # dev mode 시작 (worker)
├── server.ts           # vitest 시작 (node)
├── fixtures/           # 결정적 시드 데이터
│   ├── users.ts
│   └── ...
└── handlers/
    ├── index.ts        # 모든 handler aggregation (export const handlers = [...])
    ├── auth.ts         # POST /api/login, POST /api/logout
    ├── users.ts
    └── ...
```

### 8.5 Dev 모드에서 MSW 활성화

```ts
// src/main.tsx
if (MODE === "development" && env.PUBLIC_USE_MOCK === "true") {
  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledRequest: "warn" });
}
```

`.env.local` 에 `PUBLIC_USE_MOCK=true` → 백엔드 없이 dev 가능.

### 8.6 백엔드와의 contract 동기화

```bash
# 1. zod schema → OpenAPI 자동 변환 (zod-to-openapi 또는 우리 자체 export)
pnpm gd api export --format openapi --out api.yaml

# 2. 백엔드는 api.yaml 을 보고 구현 — 디자이너 / 프론트와 병렬 가능

# 3. 백엔드 stub 자동 생성 (NestJS / FastAPI 등)
pnpm gd api export --format nestjs --out backend-stub/
```

> `gd api export` 는 후속 spec — 현재는 *철학 / 정책* 만 박힘.

### 8.7 이점

| 항목 | 전통 방식 | Mock-first contract |
|---|---|---|
| 디자이너 첫 동작 | 백엔드 완료 대기 | **즉시** (MSW) |
| 백엔드 작업 시점 | 디자이너 후 | **병렬** |
| Contract drift | 문서 + 수동 검증 | **schema = 코드** |
| e2e 환경 의존 | DB / API 서버 필요 | **MSW 만** |
| 타입 안정성 | 별도 OpenAPI codegen | **z.infer 자동** |

### 8.8 안티 패턴 (금지)

- ❌ handler 가 schema 없이 *임의 JSON 반환* — contract 약화
- ❌ MSW 외 `vi.fn(fetch)` 직접 모킹 — 일관성 깨짐, 테스트만의 mock 됨
- ❌ MSW 를 *테스트에서만* — dev mode 에서도 활성화해 prototyping 가속
- ❌ handler 가 *side effect* (DB / 외부 호출) — 순수 fixture 만
- ❌ schema 와 별도로 type 수동 정의 — 항상 `z.infer<typeof schema>`

### 8.9 chat.md ↔ MSW handler 매핑 (gd api 의 책임 — 후속)

`chat.md` 의 Structure 섹션에서 데이터 사용 패턴을 분석:

```chat
<UserList>
  <UserCard for={user in users} />
</UserList>
```

↓ `gd api` (후속 명령) 가 자동 추출:

```ts
// src/mocks/handlers/users.ts
export const usersListSchema = z.object({
  items: z.array(userSchema),
  total: z.number().int(),
});

export const handlers = [
  http.get("/api/users", () => HttpResponse.json(usersListSchema.parse({...}))),
];
```

→ chat.md 가 곧 *화면 spec + API spec*. 디자이너가 만진 적 없어도 contract 가 생성됨.

---

## 9. Component Architecture & Patch Strategy ⭐

> **shadcn 의 핵심 철학**: 컴포넌트를 *npm install 하지 않고 복사해서 소유* 한다. 따라서 *직접 수정 (패치) 가능*. 이는 강력하지만, *일관된 패치 전략* 이 없으면 카오스가 됨.

### 8.1 3-tier 컴포넌트 카탈로그

```
┌─────────────────────────────────────────────┐
│ Tier 1: ARIA roles (자동 a11y)              │  — Radix UI 가 기반 제공
├─────────────────────────────────────────────┤
│ Tier 2: shadcn/ui (src/components/ui/)      │  🔒 LOCKED (패치 정책)
│   Button / Card / Input / Label / ...       │
├─────────────────────────────────────────────┤
│ Tier 3: composites (src/components/composi…)│  ✏️ EDITABLE (도메인 어휘)
│   LoginForm / DashboardStats / EmptyState   │
├─────────────────────────────────────────────┤
│ Tier 3+: templates (src/components/template…)│  ✏️ 페이지 macro
│   AppShell / EmptyLayout / AuthLayout       │
└─────────────────────────────────────────────┘
```

**규칙:**
- Tier 1 은 *자동* — 직접 다루지 않음
- Tier 2 는 *제한적 패치만* (아래 §8.2)
- Tier 3 는 *자유 편집* (도메인 어휘 = 본 프로젝트 가치)

### 8.2 Tier 2 (shadcn) 패치 정책

**`src/components/ui/` 의 shadcn 컴포넌트는 lock 처리. 단 다음 패치는 허용:**

| 패치 종류 | 허용 | 예시 |
|---|---|---|
| **cva variant 추가** | ✅ | `Button` 에 `variant: "soft"` 추가 |
| **색상 토큰 매핑 조정** | ✅ | `bg-primary` → `bg-brand` |
| **className 기본값 수정** | ✅ | 기본 padding 조정 |
| **a11y 속성 추가** | ✅ | 기본 `aria-label` |
| **Radix prop 변경** | ⚠️ 신중히 | side effect 분석 필요 |
| **컴포넌트 API 변경** | ❌ | `<Button onClick>` → `<Button onPress>` 같은 변경 |
| **컴포넌트 삭제** | ❌ | catalog 일관성 깨짐 |

### 8.3 신규 shadcn 컴포넌트 추가

```bash
# 1. shadcn CLI 로 add (`src/components/ui/` 에 복사)
npx shadcn@latest add dialog

# 2. catalog 등재 — gd lint 가 자동 감지
pnpm gd lint

# 3. 패치 필요 시 (variant / 색상) — 위 §8.2 규칙 안에서
```

### 8.4 upstream 변경 추적 (drift 관리)

shadcn 은 *수동 갱신* 모델. upstream 에 새 버전이 나와도 자동 반영 안 됨.

```bash
# upstream diff 확인
npx shadcn@latest diff button

# 강제 갱신 (덮어쓰기 — 주의: 패치 손실)
npx shadcn@latest add button --overwrite
```

**워크플로 (안전):**
1. `git stash` 또는 `feature branch` 분리
2. `npx shadcn diff <component>` 로 변경 확인
3. *3-way merge* — base / 우리 패치 / upstream 통합
4. `pnpm precheck` PASS 확인
5. 머지

### 8.5 Tier 3 (composite) 승격 기준 — "3회 룰"

같은 마크업이 **3회 이상 반복** 되면 *반드시 composite 으로 승격*.

```
같은 패턴 3회 발견 (gd doctor 가 AST 매칭으로 감지)
    ↓
src/components/composites/<Name>/ 생성
    ↓
├── index.tsx          # cva 로 variant 표현
├── <Name>.test.tsx    # 단위 + 스냅샷 테스트
└── __snapshots__/
    ↓
pnpm gd lint           # catalog.json 자동 등재
    ↓
chat.md 에서 <Name> 어휘 사용 가능
```

### 8.6 composite 작성 표준 (cva 패턴)

```ts
// src/components/composites/StatCard/index.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "py-2 [&_.value]:text-xl",
      highlighted: "border-2 border-primary",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  label: string;
  value: string;
}

export function StatCard({ label, value, variant }: StatCardProps) {
  return (
    <Card className={cn(statCardVariants({ variant }))}>
      <CardContent>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="value mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
```

**룰:**
- 모든 variant 는 cva `variants` 안에 정의 — 임의 `if/else` 분기 금지
- prop 은 `VariantProps<typeof X>` 로 자동 추론
- `cn()` 으로 className 병합 (Tailwind 충돌 자동 해소)
- 외부에서 `className` 추가 가능하게 `props.className` 받기 (선택)

### 8.7 의사결정 트리 — 패치 vs 새 composite

```
변경하려는 것이 무엇?
   │
   ├─ 색상 / spacing / variant 조정만? → Tier 2 패치 (§8.2)
   │
   ├─ 구조 / 조합 / 도메인 의미 추가? → 새 Tier 3 composite (§8.5)
   │
   ├─ 컴포넌트 동작 (a11y / interaction)? → ⚠️ 신중 — 보통 새 composite 권장
   │                                       (Radix 기반 패치 시 side effect ↑)
   │
   └─ 페이지 전체 레이아웃? → Tier 3+ template (src/components/templates/)
```

### 8.8 등록 / catalog 동기화

`templates/FRONT.md` 의 카탈로그 표 (Tier 2/3) 는 `pnpm vocab` (vocab CLI) 또는 `pnpm gd lint` 가 자동 갱신:

- `src/components/ui/<Name>.tsx` → Tier 2 entry
- `src/components/composites/<Name>/index.tsx` → Tier 3 entry
- cva `variants.<axis>` → catalog 의 axis 자동 추출

→ chat.md 에서 `<StatCard variant="compact">` 사용 시 `gd doctor` 가 catalog 매칭 검증.

### 8.9 외부 공유 — shadcn registry export

자체 composite 를 다른 프로젝트로 공유:

```bash
pnpm gd react --registry > registry.json
# 또는 별도 npm package 로 publish

# 소비 측에서:
npx shadcn@latest add @my-project/login-form
```

→ Tier 3 composite 가 *시장의 표준 install 채널* 로 흘러감. (vision.md §D3)

### 8.10 안티 패턴 (금지)

- ❌ `src/components/ui/` 에 *새로* 컴포넌트 추가 (shadcn CLI 외 직접 작성) — Tier 3 composite 으로 만들 것
- ❌ composite 에서 도메인 데이터를 *컴포넌트 내부 fetch* — props 로 받기 (UI / 로직 분리)
- ❌ variant 를 *동적 className 문자열 조합* — cva 만 사용
- ❌ shadcn 컴포넌트의 *Radix prop 직접 변경* — 분석 없이는 위험
- ❌ god component (한 파일에 모든 것) — 200줄 넘으면 분해 검토

---

## 10. Styling Strategy

### 표준

- **Tailwind CSS** 4 — utility-first
- **cva** — variant 시스템
- **cn()** (`clsx` + `tailwind-merge`) — 조건부 + 충돌 해소
- **CSS vars + 토큰** — `src/styles/globals.css` 의 `@theme inline`

### 금지

- ❌ 거대한 global CSS — 토큰 / `globals.css` 외 추가 CSS 파일 금지
- ❌ 깊게 중첩된 selector — `.a .b .c .d {...}` 금지
- ❌ 인라인 `style={{...}}` — Tailwind 클래스로 변환
- ❌ CSS-in-JS (styled-components, emotion) — Tailwind 가 표준

### 패턴

```tsx
// ❌ 안티
<div style={{ padding: 16, color: '#475569' }}>...

// ❌ 안티 — magic
<div className="p-4 text-[#475569]">...

// ✅ 좋음 — 토큰 + cn
<div className={cn("p-4 text-muted-foreground", isActive && "bg-primary")}>...
```

---

## 11. 환경변수 — `@env-kit/node-settings`

> 자작 라이브러리 — Vite / Next / dotenv-flow 컨벤션. zod 검증 + 자동 시크릿 감지 + K8s Secret 분리 + CLI.
> ref: https://github.com/changsik00/node-settings

### 정책

- `PUBLIC_` prefix 만 client bundle 노출 (Vite envPrefix)
- **prefix 는 definition 시점에 enforce** — schema 가 prefix 위반 키 포함 시 build 거부
- zod schema 로 런타임 검증 — 필수 키 누락 시 `NodeSettingsError`
- 모든 env 접근은 `src/config/env.ts` 통과 (직접 `import.meta.env.X` 금지)

### 표준 패턴 (2단계)

```ts
import { z } from "zod";
import { defineClientEnv } from "@env-kit/node-settings";

const schema = z.object({
  PUBLIC_API_URL: z.string().default(""),
  PUBLIC_SENTRY_DSN: z.string().default(""),
  PUBLIC_POSTHOG_KEY: z.string().default(""),
  PUBLIC_LOG_LEVEL: z.enum(["silent", "error", "warn", "info", "debug"]).optional(),
});

// 1단계: definition (검증 함수 반환)
const getClientEnv = defineClientEnv({ prefix: "PUBLIC_", schema });

// 2단계: 호출 (import.meta.env 를 raw 로 전달)
export const env = getClientEnv(import.meta.env as Record<string, string | undefined>);
export const MODE = (import.meta.env.MODE as string) ?? "development";
```

### .env 파일 계층

```
.env                # 공통 (커밋 OK)
.env.local          # 로컬 override (.gitignore — 시크릿 OK)
.env.development    # dev mode
.env.production     # prod mode
.env.[mode].local   # mode 별 로컬
```

### 서버측 (build script / Node)

```ts
import { defineSettings, loadDotenvCascade } from "@env-kit/node-settings";

const settings = defineSettings({
  envSchema: z.object({ DATABASE_URL: z.string(), API_SECRET: z.string() }),
  envKey: "NODE_ENV",
  defaults: { logLevel: "info" },
  perEnv: { production: { logLevel: "warn" } },
  build: (env, config) => ({ db: { url: env.DATABASE_URL }, ...config }),
});

const { env } = loadDotenvCascade();
export const serverConfig = settings(env);  // frozen + validated
```

### CLI (CI 통합)

```bash
npx node-settings validate .env.production     # 검증 게이트
npx node-settings check --env prod,stage       # 다환경 동시 검증
npx node-settings generate k8s --name app --out k8s.yaml  # K8s 매니페스트
npx node-settings generate docs --out ENV.md   # 환경변수 문서
```

### 런타임 오버라이드 (canary / 인시던트)

```bash
APP_CONFIG_JSON='{"logLevel":"debug"}' node server.js
```

---

## 12. Error Handling Strategy

### 4 계층 분리

| 계층 | 위치 | 책임 |
|---|---|---|
| **1. HTTP** | `src/lib/http/errors.ts` 의 `toAppError()` | raw → AppError 표준화 |
| **2. Query** | `QueryCache.onError` | 전역 Query 실패 → toast + Sentry |
| **3. Component** | `<ErrorBoundary>` (route / feature) | 렌더 실패 → fallback UI |
| **4. Form** | react-hook-form + zod | 입력 검증 → field-level 메시지 |

### Error Boundary (3 종)

```tsx
// 1) 루트 boundary (catch-all)
<SentryErrorBoundary fallback={RootErrorFallback}>
  <App />
</SentryErrorBoundary>

// 2) Route boundary (페이지 단위)
{
  path: "/dashboard",
  element: (
    <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  ),
}

// 3) Feature boundary (위험한 영역)
<ErrorBoundary FallbackComponent={WidgetErrorFallback}>
  <ThirdPartyWidget />
</ErrorBoundary>
```

### Async Fallback

```tsx
<Suspense fallback={<Skeleton />}>
  <LazyScene />
</Suspense>
```

### 사용자 메시지

- 모든 에러 메시지는 *한국어* + *해결 방법 한 줄*
- 기술 스택 누설 금지 (`SQL error` 같은 거 노출 X)
- i18n 키 사용 (`error.network`, `error.unauthorized`)

---

## 13. Logger (consola)

- **표준 위치**: `src/lib/logger.ts`
- 사용:
  ```ts
  import { logger, createLogger } from "@/lib/logger";
  logger.info("app boot");
  const log = createLogger("auth"); log.debug("login attempt");
  ```
- 환경별 레벨: dev=debug, prod=warn (env `PUBLIC_LOG_LEVEL` 로 override)
- production 빌드 자동 silent (DOM 노출 방지)

### 금지

- ❌ `console.log` 잔존 — `logger.debug` 로
- ❌ 시크릿 / 토큰 logging
- ❌ 사용자 PII logging — GDPR 준수

---

## 14. Monitoring — Sentry + PostHog

### Sentry — Crash + 에러 모니터링

- **`@sentry/react`** 8+
- **표준 위치**: `src/lib/monitoring/sentry.ts`
- DSN 없으면 **no-op** — 로컬 dev 마찰 0
- 자동 capture 지점:
  - ky `afterResponse` → 4xx/5xx
  - TanStack Query `QueryCache.onError`
  - React Error Boundary
  - unhandled rejection

```ts
import { initSentry, SentryErrorBoundary } from "@/lib/monitoring/sentry";

initSentry();
createRoot(rootEl).render(
  <SentryErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </SentryErrorBoundary>,
);
```

### PostHog — Product Analytics

- **`posthog-js`**
- **표준 위치**: `src/lib/monitoring/posthog.ts`
- KEY 없으면 **no-op**
- 추적 지점:
  - 페이지뷰 (자동)
  - 핵심 이벤트 (`onboarding-complete`, `subscription-paid`)
  - feature flag (옵션)

```ts
import { posthog } from "@/lib/monitoring/posthog";

posthog.capture("button-clicked", { button: "subscribe" });
```

### 추적 대상

- ✅ frontend crashes (Sentry)
- ✅ API failures (Sentry)
- ✅ UX 흐름 / 핵심 funnel (PostHog)
- ❌ PII / 토큰 — *절대* 보내지 않음

---

## 15. Pre-check — 품질 게이트

`pnpm precheck` = lint + typecheck + test 단일 명령.

| 검사 | 도구 | 명령 |
|---|---|---|
| Lint | eslint 9 flat config | `pnpm lint` |
| Format | prettier 3 | `pnpm format` |
| Type | tsc strict | `pnpm typecheck` |
| Test | vitest 4 + RTL + jest-dom + user-event v14 | `pnpm test` |
| Git hook | lefthook | 자동 |

### lefthook.yml

```yaml
pre-commit:
  parallel: true
  commands:
    lint: { glob: "*.{ts,tsx,js,jsx}", run: pnpm eslint {staged_files} }
    format: { glob: "*.{ts,tsx,json,md,css}", run: pnpm prettier --check {staged_files} }
    typecheck: { glob: "*.{ts,tsx}", run: pnpm typecheck }

pre-push:
  commands:
    precheck: { run: pnpm precheck }
```

---

## 16. i18n — react-i18next + chat.md 통합

- **표준 위치**: `src/i18n/index.ts` + `src/i18n/locales/{ko,en}.json`
- 키 명명: `<도메인>.<액션>.<속성>` — `auth.login.email-label`

### chat.md ↔ React 자동 변환

```chat
<Button>{{i18n.ko.welcome.cta}}</Button>
```
↓ `gd react` 컴파일
```tsx
const { t } = useTranslation();
<Button>{t("welcome.cta")}</Button>
```

### 금지

- ❌ 한국어 / 영어 하드코딩 — 모두 i18n 키
- ❌ 즉시 평가 (`t("foo")` 가 hook 밖에서) — 항상 hook 내부

---

## 17. Form + Date / Async

### Form — react-hook-form + zod

```ts
const schema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(8, "8자 이상 입력하세요"),
});
type Input = z.infer<typeof schema>;

const form = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
const onSubmit = form.handleSubmit(async (v) => await login(v));
```

shadcn `<Form>` 사용 시 `<FormField>` + `<FormLabel>` + `<FormMessage>` 가 a11y 자동.

### Date — date-fns 4

```ts
import { format, differenceInMinutes } from "date-fns";
const display = format(date, "yyyy-MM-dd HH:mm");
```

`dayjs` / `moment` *금지*.

### Async sanitize (XSS 방어)

```ts
import DOMPurify from "isomorphic-dompurify";
const safe = DOMPurify.sanitize(userInput);
```

`dangerouslySetInnerHTML` *단독* 사용 *절대* 금지.

---

## 18. Accessibility (WCAG 2.1 AA)

### 요구사항

- **WCAG 2.1 AA target**
- 키보드 네비게이션 지원 (`tab` 순회, `focus-visible` 표준)
- 시맨틱 HTML (`<button>`, `<nav>`, `<main>` 등)
- 올바른 ARIA (Radix UI 가 대부분 자동)

### 색 대비 기준

| 텍스트 | 기준 |
|---|---|
| Normal text (< 18pt) | **4.5:1** |
| Large text (≥ 18pt / 14pt bold) | **3:1** |
| UI components / graphics | **3:1** |

`gd doctor` 가 토큰 페어 자동 측정 + 미달 시 *가장 가까운 합격 컬러* 제안.

### 자동 검사

- `eslint-plugin-jsx-a11y` — 정적 분석
- `@axe-core/playwright` — runtime 스캔
- Radix UI (shadcn 기반) — 컴포넌트 a11y 자동

---

## 19. E2E + a11y (Playwright + axe)

- `e2e/smoke.spec.ts` — 6 라우트 로딩 + 렌더 완료
- `e2e/a11y.spec.ts` — axe 스캔, WCAG 2.1 AA
- 게이트 정책:
  - `critical` / `serious` → CI 실패
  - `moderate` / `minor` → console.warn (게이트 아님)

### 핵심 flow (E2E 우선)

- 인증 (회원가입 → 로그인 → 로그아웃)
- 결제 (가능 시)
- onboarding
- 대시보드 주요 워크플로

---

## 20. Testing Pyramid

```
      ▲ E2E (Playwright)  — 10%
     / \  핵심 user flow 1-3개
    /   \
   / 통합 (RTL + MSW)  — 20%
  /  ───  feature 단위, network mock
 /
/ 단위 (vitest)  — 70%
─────────────────  순수 함수 / 훅 / store / pure component
```

### MSW 표준 (network mock)

```ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const server = setupServer(
  http.get("/api/users/:id", ({ params }) =>
    HttpResponse.json({ id: params.id, name: "Test User" }),
  ),
);
```

직접 `vi.fn(fetch)` 모킹 *금지* — 항상 MSW.

### 금지

- ❌ 구현 detail 테스트 — *사용자 관점* (role / label / text) 으로 query
- ❌ snapshot 남용 — 가독성 ↓
- ❌ E2E 가 단위 테스트 대체 — 느림 + 플레이키

---

## 21. Performance defaults

- Route-level lazy (`React.lazy` + `<Suspense>`)
- `React.memo` 는 *큰 리스트 / 자주 리렌더되는 컴포넌트* 만
- TanStack Query: `staleTime` 표준값 (§7)
- 큰 list: `@tanstack/react-virtual`
- React Compiler (React 19+) — 자동 메모이제이션 (옵션)

**금지**: premature optimization. 측정 후 최적화.

---

## 22. 보안 defaults

- 사용자 HTML 입력 렌더: `isomorphic-dompurify` 만 (`dangerouslySetInnerHTML` 단독 금지)
- env `PUBLIC_` prefix 강제 — 시크릿 노출 방지
- 외부 링크: `rel="noopener noreferrer"` (eslint rule)
- 의존성: `pnpm audit` + `pnpm outdated` 정기 CI
- CSP / 헤더: 호스팅 platform 설정 (`vercel.json`, `_headers`)

---

## 23. TypeScript strict 패턴

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

### Utility types

| 상황 | 패턴 |
|---|---|
| 일부 필드만 | `Pick<User, "id" \| "name">` |
| 옵션 | `Partial<User>` |
| 깊은 옵션 | `DeepPartial<User>` (type-fest) |
| 함수 인자 / 반환 | `Parameters<typeof fn>` / `ReturnType<typeof fn>` |
| zod 스키마 → 타입 | `z.infer<typeof schema>` |

### 금지

- ❌ `any` — `unknown` + type guard
- ❌ `as` 캐스팅 남용 — 정말 필요할 때만
- ❌ `@ts-ignore` — `@ts-expect-error` + *왜 그런지 한 줄 주석* 필수

---

## 24. React 19 활용 가이드

### 새 API

| API | 용도 |
|---|---|
| `use(promise)` | Promise / Context unwrap (+ Suspense) |
| `useActionState` | form action 통합 |
| `useFormStatus` | 자식에서 부모 form pending |
| `useOptimistic` | 낙관적 업데이트 |
| `useTransition` | non-blocking 전환 |

### 금지

- ❌ `forwardRef` 새로 작성 — React 19 는 ref 가 prop
- ❌ `useEffect` 로 fetch — `use()` + Suspense + TanStack Query
- ❌ 수동 `useMemo` 남용 — React Compiler 가 자동

---

## 25. AI-Agent Compatibility Rules

> agent (Claude / Cursor) 가 *코드를 작성할 때 잘 동작* 하도록 *예측 가능한 구조* 를 유지한다.

### 선호

- ✅ **명시적 네이밍** — `useUser` (`useFetch` X)
- ✅ **결정적 폴더 구조** — feature-based, agent 가 *어디에 무엇이 있는지* 예측 가능
- ✅ **격리된 책임** — 한 파일 / 한 함수 = 한 가지 일
- ✅ **단순한 렌더 흐름** — SSG → hydrate → query, *예외 없음*

### 회피

- ❌ **숨겨진 magic** — context / provider 가 *어디서 주입되는지* 불명확
- ❌ **과도한 추상화** — 사용처 1곳인데 추상 클래스 / interface 제공
- ❌ **깊게 결합된 상태** — 여러 store 가 서로 참조
- ❌ **예측 불가능한 side effect** — `useEffect` 안에서 다른 effect 트리거

### 표준화

agent 가 매번 다른 패턴을 생성하지 않도록:
- *모든* HTTP → `src/lib/http/client.ts` 의 `api` 인스턴스
- *모든* 서버 상태 → TanStack Query 훅
- *모든* form → react-hook-form + zod
- *모든* 신 → chat.md → `gd react` 컴파일

→ FRONT.md 의 결정이 *모든* 코드에 적용. *예외 만들지 않음*.

---

## 26. Anti-Patterns 모음

> 본 프로젝트에서 *절대* 피해야 할 패턴 모음. 발견 시 `gd doctor` 가 보고하고, agent 는 *자동 거부* 한다.

| # | 안티 패턴 | 대안 |
|---|---|---|
| 1 | 서버 데이터를 zustand 에 보관 | TanStack Query 훅 |
| 2 | UI 컴포넌트 안 `fetch()` 직접 호출 | `src/lib/http/client.ts` 의 `api` 인스턴스 |
| 3 | 거대 글로벌 store | feature 별 분리 (`src/features/<f>/stores/`) |
| 4 | 중복 검증 로직 | zod 스키마 공유 (`src/features/<f>/schemas/`) |
| 5 | SSR-by-default 마인드 | SSG-first (→ §2) |
| 6 | Hydration 의존 아키텍처 | client-side fetch + Suspense |
| 7 | 혼합 fetch client (axios + fetch) | ky 단일 |
| 8 | Context API 과사용 | zustand (전역) 또는 jotai (지역 + Provider scope) |
| 9 | Barrel files (`index.ts` 모두 re-export) | 직접 import |
| 10 | feature 간 직접 import | shared 로 승격 후 사용 |
| 11 | 인라인 `style={{...}}` | Tailwind + cn |
| 12 | magic number / hex | TOKEN.md 토큰 |
| 13 | `useEffect` 안 fetch / setState | Query 훅 / 이벤트 핸들러 분리 |
| 14 | `if (typeof window !== "undefined")` 분기 | SPA/SSG 에서 불필요 |
| 15 | `console.log` 잔존 | `logger.debug` |
| 16 | `dayjs` / `moment` | date-fns |
| 17 | `dangerouslySetInnerHTML` 단독 | isomorphic-dompurify sanitize |
| 18 | `forwardRef` 새로 작성 | React 19 — ref 가 prop |
| 19 | `any` / `@ts-ignore` | `unknown` + guard / `@ts-expect-error` |
| 20 | 직접 `vi.fn(fetch)` 모킹 | MSW |
| 21 | snapshot 테스트 남용 | role / label query |
| 22 | shadcn 컴포넌트 API 직접 변경 | Tier 3 composite 으로 분리 |
| 23 | god component (200+ 줄) | 분해 (§9) |
| 24 | jotai 를 *전역* 으로 사용 (`src/atoms/`) | features/<f>/atoms/ + Provider scope (Context 대체) |
| 25 | `src/api/` 디렉토리 신설 | `src/lib/http/` (인프라) + `features/<f>/api/` (도메인) |
| 26 | feature 내부 코드가 *전역* `components/composites/` 컴포넌트를 *수정* | 자체 composite 생성 (도메인 specific) |
| 27 | MSW handler 가 schema 없이 임의 JSON 반환 | zod schema + `schema.parse()` 자체 검증 |

---

## 27. Recommended Defaults

빠른 참조용 표:

```
Build       Vite 7 (SSG-first)
React       19+
TypeScript  5.9+ strict + noUncheckedIndexedAccess

UI          Tailwind 4 + shadcn/ui + cva + cn (clsx + tailwind-merge)
State       TanStack Query v5 (server) + zustand v5 (global) + jotai v2 (optional atomic)
Form        react-hook-form 7 + zod 4
HTTP        ky 1
Env         @env-kit/node-settings 1
i18n        react-i18next 15
Date        date-fns 4
Sanitize    isomorphic-dompurify 2

Logger      consola 3
Monitor     @sentry/react 8 + posthog-js
Test        vitest 4 + RTL 16 + jest-dom + user-event 14 + MSW 2 + Playwright 1.50 + @axe-core/playwright
Lint/Fmt    eslint 9 (flat) + prettier 3 + lefthook 1
```

---

## 28. Final Principle — Keep it boring

> **지루한 아키텍처가 더 잘 확장된다.**

단순한 시스템은:
- 더 빠르게 디버깅된다
- 새 팀원 / agent 가 더 빠르게 적응한다
- AI 출력이 더 일관적이다
- 덜 실패한다
- 더 안전하게 진화한다

**유혹**: 새 lib / 새 패턴 / 새 아키텍처. **답**: 측정 가능한 이득 없으면 *현재 stack 유지*.

본 FRONT.md 는 *한 번 정해진 결정* 이다. 변경하려면 *합의된 ADR* 작성 후 본 문서 직접 갱신.

---

## 29. AGENT.md 안내

본 FRONT.md 는 *stack 결정 + 패턴* 만 담는다.

*agent 가 코드 작성 시 따라야 할 명령형 규칙* (❌금지 / ✅필수 / 코드 패턴 예시 / 작업 흐름) 은 별도 `templates/AGENT.md` 참조.

---

## 외부 레퍼런스

### 아키텍처
- [bulletproof-react](https://github.com/alan2207/bulletproof-react) — feature-based + unidirectional
- [Epic Web by Kent C. Dodds](https://www.epicweb.dev/)

### State / Data
- [TkDodo's blog (TanStack Query maintainer)](https://tkdodo.eu/blog) — Query best practices
- [zustand docs](https://zustand.docs.pmnd.rs/)
- [jotai docs](https://jotai.org/)

### UI / Component
- [shadcn/ui docs](https://ui.shadcn.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Form / Validation
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Build / Tooling
- [Vite Guide](https://vite.dev/guide/)
- [@env-kit/node-settings](https://github.com/changsik00/node-settings)
- [lefthook](https://lefthook.dev/)
- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)

### Performance / a11y
- [web.dev / Core Web Vitals](https://web.dev/articles/vitals)
- [React Compiler](https://react.dev/learn/react-compiler)
- [WCAG 2.1 AA Quickref](https://www.w3.org/WAI/WCAG21/quickref/)
- [The A11y Project](https://www.a11yproject.com/)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

### Testing
- [Testing Library Guide](https://testing-library.com/docs/)
- [Playwright](https://playwright.dev/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

### Monitoring
- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [PostHog](https://posthog.com/docs)

### 한국어 자료
- [Effective TypeScript (번역)](https://github.com/danvk/effective-typescript)
- [React Query velog 시리즈](https://velog.io/tags/react-query)
