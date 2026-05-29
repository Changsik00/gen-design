# Implementation Plan: spec-13-02

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-02-intake-existing-assets`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **자산 감지 방식**: 첫 질문에서 AskUserQuestion으로 다중 선택 제공 (빈 슬레이트 / 기획 문서 / DESIGN.md / TOKEN.md). 이미 파일이 존재하면 자동 감지 후 확인으로 단축 가능 — 어느 방식이 맞나요?
> - [ ] **기획 문서 형식**: PRD/요구사항 문서가 있을 때 LLM이 직접 읽고 추출 vs 사용자에게 질문으로 핵심 내용 파악 중 어느 쪽을 우선하나요?

## 🎯 핵심 전략

### 자산 감지 흐름

```
gd-start 호출
    │
    ├── .gd/memory/designer.md 채워진 경우 → §5 상태 요약으로 직행
    │
    └── 처음 호출
          │
          ▼
    [질문 1] 어떤 자산을 가지고 계신가요?
      (A) 없음 — 처음 시작
      (B) 기획/요구사항 문서
      (C) DESIGN.md (또는 유사 디자인 가이드)
      (D) TOKEN.md / CSS 변수 / 색상 팔레트
      (복수 선택 가능)
          │
          ▼
    선택에 따라 intake 경로 분기
```

### 각 intake 경로

**빈 슬레이트 (A)**: 기존 §3~§4 온보딩 흐름 그대로

**기획 문서 (B)**:
```
"기획 문서를 공유해주시거나, 핵심 내용을 알려주세요."
  → LLM이 읽고 추출:
      - 화면 목록: [로그인, 대시보드, 설정, ...]
      - 핵심 데이터: [주문, 사용자, 통계 ...]
      - 타깃 사용자: ...
  → 확인 후 .gd/memory/project.md에 기록
  → "이 화면들로 chat.md를 만들어볼게요" → /gd-chat 안내
```

**DESIGN.md (C)**:
```
"DESIGN.md를 보여주세요 (경로 또는 내용)"
  → 형식 확인: 우리 포맷? / Stitch? / 자체 형식?
  → 우리 포맷이면: 누락 섹션만 채우기 (gd-design §2 스캔 재활용)
  → 다른 형식이면: 섹션별 매핑 안내 (브랜드/색상/컴포넌트 → 우리 섹션)
  → 결과: templates/DESIGN.md 업데이트
```

**TOKEN.md / CSS vars (D)**:
```
"TOKEN.md나 CSS 변수를 보여주세요"
  → shadcn 24개 토큰 이름과 비교
  → 일치: 값만 확인하고 tokens.json 업데이트
  → 불일치 (커스텀 이름):
      "primary 대신 brand-blue를 쓰고 계신가요?
       shadcn 표준에서는 primary가 버튼 배경색입니다.
       brand-blue 값을 primary에 매핑할까요?"
  → 결과: templates/TOKEN.md + templates/assets/tokens/tokens.json 업데이트
```

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 자산 감지 방식 | 질문으로 선택 | 파일 자동 스캔보다 사용자 의도 명확 |
| 기획 문서 처리 | LLM이 직접 읽고 추출 (확인 필요) | 대화형이 가장 유연 |
| DESIGN.md 형식 감지 | 사용자에게 확인 | LLM 오판 방지 |
| TOKEN 매핑 | 1:1 shadcn 매핑 제안 | gd-token과 일관성 |

## 📂 Proposed Changes

### [MODIFY] `packages/gd-skills/skills/gd-start.md`

변경 범위:
- §1 자동 로딩 컨텍스트: 기존 자산 파일 목록 추가
- §2 환영 메시지: intake 가능 언급 추가
- §3 자산 감지 (신규): AskUserQuestion으로 4가지 타입 선택
- §4 intake 경로 (신규): 타입별 처리 흐름 4개
- §5~§10: 기존 번호 재조정 + 완료 안내에 intake 완료 케이스 추가

## 🧪 검증 계획

### 수동 검증 시나리오
1. 빈 슬레이트 선택 → 기존 온보딩 흐름 진입 확인
2. TOKEN.md 있음 선택 → shadcn 매핑 안내 흐름 확인
3. DESIGN.md 있음 선택 → 누락 섹션 스캔 흐름 확인
4. 기획 문서 있음 선택 → 화면 목록 추출 흐름 확인

## 🔁 Rollback Plan

- 스킬 파일 변경만이므로 git revert로 즉시 원복 가능

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
