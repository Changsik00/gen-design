# spec-2-005: 테스트 보강 (phase-2 회고 대응)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-2-005` |
| **Phase** | `phase-2` |
| **Branch** | `spec-2-005-test-coverage` |
| **상태** | Planning |
| **타입** | Test |
| **Integration Test Required** | no |
| **작성일** | 2026-04-15 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-2 회고에서 테스트 품질이 C 등급으로 평가됨. 28개 테스트가 있으나 대부분 "렌더링되면 통과" 수준. 핵심 기능(토큰 교체, variant 전환, i18n 레이아웃 유지)에 대한 자동화 테스트 없음.

### 문제점

1. variant 전환(page↔modal) 테스트 없음
2. brand 교체(Brand A↔B) 시 CSS 변수 변경 검증 없음
3. i18n 교체(ko↔en) 시 레이아웃 유지 검증 없음
4. Composite 컴포넌트(StatCard, Sidebar, ActivityTable) 단독 테스트 없음
5. phase-2 통합 테스트 시나리오 3개 자동화 없음

### 해결 방안 (요약)

위 5가지 테스트 갭을 모두 자동화 테스트로 보강한다.

## 🎯 요구사항

### Functional Requirements

1. **variant 전환 테스트**: LoginPage page variant와 modal variant의 DOM 구조 차이 검증
2. **brand 교체 테스트**: `.brand-b` 클래스 적용 시 CSS 변수 변경 확인
3. **i18n 레이아웃 테스트**: ko/en 전환 시 동일 DOM 구조 + 텍스트만 다름 확인
4. **Composite 단독 테스트**: StatCard, Sidebar, ActivityTable, DashboardHeader 개별 렌더링
5. **통합 시나리오 자동화**: phase-2.md의 3개 통합 테스트 시나리오를 vitest로 구현

### Non-Functional Requirements

1. 기존 28개 테스트 깨뜨리지 않음
2. 구현 코드 변경 없음 (테스트만 추가)

## 🚫 Out of Scope

- 접근성(a11y) 테스트 — 별도 도구(axe-core) 도입 필요, 규모가 큼
- 시각적 회귀(snapshot) 테스트 — 현 단계에서 과잉
- E2E 테스트 (Playwright 등)

## ✅ Definition of Done

- [ ] 기존 28개 테스트 + 신규 테스트 전체 PASS
- [ ] variant 전환 검증 테스트 존재
- [ ] brand 교체 검증 테스트 존재
- [ ] i18n 레이아웃 유지 검증 테스트 존재
- [ ] Composite 단독 테스트 존재
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-2-005-test-coverage` 브랜치 push 완료
