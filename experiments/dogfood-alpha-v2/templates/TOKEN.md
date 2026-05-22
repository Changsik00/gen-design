# taskflow — TOKEN.md

> ✏️ **디자이너 surface.** DTCG 1.0 호환 + **shadcn/ui 의 표준 토큰** 을 그대로 따릅니다.
> 실제 값은 `templates/assets/tokens/tokens.json` 에 저장 — 본 문서는 *의미 + 사용처 + cva variant 매핑*.
> Claude Code 에서 `/gd-token` 호출하면 작성 / 색 대비 검증을 가이드합니다.

---

## 🎨 본질 — shadcn 표준 토큰 = Tailwind 클래스 = cva variant

shadcn 의 토큰은 *Tailwind 클래스* 와 1:1 대응합니다. 즉:

| 토큰 (CSS var) | Tailwind 클래스 | cva variant 에서 사용 |
|---|---|---|
| `--primary` | `bg-primary` | `<Button variant="default">` 의 배경 |
| `--primary-foreground` | `text-primary-foreground` | `<Button variant="default">` 의 텍스트 |
| `--destructive` | `bg-destructive` | `<Button variant="destructive">` 배경 |
| `--destructive-foreground` | `text-destructive-foreground` | `<Button variant="destructive">` 텍스트 |
| ... | ... | ... |

→ **토큰을 바꾸면 cva variant 의 결과가 바뀐다.** gen-design 컴파일러는 *토큰 이름 그대로* TSX 출력에 사용하므로 *이름을 임의로 바꿔서는 안 됨*.

---

## 표준 토큰 풀셋 (shadcn default style)

본 프로젝트는 shadcn 의 default style 토큰 세트를 사용합니다. 디자이너는 *값만* 조정 (이름은 잠금).

### 1. Base — 페이지 기본

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--background` | 페이지 배경 | `bg-background` | body 기본 |
| `--foreground` | 본문 텍스트 | `text-foreground` | body 기본 |
| `--border` | 외곽선 (Card / Separator 등) | `border-border` | Card / Separator |
| `--input` | 입력 필드 외곽선 | `border-input` | Input border |
| `--ring` | 포커스 링 | `ring-ring` | `:focus-visible` |

### 2. Primary — 브랜드 메인

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--primary` | 브랜드 메인 색 | `bg-primary` | `<Button variant="default">` 배경 |
| `--primary-foreground` | primary 위 텍스트 | `text-primary-foreground` | `<Button variant="default">` 텍스트 |

### 3. Secondary — 보조 액션

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--secondary` | 보조 surface | `bg-secondary` | `<Button variant="secondary">` 배경 |
| `--secondary-foreground` | secondary 위 텍스트 | `text-secondary-foreground` | `<Button variant="secondary">` 텍스트 |

### 4. Muted — 비활성 / 약함

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--muted` | 약한 surface (Skeleton 배경) | `bg-muted` | Skeleton / 비활성 |
| `--muted-foreground` | 약한 텍스트 (caption) | `text-muted-foreground` | caption / 보조 정보 |

### 5. Accent — 호버 / 하이라이트

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--accent` | 호버 / 강조 배경 | `bg-accent` | `<Button variant="ghost">` 호버 |
| `--accent-foreground` | accent 위 텍스트 | `text-accent-foreground` | ghost 호버 텍스트 |

### 6. Card — 카드 surface

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--card` | Card 배경 | `bg-card` | `<Card>` 배경 |
| `--card-foreground` | Card 텍스트 | `text-card-foreground` | `<Card>` 내부 텍스트 |

### 7. Popover — 팝오버 / 메뉴

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--popover` | Popover / DropdownMenu 배경 | `bg-popover` | Popover / DropdownMenu |
| `--popover-foreground` | popover 위 텍스트 | `text-popover-foreground` | Popover 내부 텍스트 |

### 8. Destructive — 위험 / 에러

| 토큰 | 의미 | Tailwind 클래스 | cva 사용 |
|---|---|---|---|
| `--destructive` | 위험 색 (삭제 / 에러) | `bg-destructive` | `<Button variant="destructive">` |
| `--destructive-foreground` | destructive 위 텍스트 | `text-destructive-foreground` | destructive 텍스트 |

### 9. Chart — 데이터 시각화 (5색)

| 토큰 | 의미 | Tailwind 클래스 |
|---|---|---|
| `--chart-1` ~ `--chart-5` | Recharts / Echarts 시리즈 색 5개 | `fill-chart-1` 등 |

### 10. Sidebar — 사이드바 (옵션, dashboard 패턴)

| 토큰 | 의미 |
|---|---|
| `--sidebar` / `--sidebar-foreground` | Sidebar 배경 / 텍스트 |
| `--sidebar-primary` / `--sidebar-primary-foreground` | active item |
| `--sidebar-accent` / `--sidebar-accent-foreground` | hover item |
| `--sidebar-border` / `--sidebar-ring` | 외곽 / 포커스 |

### 11. Radius — 모서리 (단일 변수 + 파생)

| 토큰 | 값 | Tailwind 클래스 |
|---|---|---|
| `--radius` | base (예: `0.625rem`) | `rounded-[var(--radius)]` |
| `--radius-sm` | `calc(var(--radius) - 4px)` | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) - 2px)` | `rounded-md` |
| `--radius-lg` | `var(--radius)` | `rounded-lg` |
| `--radius-xl` | `calc(var(--radius) + 4px)` | `rounded-xl` |

