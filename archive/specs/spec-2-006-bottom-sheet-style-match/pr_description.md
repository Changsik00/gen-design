# feat(spec-2-006): bottom-sheet variant + Paper 스타일 매칭

## 📋 Summary

phase-2 성공 기준 #4(variant 3종 지원) 충족. bottom-sheet variant 추가 + Paper 디자인의 사이즈/패딩 반영.

### 주요 변경 사항

- [x] bottom-sheet variant: 하단 고정 Card + 둥근 상단 모서리 + 드래그 핸들
- [x] Paper 사이즈 매칭: CTA/input h-11(44px), 폼 gap-6(24px), 라벨↔input gap-1.5(6px)
- [x] App.tsx variant 전환에 bottom-sheet 옵션 추가
- [x] 테스트 63/63 PASS

## 🧪 Verification

- ✅ 전체 테스트 63/63 PASS
- ✅ `pnpm build` 성공

## 📦 Files Changed

- `studio/src/components/templates/VariantWrapper.tsx`: bottom-sheet 구현
- `studio/src/components/templates/LoginPage/index.tsx`: bottom-sheet 레이아웃
- `studio/src/components/composites/LoginForm/index.tsx`: h-11, gap 조정
- `studio/src/App.tsx`: 전환 옵션 추가
- `studio/src/components/templates/LoginPage/LoginPage.variant.test.tsx`: 테스트 추가
