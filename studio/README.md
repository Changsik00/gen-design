# Design Studio

DESIGN.md 기반 디자인 시스템 산출물을 생성하고 검증하는 React 웹앱.
이 앱 자체가 디자인 시스템을 사용하는 dogfooding 프로젝트.

## 환경 요구사항

| 항목 | 버전 | 비고 |
|------|------|------|
| Node.js | >= 24 | `.node-version` 참조 (fnm/nvm 자동 감지) |
| pnpm | >= 10 | `corepack enable`로 활성화. **npm/yarn 사용 금지** |

```bash
# corepack으로 pnpm 활성화 (최초 1회)
corepack enable

# Node 버전 확인
node --version  # v24.x
```

## 시작하기

```bash
# 의존성 설치 (pnpm 필수)
pnpm install

# 개발 서버 (http://localhost:5173)
pnpm dev

# 토큰 빌드만
pnpm tokens

# 프로덕션 빌드 (tokens → tsc → vite)
pnpm build

# 빌드 미리보기
pnpm preview
```

## 사용 패키지

| 패키지 | 버전 | 역할 |
|--------|------|------|
| React | 19 | UI 프레임워크 |
| TypeScript | 5.8 | 타입 안정성 |
| Vite | 8 | 빌드 도구 + HMR |
| Tailwind CSS | v4 | 유틸리티 퍼스트 스타일링 |
| shadcn/ui | latest | Radix 기반 컴포넌트 (코드 소유 모델) |
| class-variance-authority (cva) | — | 컴포넌트 variant 타입 안전 정의 |
| clsx + tailwind-merge | — | `cn()` 유틸 — 조건부 클래스 + 충돌 해결 |
| tw-animate-css | — | 애니메이션 프리셋 |

## 디렉토리 구조

```
src/
├── components/
│   └── ui/              ← shadcn/ui 컴포넌트 (Button, Input, Card, Dialog)
├── lib/
│   └── utils.ts         ← cn() 유틸 (clsx + tailwind-merge)
├── App.tsx              ← 메인 앱
├── main.tsx             ← 엔트리포인트
└── index.css            ← Tailwind + shadcn/ui 테마 (CSS 변수)
```

## 테마 구조

shadcn/ui가 생성한 CSS 변수 기반 테마 (`index.css`):

```
:root {
  --primary          ← bg-primary, text-primary
  --secondary        ← bg-secondary, text-secondary
  --destructive      ← bg-destructive
  --accent           ← bg-accent
  --muted            ← bg-muted, text-muted-foreground
  --border           ← border-border
  --ring             ← ring-ring
  --radius           ← rounded-*
  ...
}
```

이 CSS 변수들이 spec-1-003 (토큰 파이프라인)에서 `tokens.json`과 연결됩니다.

## 컴포넌트 추가

```bash
# shadcn/ui 컴포넌트 추가
npx shadcn@latest add [component-name]

# 예시
npx shadcn@latest add select checkbox tabs toast tooltip
```

추가된 컴포넌트는 `src/components/ui/`에 소스 코드로 복사됩니다 (npm 패키지가 아님).