---

## 🎨 cva variant ↔ 토큰 매핑 — Button 예시

shadcn `<Button>` 의 6 variant 와 토큰 매핑:

```ts
const buttonVariants = cva("...", {
  variants: {
    variant: {
      default:     "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost:       "hover:bg-accent hover:text-accent-foreground",
      link:        "text-primary underline-offset-4 hover:underline",
    },
  },
});
```

→ 디자이너가 *각 토큰의 값* 을 조정하면 *모든 variant* 가 자동 반영됨. *cva 코드 수정 불필요*.

---

## 🌗 Light / Dark mode

shadcn 은 **dark mode 가 표준**입니다. `<html class="dark">` 토글 시 dark 토큰 자동 적용.

`templates/assets/tokens/tokens.json` 은 *light / dark 두 모드* 의 값을 모두 정의:

```json
{
  "color": {
    "primary": {
      "$value": { "light": "oklch(0.205 0 0)", "dark": "oklch(0.985 0 0)" },
      "$type": "color"
    },
    ...
  }
}
```

`pnpm gd build-tokens` 가 위 JSON → `src/styles/globals.css` 의 `:root {...}` (light) + `.dark {...}` (dark) 로 자동 생성.

---

## 📐 Spacing / Typography — Tailwind 표준 사용

> 본 프로젝트는 spacing / font-size 를 *별도 토큰화하지 않습니다.* **Tailwind 4 의 표준 스케일** 을 그대로 사용 — 어휘 통일 + LLM 친화.

### Spacing (Tailwind 표준)

| Tailwind 클래스 | 값 (rem / px) |
|---|---|
| `p-1` / `m-1` / `gap-1` | `0.25rem` (4px) |
| `p-2` ... | `0.5rem` (8px) |
| `p-3` | `0.75rem` (12px) |
| `p-4` | `1rem` (16px) |
| `p-6` | `1.5rem` (24px) |
| `p-8` | `2rem` (32px) |
| `p-12` | `3rem` (48px) |

→ Tailwind 의 *4px 그리드* 가 표준. 디자이너는 *임의 수치 사용 금지* (`p-[17px]` X).

### Typography (Tailwind 표준)

| Tailwind 클래스 | font-size / line-height |
|---|---|
| `text-xs` | 12px / 16px |
| `text-sm` | 14px / 20px |
| `text-base` | 16px / 24px — 본문 기본 |
| `text-lg` | 18px / 28px |
| `text-xl` | 20px / 28px |
| `text-2xl` | 24px / 32px — section title |
| `text-3xl` | 30px / 36px |
| `text-4xl` | 36px / 40px — page title |

폰트 패밀리만 token 으로:
- `--font-sans` — 본문 (기본: `"Inter", system-ui, sans-serif`)
- `--font-mono` — 코드 (기본: `ui-monospace, "SF Mono", monospace`)

---

## ♿ WCAG 2.1 AA 색 대비 자동 검증

`pnpm gd doctor` 가 다음 페어를 자동 측정:

| 페어 | 최소 대비비 (AA) | 측정 |
|---|---|---|
| `--foreground` on `--background` | 4.5:1 | 본문 |
| `--primary-foreground` on `--primary` | 4.5:1 | 기본 버튼 |
| `--destructive-foreground` on `--destructive` | 4.5:1 | 위험 버튼 |
| `--muted-foreground` on `--background` | 4.5:1 | caption (large text 라면 3:1) |
| `--card-foreground` on `--card` | 4.5:1 | Card 내부 텍스트 |

대비 미달 시 *가장 가까운 합격 OKLCH* 를 제안.

---

## 🛠 빌드 파이프라인

```
tokens.json (DTCG, light + dark)
    ↓ pnpm gd build-tokens
src/styles/globals.css
    ├── :root {...}     /* light 토큰 */
    ├── .dark {...}     /* dark 토큰 */
    └── @theme inline {...}  /* Tailwind 4 매핑 */
```

→ 디자이너는 *tokens.json 만 편집*. CSS / Tailwind 매핑은 자동.

---

## ❌ 안티 패턴

- ❌ 토큰 *이름* 변경 (`--primary` → `--brand`) — gen-design 컴파일러가 shadcn 표준 이름을 기대
- ❌ Tailwind 스케일 외 *임의 수치* (`p-[17px]` / `text-[15px]`)
- ❌ 색을 *임의 hex / rgb* 직접 사용 — 항상 토큰 참조
- ❌ light / dark 모드 *한쪽만* 정의 — 둘 다 필수
- ❌ chart-1 ~ chart-5 의 *시각화 색 의미* 임의 변경 — 시리즈 순서 보존
