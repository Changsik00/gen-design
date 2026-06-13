# spec-13-05: 시나리오 기반 e2e 재설계

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-05` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-05-e2e-scenario-based` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

기존 e2e 테스트(`smoke.spec.ts`, `a11y.spec.ts`)는 "라우트가 뜨는가"만 검증했다. phase-13 정리 시 삭제했고 `studio/e2e/` 디렉토리는 비어있다. CI의 e2e/a11y job도 비활성화 상태다.

### 문제점

1. **의미 없는 검증**: 라우트 로딩 확인은 JS 번들이 깨지지 않았다는 것만 보장
2. **파이프라인 미검증**: chat.md v2 → gd extract → MSW 핸들러 파이프라인의 실제 동작을 검증하지 않음
3. **CI 공백**: e2e job 비활성화 상태 — PR 머지 안전성 저하

### 해결 방안 (요약)

**두 레이어**로 e2e를 재설계한다:

1. **파이프라인 통합 테스트** (vitest): `gd extract` → 유효한 MSW 핸들러 TypeScript 생성 검증
2. **Studio 기능 테스트** (Playwright): 라우트 로딩 + `#/chats` Chat Viewer 상태별 동작 검증

CI에 e2e job을 복원하여 PR 안전성을 확보한다.

## 📊 개념도

```
레이어 1 — 파이프라인 통합 (vitest, packages/gd-cli)
  chat.md v2 (fixture) → gd extract → .msw.ts 생성 확인
  → 이미 spec-13-04에서 구현됨 (extract.test.ts의 runExtract 통합 테스트)

레이어 2 — Studio 기능 (Playwright, studio/e2e/)
  시나리오 A: 전체 라우트 로딩 (smoke)
    → 6개 라우트 접근 → JS 오류 없음 → sidebar nav 렌더

  시나리오 B: Chat Viewer 상태
    → #/chats 접근 → fixtures/chats/scenes/*.chat.md 목록 표시
    → 파일 선택 → 내용 렌더링

  시나리오 C: 라우트 간 네비게이션
    → 한 라우트 → 다른 라우트 → URL 변경 + 컨텐츠 교체
```

## 🎯 요구사항

### Functional Requirements

1. **smoke.spec.ts 재작성**: 6개 라우트 로딩 + JS 오류 없음 (기존 방식, but 더 강건하게)
2. **chats.spec.ts 신규**: `#/chats` Chat Viewer 동작 검증
   - 파일 목록 렌더링
   - 파일 선택 시 컨텐츠 표시
3. **CI 복원**: `.github/workflows/ci.yml`의 e2e job 재활성화
4. **3개 이상 시나리오 PASS**: phase-13 성공 기준 충족

### Non-Functional Requirements

1. 테스트 실행 시간 60초 이내 (CI 기준)
2. flaky test 방지: `waitFor` + `toBeVisible` 우선, 고정 sleep 금지

## 🚫 Out of Scope

- MSW service worker를 Studio 앱에 통합 (Studio는 백엔드 API가 없음)
- Visual regression (스크린샷 비교)
- a11y 자동 검사 (axe) — spec-x로 별도 추진 가능

## 📑 ADR 후보

- [ ] 없음

## ✅ Definition of Done

- [ ] `studio/e2e/smoke.spec.ts` 신규 작성 — 6개 라우트 PASS
- [ ] `studio/e2e/chats.spec.ts` 신규 작성 — Chat Viewer 시나리오 PASS
- [ ] `pnpm --filter studio test:e2e` 로컬 PASS
- [ ] `.github/workflows/ci.yml` e2e job 복원 + PASS
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] PR → `phase-13-vertical-slice` 타겟
