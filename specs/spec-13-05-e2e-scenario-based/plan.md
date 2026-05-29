# Implementation Plan: spec-13-05

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-05-e2e-scenario-based`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **Chat Viewer 파일 로딩**: 로컬 dev에서 `#/chats`는 `fixtures.generated.ts`로 파일 목록을 가져옴. 이 파일은 `pnpm fixtures:gen` 실행 시 생성됨. CI에서도 동일하게 동작하는지 확인 필요.

## 🎯 핵심 전략

### 테스트 파일 구성

```
studio/e2e/
├── smoke.spec.ts   ← 신규 (6개 라우트 로딩 검증)
└── chats.spec.ts   ← 신규 (Chat Viewer 시나리오 검증)
```

### smoke.spec.ts — 6개 라우트

```typescript
const ROUTES = [
  { hash: "#/spec",   label: "Spec Editor" },
  { hash: "#/new",    label: "New Spec" },
  { hash: "#/design", label: "Design MD" },
  { hash: "#/tokens", label: "Tokens" },
  { hash: "#/export", label: "Export" },
  { hash: "#/chats",  label: "Chats" },
]

// 각 라우트:
// 1. page.goto(`/${hash}`)
// 2. aside nav 렌더 확인
// 3. JS 오류 없음
```

### chats.spec.ts — Chat Viewer 시나리오

```typescript
// 시나리오 A: 파일 목록 렌더링
// Given: #/chats 접근
// When: 페이지 로드 완료
// Then: 파일 목록 컨테이너 존재
//       fixtures/chats/scenes/*.chat.md → 항목 표시

// 시나리오 B: 파일 선택 → 컨텐츠 표시
// Given: 파일 목록이 렌더됨
// When: 첫 번째 파일 클릭
// Then: 탭 (narrative/structure/history) 표시
//       content 영역에 텍스트 렌더

// 시나리오 C: 탭 전환
// Given: 파일이 선택됨
// When: "structure" 탭 클릭
// Then: 활성 탭이 변경됨
```

### CI 복원 전략

`.github/workflows/ci.yml`에 e2e job 복원:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 24
    - uses: pnpm/action-setup@v4
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    - name: Install Chromium
      run: pnpm --filter studio exec playwright install --with-deps chromium
    - name: E2E Tests
      run: pnpm --filter studio test:e2e
```

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| MSW 통합 | 미포함 | Studio는 백엔드 API 없음 — 별도 spec-x 가능 |
| a11y 검사 | 미포함 | 별도 spec-x로 추진 |
| fixtures:gen | CI에서 실행 | chat viewer가 fixtures.generated.ts 필요 |

## 📂 Proposed Changes

### [NEW] `studio/e2e/smoke.spec.ts`
6개 라우트 로딩 + JS 오류 없음

### [NEW] `studio/e2e/chats.spec.ts`
Chat Viewer 3개 시나리오

### [MODIFY] `.github/workflows/ci.yml`
e2e job 복원 + fixtures:gen 단계 추가

## 🧪 검증 계획

### 통합 테스트

```bash
pnpm --filter studio test:e2e
```

## 🔁 Rollback Plan

테스트 파일만 추가 — git revert로 즉시 원복 가능.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
