# Implementation Plan: spec-3-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-3-01-page-catalog`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 카탈로그 위치: `schema/page-catalog.md` — schema/ 디렉토리에 DESIGN.md schema와 함께 배치
> - [ ] 본 Spec은 문서 전용(docs) — 코드 변경/테스트 없음

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **카탈로그 형식** | Markdown 테이블 + 상세 섹션 혼합 | AI 파싱 용이 + 사람 가독성 확보 |
| **카탈로그 위치** | `schema/page-catalog.md` | DESIGN.md schema와 동일 레벨, 앱 생성 시 참조 기준점 |
| **카테고리 구조** | auth / dashboard / profile / content / commerce / common 6개 | phase-3.md에 정의된 구조 + commerce 추가 |
| **Template 매핑** | 구현 완료 표시(✅) + 미구현 표시(⬜) | 현재 자산 활용도 파악 + 향후 구현 우선순위 기초 |

## 📂 Proposed Changes

### 카탈로그 문서

#### [NEW] `schema/page-catalog.md`

페이지 카탈로그 본문. 구조:
1. 카테고리별 페이지 요약 테이블 (ID, 이름, variant, Template 매핑 상태)
2. 각 페이지 상세: 설명, 필수/선택 섹션(Composite 단위), variant별 동작
3. 앱 유형별 추천 세트 (SaaS / E-commerce / Social / Content / Utility)

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)

본 Spec은 문서 전용이므로 코드 테스트 없음.

### 수동 검증 시나리오

1. 카테고리 6개 이상 존재 — 기대: auth, dashboard, profile, content, commerce, common
2. 각 카테고리 2종 이상 페이지 — 기대: 총 15종 이상
3. 각 페이지 variant 2개 이상 — 기대: page + modal 또는 bottom-sheet 등
4. 기존 Template 3종(LoginPage, SignupPage, DashboardPage) 매핑 표시 확인
5. 앱 유형별 추천 세트 5종 정의 확인

## 🔁 Rollback Plan

- 문서 전용이므로 브랜치 삭제로 즉시 롤백 가능
- 기존 코드에 영향 없음

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
