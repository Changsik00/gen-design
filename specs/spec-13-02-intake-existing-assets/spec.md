# spec-13-02: intake 경로 확장 — 기존 자산 흡수

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-02` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-02-intake-existing-assets` |
| **상태** | Planning |
| **타입** | Refactor |
| **Integration Test Required** | no |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gd-start` 스킬은 사용자가 **빈 슬레이트**로 시작한다고 가정한다. 디자이너 정보 2개, 프로젝트 정보 2개를 묻고 → `/gd-chat` 으로 안내하는 단순 온보딩 흐름이다.

### 문제점

실제 사용자는 다양한 형태로 진입한다:
- 이미 만들어둔 DESIGN.md (자체 형식, Stitch 형식, 또는 우리 형식)
- CSS 변수 또는 자체 형식의 TOKEN.md / tokens.json
- PRD, 요구사항 문서, 기획서 같은 기획 문서
- Figma/Paper에서 추출한 디자인 데이터

지금은 이 자산들을 가져와도 처리 경로가 없어, 사용자가 처음부터 다시 채워야 하는 마찰이 생긴다.

### 해결 방안 (요약)

`gd-start` 스킬에 **자산 감지 → 타입별 정규화 안내** 흐름을 추가한다. 어떤 자산을 가져오든 결과는 동일하다: 우리 포맷의 DESIGN.md + TOKEN.md + chat.md v2 작성 준비 완료.

## 📊 개념도

```
사용자 진입
    │
    ├── 빈 슬레이트     ──► 기존 온보딩 흐름 (§3~§4)
    │
    ├── 기획 문서 있음   ──► 화면 목록 추출 + 비즈니스 로직 힌트 → chat.md 초안
    │
    ├── DESIGN.md 있음  ──► 형식 감지 → 누락 섹션 채우기 → 우리 포맷으로 수렴
    │
    ├── TOKEN.md 있음   ──► shadcn 24 토큰 매핑 → 커스텀 토큰 처리
    │
    └── 복합 (2개 이상) ──► 순서대로 처리, 중복 질문 최소화
```

## 🎯 요구사항

### Functional Requirements

1. **자산 타입 감지**: 사용자가 무엇을 가지고 있는지 첫 질문으로 파악 (AskUserQuestion 또는 텍스트). 4가지 타입: `빈 슬레이트` / `기획 문서` / `DESIGN.md` / `TOKEN.md` (복수 선택 가능)

2. **기획 문서 intake**: 제공된 기획 문서에서 다음을 추출하도록 안내:
   - 화면 목록 (→ chat.md 작성 대상)
   - 핵심 비즈니스 데이터 (→ chat.md v2 Data 레이어 힌트)
   - 사용자/권한 구조 (→ DESIGN.md Overview)

3. **DESIGN.md intake**: 기존 DESIGN.md를 읽고:
   - 형식 확인 ("우리 포맷? 다른 포맷?")
   - 우리 9섹션 + 확장 2섹션 기준 누락 섹션 파악
   - 누락 섹션은 질문으로 채우기 (gd-design 흐름 재활용)
   - 결과: 우리 포맷 DESIGN.md

4. **TOKEN.md intake**: 기존 토큰 파일을 읽고:
   - shadcn 24개 표준 토큰 이름 매핑 확인
   - 커스텀 토큰 → 가장 가까운 shadcn 토큰으로 안내
   - 결과: 우리 포맷 TOKEN.md + tokens.json

5. **완료 후 안내**: 정규화 완료 시 → "이제 chat.md v2를 만들어볼까요? `/gd-chat`"

### Non-Functional Requirements

1. 질문 수 최소화 — 이미 파악된 정보는 다시 묻지 않음
2. AskUserQuestion 우선 사용 (uxMode: interactive일 때)
3. 처리 완료된 자산은 `.gd/memory/project.md`에 기록

## 🚫 Out of Scope

- Figma API / Paper MCP를 직접 호출하는 자동 import
- 기획 문서 자동 파싱 (LLM이 대화로 추출)
- gd-token / gd-design 스킬 자체 수정 (intake에서 해당 흐름을 재활용만 함)
- chat.md v2 실제 작성 (spec-13-03)

## 📑 ADR 후보

- [ ] 없음 (기존 ADR-011 + 스킬 설계 원칙으로 충분)

## ✅ Definition of Done

- [ ] `packages/gd-skills/skills/gd-start.md` 업데이트 — 자산 감지 + 4가지 intake 경로 포함
- [ ] `packages/gd-skills/skills/gd-start.md` 동기화 — `packages/gd-skills/src/cli.ts`가 빌드하는 skills/ 파일과 일치
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-13-02-intake-existing-assets` 브랜치 push 완료
- [ ] PR → `phase-13-vertical-slice` 타겟
- [ ] 사용자 검토 요청 알림 완료
