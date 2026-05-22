# Implementation Plan: spec-3-02

## 📋 Branch Strategy

- 신규 브랜치: `spec-3-02-blueprint-questionnaire`
- 시작 지점: `phase-3-app-blueprint` (Phase base branch)
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 질의서 위치: `schema/blueprint-protocol.md` — page-catalog.md와 동일 디렉토리
> - [ ] 본 Spec은 문서 전용(docs) — 코드 변경/테스트 없음

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **질의서 형식** | Markdown 프로토콜 문서 | AI 시스템 프롬프트로 직접 사용 가능 |
| **질의 단계** | 3단계 (유형→페이지→커스터마이징) | 과도한 질문 방지, 필수만 코어 |
| **출력 형식** | REQUIREMENTS.md 매핑 규칙 | spec-3-003에서 템플릿으로 확정 |
| **카탈로그 참조** | page-catalog.md ID 체계 직접 사용 | 일관성 유지, 중복 방지 |

## 📂 Proposed Changes

### 질의서 프로토콜

#### [NEW] `schema/blueprint-protocol.md`

Blueprint 질의서 프로토콜. 구조:
1. 프로토콜 개요 — AI 에이전트용 실행 지침
2. Step 1: 앱 유형 선택 — 질문/선택지/기본값
3. Step 2: 페이지 구성 확인 — 추천 세트 기반 추가/제거
4. Step 3: variant/섹션 커스터마이징 — 페이지별 세부 조정
5. Output 규칙: 질의 결과 → REQUIREMENTS.md 매핑

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오

1. "SaaS 대시보드 앱"으로 질의서 시뮬레이션 → REQUIREMENTS.md 페이지 목록이 page-catalog.md 추천 세트와 일치
2. 커스터마이징 단계에서 페이지 추가/제거 시 매핑 표가 정확히 반영되는지 확인
3. 미구현 Template(⬜)이 매핑 표에서 명시적으로 표시되는지 확인

## 🔁 Rollback Plan

- 문서 전용이므로 브랜치 삭제로 즉시 롤백 가능

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
