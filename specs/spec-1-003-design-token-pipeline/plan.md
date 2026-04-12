# Implementation Plan: spec-1-003

## 📋 Branch Strategy

- 신규 브랜치: `spec-1-003-design-token-pipeline`
- 시작 지점: `main`
- 첫 task가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 토큰 소스 파일 위치: `studio/tokens/` vs `templates/assets/tokens/` — `studio/tokens/`로 제안 (프로젝트 내부 관리)
> - [ ] shadcn/ui CSS 변수명을 그대로 유지하고 값만 토큰에서 주입하는 방식이 맞는지

## 🎯 핵심 전략 (Core Strategy)

### 아키텍처 컨텍스트

```
studio/tokens/
├── tokens.json           ← W3C DTCG 소스 (사람이 편집)
└── build.mjs             ← Style Dictionary 빌드 스크립트

    ↓ npm run tokens

studio/src/styles/
└── tokens.css            ← 자동 생성된 CSS 변수

    ↓ index.css에서 import

studio/src/index.css      ← shadcn/ui 테마 변수가 tokens.css 값을 참조
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **토큰 포맷** | W3C DTCG JSON | 2025.10 안정판 표준, Style Dictionary 지원 |
| **빌드 도구** | Style Dictionary v4 | DTCG 레퍼런스 구현체, 커스텀 transform 가능 |
| **CSS 변수 매핑** | shadcn/ui 변수명 유지, 값만 토큰에서 주입 | 기존 컴포넌트 코드 변경 없이 테마 교체 가능 |
| **색상 포맷** | oklch (shadcn/ui 기본) | shadcn/ui v4가 oklch 사용, 호환 유지 |
| **i18n 구조** | 네임스페이스 JSON (page.section.element.property) | Schema §14와 정합 |

## 📂 Proposed Changes

### 토큰 소스

#### [NEW] `studio/tokens/tokens.json`
- W3C DTCG 포맷 디자인 토큰
- shadcn/ui CSS 변수 전체를 커버:
  - **Color (20+)**: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1~5, sidebar(7종)
  - **Color (dark)**: .dark 모드 전체 오버라이드
  - **Radius**: base radius + 파생 (sm, md, lg, xl, 2xl, 3xl, 4xl)
  - **Font**: sans, heading
- 2계층 구조: 원시 토큰(oklch 값) → 시맨틱 토큰(primary, secondary 등)

#### [NEW] `studio/tokens/build.mjs`
- Style Dictionary v4 빌드 스크립트
- DTCG → CSS 변수 변환 (oklch 포맷 출력)

### 생성 파일

#### [NEW] `studio/src/styles/tokens.css`
- Style Dictionary가 자동 생성하는 CSS 변수 파일
- `.gitignore`에 추가하지 않음 (빌드 결과를 커밋하여 CI 없이도 동작)

### 기존 파일 수정

#### [MODIFY] `studio/src/index.css`
- tokens.css import 추가
- `:root` 블록에서 토큰 CSS 변수를 shadcn/ui 변수에 연결

#### [MODIFY] `studio/package.json`
- `"tokens": "node tokens/build.mjs"` 스크립트 추가
- `style-dictionary` devDependency 추가

### i18n 구조

#### [NEW] `studio/src/i18n/ko.json`
- 한국어 텍스트 리소스 샘플

#### [NEW] `studio/src/i18n/en.json`
- 영어 텍스트 리소스 샘플

## 🧪 검증 계획 (Verification Plan)

### 수동 검증 시나리오

1. `npm run tokens` 실행 → `src/styles/tokens.css` 생성 확인
2. `npm run build` 성공
3. tokens.json의 primary 색상 변경 → `npm run tokens` → Button 색상 변경 확인
4. i18n JSON 구조가 Schema §14 네임스페이스 규약 준수 확인

## 🔁 Rollback Plan

- `studio/tokens/`, `studio/src/styles/tokens.css`, `studio/src/i18n/` 삭제
- `index.css`에서 tokens import 제거
- `package.json`에서 tokens 스크립트 및 style-dictionary 제거

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md archive
