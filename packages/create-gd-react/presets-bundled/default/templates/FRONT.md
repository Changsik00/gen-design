# {{project-name}} — FRONT.md (Agent Stack Guide)

> 🔒 **본 파일은 *고정 surface* 입니다.** 디자이너 / 사용자가 수정하지 않습니다.
> agent (Claude / Cursor 등) 가 *코드를 작성할 때 반드시 따라야 할 React stack 의 single source of truth* 입니다.
> 행동 규칙은 별도 `AGENT.md` 참조.

---

## 1. Stack 결정

| 영역 | 선택 | 버전 |
|---|---|---|
| Build / Bundle | **Vite** | 7+ |
| React | **React** | 19+ |
| TypeScript | strict | 5.7+ |
| Router | **React Router** | v7 (data API) |
| Image | `@unpic/react` (옵션 — 본 preset 미포함) | — |

> 향후 `--preset next-app-router` 분기: Next.js 15+ / App Router / `next/image`. 본 default preset 은 Vite 만.

---

## 2. State Management — 3축 분리

**어떤 상태인가** 에 따라 *반드시* 다음 매핑을 따른다:

| 상태 종류 | 라이브러리 | 사용 기준 | 금지 |
|---|---|---|---|
| **서버 데이터** | **TanStack Query v5** | 모든 fetch 결과. 캐시 / 재시도 / invalidation 표준화. | `useState` 로 fetch 결과 보관 금지 |
| **클라이언트 글로벌** | **zustand v5** | 로그인 사용자 / UI 모드 / 모달 상태 등 store 단위 글로벌 | context 남용 금지 |
| **아토믹 / 파인그레인** | **jotai v2** | 폼·필터 등 *상호 의존적 atom 들* — zustand store 가 거대화될 때만 | 첫 store 부터 jotai 금지 |
| **로컬 컴포넌트** | `useState` / `useReducer` | 한 컴포넌트 안에서만 쓰는 상태 | — |

위치:
- zustand store: `src/stores/<domain>.ts`
- TanStack Query 훅: `src/api/hooks/use<X>.ts`
- jotai atom: `src/features/<feature>/atoms.ts` (필요 시)

---

## 3. HTTP Client

- **`ky`** (fetch wrapper) — retry / timeout / interceptors / hooks 기본 제공, 13KB
- **표준 인스턴스**: `src/api/client.ts` — 모든 HTTP 요청이 이 인스턴스를 통과
- **인터셉터**:
  - `beforeRequest`: auth header 주입, debug log
  - `afterResponse`: 4xx/5xx Sentry 보고
  - `beforeError`: 표준 에러 변환

도메인 호출 패턴:
```ts
// src/api/users.ts
import { api } from "./client";
export const fetchUsers = () => api.get("users").json<User[]>();

// src/api/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../users";
export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: fetchUsers });
```

> 직접 `fetch()` 호출 금지. 모든 HTTP 는 `src/api/client.ts` 의 `api` 인스턴스 통과.

---

## 4. 환경변수 — `@env-kit/node-settings` 패턴

- **표준 위치**: `src/config/env.ts` — 모든 env 접근의 single source
- 직접 `import.meta.env.X` 금지 (lint 차단 가능)
- Vite 의 `PUBLIC_` prefix 만 client bundle 에 노출
- 필수 키 누락 시 startup 에서 `validateEnv()` 가 throw

**표준 키**:
- `PUBLIC_API_URL` — API 베이스 (빈 문자열이면 same-origin)
- `PUBLIC_SENTRY_DSN` — Sentry DSN (빈 문자열이면 no-op)
- `PUBLIC_LOG_LEVEL` — `silent` / `error` / `warn` / `info` / `debug`
- `MODE` — Vite 자동 주입

서버 전용 키 (Next preset 후속): `INTERNAL_*` prefix.

---

## 5. Sentry — DSN 없어도 자리잡기

- **`@sentry/react`** 8+
- **표준 위치**: `src/lib/sentry.ts`
- `initSentry()` 가 DSN 환경변수 없으면 **no-op** (로컬 dev 마찰 0)
- `<SentryErrorBoundary>` 로 루트 wrap (필요 시)
- TanStack Query `onError` + ky `afterResponse` 가 자동 capture

