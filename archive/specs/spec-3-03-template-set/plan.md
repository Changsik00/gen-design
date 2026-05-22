# Implementation Plan: spec-3-03

## 📋 Branch Strategy

- 신규 브랜치: `spec-3-03-template-set`
- 시작 지점: `phase-3-app-blueprint` (Phase base branch)
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] `templates/` 디렉토리 신규 생성 — 프로젝트 생성 템플릿 전용
> - [ ] 리소스 분리는 구조 설계만 — studio 코드의 실제 import 변경은 향후 Phase

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **템플릿 위치** | `templates/` 디렉토리 | `schema/`는 스키마 정의, `templates/`는 프로젝트 생성용 |
| **assets 구조** | `templates/assets/{i18n,tokens,images}/` | 앱 간 재사용 가능, 빌드 시 복사/참조 |
| **매핑 명세 위치** | `schema/design-component-mapping.md` | 스키마 레벨 문서 (design-md-schema.md 확장) |
| **AGENT.md** | 프로젝트별 AI 지침 | DESIGN.md(시각) + REQUIREMENTS.md(기능) + AGENT.md(실행 규칙) 3종 세트 |

## 📂 Proposed Changes

### 템플릿 세트

#### [NEW] `templates/REQUIREMENTS.md.template`
Blueprint 질의서 결과를 채우는 프로젝트 요구사항 템플릿

#### [NEW] `templates/AGENT.md.template`
AI 에이전트의 프로젝트별 실행 지침 템플릿

#### [NEW] `templates/assets/README.md`
assets 디렉토리 구조 설명 + studio 참조 방식 문서화

### 매핑 명세

#### [NEW] `schema/design-component-mapping.md`
DESIGN.md 확장 섹션(11~14) → Page Template 컴포넌트/슬롯 매핑

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오

1. REQUIREMENTS.md 템플릿이 blueprint-protocol.md 출력 구조와 일치하는지
2. AGENT.md 템플릿이 DESIGN.md + REQUIREMENTS.md를 참조하는 구조인지
3. 매핑 명세가 ARCHITECTURE.md의 3계층 + 슬롯 시스템과 일관되는지
4. assets 구조가 현재 studio/src/i18n/ + studio/tokens/의 파일을 수용 가능한지

## 🔁 Rollback Plan

- 문서 전용이므로 브랜치 삭제로 즉시 롤백 가능

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
