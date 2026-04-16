# spec-2-006: bottom-sheet variant + Paper 스타일 매칭

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-2-006` |
| **Phase** | `phase-2` |
| **Branch** | `spec-2-006-bottom-sheet-style-match` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-04-16 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

phase-2 성공 기준 #4에 "각 Page Template variant 지원 (page / modal / bottom-sheet)"이 명시되어 있으나 bottom-sheet은 미구현. 또한 Paper 디자인의 사이즈/패딩과 현재 shadcn 기본 사이즈 사이에 차이가 있음.

### 문제점

1. **bottom-sheet variant 미구현**: 성공 기준 미달
2. **CTA 버튼 높이**: Paper=44px, 현재 shadcn=32px(h-8)
3. **폼 영역 너비**: Paper=380px, 현재=w-full(Card 내부)
4. **간격(gap)**: Paper=24px(폼 블록간), 6px(라벨↔input), 현재 shadcn 기본

### 해결 방안 (요약)

VariantWrapper에 bottom-sheet variant를 추가하고, LoginPage/DashboardPage의 사이즈/패딩을 Paper 추출 값에 맞게 조정한다.

## 📊 Paper에서 추출한 사이즈 토큰

| 항목 | Paper 값 | 현재 값 |
|---|---|---|
| CTA 버튼 높이 | 44px (h-11) | 32px (h-8) |
| 폼 영역 너비 | 380px | w-full |
| 폼 블록간 gap | 24px (gap-6) | 16px (space-y-4) |
| 라벨↔input gap | 6px (gap-1.5) | 8px (space-y-2) |
| input border-radius | 8px | rounded-lg (기본) |
| 로고 크기 | 48px (login) / 32px (sidebar) | 32px / 32px |

## 🎯 요구사항

### Functional Requirements

1. **bottom-sheet variant**: VariantWrapper에 추가. 하단에서 올라오는 시트 레이아웃
2. **LoginPage 사이즈 조정**: CTA 높이, 폼 너비, gap을 Paper 값으로
3. **App.tsx에 bottom-sheet 전환 추가**: variant 전환 버튼에 bottom-sheet 옵션
4. **bottom-sheet 테스트 추가**

### Non-Functional Requirements

1. 기존 page/modal variant 동작에 영향 없음
2. 기존 61개 테스트 깨뜨리지 않음

## 🚫 Out of Scope

- 애니메이션/트랜지션 (CSS transition은 추후)
- Dashboard의 bottom-sheet (의미 없음)
- 반응형 breakpoint 조정

## ✅ Definition of Done

- [ ] bottom-sheet variant 렌더링 테스트 PASS
- [ ] Paper 사이즈 반영 후 기존 테스트 전체 PASS
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-2-006-bottom-sheet-style-match` 브랜치 push 완료
