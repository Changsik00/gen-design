# spec-10-02: a11y 자동 검증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-10-02` |
| **Phase** | `phase-10` |
| **Branch** | `spec-10-02-a11y-auto-check` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-10-01 에서 Playwright E2E 스모크 테스트가 갖춰졌다. 스튜디오 6개 라우트가 렌더링됨은 확인됐으나 **접근성(a11y) 기준 충족 여부는 검증되지 않았다.**

### 문제점

- 스튜디오 컴포넌트가 WCAG 2.1 AA 기준을 충족하는지 자동 측정 수단 없음
- a11y 위반이 누적되어도 CI 가 감지하지 못함
- 수동 검수는 라우트 추가 시마다 비용 발생

### 해결 방안

`@axe-core/playwright` 를 spec-10-01 의 Playwright 위에 추가. 6개 라우트를 axe 스캔 → `critical` / `serious` 위반 0건 CI 게이트. `moderate` / `minor` 는 경고로만 출력.

## 🎯 요구사항

### Functional Requirements

1. `studio/e2e/a11y.spec.ts` — 6개 라우트 각각 axe 스캔.
2. `critical` / `serious` impact 위반 → 테스트 실패 (게이트).
3. 위반 발견 시 rule ID + element selector + 설명 출력.
4. `studio/package.json` 에 `"test:a11y": "playwright test e2e/a11y.spec.ts"` script 추가.
5. `.github/workflows/ci.yml` 에 `a11y` job 추가 (e2e job 과 병렬).

### Non-Functional Requirements

1. 기존 smoke test (`test:e2e`) / vitest (`test`) 영향 없음.
2. a11y 전체 실행 90초 이내.

## 🚫 Out of Scope

- `moderate` / `minor` 위반 자동 수정 (이슈 목록 출력만)
- 모바일 뷰포트 a11y
- keyboard navigation 자동화

## 📑 ADR 후보

- [x] 없음

## ✅ Definition of Done

- [ ] `pnpm --filter studio test:a11y` → 6개 라우트 `critical`/`serious` 위반 0건 PASS
- [ ] CI `a11y` job PASS
- [ ] 기존 `test` (995) + `test:e2e` (6) PASS 유지
- [ ] `walkthrough.md` + `pr_description.md` ship 완료
