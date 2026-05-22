# {{project-name}} — AGENT.md (행동 규칙)

> 🔒 **본 파일은 *agent 용 명령형 행동 규칙* 입니다.** 디자이너 / 사용자가 수정하지 않습니다.
> Claude / Cursor 등 agent 가 본 프로젝트에서 *코드를 작성할 때 반드시 따를 규칙*.
> 배경 / 결정 / 아키텍처는 `FRONT.md` 참조.

---

## 절대 규칙 (위반 시 거부 또는 수정 요구)

### ❌ 금지

1. **SSR / RSC 도입 금지** (default preset). Server Components / `getServerSideProps` / server-only fetch 패턴 사용 금지. 본 프로젝트는 **SSG-first** (→ FRONT.md §0). 데이터는 client-side TanStack Query 로 fetch.
2. **`useState` 로 서버 데이터 보관 금지**. TanStack Query 훅을 만들어 사용한다.
3. **`useEffect` 안에서 직접 `fetch` 또는 `setState` 호출 금지**. 데이터는 query 훅, 상태 변경은 이벤트 핸들러로 분리.
4. **직접 `fetch()` 호출 금지**. 모든 HTTP 는 `src/api/client.ts` 의 `api` 인스턴스 (ky) 사용.
5. **`import.meta.env.X` 직접 접근 금지**. `src/config/env.ts` 의 `env` 객체만 사용.
6. **`if (typeof window !== "undefined")` 패턴 금지**. SPA/SSG 에서는 항상 client — 분기 자체가 불필요.
7. **인라인 `style={{...}}` 금지**. Tailwind 클래스 또는 `cn()` 으로 처리.
8. **Magic number / hex / rem 하드코딩 금지**. `templates/TOKEN.md` / `templates/assets/tokens/tokens.json` 의 토큰 참조.
9. **`console.log` 잔존 금지**. `import { logger } from "@/lib/logger"` 후 `logger.debug(...)`.
10. **`dayjs` / `moment` 사용 금지**. `date-fns` 만.
11. **`dangerouslySetInnerHTML` 단독 사용 금지**. 항상 `isomorphic-dompurify` 로 sanitize.
12. **외부 링크에 `rel="noopener noreferrer"` 누락 금지**.

### ✅ 필수

1. **신 (scene) 추가 = chat.md 먼저**. `chats/scenes/<name>.chat.md` 작성 → `pnpm gd react chats/scenes/<name>.chat.md` 로 TSX 생성. 직접 `src/scenes/X.tsx` 수정 금지 (다음 컴파일에 덮어쓰여짐).
2. **새 도메인 = `src/features/<domain>/`** 추가. components / api / stores / hooks 폴더 구조 따름.
3. **새 composite = `src/components/composites/<Name>/`** + `index.tsx` + `<Name>.test.tsx` + `__snapshots__/`.
4. **API 함수 = `src/api/<domain>.ts`**. 그에 대응되는 훅 = `src/api/hooks/use<X>.ts` (TanStack Query 로 래핑).
5. **글로벌 상태 = `src/stores/<domain>.ts`** (zustand). atom-level 필요 시에만 `src/features/<feature>/atoms.ts` (jotai).
6. **i18n 키 = `<도메인>.<액션>.<속성>`** — `auth.login.email-label`. chat.md 의 `{{i18n.ko.foo}}` → `t('foo')` 로 자동 변환.
7. **모든 user-visible string 은 i18n key 사용**. 하드코딩된 한국어 / 영어 금지.
8. **a11y 자동 보장**: shadcn (Radix) 기반 → ARIA role 자동. 추가 `aria-label` 은 *시맨틱 없는* `<div>` 에 인터랙션 붙일 때만.
9. **form = react-hook-form + zod**. 다른 form lib 사용 금지.
10. **에러 boundary**: 루트에 `<SentryErrorBoundary>` (DSN 없어도 동작).

---

## 코드 작성 패턴 (예시)

### TanStack Query 훅 패턴

```ts
// src/api/users.ts
import { api } from "./client";
import type { User } from "@/types/user";

export const fetchUsers = (): Promise<User[]> => api.get("users").json<User[]>();

// src/api/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../users";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 30_000,
  });
```

### zustand store 패턴

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
```

### 새 신 (scene) 추가 워크플로

1. `chats/scenes/<name>.chat.md` 작성 (Narrative + Structure + History 3층)
2. `pnpm gd react chats/scenes/<name>.chat.md` 실행
3. `src/scenes/<name>.tsx` 자동 생성 (`// @gd:` annotation 포함)
4. `src/router.tsx` 에 라우트 추가
5. `pnpm gd doctor` → 정합 검증
6. `pnpm typecheck` → 타입 PASS
7. `pnpm dev` → 시각 확인

### 새 composite 승격 (Tier 3) 워크플로

1. 같은 마크업이 3회 이상 반복되는지 확인 (`gd doctor` 가 감지)
2. `src/components/composites/<Name>/index.tsx` 생성 — cva variants 정의
3. `src/components/composites/<Name>/<Name>.test.tsx` 테스트
4. `pnpm gd lint` 가 자동으로 `templates/FRONT.md` 카탈로그에 등재 후보 표시
5. 디자이너 confirm 후 `pnpm gd merge` 로 카탈로그 갱신

---

## 작업 흐름 (Workflow)

매 작업 전:
1. `pnpm gd doctor` — 현재 상태 정합 확인
2. `.gd/memory/MEMORY.md` 읽기 — 디자이너가 알려준 정보 반영

매 작업 후:
1. `pnpm precheck` — lint + typecheck + test
2. `pnpm gd doctor` — drift 검증 (chat.md ↔ TSX)
3. 새 정보가 있으면 `.gd/memory/` 에 append

---

## 모름 처리

- 어휘 카탈로그에 없는 컴포넌트를 디자이너가 요청 → "Tier 3 composite 으로 승격 가능. confirm?" 질문 후 진행
- DESIGN.md / TOKEN.md 가 비어있는 섹션 → 디자이너에게 1-2 문장으로 채워달라 요청 (직접 짐작 금지)
- 토큰 충돌 (예: bg 와 fg 대비 미달) → `gd doctor` 메시지 + 대안 토큰값 제시
