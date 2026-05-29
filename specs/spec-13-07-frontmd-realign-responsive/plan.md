# Implementation Plan: spec-13-07

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-07-frontmd-realign-responsive`
- 시작 지점: `phase-13-vertical-slice` (FF 수정 머지된 최신)
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **반응형 강제 수준**: "필수 규칙 + 안티패턴" (agent 가 위반 시 자가 거부) 강도. lint 자동 검사까지는 이번 scope 아님 (수동 규칙 + 안티패턴 명시).
> - [ ] **실증 방식**: todo-persona 앱을 반응형으로 직접 수정 후 375px E2E. todo-persona 는 git 미추적 검증 프로젝트.

## 🎯 핵심 전략

### 반응형 강제 규칙 (FRONT.md 신규 섹션)

DESIGN.md 의도 → FRONT.md 실행 규칙 번역:

```
DESIGN.md: "모바일 우선 375px", "Tailwind breakpoint"
        ↓ 번역
FRONT.md 신규 §: Responsive Strategy
  - 모든 레이아웃 컨테이너는 모바일 우선 작성
  - grid/flex 다열은 breakpoint 필수:
    ✅ grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    ❌ grid-cols-3 (단독)
  - 페이지 컨테이너: max-w-* mx-auto + px-4 sm:px-6
  - 터치 타겟 최소 44px (h-11 이상 버튼)
  - 375px 가로 스크롤 0
```

### gd react → LLM 생성 전환 매핑

| FRONT.md 위치 | Before | After |
|---|---|---|
| §4 scenes 주석 | `gd react 자동 출력` | `LLM 생성 (chat.md v2 컨텍스트)` |
| §8.2 흐름도 | `chat.md → gd react → X.tsx` | `chat.md v2 → LLM 생성 / gd extract → MSW` |
| §16 i18n | `gd react 컴파일` | LLM 생성 시 i18n 키 규칙 |
| §25 표준화 | `모든 신 → gd react` | `chat.md v2 컨텍스트 → LLM 생성` |

### AGENT.md 정합

| AGENT.md 위치 | Before | After |
|---|---|---|
| §0, §2 | `chat.md → gd react 컴파일로만` | `chat.md v2 작성 → LLM 직접 생성` |
| §2 워크플로 | `pnpm gd react` 단계 | `chat.md v2 → LLM 요청 → gd extract (MSW)` |
| 3층 언급 | Narrative/Structure/History | v2 레이어 (+ Data/API/Scenarios) |
| 신규 | (없음) | 반응형 필수 + 안티패턴 |

## 📂 Proposed Changes

### [MODIFY] `packages/create-gd-react/presets-bundled/default/templates/FRONT.md`
- §2 또는 §10 인근에 **Responsive Strategy 섹션 신규**
- §4/§8.2/§16/§25 gd react 참조 → LLM 생성
- §26 Anti-Patterns 표에 반응형 안티패턴 행 추가

### [MODIFY] `packages/create-gd-react/presets-bundled/default/templates/AGENT.md`
- §0/§2 워크플로 LLM 생성 전환
- 반응형 규칙 (필수/금지) 추가

### [MODIFY] `templates/FRONT.md`, `templates/AGENT.md` (repo root)
- preset과 동일 정합 (배포본 일치). 단 root FRONT.md는 auto-generated 헤더 — hand-written 부분만 동기화 가능 여부 확인 후 처리

### [검증] `todo-persona/src/scenes/*.tsx` (git 미추적)
- 5화면 반응형 수정: `grid-cols-3` → `grid-cols-1 sm:grid-cols-3` 등
- 375px E2E 작성 → PASS 확인

## 🧪 검증 계획

### 통합 테스트 (실증)
```bash
# todo-persona 에서
pnpm exec playwright test  # 375px 뷰포트 5화면 레이아웃 검증
```

수동: dashboard grid 가 375px에서 1열, sm+ 에서 3열 확인.

## 🔁 Rollback Plan

문서 변경 위주 — git revert 즉시. todo-persona 는 미추적이라 영향 없음.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough / pr_description ship
