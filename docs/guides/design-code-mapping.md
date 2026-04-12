# 디자인 ↔ 코드 매핑 가이드

> DESIGN.md에서 정의한 디자인 속성이 Paper(디자인 도구)와 React(코드)에서 어떻게 대응되는지 정리한 규칙.
> AGENT.md 또는 React 프로젝트에서 참조용으로 사용.

## 표기 규칙

DESIGN.md에서 모든 디자인 속성은 다음 형태로 기술한다:

```
{실제 값} ({CSS 변수} / {Tailwind 클래스})
```

**예시**: `#18181b (--primary / bg-primary)`

| 위치 | 용도 | 읽는 주체 |
|------|------|----------|
| 실제 값 | Paper 시안 생성, 시각 확인 | Paper MCP, 디자이너 |
| CSS 변수 | 토큰 시스템 참조, 테마 교체 | Style Dictionary, 개발자 |
| Tailwind 클래스 | React 코드 작성 | AI 코드 생성, 프론트엔드 |

## Color 매핑

### shadcn/ui 시맨틱 색상

| 역할 | 실제 값 (light) | CSS 변수 | Tailwind 클래스 | 용도 |
|------|----------------|----------|----------------|------|
| Primary | oklch(0.205 0 0) | --primary | bg-primary / text-primary | CTA 버튼, 강조 요소 |
| Primary FG | oklch(0.985 0 0) | --primary-foreground | text-primary-foreground | Primary 위의 텍스트 |
| Secondary | oklch(0.97 0 0) | --secondary | bg-secondary | 보조 버튼, 카드 |
| Secondary FG | oklch(0.205 0 0) | --secondary-foreground | text-secondary-foreground | Secondary 위의 텍스트 |
| Destructive | oklch(0.577 0.245 27.325) | --destructive | bg-destructive | 삭제, 에러 |
| Muted | oklch(0.97 0 0) | --muted | bg-muted | 비활성 배경 |
| Muted FG | oklch(0.556 0 0) | --muted-foreground | text-muted-foreground | 보조 텍스트, 힌트 |
| Accent | oklch(0.97 0 0) | --accent | bg-accent | 호버, 선택 배경 |
| Background | oklch(1 0 0) | --background | bg-background | 페이지 배경 |
| Foreground | oklch(0.145 0 0) | --foreground | text-foreground | 기본 텍스트 |
| Border | oklch(0.922 0 0) | --border | border-border | 기본 테두리 |
| Input | oklch(0.922 0 0) | --input | border-input | 입력 필드 테두리 |
| Ring | oklch(0.708 0 0) | --ring | ring-ring | 포커스 링 |
| Card | oklch(1 0 0) | --card | bg-card | 카드 배경 |
| Popover | oklch(1 0 0) | --popover | bg-popover | 팝오버 배경 |

### 차트 색상

| 역할 | CSS 변수 | Tailwind |
|------|----------|---------|
| Chart 1 | --chart-1 | bg-chart-1 |
| Chart 2 | --chart-2 | bg-chart-2 |
| Chart 3 | --chart-3 | bg-chart-3 |
| Chart 4 | --chart-4 | bg-chart-4 |
| Chart 5 | --chart-5 | bg-chart-5 |

## Radius 매핑

| 이름 | 실제 값 | CSS 변수 | Tailwind 클래스 | 용도 |
|------|---------|----------|----------------|------|
| sm | 3.75px | --radius-sm | rounded-sm | 작은 요소 (badge, tag) |
| md | 5px | --radius-md | rounded-md | 기본 (input, select) |
| lg | 6.25px | --radius-lg | rounded-lg | 카드, 컨테이너 |
| xl | 8.75px | --radius-xl | rounded-xl | 큰 카드, 모달 |
| 2xl | 11.25px | --radius-2xl | rounded-2xl | 히어로 컨테이너 |

> base radius = 0.625rem (10px). sm~4xl은 base의 0.6~2.6 배수.

## Typography 매핑

