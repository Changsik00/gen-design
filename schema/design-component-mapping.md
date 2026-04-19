# DESIGN.md ↔ Component 매핑 명세

> DESIGN.md 확장 섹션(11~14)의 정보가 Page Template의 어떤 컴포넌트/슬롯에 매핑되는지 정의.
> AI 에이전트가 DESIGN.md를 읽고 적절한 Template + 토큰 + i18n을 조합할 수 있도록 하는 규칙.
>
> **참조**:
> - `schema/design-md-schema.md` — DESIGN.md 스키마 (14섹션)
> - `studio/src/components/ARCHITECTURE.md` — 3계층 아키텍처
> - `studio/src/components/templates/types.ts` — 슬롯 인터페이스

---

## 매핑 개요

```
DESIGN.md                          Code
─────────────────────────────────────────────────────
섹션 11: Page Specifications  →  Page Template (Layer 3)
섹션 12: Composite Components →  Composite (Layer 2)
섹션 13: Token Mapping         →  tokens.json → CSS 변수 → Tailwind
섹션 14: i18n References      →  i18n JSON → texts prop
─────────────────────────────────────────────────────
섹션 1~9: 시각 디자인 기반    →  토큰/스타일 전반에 반영
```

---

## 섹션 11: Page Specifications → Page Template

### 매핑 규칙

| DESIGN.md 항목 | 코드 대응 | 예시 |
|---|---|---|
| Page 이름 | Template 컴포넌트 디렉토리 | `LoginPage` → `templates/LoginPage/` |
| Route | React Router 경로 | `/login` → `<Route path="/login">` |
| Variant | `variant` prop | `page \| modal \| bottom-sheet` |
| Layout | VariantWrapper 또는 페이지 레이아웃 | `centered-card`, `split-screen`, `sidebar` |
| Section → Block 테이블 | Composite 구성 | Section = 시각 영역, Block = Composite |

### 변환 절차

1. DESIGN.md `### LoginPage` 섹션을 읽는다
2. variant 값 → `PageTemplateVariant` 타입 확인 (`types.ts`)
3. Section/Block 테이블의 각 Block → `composites/` 디렉토리에서 매칭
4. Block이 없으면 → 새 Composite 생성 대상으로 표시

### 예시

```markdown
## DESIGN.md 입력:
### LoginPage
- Variant: page
- Layout: split-screen

| Section | Block | Description |
|---------|-------|-------------|
| BrandSection | LogoBlock | 앱 로고 |
| FormSection | CredentialBlock | 이메일/비밀번호 |
| FormSection | SocialAuthBlock | 소셜 로그인 |

## 코드 출력:
templates/LoginPage/index.tsx
  ├── BrandHeader (composites/) ← LogoBlock
  ├── LoginForm (composites/)   ← CredentialBlock
  └── SocialAuthBlock (composites/)
```

---

## 섹션 12: Composite Components → Composite (Layer 2)

### 매핑 규칙

| DESIGN.md 항목 | 코드 대응 | 예시 |
|---|---|---|
| Composite 이름 | `composites/{Name}/index.tsx` | `LoginForm` → `composites/LoginForm/` |
| Type | 컴포넌트 계층 확인 | `Composite` = Layer 2 |
| Variants | props 또는 조건부 렌더링 | `default \| with-social` |
| Element 테이블 | Primitive (ui/) 사용 | `EmailInput` → `<Input>` (ui/) |
| Required 표시 | 조건부 렌더링 여부 | ✅ = 항상 렌더, — = 조건부 |
| Props 열 | Element의 prop 인터페이스 | `placeholder, validation` |

### 변환 절차

1. DESIGN.md `### LoginForm` 섹션을 읽는다
2. Element 테이블의 Type 열 → `ui/` 컴포넌트 매핑 (예: `Input` → `ui/input.tsx`)
3. Required 여부 → 조건부 렌더링 패턴 적용
4. Props 열 → Composite의 prop 인터페이스에 반영
5. Variants → discriminated union 또는 조건부 렌더링

### Primitive(ui/) 매핑 테이블

