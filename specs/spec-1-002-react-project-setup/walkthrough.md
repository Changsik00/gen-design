# Walkthrough: spec-1-002

> 본 문서는 *증거 로그* 입니다.

## 📋 실제 구현된 변경사항

- [x] Vite + React 19 + TypeScript 5.8 프로젝트 생성 (`studio/`)
- [x] Tailwind CSS v4 설치 및 `@tailwindcss/vite` 플러그인 설정
- [x] shadcn/ui 초기화 — `cn()` 유틸, cva, tw-animate-css 자동 포함
- [x] 기본 컴포넌트 4종 설치: Button, Input, Card, Dialog
- [x] App.tsx에서 전체 컴포넌트 렌더링 확인 (variant: default/secondary/destructive/outline/ghost)
- [x] `@/*` path alias 설정 (tsconfig + vite resolve.alias)
- [x] studio/README.md를 프로젝트 맞춤 문서로 교체

## 🧪 검증 결과

### 1. 빌드 검증

- **명령**: `npm run build`
- **결과**: ✅ Passed
- **로그 요약**:
```text
vite v8.0.8 building client environment for production...
✓ 1889 modules transformed.
dist/index.html                 0.45 kB │ gzip:  0.29 kB
dist/assets/index-D0Jqnhnj.css 32.93 kB │ gzip:  6.56 kB
dist/assets/index-ptACNLJU.js  301.23 kB │ gzip: 96.39 kB
✓ built in 127ms
```

### 2. 수동 검증

1. **Action**: `npm run build` (tsc -b + vite build)
   - **Result**: 타입 체크 통과, 프로덕션 빌드 성공
2. **Action**: `cn()` 유틸 존재 확인 (`src/lib/utils.ts`)
   - **Result**: clsx + tailwind-merge 조합 확인
3. **Action**: cva 사용 확인 (`src/components/ui/button.tsx`)
   - **Result**: buttonVariants에 default/destructive/outline/secondary/ghost/link variant 정의 확인
4. **Action**: shadcn/ui CSS 변수 확인 (`src/index.css`)
   - **Result**: --primary, --secondary, --destructive, --accent 등 테마 변수 생성 확인

### 3. 증거 자료

- 빌드 로그: 위 참조
- `studio/src/lib/utils.ts`: cn() = clsx + tailwind-merge
- `studio/src/components/ui/button.tsx`: cva variant 정의

## 🔍 발견 사항

- TypeScript 7에서 `baseUrl` deprecated 예정 — `ignoreDeprecations: "6.0"` 옵션으로 우회. TS 7 출시 시 대안 검토 필요
- shadcn/ui v4가 DialogTrigger에서 `asChild` prop 미지원 — Radix 버전 변경에 따른 것으로 보임
- shadcn/ui 초기화 시 Geist 폰트가 자동 설치됨 (`@fontsource-variable/geist`)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-04-12 |
| **최종 commit** | `8971c2f` |