| 역할 | 실제 값 | Tailwind 클래스 | 용도 |
|------|---------|----------------|------|
| Heading 1 | 36px 700 | text-4xl font-bold | 페이지 제목 |
| Heading 2 | 30px 600 | text-3xl font-semibold | 섹션 제목 |
| Heading 3 | 24px 600 | text-2xl font-semibold | 서브 섹션 |
| Body | 16px 400 | text-base | 본문 |
| Body Small | 14px 400 | text-sm | 보조 텍스트 |
| Caption | 12px 400 | text-xs | 메타데이터, 힌트 |
| Label | 14px 500 | text-sm font-medium | 폼 라벨 |

## Component 매핑 (shadcn/ui)

### Button

| Variant | 배경 | 텍스트 | 테두리 | Tailwind |
|---------|------|--------|--------|---------|
| default | --primary | --primary-foreground | 없음 | `bg-primary text-primary-foreground` |
| secondary | --secondary | --secondary-foreground | 없음 | `bg-secondary text-secondary-foreground` |
| destructive | --destructive | white | 없음 | `bg-destructive text-white` |
| outline | transparent | --foreground | --border | `border border-input bg-background` |
| ghost | transparent | --foreground | 없음 | `hover:bg-accent hover:text-accent-foreground` |

**DESIGN.md 표기 예시**:
```markdown
### Button (default)
- Background: oklch(0.205 0 0) (--primary / bg-primary)
- Text: oklch(0.985 0 0) (--primary-foreground / text-primary-foreground)
- Padding: 10px 16px (py-2.5 px-4)
- Radius: 6px (--radius-lg / rounded-lg)
- Font: Inter 14px 500 (text-sm font-medium)
- Component: `<Button variant="default">`
```

### Input

```markdown
### Input
- Background: transparent (bg-transparent)
- Text: oklch(0.145 0 0) (--foreground / text-foreground)
- Border: 1px solid oklch(0.922 0 0) (--input / border-input)
- Placeholder: oklch(0.556 0 0) (--muted-foreground / text-muted-foreground)
- Radius: 5px (--radius-md / rounded-md)
- Padding: 8px 12px (py-2 px-3)
- Focus: ring oklch(0.708 0 0) (--ring / ring-ring)
- Component: `<Input />`
```

### Card

```markdown
### Card
- Background: oklch(1 0 0) (--card / bg-card)
- Border: 1px solid oklch(0.922 0 0) (--border / border-border)
- Radius: 8.75px (--radius-xl / rounded-xl)
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px (p-6)
- Component: `<Card><CardHeader /><CardContent /></Card>`
```

## Paper → React 변환 규칙

Paper에서 추출한 스타일을 React 코드로 변환할 때:

1. **색상**: hex/oklch 값 → 가장 가까운 시맨틱 토큰 매핑 → Tailwind 클래스
   ```
   #18181b → --primary → bg-primary
   ```

2. **Radius**: px 값 → 가장 가까운 radius 토큰 → Tailwind 클래스
   ```
   6px → --radius-lg → rounded-lg
   ```

3. **간격**: px 값 → Tailwind spacing (4px 단위)
   ```
   16px → p-4
   24px → p-6
   ```

4. **폰트**: px/weight → Tailwind text + font
   ```
   14px 500 → text-sm font-medium
   ```

5. **컴포넌트**: Paper 레이어명 → shadcn/ui 컴포넌트
   ```
   Button (레이어명) → <Button variant="default">
   LoginForm (레이어명) → <Card><CardHeader>...<CardContent>...</Card>
   ```

## Paper → React 변환 워크플로우

```
1. Paper에서 get_computed_styles → 실제 CSS 값 추출
2. 실제 값을 이 매핑 테이블에서 조회
3. 가장 가까운 토큰/Tailwind 클래스로 변환
4. shadcn/ui 컴포넌트로 조립
```

## 이 문서의 사용처

| 위치 | 용도 |
|------|------|
| DESIGN.md §4 (Components) | 컴포넌트 스타일 기술 시 이 표기 규칙 적용 |
| DESIGN.md §13 (Token Mapping) | 토큰 매핑 테이블 작성 시 참조 |
| AGENT.md | AI에게 코드 생성 규칙으로 제공 |
| Phase 2 (Page Template) | 컴포넌트 구현 시 매핑 참조 |
| Phase 4 (협업 Flow) | Paper↔React 변환 프로토콜에 포함 |
