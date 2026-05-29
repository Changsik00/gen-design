# spec-13-07: FRONT.md/AGENT.md 정합화 + 반응형 강제

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-07` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-07-frontmd-realign-responsive` |
| **상태** | Planning |
| **타입** | Refactor |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-13에서 chat.md를 v2(수직 단면)로 재정의하고 `gd react` 컴파일러를 제거(spec-13-06)했다. 그러나 preset의 stack SSOT 문서가 옛 방식을 그대로 가르치고 있다:

- **FRONT.md** (1,501줄, agent 가 코드 작성 시 따르는 SSOT): `gd react` 컴파일을 핵심 흐름으로 명시 (§4 scenes 주석, §8.2 흐름도, §16 i18n 변환, §25 "모든 신 → gd react")
- **AGENT.md** (306줄, 명령형 행동 규칙): "신은 chat.md → TSX 컴파일로만 추가", "`pnpm gd react` 재실행" 등 10곳
- 둘 다 chat.md "3층(Narrative/Structure/History)" = v1 기준 (v2는 5+레이어)

### 문제점

1. **두 개의 모순된 진실**: 시스템이 gd react를 제거했는데 SSOT 문서는 gd react를 가르침 → agent 가 폐기된 워크플로를 따르려 함
2. **반응형 규칙 부재**: FRONT.md 1,501줄에 반응형/breakpoint/모바일 규칙 0건. DESIGN.md에만 "모바일 우선 375px" 의도 한 줄 존재. → agent 가 `grid-cols-3` 고정 레이아웃 생성, 375px에서 깨짐 (페르소나 E2E 실증)
3. **역할 분리 미확립**: DESIGN.md(디자이너 의도) → FRONT.md(agent 실행 규칙) 번역이 안 됨. 디자이너가 "모바일 우선"이라 적어도 코드에 도달 못 함.

### 해결 방안 (요약)

FRONT.md/AGENT.md를 phase-13 방향(chat.md v2 + LLM 직접 생성 + gd extract)으로 정합화하고, **반응형 강제 규칙**을 FRONT.md에 신규 섹션으로 추가한다. todo 앱 5화면을 반응형으로 재생성해 375px 모바일 E2E 통과로 실증한다.

## 🎯 요구사항

### Functional Requirements

1. **FRONT.md gd react 흐름 제거 + LLM 생성 전환**:
   - §4 `scenes/ # gd react 자동 출력` → LLM 생성 안내
   - §8.2 `chat.md → gd react → scenes/X.tsx` 흐름도 → `chat.md v2 → LLM 직접 생성 + gd extract → MSW`
   - §16 i18n `gd react 컴파일` → LLM 생성 시 i18n 키 규칙
   - §25 "모든 신 → chat.md → gd react 컴파일" → "chat.md v2 컨텍스트 → LLM 생성"
2. **FRONT.md 반응형 강제 섹션 신규**:
   - 모바일 우선 원칙 (375px 기준 설계)
   - breakpoint 표준 (Tailwind sm/md/lg/xl)
   - 필수 규칙: 그리드/플렉스 레이아웃은 모바일 우선 + breakpoint 명시
   - 안티패턴: `grid-cols-N` 단독, 고정 `max-w` 없는 풀폭, 데스크탑 전용 레이아웃
3. **AGENT.md 정합화**:
   - "신 = chat.md → gd react 컴파일" → "chat.md v2 작성 → LLM 생성"
   - 3층 → v2 레이어 (Narrative/Structure/Data/API/Scenarios)
   - 반응형 필수 규칙 + 안티패턴 추가
4. **반응형 안티패턴 → §26 Anti-Patterns 표 등재**
5. **실증**: todo 앱 5화면을 반응형으로 재생성 → 375px 모바일 E2E PASS

### Non-Functional Requirements

1. FRONT.md는 AUTO-GENERATED 영역(카탈로그 표)과 hand-written 영역 구분 유지
2. repo root `templates/`와 preset `templates/` 양쪽 정합 (preset이 배포본)

## 🚫 Out of Scope

- `@env-kit/node-settings` 의존성 문제 (사용자 보류 결정)
- repo root의 auto-generated FRONT.md 재생성 (vocab 도구 별건)
- DESIGN.md 수정 (디자이너 surface — 이미 반응형 의도 있음)

## 📑 ADR 후보

- [ ] 없음 (ADR-011이 gd react 폐기를 이미 기록. 본 spec은 그 문서 정합화)

## 🧪 통합 테스트

todo 앱 5화면 375px 모바일 E2E (별도 검증 프로젝트). Definition: 모든 그리드가 모바일에서 단열/적정열로 떨어지고 가로 스크롤 없음.

## ✅ Definition of Done

- [ ] preset FRONT.md — gd react 흐름 제거 + 반응형 섹션 추가
- [ ] preset AGENT.md — LLM 생성 워크플로 + 반응형 규칙
- [ ] repo root templates/ 양쪽 정합
- [ ] todo 앱 5화면 반응형 재생성 + 375px E2E PASS (실증)
- [ ] `walkthrough.md` / `pr_description.md` ship
- [ ] PR → `phase-13-vertical-slice`
