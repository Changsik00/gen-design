# docs(spec-13-07): FRONT.md/AGENT.md 정합화 + 반응형 강제

## 📋 Summary

### 배경 및 목적

phase-13에서 chat.md v2 + LLM 생성으로 전환하고 `gd react`를 제거(spec-13-06)했으나, preset의 stack SSOT 문서(FRONT.md 1,501줄 / AGENT.md 306줄)는 여전히 폐기된 `gd react` 컴파일을 가르치고 있었다. 또한 FRONT.md에 반응형 규칙이 0건이라 agent가 `grid-cols-3` 고정 레이아웃을 생성해 모바일에서 깨졌다 (페르소나 E2E 실증).

**DESIGN.md(디자이너 의도) → FRONT.md(agent 실행 규칙)** 책임 분리를 확립하고, FRONT.md가 반응형을 강제하도록 정합화한다.

### 주요 변경 사항

- [x] **FRONT.md §10.5 Responsive Strategy 신규** — 모바일 우선, breakpoint 표준, 필수/금지 패턴
- [x] **FRONT.md §26 Anti-Patterns** — 반응형 안티패턴 2행 추가 (grid-cols-N 단독, 고정 px 폭)
- [x] **FRONT.md gd react → LLM 생성 정합** — §4/§8.2/§16/§25
- [x] **AGENT.md 정합** — 워크플로(chat.md v2 → LLM 생성 + gd extract), v2 레이어, 반응형 필수 규칙(14a/b/c)
- [x] **실증** — todo 앱 5화면 반응형 수정 + 375px/1024px E2E 7 PASS

### Phase 컨텍스트

- **Phase**: `phase-13` (마지막 spec, 성공기준 6·7 충족)
- **역할**: "사용자가 원하는 형태의 React가 나옴" = FRONT.md가 어휘+반응형+생성방식을 강제. phase-13 목표의 마지막 조각.

## 🎯 Key Review Points

1. **§10.5 Responsive Strategy**: DESIGN.md "모바일 우선 375px" 의도를 agent 실행 규칙으로 번역. `grid-cols-1 sm:grid-cols-3` 필수, `grid-cols-3` 단독 금지.

2. **gd react → LLM 생성 일관성**: 워크플로/흐름도/명령 안내에서 gd react 제거. "폐기됨(ADR-011)" 설명 문장만 의도적으로 잔존.

3. **실증 (E2E 7 PASS)**: 375px 5라우트 가로 스크롤 0 + dashboard 1열↔3열 전환 검증.

## 🧪 Verification

```
# 반응형 실증 (todo-persona)
pnpm exec playwright test responsive.spec.ts
7 passed (6.5s)

# gd react 잔재
grep "gd react" FRONT.md → 1 (폐기 설명만)
grep "gd react" AGENT.md → 1 (폐기 설명만)
```

## 📦 Files Changed

### 🛠 Modified Files
- `packages/create-gd-react/presets-bundled/default/templates/FRONT.md` (+87): §10.5 반응형 섹션 + 안티패턴 + gd react 정합
- `packages/create-gd-react/presets-bundled/default/templates/AGENT.md` (+30, -20): 워크플로 LLM 전환 + 반응형 규칙
- `backlog/phase-13.md`: 성공기준 6·7 추가 + spec-13-07 등재

**Total**: 3 tracked files (+ todo-persona 반응형 실증 — git 미추적, walkthrough 첨부)

## ✅ Definition of Done

- [x] FRONT.md 반응형 섹션 + gd react 정합
- [x] AGENT.md 정합
- [x] root templates — 정합 대상 아님 확인 (auto-gen)
- [x] todo 앱 375px E2E 7 PASS (실증)
- [x] walkthrough / pr_description ship
- [x] 사용자 검토 요청 알림

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- ADR: `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md`
- Walkthrough: `specs/spec-13-07-frontmd-realign-responsive/walkthrough.md`