| DESIGN.md Element Type | shadcn/ui 컴포넌트 | import |
|---|---|---|
| Input | `<Input>` | `@/components/ui/input` |
| Button | `<Button>` | `@/components/ui/button` |
| Checkbox | `<Checkbox>` | `@/components/ui/checkbox` |
| Select | `<Select>` | `@/components/ui/select` |
| Label | `<Label>` | `@/components/ui/label` |
| Card | `<Card>` | `@/components/ui/card` |
| Dialog | `<Dialog>` | `@/components/ui/dialog` |
| ButtonGroup | `<div>` + `<Button>` | 직접 조합 |

---

## 섹션 13: Token Mapping → Token Slot

### 매핑 규칙

| DESIGN.md 항목 | 코드 대응 | 흐름 |
|---|---|---|
| Color Tokens 테이블 | `tokens.json` → `_tokens-*.css` | Hex → CSS 변수 → Tailwind 클래스 |
| Typography Tokens | `tokens.json` typography 섹션 | CSS 변수 → Tailwind 유틸리티 |
| Spacing Tokens | `tokens.json` spacing 섹션 | CSS 변수 → Tailwind `p-*`, `gap-*` |
| Radius Tokens | `tokens.json` radius 섹션 | CSS 변수 → Tailwind `rounded-*` |

### 토큰 파이프라인

```
tokens.json
    ↓ (Style Dictionary / build.mjs)
_tokens-light.css, _tokens-dark.css
    ↓ (Tailwind CSS v4)
Tailwind 유틸리티 클래스
    ↓ (컴포넌트 코드)
bg-primary, text-foreground, rounded-md ...
```

### 변환 절차

1. DESIGN.md Token Mapping 테이블에서 Design Name, Hex, CSS Variable, Tailwind Class 확인
2. `tokens.json`에 해당 값이 있는지 확인
3. 없으면 → `tokens.json`에 추가하고 빌드 실행 (`pnpm tokens`)
4. 컴포넌트에서는 **Tailwind 클래스만** 사용 (hex 직접 참조 금지)

### 브랜드 교체 시

1. `tokens.json` 전체를 다른 브랜드 파일로 교체 (예: `tokens-brand-b.json`)
2. `pnpm tokens` 재실행 → CSS 변수 재생성
3. 컴포넌트 코드 변경 불필요 (Tailwind 클래스는 CSS 변수를 참조)

---

## 섹션 14: i18n References → i18n Slot

### 매핑 규칙

| DESIGN.md 항목 | 코드 대응 | 예시 |
|---|---|---|
| Namespace Convention | i18n JSON 키 구조 | `{page}.{section}.{element}.{property}` |
| Key Map 테이블 | i18n JSON 파일 + texts 타입 | `login.form.email.placeholder` → `LoginPageTexts.emailPlaceholder` |

### 변환 절차

1. DESIGN.md i18n Key Map에서 키 목록 확인
2. 각 키를 Template의 texts 타입(`types.ts`)과 매핑

   | i18n Key | texts 타입 필드 | Template |
   |---|---|---|
   | `login.form.email.placeholder` | `LoginPageTexts.emailPlaceholder` | LoginPage |
   | `login.form.submit.label` | `LoginPageTexts.submitButton` | LoginPage |
   | `dashboard.header.title` | `DashboardPageTexts.title` | DashboardPage |

3. i18n JSON 파일(`ko.json`, `en.json`)에 해당 키 존재 확인
4. 없으면 → i18n JSON에 추가
5. 컴포넌트에서는 `texts` prop으로 주입 (직접 import 금지)

### 언어 교체 시

1. `ko.json` → `en.json`으로 교체
2. `i18n.ts` helper의 locale 변경
3. 모든 Template에 새 texts 객체 전달
4. 컴포넌트 코드 변경 불필요 (texts prop 인터페이스 동일)

---

## AI 에이전트 실행 요약

DESIGN.md를 읽고 코드를 생성할 때, 에이전트는 다음 순서로 참조합니다:

```
1. REQUIREMENTS.md → 어떤 페이지가 필요한가? (Page Specifications)
2. DESIGN.md §11   → 각 페이지의 Section/Block 구조
3. DESIGN.md §12   → 재사용 Composite 정의
4. DESIGN.md §13   → tokens.json 반영 (Token Slot)
5. DESIGN.md §14   → i18n JSON 반영 (i18n Slot)
6. 이 문서          → DESIGN.md 항목 → 코드 위치 매핑
7. types.ts         → 슬롯 인터페이스 타입 확인
```
