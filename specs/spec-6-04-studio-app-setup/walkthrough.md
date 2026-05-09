# Walkthrough: spec-6-04

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| Router (Q1) | (a) react-router / (b) TanStack / (c) hash 자체 | **(c) hash 자체** | 외부 의존성 0, 단순 5 route, ~58 lines 자체 구현 |
| Playground 보존 (Q2) | (a) 정식 / (b) 숨김 / (c) 삭제 | **(b) 숨김** | 개발 중 컴포넌트 시각 확인 유지, production 비노출 |
| Placeholder 깊이 (Q3) | (a) Coming soon / (b) 기본 layout / (c) page-catalog | **(a) Coming soon** | 후속 spec 자유도 ↑, 14 lines/page 수준 |
| Studio DESIGN.md (Q4) | (a) 요약 / (b) 14 섹션 full / (c) skeleton + prefill | **(c)** | tokens.json/code 추출 영역 prefill, 시각 영역 TODO. ~236 lines |
| Test (Q5) | (a) router 만 / (b) smoke + router / (c) + a11y | **(b)** | 골격 spec, smoke 7 case + router 6 case = 13 |
| Task 3+4 분리 vs 통합 | 분리 / 통합 | **통합** | StudioLayout 의 wrapper onClick 가 자연스럽게 sidebar wire 포함. 분리 시 의미 없는 중간 commit |
| Sidebar nav 클릭 처리 | (a) Sidebar prop 추가 / (b) wrapper event delegation | **(b) wrapper** | Sidebar API breaking 회피. 단순 closest("a") + textContent 매칭 |
| Smoke 의 텍스트 매칭 | getByText / getAllByText | **getAllByText** for "Blueprint"/"Export" | Sidebar nav + Page heading 양쪽 등장 — getByText 단일 매칭 실패 사례 |

## 💬 사용자 협의

- **주제**: 5 결정점 (Q1~Q5)
  - **사용자 의견**: "권장대로"
  - **합의**: hash 자체 / 숨김 playground / Coming soon / skeleton+prefill / smoke + router

## 🧪 검증 결과

### 자동화 테스트

- **명령**: `pnpm exec vitest run`
- **결과**: ✅ **216 tests / 38 files PASS** (3.76 s)
- **신규**:
  - `src/lib/__tests__/router.test.ts` — 6 case (parseHash 정상 / fallback / playground / unknown / paths shape)
  - `src/__tests__/app-smoke.test.tsx` — 7 case (default / 4 route / playground / fallback / nav 4 항목)
- **회귀**: 기존 116 (spec-6-01) + 87 (spec-6-02) + paper-normalizer + 기타 — 모두 PASS

### TypeScript

- ✅ `tsc --noEmit` 0 errors

### 수동 검증 (jsdom 환경)

1. **default route**: `<App />` 렌더 → "Design Studio" Sidebar + BlueprintPage placeholder ("spec-6-05") 노출.
2. **`#/editor` route**: hashchange 후 EditorPage placeholder ("spec-6-06").
3. **`#/__playground`**: StudioLayout 우회 → Playground 의 control panel ("Brand A" / "Brand B" 등) 노출, Sidebar 미노출.
4. **`#/unknown` fallback**: BlueprintPage 로 회복.

## 🔍 발견 사항

- **Sidebar API 보존**: `composites/Sidebar` 자체에 `onItemClick` prop 추가 대신 wrapper `onClick` (capture) 로 nav 라우팅 처리 — Sidebar 의 외부 사용자 (페이지 templates 들) 에 영향 0. 향후 Sidebar 가 본격 nav 컴포넌트로 진화하면 prop 추가 검토.
- **playground 격리의 부수 효과**: 기존 `pnpm dev` 사용자가 default `#/blueprint` 진입 시 LoginPage / DashboardPage 가 안 보임. README 또는 walkthrough 노트 권장 — *"기존 데모는 `#/__playground` 에서 확인"*.
- **`getByText` 의 다중 매칭 문제**: Sidebar nav 라벨 ("Blueprint" / "Editor" / "Tokens" / "Export") 가 Page heading 과 동일. 향후 Sidebar 의 nav label 을 더 구체화하거나 (예: "Blueprint Wizard"), Page heading 에 부제 추가 검토.
- **DESIGN.md 의 dogfooding 시작점**: `studio/src/components/layout/StudioLayout.tsx` 가 자체 `Sidebar` 컴포넌트 사용 = phase-6.md success criteria #4 ("Studio UI 가 자체 컴포넌트 라이브러리로 90%+") 의 첫 사례. 후속 spec (spec-6-05~08) 가 점진 누적.
- **Studio DESIGN.md 의 prefill 영역 7/14**: §2/3/4/5/7/10/13 자동 채움 + §11 placeholder 표. TODO 7 (§1/6/8/9/12/14) 은 후속 spec 또는 별도 작업.

## 🚧 이월 항목

- **Sidebar 의 onNavigate prop 합류**: 본 spec 의 wrapper event delegation 은 일시적. 향후 Sidebar 가 Studio chrome 의 표준 컴포넌트가 되면 prop 으로 정리.
- **Studio i18n**: 현재 chrome 텍스트 영문 default. 별도 spec.
- **§1 Visual Theme / §6 Shadow / §8 Motion / §9 Agent Prompt / §12 Composite / §14 i18n**: Paper extraction + 후속 spec 누적.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성일** | 2026-05-09 |
| **최종 commit (ship 직전)** | `b625911` |
