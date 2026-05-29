# Implementation Plan: spec-13-03

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-03-gd-chat-v2`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **Scenarios 레이어 강제 여부**: loaded/loading/error 3개를 항상 요구할지, 정적 화면(데이터 없음)은 skip 가능하게 할지. 현재 계획은 "서버 데이터 있으면 강제, 없으면 optional".
> - [ ] **v1 → v2 업그레이드 제안**: 기존 v1 chat.md를 수정할 때 v2 업그레이드를 제안할지, 아니면 v1 유지를 허용할지.

## 🎯 핵심 전략

### gd-chat v2 핵심 변경점

| 섹션 | 기존 (v1) | 변경 (v2) |
|---|---|---|
| 레이어 | Narrative / Structure / History | + Data / API / Scenarios / DB Hints |
| 컴파일 안내 | `pnpm gd react ...` | "LLM에게 직접 요청" |
| Scenarios | 없음 | 최소 3개 강제 (서버 데이터 있을 때) |
| frontmatter | `version` 없음 | `version: 2` 추가 |
| DB Hints | 없음 | 선택적 안내 |

### 새 레이어 작성 안내 흐름

```
Structure 작성 후:

1. "{{data.X}} 바인딩이 있는데, 이 데이터는 어디서 오나요?"
   → Data 레이어 채우기

2. "Data의 source가 API라면, 엔드포인트 정보를 입력해주세요"
   → API 레이어 채우기

3. "MSW 시나리오 3개를 정의해볼게요:
    - loaded: 정상 데이터
    - loading: API 응답 대기
    - error: 오류 상태"
   → Scenarios 레이어 채우기

4. (선택) "DB 스키마 초안이 필요하면 DB Hints도 작성해드릴게요"
   → DB Hints 레이어
```

### LLM 생성 안내 (컴파일러 대체)

```
chat.md v2 작성 완료 후:

  이제 이 화면의 React 코드를 만들어봅시다.

  Claude에게 다음처럼 요청하세요:
  "chats/scenes/dashboard.chat.md를 기반으로 TSX를 만들어주세요.
   DESIGN.md와 TOKEN.md의 토큰/variant 규칙을 따라주세요."

  또는: "gd extract chats/scenes/dashboard.chat.md"
  → MSW 핸들러 스텁 자동 생성
```

## 📂 Proposed Changes

### [MODIFY] `packages/gd-skills/skills/gd-chat.md`

주요 변경:
- frontmatter 예시에 `version: 2` 추가 (§4)
- §5.5 checklist에 Data/API/Scenarios 확인 단계 추가
- **§5.8 Data 레이어 작성 (신규)**: `{{data.X}}` 발견 시 Data 레이어 유도
- **§5.9 API 레이어 작성 (신규)**: Data source → API 레이어 연결
- **§5.10 Scenarios 레이어 작성 (신규)**: 최소 3개 시나리오 (loaded/loading/error)
- **§5.11 DB Hints (신규, 선택)**: 서버 데이터 있을 때 선택 안내
- §9 컴파일 명령 안내 교체: `pnpm gd react` → "LLM 직접 요청 + gd extract"
- §11 안티 패턴에 "Data 없이 Scenarios 건너뛰기" 추가
- §12 종료 조건에 Scenarios 체크 추가

## 🧪 검증 계획

### 수동 검증 시나리오
1. 데이터 바인딩 있는 화면 → Data / API / Scenarios 3단계 안내 확인
2. 정적 화면 (데이터 없음) → Scenarios 생략 가능 확인
3. 컴파일 안내 → `pnpm gd react` 없고 "LLM 직접 요청" 확인
4. v1 chat.md 수정 시 → v2 업그레이드 제안 확인

## 🔁 Rollback Plan

스킬 파일 변경만 — git revert 즉시 원복 가능.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
