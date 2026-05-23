# Implementation Plan: spec-12-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-12-04-similar-scenes-and-token-reuse`
- 시작 지점: `phase-12-conversation-depth-and-orchestration` (phase base branch)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [x] 문서 전용 spec — 테스트 없음 (spec-12-02 와 동일 패턴)
> - [x] `gd-chat.md` 는 단일 파일; 기존 §5.5 구조 유지하면서 §5.6/§5.7 삽입

> [!WARNING]
> - [x] 기존 §5.5 checklist 항목 3 문구 변경 — "§5.6 참조" 추가 (backward compatible)

## 🎯 핵심 전략

### 아키텍처 컨텍스트

변경 대상: `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` (단일 파일)

```
현재 402줄 구조:
  §1  자동 로딩 컨텍스트
  §2  어떤 화면? 질문
  §3  파일 위치 자동 결정
  §4  frontmatter 자동 삽입
  §5  카탈로그 후보 추천
  §5.5  대화 깊이 checklist  ← 항목 3 강화
  §5.6  [NEW] 비슷한 화면 발견 가이드
  §5.7  [NEW] 토큰 재사용 vs 확장 결정
  §6  Narrative walkthrough
  ...
  §10 decisions.md 패턴  ← entry 템플릿 2개 추가
  §11 안티 패턴          ← 항목 2개 추가
  §12 종료 조건          ← 5.6/5.7 항목 추가
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **유사도 판정** | 에이전트가 직접 읽고 비교 (CLI 아님) | 에이전트가 파일을 읽는 것이 더 정확; CLI 유사도 알고리즘은 scope 과다 |
| **4-옵션 vs 2-옵션** | A/B/C/D 4-옵션 (§5.6) | 버튼 의도 §7.6 와 동일 패턴 — 디자이너가 익숙한 선택지 형식 |
| **gd tokens find 연동** | §5.7 에서 명시적으로 안내 | spec-12-03 도구를 gd-chat flow 에 통합 |

### 📑 ADR 후보

- [x] 없음

## 📂 Proposed Changes

### gd-chat 스킬

#### [MODIFY] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md`

변경 위치와 내용:

**1) §5.5 checklist 항목 3 업데이트** (1줄 → 2줄):
```text
3. **비슷한 화면 발견** — §5.6 가이드 실행.
```

**2) §5.6 신규 삽입** (§5.5 와 §6 사이, 약 40줄):
```text
## §5.6 비슷한 화면 발견 + 재사용 결정 (spec-12-04)

탐지 → 비교 → 4-옵션 결정 → decisions.md 기록
```

**3) §5.7 신규 삽입** (§5.6 직후, 약 30줄):
```text
## §5.7 토큰 재사용 vs 확장 결정 (spec-12-04)

gd tokens find → 3-옵션 결정 → decisions.md 기록
```

**4) §10 decisions.md 패턴 보강** (entry 템플릿 2개 추가, 약 15줄)

**5) §11 안티 패턴 2개 추가** (약 4줄)

**6) §12 종료 조건 항목 추가** (약 2줄)

## 🧪 검증 계획

### 단위 테스트

해당 없음 (문서 전용 spec).

### 수동 검증 시나리오 (v5 환경)

1. `experiments/dogfood-alpha-v5/` 에서 새 씬(예: `settings.chat.md`) 작성 시작
   → 기대: §5.6 가 기존 `login.chat.md` / `signup.chat.md` 와 유사 감지, 4-옵션 제시
2. 토큰 확인 단계에서 "brand color 필요"
   → 기대: `gd tokens find brand` → 없음 → §5.7 가이드 진입 → 결정 → decisions.md 기록
3. decisions.md 확인
   → 기대: "재사용 vs 확장" 유형 entry ≥1 추가 확인

## 🔁 Rollback Plan

- `gd-chat.md` git revert — 기존 §5.5 이전 버전으로 즉시 복원 가능
- decisions.md entry 는 append-only — rollback 시 마지막 entry 수동 삭제

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
