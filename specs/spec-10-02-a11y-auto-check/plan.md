# Implementation Plan: spec-10-02

## 📋 Branch Strategy

- 신규 브랜치: `spec-10-02-a11y-auto-check` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: `phase-10-verification-automation`
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [x] `@axe-core/playwright` devDependency 로 설치 (runtime 불필요)
> - [x] `playwright.config.ts` 공유 — a11y 테스트도 동일 webServer 설정 사용

> [!WARNING]
> - [x] axe 스캔은 실제 렌더링 후 실행되므로 JS 오류가 있으면 false positive 발생 가능 — smoke test PASS 이후에만 의미 있음

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```
spec-10-01 (Playwright 기반)
  └── playwright.config.ts (webServer: pnpm dev, port 5173)
      └── e2e/smoke.spec.ts  ← 기존 (6 routes 렌더링 확인)
      └── e2e/a11y.spec.ts   ← 신규 (axe 스캔 + 위반 게이트)
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **axe 통합** | `@axe-core/playwright` (AxeBuilder) | Playwright 네이티브 통합, `checkA11y` 없이 raw violations 접근 가능 |
| **게이트 기준** | `critical` / `serious` 만 실패 | WCAG 2.1 AA 핵심 위반만 CI 차단; `moderate`/`minor`는 경고 출력 |
| **config 공유** | 기존 `playwright.config.ts` 그대로 사용 | 별도 a11y config 불필요, `test:a11y` script 로 파일 지정 |
| **CI job** | `e2e` 와 병렬 `a11y` job | 독립 실행 가능, 실패 격리 |

### 📑 ADR 후보

- [ ] 없음

## 📂 Proposed Changes

### [devDependency 추가]

#### [MODIFY] `studio/package.json`
- `@axe-core/playwright` devDependency 추가
- `"test:a11y": "playwright test e2e/a11y.spec.ts"` script 추가

### [a11y 테스트]

#### [NEW] `studio/e2e/a11y.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  { hash: "#/spec",   label: "Spec Editor" },
  { hash: "#/new",    label: "New Spec" },
  { hash: "#/design", label: "Design MD" },
  { hash: "#/tokens", label: "Tokens" },
  { hash: "#/export", label: "Export" },
  { hash: "#/chats",  label: "Chats" },
];

for (const { hash, label } of ROUTES) {
  test(`${label} a11y (${hash})`, async ({ page }) => {
    await page.goto(`/${hash}`);
    await page.locator("aside nav").first().waitFor({ state: "visible" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    // moderate/minor: 경고만 출력
    const warnings = results.violations.filter(
      (v) => v.impact === "moderate" || v.impact === "minor"
    );
    if (warnings.length > 0) {
      console.warn(`[a11y warn] ${label}: ${warnings.map((v) => v.id).join(", ")}`);
    }

    // critical/serious: 실패 게이트
    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    if (blocking.length > 0) {
      const detail = blocking
        .map((v) => `  [${v.impact}] ${v.id}: ${v.description}\n` +
          v.nodes.slice(0, 3).map((n) => `    selector: ${n.target}`).join("\n"))
        .join("\n");
      expect.fail(`a11y violations on ${hash}:\n${detail}`);
    }

    expect(blocking).toHaveLength(0);
  });
}
```

### [CI job 추가]

#### [MODIFY] `.github/workflows/ci.yml`
`e2e` job 과 병렬로 `a11y` job 추가:

```yaml
a11y:
  name: A11y Check
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 24 }
    - uses: pnpm/action-setup@v4
    - name: Install dependencies
      run: pnpm --filter studio install --frozen-lockfile
    - name: Install Chromium
      run: pnpm --filter studio exec playwright install --with-deps chromium
    - name: A11y check
      run: pnpm --filter studio test:a11y
```

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
pnpm --filter studio test --run
# 기존 995 tests PASS 유지
```

### 통합 테스트 (Integration Test Required = yes)
```bash
pnpm --filter studio test:a11y
# 6개 라우트 critical/serious 위반 0건 → PASS
```

### 수동 검증 시나리오
1. `pnpm --filter studio test:a11y` 실행 → 6개 테스트 PASS, moderate/minor 경고는 console.warn 으로 출력
2. `pnpm --filter studio test:e2e` 실행 → 기존 6개 smoke 테스트 PASS 유지
3. `pnpm --filter studio test --run` → 기존 995 unit tests PASS 유지

## 🔁 Rollback Plan

- `@axe-core/playwright` 제거: `pnpm --filter studio remove @axe-core/playwright`
- `e2e/a11y.spec.ts` 삭제
- `package.json` 에서 `test:a11y` script 제거
- CI 에서 `a11y` job 제거
- 기존 smoke/unit test 는 영향 없음

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
