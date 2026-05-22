# Implementation Plan: spec-1-002

## 📋 Branch Strategy

- 신규 브랜치: `spec-1-002-react-project-setup`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 프로젝트 위치가 `studio/`가 맞는지
> - [ ] Tailwind CSS v4 사용 (v3 아님)
> - [ ] shadcn/ui 기본 컴포넌트 4종 (Button, Input, Card, Dialog) 범위가 적절한지

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **빌드 도구** | Vite | 빠른 HMR, React 생태계 표준 |
| **언어** | TypeScript (strict) | 타입 안정성, AI 코드 생성 품질 향상 |
| **스타일** | Tailwind CSS v4 | AI 친화적, 유틸리티 퍼스트, 토큰 연동 용이 |
| **variant** | class-variance-authority (cva) | 컴포넌트 variant를 타입 안전하게 정의 |
| **클래스 유틸** | clsx + tailwind-merge → `cn()` | 조건부 클래스 결합 + Tailwind 충돌 해결 |
| **애니메이션** | tailwindcss-animate | 트랜지션/애니메이션 프리셋 |
| **컴포넌트** | shadcn/ui (Radix 기반) | 코드 소유 모델, Phase 2에서 확장 가능. 위 도구들 자동 포함 |

## 📂 Proposed Changes

### 프로젝트 초기화

#### [NEW] `studio/` 전체
- `npm create vite@latest studio -- --template react-ts`
- Tailwind CSS v4 설치
- shadcn/ui 초기화 (`npx shadcn@latest init`)
  - 자동 포함: `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate`
  - `cn()` 유틸: `src/lib/utils.ts`에 생성됨
- 기본 컴포넌트 설치 (`npx shadcn@latest add button input card dialog`)

### 주요 파일 구조

```
studio/
├── src/
│   ├── components/
│   │   └── ui/          ← shadcn/ui 컴포넌트
│   ├── App.tsx          ← 기본 컴포넌트 렌더링 확인용
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts   (또는 v4 CSS 기반 설정)
```

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오

1. `cd studio && npm run dev` — 개발 서버 정상 구동, 브라우저에서 확인
2. `cd studio && npm run build` — 프로덕션 빌드 성공
3. App.tsx에서 Button, Input, Card, Dialog 렌더링 확인

## 🔁 Rollback Plan

- `studio/` 디렉토리 삭제하면 원복

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
