# taskflow-v3 — AGENT.md (행동 규칙)

> 🔒 **본 파일은 *agent 용 명령형 행동 규칙* 입니다.** 디자이너 / 사용자가 수정하지 않습니다.
> Claude / Cursor 등 agent 가 본 프로젝트에서 *코드를 작성할 때 반드시 따를 규칙*.
> 배경 / 결정 / 아키텍처는 `FRONT.md` 참조.

---

## 🎯 0. 가장 중요한 원칙 — gen-design 우선

**이 프로젝트는 *gen-design* 워크플로를 따릅니다.** 일반 React 프로젝트가 아닙니다.

핵심:

1. **신 (scene) 은 chat.md → TSX 컴파일로만 추가**. 직접 `src/scenes/X.tsx` 작성 금지.
2. **컴포넌트 어휘는 카탈로그 안에서만 사용**. 임의 신규 컴포넌트 작명 금지.
3. **디자이너 surface 3개 (DESIGN.md / TOKEN.md / chat.md) 만 디자이너가 수정**. 그 외는 agent / gd CLI 영역.
4. **`gd doctor` 가 자동 검증**. 작업 마무리 시 *반드시* 실행.
5. **shadcn 토큰 이름 절대 변경 금지**. cva variant 정합이 깨짐.

---

## 🎯 1. 작업 흐름 (모든 작업 전 / 후)

### 작업 전 (Pre)

1. **`.gd/memory/MEMORY.md` 읽기** — 디자이너가 알려준 정보 (브랜드 / 톤 / 결정) 회상
2. **`templates/FRONT.md` + `AGENT.md` 자동 컨텍스트 확인** — 본 문서들이 *모든 결정의 source*
3. **`templates/DESIGN.md` + `TOKEN.md` 읽기** — 도메인 / 토큰 의도 회상
4. **`pnpm gd doctor`** — 현재 상태 정합 확인

### 작업 후 (Post)

1. **`pnpm precheck`** — lint + typecheck + test 모두 PASS
2. **`pnpm gd doctor`** — drift / 어휘 / 대비 / contract 검증
3. **`.gd/memory/` 갱신** — 새로 알게 된 정보 append (디자이너 / 프로젝트 / 결정 / 피드백)
4. **chat.md ↔ TSX 정합 확인** — 수정된 chat.md 마다 `gd react` 재실행

---

## 🎯 2. 신 (scene) 추가 워크플로 — 가장 중요

```
디자이너 또는 /gd-chat 스킬과 대화
   ↓
1. chats/scenes/<name>.chat.md 작성 (Narrative + Structure + History 3층)
   ↓
2. pnpm gd react chats/scenes/<name>.chat.md
   ↓
3. src/scenes/<name>.tsx 자동 생성 (// @gd: annotation 포함)
   ↓
4. src/router.tsx 에 라우트 추가
   ↓
5. pnpm gd doctor (정합 검증)
   ↓
6. pnpm typecheck (타입 PASS)
   ↓
7. pnpm dev (시각 확인)
```

**금기**:
- 4단계 (router 추가) 외에는 `src/scenes/*.tsx` 손대지 않음. 손대면 다음 `gd react` 시 덮어쓰기 됨.
- chat.md 없이 scenes 디렉토리에 파일 직접 작성 금지.

---

## ❌ 절대 금지 (위반 시 거부 또는 수정 요구)

### gen-design 본질 위반

1. **`src/scenes/*.tsx` 직접 수정 금지**. chat.md 만 수정 → `gd react` 컴파일.
2. **FRONT.md 카탈로그 외 컴포넌트 어휘 사용 금지**. chat.md 에 `<MyCustomBtn>` 같이 임의 명명 X — `Button` (Tier 2) 또는 *Tier 3 composite 으로 승격* 후 사용.
3. **shadcn 토큰 이름 (`--primary` / `--card` / `--accent` 등) 변경 금지**. cva variant 정합이 깨짐. 값만 `tokens.json` 에서 수정.
4. **Tier 2 (`src/components/ui/`) 에 *새* 컴포넌트 추가 금지** (shadcn CLI 외). Tier 3 composite 으로 만들 것.
5. **Tier 3 composite 의 *외부 호출* 변경 금지** (다른 chat 이 의존). props 호환성 유지.

### SSR / 렌더링 본질

6. **SSR / RSC 도입 금지** (default preset). Server Components / `getServerSideProps` / server-only fetch 패턴 X — 본 프로젝트는 **SSG-first** (→ FRONT.md §2).
7. **`if (typeof window !== "undefined")` 패턴 금지**. SPA/SSG 에서는 항상 client — 분기 불필요.