DSN 주입은 `.env.local`:
```
PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

---

## 6. Logger

- **`consola`** 4+ (DX 친화, Nuxt 팀)
- **표준 위치**: `src/lib/logger.ts`
- 사용: `import { logger } from "@/lib/logger"; logger.info("msg")`
- scoped: `import { createLogger } from "@/lib/logger"; const log = createLogger("auth"); log.debug(...)`
- 환경별 레벨: dev=debug, prod=warn (env 로 override 가능)

> production 빌드는 자동 silent (DOM 노출 방지).

---

## 7. Pre-check — `pnpm precheck` 단일 명령

| 검사 | 도구 | 명령 |
|---|---|---|
| Lint | **eslint 9** (flat config) + `@typescript-eslint`, `eslint-plugin-react`, `react-hooks`, `jsx-a11y` | `pnpm lint` |
| Format | **prettier 3** + `eslint-config-prettier` | `pnpm format` |
| Type | tsc strict | `pnpm typecheck` |
| Test | **vitest 4** + `@testing-library/react` + `jest-dom` + `user-event v14` | `pnpm test` |
| Git hook | **`lefthook`** (husky 보다 빠름) | 자동 |

위 모두 scaffold 가 설정. 디자이너는 `pnpm precheck` 만.

---

## 8. i18n

- **`react-i18next` 15+** + `i18next-browser-languagedetector`
- **표준 위치**: `src/i18n/index.ts` + `src/i18n/locales/{ko,en}.json`
- chat.md 의 `{{i18n.ko.welcome.title}}` placeholder → `gd react` 가 `t('welcome.title')` 로 컴파일

키 네이밍: `<도메인>.<액션>.<속성>` — 예: `auth.login.email-label`, `dashboard.stats.total-users`.

---

## 9. Form / Date

- **Form**: `react-hook-form` 7 + `zod` 4 (zodResolver 표준 조합)
  ```ts
  const schema = z.object({ email: z.string().email() });
  const form = useForm({ resolver: zodResolver(schema) });
  ```
- **Date**: `date-fns` 4 (트리쉐이킹, ESM 친화). dayjs/moment 사용 금지.

---

## 10. E2E + a11y

- `@playwright/test` 1.50+ + `@axe-core/playwright`
- `e2e/smoke.spec.ts` (라우트 로딩) + `e2e/a11y.spec.ts` (WCAG 2.1 AA)
- a11y 게이트: `critical` / `serious` 만 CI 실패, `moderate` / `minor` 는 console.warn

---

## 11. DRY 룰 (`gd doctor` 가 검사)

| 위반 | 권장 조치 |
|---|---|
| 같은 마크업 3회 이상 반복 | composite 승격 후보 (`src/components/composites/<Name>/`) |
| 인라인 `style={{...}}` 사용 | Tailwind 클래스로 변환 |
| Magic number / hex / rem | `templates/TOKEN.md` 의 토큰 참조 |
| 동일 type alias 중복 | `src/types/<Name>.ts` 공유 |
| `useEffect` 안 직접 `fetch` | TanStack Query 훅 (`useXQuery`) 으로 추출 |
| `useEffect` 안 직접 `setState` | 이벤트 핸들러 / lazy initialization 분리 |
| `console.log` 잔존 | `logger.debug` 로 교체 |

---

## 12. 폴더 구조 (feature-based + shared layer)

```
src/
├── main.tsx              # entry
├── router.tsx            # React Router 설정
├── scenes/               # 🤖 gd react 자동 출력 — // @gd: chats/scenes/X
├── features/             # 도메인 기능 묶음
│   └── <feature>/
│       ├── components/
│       ├── api/
│       ├── stores/
│       └── hooks/
├── components/
│   ├── ui/               # 🔒 shadcn (locked)
│   ├── composites/       # ✏️ Tier 3 카탈로그
│   └── templates/        # ✏️ 페이지 매크로
├── lib/                  # 순수 유틸 (cn, sentry, logger)
├── api/
│   ├── client.ts         # ky 인스턴스
│   └── hooks/            # TanStack Query 훅
├── stores/               # zustand store 들
├── config/env.ts         # 환경변수 single source
├── i18n/                 # i18next + locales
├── types/                # 공유 타입
└── styles/globals.css    # Tailwind + 토큰 CSS vars
```

새 도메인 = `src/features/<domain>/` 추가. 신은 항상 `src/scenes/`.

---

## 13. Performance defaults

- Route-level lazy (`React.lazy` + `<Suspense>`) — `src/router.tsx` 에 기본 설정됨
- `React.memo` 는 *큰 리스트 아이템* / *자주 리렌더되는 컴포넌트* 만 (전역 적용 금지)
- TanStack Query 표준값: `staleTime: 30_000` 일반, `Infinity` 정적 데이터
- 큰 list: `@tanstack/react-virtual` (필요 시 추가)

---

## 14. 보안 defaults

- 사용자 HTML 입력 렌더: **`isomorphic-dompurify`** 만 사용 (`dangerouslySetInnerHTML` 단독 금지)
- env: `PUBLIC_` prefix 만 client bundle 노출 — Vite envPrefix 강제
- 외부 링크: `rel="noopener noreferrer"` — eslint rule 으로 강제 가능

---

## 15. AGENT.md — 행동 규칙

본 FRONT.md 는 *stack 결정* 만 담는다. *agent 가 코드 작성 시 따라야 할 명령형 규칙* 은 별도 `templates/AGENT.md` 참조.

---

## 참고

- 카탈로그 컴포넌트 어휘 (Tier 2/3): `gd lint` 가 `chat.md` 사용 컴포넌트를 검증
- 디자인 토큰: `templates/TOKEN.md` + `templates/assets/tokens/tokens.json` (DTCG 1.0)
- 화면 명세: `chats/*.chat.md` (Narrative + Structure + History 3층)
- 4축 어휘: `chat.md` ≡ Paper layer-name ≡ React component ≡ shadcn 이름
