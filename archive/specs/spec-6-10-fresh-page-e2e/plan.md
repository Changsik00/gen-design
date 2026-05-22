# Implementation Plan: spec-6-10

## 📋 Branch Strategy

- 신규 브랜치: `spec-6-10-fresh-page-e2e`
- 시작 지점: `phase-6-studio-v1` (phase base)

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **Verification spec** — 코드 산출물보다 *분석/측정 결과* 가 핵심 deliverable
> - [ ] Paper MCP 도구 활성 필수. 비활성 시 spec 진행 불가 (이전 spec-6-09 와 달리 스킵 옵션 없음)
> - [ ] React dev 서버 띄울 수 있어야 함 (`pnpm --filter studio dev`)
> - [ ] 시각 비교는 사람 눈 + 스크린샷. pixel-diff 는 phase-7 spec-x 후보

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
Paper                                 React (studio)
─────────────────────────             ─────────────────────────
[Phase-6 E2E — Composites]            studio/src/components/
  └ 20 composite preview               composites/* (20)

[Phase-6 E2E — Templates]             studio/src/components/
  └ 6 template preview                  templates/* (6)

write_html(html, css)                 dev server screenshot
  ↑                                   ↑
  paper-sync.resolveSemanticColors    var(--xxx)
  paper-sync.tokensToPaperPayloads
  ↑                                   ↑
  templates/assets/tokens/tokens.json (Single source of truth)
```

### Paper 렌더링 전략

각 컴포넌트의 React JSX 를 동등한 HTML+CSS 로 변환. 토큰은 두 방식 중 하나 선택:
- **방식 A** (채택): paper-sync resolver 로 light scheme CSS vars 추출 → HTML 에 `<style>:root { --primary: ...; }</style>` 인라인 → 컴포넌트는 `var(--primary)` 사용. C2 해소 + 한 번 작성된 컴포넌트 HTML 이 토큰 변경에 자동 반응.
- 방식 B: 매번 hand-resolve 색상값 직접 삽입 (paper-sync 미사용 — C2 미해결)

### 컴포넌트 우선순위 (대표 variant 기준)

**Composites (20)** - 의존성 낮은 것부터:
1. ErrorIcon, HomeButton, BrandHeader (기본)
2. ErrorMessage, AvatarUpload, StatCard, SocialAuthBlock
3. SettingsHeader, SettingsGroup, SettingsToggleRow, SettingsSelectRow, SettingsSliderRow
4. DashboardHeader, ProfileHeader, ProfileInfoCard
5. ActivitySummary, ActivityTable
6. LoginForm, SignupForm
7. Sidebar (가장 복잡)

**Templates (6)**: LoginPage, SignupPage, DashboardPage, MyPage, SettingsPage, ErrorPage

### React 캡처 전략

- studio 의 기존 Playground / VariantWrapper 라우트 활용
- 가능하면 단일 페이지에 26 컴포넌트 모두 배치 (스크린샷 효율)

### findings.md 구조

각 컴포넌트 1 행 + 끝에 요약 통계.
- Paper: artboard / 노드 ID
- React: route 또는 playground wrapper
- 시각 비교: ✓ match / ⚠️ minor drift / ❌ mismatch
- drift 항목: radius / spacing / typography / color / 기타
- 조치: 본 spec 수정 / backlog 이월 / 무조치

## 📂 Proposed Changes

### [NEW] `specs/spec-6-10-fresh-page-e2e/findings.md`
검증 결과 보고서 (핵심 deliverable)

### [NEW] `studio/scripts/paper-e2e/render-helpers.mjs`
paper-sync resolver 를 import 하여 light scheme CSS vars 추출 + 26 컴포넌트의 HTML 템플릿 정의. write_html 호출에 사용할 페이로드 생성기.

### [NEW] Paper artboards
- "Phase-6 E2E — Composites" (Paper 파일 내)
- "Phase-6 E2E — Templates" (Paper 파일 내)

### [POSSIBLE EDIT] `templates/assets/tokens/tokens.json`
findings 에서 token-level drift 발견 시

### [POSSIBLE EDIT] `studio/src/components/composites/*` 또는 `templates/*`
findings 가 component-level 단순 fix 를 도출하면

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] Paper 아트보드 2 개 생성 + 26 컴포넌트 렌더
- [ ] React 캡처 완료
- [ ] findings.md 작성
- [ ] paper-sync 라이브러리가 production 코드에서 import 됨 (C2 해소)
- [ ] (필요 시) 수정 commit
- [ ] walkthrough / pr_description 작성 + ship
