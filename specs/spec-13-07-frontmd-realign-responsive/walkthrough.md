# Walkthrough: spec-13-07

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 반응형 강제 수준 | 규칙+안티패턴 / lint 자동검사 | **규칙+안티패턴 (agent 자가 거부)** | lint 자동 검사는 별도 도구 작업. 본 spec은 FRONT.md/AGENT.md 규칙 명문화 + 실증에 집중 |
| repo root templates 정합 | 동기화 / 대상 아님 | **대상 아님 (Pass)** | root `templates/FRONT.md`는 AUTO-GENERATED 카탈로그(cva AST)로 preset의 hand-written stack 가이드와 다른 파일. gd react 참조 0. root AGENT.md 미존재 |
| 실증 방식 | 새 검증 프로젝트 / todo-persona 재사용 | **todo-persona 반응형 수정 + E2E** | 이미 만든 5화면 활용. git 미추적이라 증거는 walkthrough 첨부 |
| 반응형 1열/3열 검증 | x좌표 / y좌표 | **y좌표** | x좌표는 라벨 패딩 차이로 부정확("완료" 텍스트 중복). y좌표가 세로 쌓임을 정확히 판정 |

## 💬 사용자 협의

- **주제**: "agent가 React 뽑는 건 당연. 내가 원하는 형태로 나와야 하는데 shadcn부터 안 되면?"
  - **합의**: DESIGN.md(디자이너 의도) → FRONT.md(agent 실행 규칙) 책임 분리. FRONT.md가 "모든걸 보완"해야 함.
- **주제**: "반응형이어야 해"
  - **합의**: FRONT.md에 반응형 강제 규칙 신설 + 안티패턴. todo 앱 375px 실증.
- **주제**: "이번 Phase에서 해결. 계속 넘기지 마라"
  - **합의**: spec-x/다음 phase로 미루지 않고 phase-13에 spec-13-07 추가하여 해결.

## 🧪 검증 결과

### 1. gd react 잔재 제거

```
grep "gd react" preset/templates/FRONT.md
→ 1건 (= "gd react 컴파일러는 폐기" 설명 문장, 의도적)
preset/templates/AGENT.md → 1건 (= 동일 폐기 설명)
```
워크플로 흐름도/명령 안내의 gd react 참조 모두 LLM 생성 + gd extract로 교체.

### 2. 반응형 E2E (실증, todo-persona)

```
pnpm exec playwright test responsive.spec.ts
7 passed (6.5s)
```

- `/login` `/signup` `/todos` `/dashboard` `/mypage` — 375px 가로 스크롤 0 (5 PASS)
- `/dashboard` 통계 카드 — 375px 세로 1열 (y좌표 상이) PASS
- `/dashboard` 통계 카드 — 1024px 가로 3열 (y좌표 동일) PASS

### 3. Before / After (dashboard 통계 카드, 375px)

- **Before**: `grid grid-cols-3` → 모바일에서 3열 고정, "남은 것" 카드 텍스트 2줄 줄바꿈/찌그러짐
- **After**: `grid grid-cols-1 sm:grid-cols-3` → 모바일 세로 1열(풀폭), sm+ 3열. 스크린샷 확인 완료.

## 🔍 발견 사항

- repo root `templates/FRONT.md`와 preset `templates/FRONT.md`는 **다른 파일**(전자=auto-gen 카탈로그, 후자=stack 가이드). 혼동 주의.
- todo-persona가 git 미추적이라 반응형 수정 코드는 레포에 안 남음. 실증 증거(E2E 로그)는 본 walkthrough에 기록.

## 🚧 이월 항목

- 반응형 lint 자동 검사 (`gd doctor`에 안티패턴 정적 감지) → 후속
- `@env-kit/node-settings` 의존성 (사용자 보류)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
