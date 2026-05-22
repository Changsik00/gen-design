# Implementation Plan: spec-1-001

## 📋 Branch Strategy

- 신규 브랜치: `spec-1-001-design-md-schema`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 확장 섹션 5개(Naming Convention, Page Specifications, Composite Components, Token Mapping, i18n References)의 범위가 적절한지
> - [ ] 확장 섹션이 기존 9섹션 뒤에 추가되는 구조가 맞는지 (하위 호환)

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```
기존 DESIGN.md (9섹션)          확장 DESIGN.md (14섹션)
┌─────────────────────┐        ┌─────────────────────┐
│ 1. Visual Theme     │        │ 1. Visual Theme     │
│ 2. Color Palette    │        │ 2. Color Palette    │
│ 3. Typography       │        │ 3. Typography       │
│ 4. Components       │        │ 4. Components       │
│ 5. Layout           │        │ 5. Layout           │
│ 6. Depth            │        │ 6. Depth            │
│ 7. Do's/Don'ts      │        │ 7. Do's/Don'ts      │
│ 8. Responsive       │        │ 8. Responsive       │
│ 9. Agent Prompt     │        │ 9. Agent Prompt     │
└─────────────────────┘        │───── 확장 ─────────│
                               │ 10. Naming Conv.    │
                               │ 11. Page Specs      │
                               │ 12. Composites      │
                               │ 13. Token Mapping   │
                               │ 14. i18n References │
                               └─────────────────────┘
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **분석 방법** | 대표 파일 5~6개 정독 + 전체 66개 구조 스캔 | 전수 정독은 비효율, 대표 샘플로 패턴 도출 후 전체 검증 |
| **확장 위치** | 기존 9섹션 뒤에 10~14번 추가 | 기존 파일 호환성 유지, 확장 미사용 시 기존과 동일 |
| **검증 방법** | stripe.md를 확장 Schema로 변환 | 가장 상세한 레퍼런스, 확장 섹션 채울 내용이 풍부 |

## 📂 Proposed Changes

### 분석 보고서

#### [NEW] `specs/spec-1-001-design-md-schema/report.md`
- 66개 레퍼런스 공통 패턴 분석 결과
- 섹션별 출현 빈도, 필수/선택 판별
- 기존 포맷의 한계점 도출

### Schema 정의

#### [NEW] `schema/design-md-schema.md`
- 기존 9섹션 구조 정리 (각 섹션 필수/선택, 포함 항목)
- 확장 5섹션 상세 정의 (포맷, 예시, 규칙)
- 전체 Schema 요약 테이블

### 검증 샘플

#### [NEW] `schema/examples/stripe-extended.md`
- stripe.md를 확장 Schema로 변환한 샘플
- 기존 9섹션 그대로 + 확장 5섹션 추가

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오

1. `schema/design-md-schema.md`의 필수 섹션이 기존 66개 파일 모두에 존재하는지 확인
2. `schema/examples/stripe-extended.md`가 기존 stripe.md의 정보를 손실 없이 포함하는지 확인
3. 확장 섹션(10~14)이 비어있어도 Schema 자체가 유효한지 확인 (하위 호환)

## 🔁 Rollback Plan

- 리서치 Spec이므로 코드 변경 없음. 문서만 삭제하면 원복 가능.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