### 상태 / 데이터

8. **`useState` 로 서버 데이터 보관 금지**. TanStack Query 훅 사용.
9. **`useEffect` 안에서 직접 `fetch` 또는 `setState` 호출 금지**. 데이터는 query 훅, 상태는 이벤트 핸들러.
10. **직접 `fetch()` 호출 금지**. 모든 HTTP 는 `src/lib/http/client.ts` 의 `api` 인스턴스 (ky) 사용.
11. **`src/atoms/` 또는 `src/api/` 디렉토리 생성 금지**. jotai atom = `features/<f>/atoms/` (지역 Provider scope) / API = `src/lib/http/` (인프라) + `features/<f>/api/` (도메인).
12. **jotai 를 *전역* 으로 사용 금지**. jotai 는 Context API 대체 — 항상 Provider 로 *지역 scope*.
13. **MSW handler 가 zod schema 없이 임의 JSON 반환 금지**. handler 는 *반드시* schema + `schema.parse()` 자체 검증 (FRONT.md §8).

### 코드 품질

14. **`import.meta.env.X` 직접 접근 금지**. `src/config/env.ts` 의 `env` 객체만.
15. **인라인 `style={{...}}` 금지**. Tailwind 클래스 또는 `cn()`.
16. **Magic number / hex / rem 하드코딩 금지**. `templates/TOKEN.md` 토큰 / Tailwind 스케일 사용.
17. **`console.log` 잔존 금지**. `logger.debug` 사용.
18. **`dayjs` / `moment` 금지**. `date-fns` 만.
19. **`dangerouslySetInnerHTML` 단독 사용 금지**. `isomorphic-dompurify` 로 sanitize.
20. **외부 링크에 `rel="noopener noreferrer"` 누락 금지**.
21. **`forwardRef` 새로 작성 금지**. React 19 — ref 가 prop.
22. **`any` / `@ts-ignore` 금지**. `unknown` + type guard / `@ts-expect-error` + 사유 주석.

---

## ✅ 필수

### gen-design 본질 따르기

1. **신 = chat.md 먼저**. `chats/scenes/<name>.chat.md` 작성 → `pnpm gd react` 로 TSX 생성.
2. **카탈로그 어휘 사용**. Tier 1 (ARIA) / Tier 2 (shadcn 28종) / Tier 3 (composite) — `pnpm gd lint` 가 검증.
3. **새 composite = 3회 룰 후 승격**. `src/components/composites/<Name>/index.tsx` + 테스트.
4. **shadcn 토큰 풀셋 사용**. background / foreground / card / popover / primary / secondary / muted / accent / destructive / border / input / ring / chart-1~5 / sidebar 들 모두 표준 이름 그대로.
5. **`gd doctor` 작업 끝마다 실행** — drift / 어휘 / 대비 / contract 자동 검증.

### 폴더 / 코드 구조

6. **새 도메인 = `src/features/<domain>/`** — `api/` `components/` `hooks/` `stores/` `schemas/` `types/` 폴더 구조.
7. **API 함수 = `features/<f>/api/<domain>.ts`**, 훅 = `features/<f>/api/hooks/use<X>.ts` (TanStack Query 로 래핑).
8. **글로벌 상태 = `src/stores/<domain>.ts`** (zustand). 진짜 글로벌만 (auth / ui-mode).
9. **지역 atomic = `features/<f>/atoms/`** (jotai) + `features/<f>/providers/` 의 Provider 로 scope 시작.
10. **i18n 키 = `<도메인>.<액션>.<속성>`** — `auth.login.email-label`. chat.md 의 `{{i18n.ko.foo}}` → `t('foo')` 자동 변환.
11. **모든 user-visible string 은 i18n 키**. 하드코딩 한국어 / 영어 금지.
12. **a11y 자동 보장**. shadcn (Radix) 기반 → ARIA 자동. 추가 `aria-label` 은 *시맨틱 없는* `<div>` 인터랙션 시.
13. **form = react-hook-form + zod**. 다른 form lib 금지.
14. **MSW handler = API contract**. `src/mocks/handlers/<domain>.ts` 에 zod schema + `schema.parse()` 자체 검증.
15. **루트 `<SentryErrorBoundary>`**. DSN 없어도 동작 (no-op).

---

## 🎯 3. 디자이너 surface 보호

**디자이너만 만지는 파일** — agent 가 *수정 제안 시 반드시 확인*:

