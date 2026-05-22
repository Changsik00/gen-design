# Implementation Plan: spec-2-006

## 📋 Branch Strategy

- 신규 브랜치: `spec-2-006-bottom-sheet-style-match`
- 시작 지점: `main`

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] CTA 버튼 높이 변경 (h-8 → h-11) — LoginPage의 submit 버튼만, 전역 Button 기본값은 유지
> - [ ] 폼 gap 변경 (space-y-4 → gap-6) — Composite 내부 스타일 변경

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 항목 | 전략 | 이유 |
|:---:|:---|:---|
| **bottom-sheet** | 하단 고정 Card + 상단 둥근 모서리 | 모바일 시트 패턴. 애니메이션은 추후 |
| **사이즈 조정** | Composite props가 아닌 Tailwind 클래스 직접 수정 | 토큰으로 분리하기엔 과잉, 직접 수정이 명확 |
| **Button 높이** | LoginForm의 submit만 h-11 | 전역 Button 기본값(h-8)은 건드리지 않음 |

## 📂 Proposed Changes

#### [MODIFY] `studio/src/components/templates/VariantWrapper.tsx`
bottom-sheet variant 추가 — 하단 고정 Card

#### [MODIFY] `studio/src/components/composites/LoginForm/index.tsx`
CTA 버튼 h-11, gap 조정

#### [MODIFY] `studio/src/components/templates/LoginPage/index.tsx`
폼 영역 gap-6, 너비 380px 반영

#### [MODIFY] `studio/src/App.tsx`
variant 전환에 bottom-sheet 옵션 추가

#### [NEW] variant 테스트 추가 (bottom-sheet)

## 🧪 검증 계획

```bash
cd studio && pnpm exec vitest run
```

기존 61개 + bottom-sheet 테스트 전체 PASS

## 🔁 Rollback Plan

- 변경된 Tailwind 클래스 revert

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
