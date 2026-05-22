# taskflow-v3 — DESIGN.md

> ✏️ **디자이너 surface.** Stitch DESIGN.md 0.1 superset 형식 + gen-design 확장.
> 이 파일은 *디자인 의도의 문장 표현* 이며, gen-design 컴파일러가 chat.md / catalog 와 매핑하여 React 코드 생성에 활용합니다.
> Claude Code 에서 `/gd-design` 호출하면 각 섹션 작성을 가이드합니다.

---

## 🎯 본 문서의 역할 (gen-design 워크플로 안에서)

```
DESIGN.md ◄────── 디자이너 채움 (이 파일)
   ▲
   │ 의도 / 톤 / 컨벤션
   │
TOKEN.md  ◄────── 디자이너 채움 (값)
   │
   │ shadcn 표준 토큰
   ▼
chat.md (디자이너 + /gd-chat 스킬)
   │
   │ gd react 컴파일
   ▼
React TSX (shadcn + Tailwind + cn + cva)
```

DESIGN.md = **"브랜드 / 비주얼 컨벤션"** 의 문서.
TOKEN.md = **"색 / radius / 폰트의 값"**.
chat.md = **"각 화면의 컴포넌트 구조"**.

→ 셋이 *함께* 있어야 gen-design 컴파일러가 *결정적* React 를 만듭니다.

---

## 작성 흐름 (Stitch 9 섹션 순서대로)

> ⚡ Claude Code 에서 `/gd-design` 호출 — 각 섹션을 1-2 문장 단위로 가이드받습니다.
> 비어 있어도 컴파일은 가능하지만, *디자인 일관성 / agent 코드 품질* 은 채울수록 올라갑니다.

---

## 1. Overview

> *이 프로젝트는 무엇이고, 누가 쓰며, 어떤 가치를 주는가?*

<!-- 한 줄 요약 + 2-3 문장. 예시:
taskflow-v3 은 1인 개발자가 SaaS 의 *결제 / 인증 / 대시보드* 를 빠르게 구축하기 위한 도구입니다.
타깃: 백엔드 개발자 → 풀스택 전환. 핵심 가치: 30초 안에 새 신 추가.
-->

---

## 2. Brand

> *어떤 톤 / 인격 / 정서를 가진 제품인가?*

<!-- 3-5 문장. 예시:
- 톤: 친근하지만 전문적 (formal-friendly)
- 목소리: 짧은 문장 / 명령형 동사 / 한국어 우선
- 정서: 신뢰감 + 빠른 실행 (느린 아니메이션 X)
- 키워드: "직진" / "분명히" / "지금"
-->

---

## 3. Colors

> *색이 무엇을 의미하는가?* — 토큰 값 자체는 `templates/TOKEN.md` 참조.

본 프로젝트는 shadcn 표준 토큰을 사용합니다. 각 토큰의 *의도* 만 여기서 정의:

<!-- 예시:
- `--primary`: 행동을 *부르는* 색. CTA / 활성 상태에만 사용. (현재 indigo.600)
- `--destructive`: 되돌릴 수 없는 행동만 (삭제 / 구독 취소). 경고는 amber 별도 추가 검토.
- `--muted-foreground`: caption / 보조 정보. body 텍스트로 사용 금지.
- chart-1~5: 5색 시리즈, 데이터 시각화 전용. UI 에 직접 사용 금지.
-->

> 자세한 cva variant 매핑: `templates/TOKEN.md` 의 "cva variant ↔ 토큰 매핑" 표 참조.

---

## 4. Typography

> *글자가 무엇을 표현하는가?*

- 폰트 패밀리: 본문 `var(--font-sans)` (기본: Inter) / 코드 `var(--font-mono)`
- 스케일: **Tailwind 표준** (`text-xs / sm / base / lg / xl / 2xl / 3xl / 4xl`) 사용. 임의 px 금지.

<!-- 의도 예시:
- 본문: text-base (16px). 단락 간 spacing 은 leading-relaxed.
- 페이지 타이틀: text-3xl font-bold tracking-tight.
- 섹션 타이틀: text-xl font-semibold.
- caption: text-sm text-muted-foreground.
- 모노스페이스: 코드 / 토큰값 표시에만.
-->

---

## 5. Layout

> *공간 / 그리드 / 반응형 의도.*