| 파일 | 누가 만지나 | agent 수정 정책 |
|---|---|---|
| `chats/**/*.chat.md` | 디자이너 + `/gd-chat` 스킬 | agent 가 *제안 가능*, 적용은 디자이너 confirm 후 |
| `templates/DESIGN.md` | 디자이너 + `/gd-design` 스킬 | 동일 |
| `templates/TOKEN.md` | 디자이너 + `/gd-token` 스킬 | 동일 (값만 — 이름 변경은 *항상* 거부) |
| `templates/assets/tokens/tokens.json` | 위 동기화 | `/gd-token` 통해서만 |
| `.gd/memory/*` | 자동 누적 (스킬) | agent 가 *세션 끝* 에 append |

**agent 가 자유롭게 수정 가능한 파일** (디자이너 surface 외):
- `src/features/**/*` — 도메인 코드
- `src/lib/**/*` — 인프라
- `src/stores/**/*` `src/hooks/**/*` `src/providers/**/*` `src/types/**/*`
- `src/mocks/**/*` — MSW handler
- 설정 파일 (`vite.config.ts` 등)

**agent 가 *절대* 수정하지 않는 파일**:
- `src/components/ui/**/*` — shadcn (`npx shadcn add` 만 추가 가능, 직접 작성 X)
- `templates/FRONT.md`, `templates/AGENT.md` — agent 자신의 행동 규칙 (의도적 수정만)
- `src/scenes/**/*` — `gd react` 의 출력물 (chat.md 수정 후 재컴파일)

---

## 🎯 4. 코드 작성 패턴 (필수 예시)

### 4.1 TanStack Query 훅 패턴

```ts
// features/users/api/users.ts
import { api } from "@/lib/http/client";
import type { User } from "../types/user";

export const fetchUsers = (): Promise<User[]> => api.get("users").json<User[]>();

// features/users/api/keys.ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

// features/users/api/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
export const useUsers = () =>
  useQuery({ queryKey: userKeys.lists(), queryFn: fetchUsers, staleTime: 30_000 });
```

### 4.2 zustand store 패턴

```ts
// src/stores/auth.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### 4.3 jotai 지역 패턴 (Context API 대체)

```tsx
// features/editor/atoms.ts
import { atom } from "jotai";
export const canvasZoomAtom = atom(1);
export const selectedNodeAtom = atom<string | null>(null);

// features/editor/providers/EditorProvider.tsx
import { Provider } from "jotai";
export const EditorProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider>{children}</Provider>  // ← scope 시작 (Context 대체)
);

// features/editor/EditorRoot.tsx
import { EditorProvider } from "./providers/EditorProvider";
export function EditorRoot() {
  return (
    <EditorProvider>
      <Toolbar />
      <Canvas />
    </EditorProvider>
  );
}
```

### 4.4 cva variant 패턴 (composite)

```ts
// src/components/composites/StatCard/index.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "py-2",
      highlighted: "border-2 border-primary",  // shadcn 토큰만 사용
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
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
```

### 4.5 MSW handler 패턴 (API contract)

```ts
// src/mocks/handlers/users.ts
import { http, HttpResponse } from "msw";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;

export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    const user: User = { id: params.id as string, name: "Test", email: "t@b.c" };
    return HttpResponse.json(userSchema.parse(user));  // schema = contract
  }),
];
```

---

## 🎯 5. 모름 / 충돌 처리

| 상황 | 대응 |
|---|---|
| 디자이너가 카탈로그 외 컴포넌트 요청 | "Tier 3 composite 으로 승격 가능. 어떤 shadcn 조합으로 만들까요?" 질문 후 진행 |
| DESIGN.md / TOKEN.md 빈 섹션 | 디자이너에게 *1-2 문장으로 채워달라* 요청. 직접 짐작 금지. |
| 토큰 색 대비 미달 | `gd doctor` 메시지 + 대안 OKLCH 값 제시 |
| chat.md ↔ TSX drift | `pnpm gd react <chat>` 재실행 안내 |
| API 시그니처 불명 | MSW handler 의 zod schema 정의 후 contract 합의 |
| 기존 카탈로그 변경 필요 | 영향 받는 chat 목록 (`gd doctor`) 출력 후 디자이너 확인 |

---

## 🎯 6. 작업 종료 체크리스트

```
□ pnpm precheck            — lint + typecheck + test
□ pnpm gd doctor           — drift / 어휘 / 대비 / contract
□ pnpm gd react <chat>     — 수정된 chat.md 마다 (있다면)
□ .gd/memory/ append       — 새 정보 누적
□ chat.md 수정 시 diff 확인 — 디자이너 의도 보존
```
