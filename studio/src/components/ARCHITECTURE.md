# Component Architecture: 3-Layer Page Template System

## Overview

본 프로젝트는 shadcn/ui 기반의 3계층 컴포넌트 아키텍처를 사용한다.
각 계층은 명확한 책임 경계를 가지며, 상위 계층은 하위 계층만 의존한다.

```
templates/          Layer 3: Page Template (페이지 단위 재사용)
    ↓ uses
composites/         Layer 2: Composite (기능 단위 조합)
    ↓ uses
ui/                 Layer 1: Primitive (shadcn/ui 원자 컴포넌트)
```

## Layer 1: Primitive (`ui/`)

shadcn/ui가 제공하는 원자 컴포넌트. Radix UI Primitives 위에 Tailwind 스타일을 입힌 것.

- **출처**: `npx shadcn@latest add <component>`
- **수정 규칙**: shadcn/ui CLI로 추가/업데이트. 직접 수정 최소화.
- **예시**: Button, Input, Card, Label, Dialog, Select, Checkbox
- **네이밍**: 파일명 = 컴포넌트명 (소문자, kebab-case). `button.tsx`, `card.tsx`

### 왜 "Primitive"인가?

Radix UI 공식 문서와 shadcn/ui가 이 계층을 "Primitives"라고 부른다.
Atomic Design의 "Atom"이 아닌 "Primitive"를 채택한 이유:
- Radix/shadcn 생태계 용어와 일관성 유지
- AI 학습 데이터에서 "Primitive"가 더 빈번하게 등장
- 코드에서 `@radix-ui/react-*`를 import하면서 "Atom"이라 부르는 것은 인지 부조화

## Layer 2: Composite (`composites/`)

여러 Primitive를 조합한 기능 단위 컴포넌트. 독립적으로 의미 있는 UI 블록.

- **책임**: 단일 기능을 수행하는 UI 블록. 예: 로그인 폼, 소셜 인증 버튼 그룹
- **의존**: Primitive(ui/)만 import. 다른 Composite를 import하지 않는다.
- **예시**: LoginForm, SocialAuthBlock, BrandHeader, StatCard
- **네이밍**: PascalCase 디렉토리. `LoginForm/index.tsx`, `SocialAuthBlock/index.tsx`

### Atomic Design과의 차이

Atomic Design은 Molecule과 Organism을 구분하지만, 경계가 모호하다 (Brad Frost 본인도 인정).
Composite는 이 두 계층을 하나로 통합하여 판단 비용을 제거한다.

## Layer 3: Page Template (`templates/`)

완성된 페이지 레이아웃. Composite와 Primitive를 조합하여 하나의 페이지를 구성한다.

- **책임**: 페이지 전체 레이아웃 + 슬롯 인터페이스 제공
- **의존**: Composite + Primitive
- **예시**: LoginPage, SignupPage, DashboardPage
- **네이밍**: PascalCase 디렉토리. `LoginPage/index.tsx`

## Slot System (슬롯 인터페이스)

Page Template은 3가지 슬롯을 통해 교체 가능성을 제공한다:

### 1. Token Slot (토큰 슬롯)

디자인 토큰에 의한 시각적 테마 교체.

- **메커니즘**: CSS 변수 (`tokens.json → _tokens-*.css → Tailwind`)
- **교체 방법**: `<html>` 태그의 클래스 전환 (예: `class="dark"`)
- **Template 코드에서**: Tailwind 유틸리티 클래스 사용 (`bg-primary`, `text-foreground`)
- **Template이 직접 토큰을 알 필요 없음** — CSS 변수가 중개

### 2. i18n Slot (i18n 슬롯)

텍스트 리소스 교체에 의한 다국어 지원.

- **메커니즘**: `texts` prop으로 i18n 객체 주입
- **타입 안전**: 각 Template마다 전용 텍스트 타입 정의 (예: `LoginPageTexts`)
- **교체 방법**: `ko.json` / `en.json` 등에서 해당 키를 읽어 props로 전달

```typescript
// 사용 예시
<LoginPage texts={i18n.loginPage} variant="page" />
```

### 3. Variant Slot (variant 슬롯)

동일 콘텐츠의 레이아웃 변형.

- **메커니즘**: `variant` prop (discriminated union type)
- **타입**: `"page" | "modal" | "bottom-sheet"`
- **동작**: 같은 내부 콘텐츠를 다른 레이아웃 래퍼로 감싼다

```typescript
type PageTemplateVariant = "page" | "modal" | "bottom-sheet";
```

## Directory Convention

```
studio/src/components/
├── ui/                          # Layer 1: Primitive (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── composites/                  # Layer 2: Composite
│   ├── LoginForm/
│   │   └── index.tsx
│   ├── SocialAuthBlock/
│   │   └── index.tsx
│   └── index.ts                 # re-export
├── templates/                   # Layer 3: Page Template
│   ├── LoginPage/
│   │   └── index.tsx
│   ├── types.ts                 # 공통 타입 (슬롯 인터페이스)
│   └── index.ts                 # re-export
└── ARCHITECTURE.md              # 이 문서
```

## Rules for AI Code Generation

1. **계층 의존 방향**: `templates → composites → ui` (역방향 금지)
2. **Primitive 수정 금지**: `ui/` 컴포넌트는 shadcn/ui CLI로만 관리
3. **슬롯 필수**: 모든 Page Template은 `texts`, `variant` prop을 반드시 받는다
4. **토큰 직접 참조 금지**: 컴포넌트에서 hex/oklch 값을 하드코딩하지 않는다. Tailwind 유틸리티만 사용
5. **i18n 하드코딩 금지**: 사용자에게 보이는 텍스트는 반드시 `texts` prop에서 가져온다
