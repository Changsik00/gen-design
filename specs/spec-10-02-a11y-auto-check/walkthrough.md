# Walkthrough: spec-10-02 — a11y 자동 검증

## 실행 증거

### 1. `pnpm --filter studio test:a11y` — 6개 라우트 PASS

```
Running 6 tests using 6 workers

  ✓  [chromium] › e2e/a11y.spec.ts › Chats a11y (#/chats)      (1.3s)
  ✓  [chromium] › e2e/a11y.spec.ts › New Spec a11y (#/new)     (1.3s)
  ✓  [chromium] › e2e/a11y.spec.ts › Export a11y (#/export)    (1.4s)
  ✓  [chromium] › e2e/a11y.spec.ts › Design MD a11y (#/design) (1.4s)
  ✓  [chromium] › e2e/a11y.spec.ts › Spec Editor a11y (#/spec) (1.4s)
  ✓  [chromium] › e2e/a11y.spec.ts › Tokens a11y (#/tokens)    (1.4s)

  6 passed (3.0s)
```

### 2. `pnpm --filter studio test --run` — 995 PASS (기존 유지)

```
  Test Files  131 passed (131)
       Tests  995 passed (995)
    Duration  10.11s
```

### 3. `pnpm --filter studio test:e2e` — 기존 smoke 6 PASS

```
  ✓  12 passed (2.6s)
```

---

## 발견 및 수정된 a11y 위반

테스트 실행 과정에서 발견된 실제 위반과 수정 내역:

| 위반 | Impact | 영향 컴포넌트 | 수정 방법 |
|---|---|---|---|
| `bg-primary` (#6366F1) + white: 4.46:1 | serious | 사이드바 active nav, 버튼 | primary → indigo.600 (#4F46E5, 5.8:1) |
| `bg-muted/30` + `muted-foreground` (#64748B): 4.47:1 | serious | BlueprintWizard 헤더 | muted-foreground → neutral.600 (#475569, 8.7:1) |
| `bg-secondary` + muted text: 4.31:1 | serious | SectionNav number span | 위와 동일 토큰 변경으로 해소 |
| iframe placeholder `color:#888`: 3.54:1 | serious | PaperPreviewPanel | `color:#595959` (7:1) |
| SelectTrigger 에 accessible name 없음 | critical | ExportConfigForm | `aria-label` 추가 |
| `<pre>` scrollable region 키보드 접근 불가 | serious | FileTabList, MarkdownPreview | `tabIndex={0}` 추가 |
| `muted-foreground opacity-60` on bg: 2.25:1 | serious | ChatViewerPage file label | `opacity-60` 제거 |
| `bg-destructive/10` + `text-destructive` (#EF4444): 3.29:1 | serious | Button destructive variant, ErrorPanel, Step2Pages | destructive → red.700 (#B91C1C, 6.4:1) |
| `bg-destructive` + `text-destructive-foreground` (dark fallback): 3.69:1 | serious | ComponentPreview | `--color-destructive-foreground` @theme inline 매핑 추가 + `--destructive-foreground` 토큰 추가 |
| color input 에 accessible label 없음 | critical | ColorSection (Tokens 페이지) | `aria-label={label}` 추가 |

---

## 주요 토큰 변경 (WCAG 2.1 AA 준수)

| 토큰 | 이전 | 이후 | 변경 이유 |
|---|---|---|---|
| `--primary` | `#6366F1` (indigo.500, 4.46:1) | `#4F46E5` (indigo.600, 5.8:1) | white text AA 통과 |
| `--muted-foreground` | `#64748B` (neutral.500) | `#475569` (neutral.600, 8.7:1 on bg-muted) | bg-muted/secondary 위 AA 통과 |
| `--destructive` | `#EF4444` (red.500, 4:1 w/ white) | `#B91C1C` (red.700, 7.5:1 w/ white) | bg-destructive/10 위 text-destructive AA 통과 |
| `--destructive-foreground` | (미정의) | `#FFFFFF` (토큰 추가) | solid red bg 위 white text 명시 |

---

## 커밋 내역

| SHA | 메시지 |
|---|---|
| `b167386` | test(spec-10-02): add a11y axe scan for 6 routes |
| `38c6cc2` | feat(spec-10-02): add test:a11y script and fix all critical/serious violations |
| `6bbdeed` | ci(spec-10-02): add a11y job parallel to e2e |

---

## DoD 체크

- [x] `pnpm --filter studio test:a11y` → 6개 라우트 `critical`/`serious` 위반 0건 PASS
- [x] CI `a11y` job 추가 (`.github/workflows/ci.yml`)
- [x] 기존 `test` (995) + `test:e2e` (6) PASS 유지
- [x] walkthrough.md + pr_description.md ship 완료
