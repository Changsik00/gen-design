# feat(spec-1-002): React 프로젝트 셋업 (Vite + Tailwind v4 + shadcn/ui)

## 📋 Summary

### 배경 및 목적

Phase 1 (Foundation)의 두 번째 스펙. DESIGN.md 확장 Schema(spec-1-001)를 실제로 활용할 React 프로젝트 기반을 구축한다. 이 프로젝트는 Phase 2 (Page Template), Phase 6 (Studio v1)의 기반이 된다.

### 주요 변경 사항

- [x] `studio/` 디렉토리에 Vite + React 19 + TypeScript 5.8 프로젝트 생성
- [x] Tailwind CSS v4 설치 (`@tailwindcss/vite` 플러그인)
- [x] shadcn/ui 초기화 + 기본 컴포넌트 4종 (Button, Input, Card, Dialog)
- [x] `cn()` 유틸 (clsx + tailwind-merge), cva variant, tw-animate-css 포함 확인
- [x] App.tsx에서 전체 컴포넌트 + variant 렌더링 확인
- [x] studio/README.md를 프로젝트 맞춤 문서로 교체

### Phase 컨텍스트

- **Phase**: `phase-1` (Foundation)
- **본 SPEC의 역할**: 이후 모든 컴포넌트 구현과 토큰 파이프라인의 코드 기반. spec-1-003 (토큰 파이프라인)이 이 프로젝트의 CSS 변수를 tokens.json과 연결

## 🎯 Key Review Points

1. **CSS 변수 → 토큰 연결 포인트**: shadcn/ui가 생성한 `--primary`, `--secondary` 등 CSS 변수가 spec-1-003에서 tokens.json과 매핑될 예정. 변수명 체계 확인
2. **path alias**: `@/*` → `./src/*` 설정. tsconfig에 `ignoreDeprecations: "6.0"` 필요 (TS 7 baseUrl deprecated)

## 🧪 Verification

### 빌드 검증
```bash
cd studio && npm run build
```

**결과 요약**:
- ✅ `tsc -b`: 타입 체크 통과
- ✅ `vite build`: 1889 modules, 127ms

### 수동 검증 시나리오

1. **빌드**: `npm run build` → 프로덕션 빌드 성공
2. **컴포넌트 렌더링**: App.tsx에서 Button(5 variants), Input, Card, Dialog 렌더링 확인
3. **cn() 유틸**: `src/lib/utils.ts`에 clsx + tailwind-merge 조합 확인
4. **cva**: `src/components/ui/button.tsx`에 buttonVariants 정의 확인

## 📦 Files Changed

### 🆕 New Files

- `studio/` 전체 (Vite React TS 프로젝트)
- `studio/src/components/ui/button.tsx`: shadcn/ui Button (cva variant)
- `studio/src/components/ui/input.tsx`: shadcn/ui Input
- `studio/src/components/ui/card.tsx`: shadcn/ui Card
- `studio/src/components/ui/dialog.tsx`: shadcn/ui Dialog
- `studio/src/lib/utils.ts`: cn() 유틸
- `studio/components.json`: shadcn/ui 설정

**Total**: 20+ files (new project)

## ✅ Definition of Done

- [x] `npm run build` 성공
- [x] Button, Input, Card, Dialog 렌더링 확인
- [x] cn(), cva, tailwind-merge 동작 확인
- [x] `walkthrough.md` archive commit 완료
- [x] `pr_description.md` archive commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-1.md`
- Walkthrough: `specs/spec-1-002-react-project-setup/walkthrough.md`
- 관련 ADR: `docs/decisions/ADR-001-phase-restructure.md`