- Spacing: **Tailwind 4px 그리드** (`p-1 / p-2 / p-4 / p-6 / p-8`) 사용. 임의 px 금지.
- Breakpoint: Tailwind 기본 (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`)
- Container: `max-w-screen-lg` 기본

<!-- 의도 예시:
- 모바일 우선 (375px 기준 설계)
- 신 사이 vertical spacing: `gap-8` (32px)
- Card 내부 padding: `p-6` (24px)
- Form field 사이 `space-y-4` (16px)
-->

---

## 6. Elevation

> *깊이 / 그림자 / 떠있음의 의도.*

본 프로젝트는 Tailwind 의 `shadow-*` 스케일 사용:

| 클래스 | 의미 | 사용 |
|---|---|---|
| `shadow-sm` | 미세하게 떠있음 | Card 기본 |
| `shadow-md` | 명확히 떠있음 | Popover / Tooltip |
| `shadow-lg` | 강하게 떠있음 | Modal / Drawer |
| `shadow-xl` | 가장 강함 | Toast / Alert dialog (옵션) |

<!-- 사용 컨벤션 예시:
- shadow-sm: 모든 Card 의 기본 (떠있는 느낌 약하게)
- shadow-md: 메뉴 / 드롭다운
- shadow-lg: 풀스크린 모달
-->

---

## 7. Shapes (Radius)

> *모서리의 의도.*

본 프로젝트는 토큰 `--radius` (= 0.625rem) 의 파생값 사용:

| 클래스 | 값 | 사용 |
|---|---|---|
| `rounded-sm` | 6px | Badge / 작은 chip |
| `rounded-md` | 8px | Input / Button (기본) |
| `rounded-lg` | 10px | Card |
| `rounded-xl` | 14px | Modal / hero panel |
| `rounded-full` | 50% | Avatar / icon button |

<!-- 의도 예시:
- 전체 톤이 *부드러움 (soft)* — rounded-lg 이상 자주 사용
- 또는 *sharp* — rounded-sm 위주
-->

---

## 8. Components — 도메인 어휘 (Tier 3 카탈로그)

> *gen-design 의 핵심.* chat.md 에서 사용할 *재사용 컴포넌트* 어휘를 여기 정의합니다.
> Tier 1 (ARIA) + Tier 2 (shadcn) 은 *자동* — 본 섹션은 **Tier 3 (프로젝트 specific composites)** 만.

자세한 카탈로그: `pnpm gd lint` 또는 `studio/src/lib/vocabulary/catalog/catalog.json` 확인.

<!-- 예시:
| Composite | 정의 | 구성 (Tier 2) | 사용 처 |
|---|---|---|---|
| `LoginForm` | 이메일/패스워드 + 소셜 + remember me | Card + Form + Input + Label + Button | login.chat.md |
| `BrandHeader` | 로고 + 앱 이름 + tagline | div + img + h1 + p | 모든 신의 상단 |
| `StatCard` | 라벨 + 큰 수치 + 추세 표시 | Card + cva variant (default/compact/highlighted) | dashboard.chat.md |
| `EmptyState` | 일러스트 + 메시지 + CTA | div + svg + p + Button | list.chat.md |

→ 새 composite 승격: 3회 룰 (FRONT.md §9). 디자이너가 직접 만들기보다 *`/gd-chat`* 스킬이 패턴 감지 시 제안.
-->

---

## 9. Iconography

> *아이콘 set 과 사용 규칙.*

- Set: **`lucide-react`** (700+ 아이콘, Tailwind 호환)
- 크기 권장: `size={16}` (caption inline) / `size={20}` (body inline) / `size={24}` (button icon)
- 색: `currentColor` (Tailwind `text-*` 클래스가 자동 적용)

<!-- 사용 컨벤션 예시:
- 상태 의미 일관성: 성공 = ✓ (Check), 경고 = ⚠ (AlertTriangle), 실패 = ✕ (X)
- icon-only button: <Button size="icon" aria-label="..."> 형식. aria-label 필수.
-->

---

## 🌐 i18n schema (gen-design 확장)

> chat.md 의 `{{i18n.ko.foo}}` placeholder 가 어떤 키 구조를 따르는지.

- 키 명명: `<도메인>.<액션>.<속성>` — 예: `auth.login.email-label`
- locale 위치: `src/i18n/locales/{ko,en}.json`
- 표현 가이드:
  - 한국어 우선 (ko 가 기준)
  - 명령형 동사: "확인하세요" / "저장하기"
  - 단수 / 복수 표현: i18next 의 `count` 활용

---

## 🧩 Components 어휘 매핑 (gen-design 확장)

> Tier 3 composite 가 어떤 shadcn 컴포넌트 조합으로 컴파일되는지 명시.
> `gd react` 컴파일러가 본 섹션을 참조 — *없으면 fallback 패턴*, *있으면 명시 패턴*.

<!-- 예시:
| 어휘 (chat.md) | 컴파일 결과 (TSX) |
|---|---|
| `<LoginForm>` | Card + react-hook-form + zod + Input + Label + Button (variant=default) |
| `<DashboardStats>` | grid grid-cols-3 + StatCard repeat |
| `<BrandHeader>` | header + img + h1 + p (Card 아님) |
| `<EmptyState>` | div text-center + Lucide icon + p + Button |
-->

---

## 🛠 gen-design 워크플로 (참조)

1. **`/gd-token`** — 색 / radius 결정. `tokens.json` 편집.
2. **`/gd-design`** — 본 문서 (DESIGN.md) 의 9 섹션 + 확장 채움.
3. **`/gd-chat`** — 새 신 (scene) 작성. `chats/scenes/X.chat.md`.
4. **`pnpm gd react chats/scenes/X.chat.md`** — TSX 생성.
5. **`pnpm gd doctor`** — 정합 검증 (토큰 ↔ DESIGN.md ↔ chat.md ↔ TSX drift).

→ 디자이너는 1-3 만 만집니다. 4-5 는 명령 실행만.

---

## ❌ 안티 패턴 (gen-design 본질)

- ❌ **DESIGN.md 에 픽셀값 / 색값 직접 작성** — 항상 토큰 이름 참조 (값은 TOKEN.md)
- ❌ **Tier 2 (shadcn) 컴포넌트 어휘를 §8 에 재정의** — 자동, 적지 않음
- ❌ **컨벤션을 작성하지 않고 chat.md 만 채우기** — agent 가 일관성 없는 코드 생성
- ❌ **§8 Components 어휘 매핑을 비워두고 신 만들기** — gd react fallback 만 작동 (제한적)
