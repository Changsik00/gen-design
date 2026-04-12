# E2E 데모: DESIGN.md → Paper → React 매핑 검증

> 2026-04-12 실행. DESIGN.md 토큰 기반으로 Paper에 LoginPage 시안을 생성하고,
> 구조가 shadcn/ui 컴포넌트와 1:1 대응되는지 검증한 실험 기록.

## 목적

핵심 가설 검증: **"DESIGN.md에 정의된 토큰과 컴포넌트 명세로 Paper 시안을 만들면, 그 구조가 React/shadcn/ui 코드와 1:1 매핑된다"**

## 실험 설계

### 입력: DESIGN.md 기반 LoginPage 명세

ADR-002 표기 규칙 적용 — `실제 값 (CSS변수 / Tailwind)`:

```markdown
### LoginPage
- Layout: 중앙 정렬, 카드 기반

### Card (컨테이너)
- Background: #ffffff (--card / bg-card)
- Border: 1px solid oklch(0.922 0 0) (--border / border-border)
- Radius: 8.75px (--radius-xl / rounded-xl)
- Padding: 32px (p-8)
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

### CardHeader
- Title: "로그인" — 24px 600 oklch(0.145 0 0) (text-2xl font-semibold text-foreground)
- Description: "계정에 로그인하세요" — 14px oklch(0.556 0 0) (text-sm text-muted-foreground)

### Input (이메일)
- Label: "이메일" — 14px 500 oklch(0.145 0 0) (text-sm font-medium)
- Border: 1px solid oklch(0.922 0 0) (--input / border-input)
- Radius: 5px (--radius-md / rounded-md)
- Placeholder: oklch(0.556 0 0) (text-muted-foreground)

### Input (비밀번호)
- 위와 동일 구조

### Button (로그인 — default variant)
- Background: oklch(0.205 0 0) (--primary / bg-primary)
- Text: oklch(0.985 0 0) (--primary-foreground / text-primary-foreground)
- Radius: 5px (--radius-md / rounded-md)
- Font: 14px 500 (text-sm font-medium)
- Width: 100%

### Button × 3 (소셜 — outline variant)
- Background: transparent
- Text: oklch(0.145 0 0) (--foreground / text-foreground)
- Border: 1px solid oklch(0.922 0 0) (--border / border-input)
- Labels: "Google", "Apple", "Kakao"

### Footer
- "계정이 없으신가요?" — oklch(0.556 0 0) (text-muted-foreground)
- "회원가입" — oklch(0.205 0 0) 500 underline
```

### 사용한 도구

- Paper MCP: `create_artboard`, `write_html` (점진적 삽입)
- 검증: `get_tree_summary` (노드 구조 확인)

## 실험 결과

### 1. Paper 렌더링 — 토큰 값 적용 ✅

| 토큰 | 실제 값 | Paper 적용 |
|------|---------|:---:|
| --primary | oklch(0.205 0 0) | ✅ Button 배경 |
| --primary-foreground | oklch(0.985 0 0) | ✅ Button 텍스트 |
| --border | oklch(0.922 0 0) | ✅ Input/Card 테두리 |
| --muted-foreground | oklch(0.556 0 0) | ✅ placeholder, 보조 텍스트 |
| --foreground | oklch(0.145 0 0) | ✅ 제목, 라벨 |
| --radius-md | 5px | ✅ Input, Button radius |
| --radius-xl | 8.75px | ✅ Card radius |

**결론**: DESIGN.md의 oklch 토큰 값이 Paper에서 정확히 렌더링됨.

### 2. 노드 구조 → shadcn/ui 1:1 대응 ✅

```
Paper 노드 트리                          shadcn/ui React 코드
──────────────────────────────────────────────────────────────────
Frame "LoginPage" (아트보드)         →   <div className="min-h-screen flex items-center justify-center">
 └─ Frame (카드 컨테이너)            →     <Card>
     ├─ Frame (헤더)                 →       <CardHeader>
     │   ├─ Text "로그인"            →         <CardTitle>로그인</CardTitle>
     │   └─ Text "계정에 로그인하세요" →         <CardDescription>계정에 로그인하세요</CardDescription>
     ├─ Frame (폼 영역)              →       <CardContent className="space-y-4">
     │   ├─ Frame (이메일 그룹)      →         <div className="space-y-2">
     │   │   ├─ Text "이메일"        →           <Label>이메일</Label>
     │   │   └─ Frame (인풋)         →           <Input placeholder="이메일을 입력하세요" />
     │   └─ Frame (비밀번호 그룹)    →         <div className="space-y-2">
     │       ├─ Text "비밀번호"      →           <Label>비밀번호</Label>
     │       └─ Frame (인풋)         →           <Input placeholder="비밀번호를 입력하세요" />
     ├─ Frame "Button" (로그인)      →         <Button className="w-full">로그인</Button>
     ├─ Frame (소셜 버튼 그룹)       →         <div className="flex gap-2">
     │   ├─ Frame "Button" (Google)  →           <Button variant="outline">Google</Button>
     │   ├─ Frame "Button" (Apple)   →           <Button variant="outline">Apple</Button>
     │   └─ Frame "Button" (Kakao)   →           <Button variant="outline">Kakao</Button>
     └─ Frame (회원가입 링크)        →         <p className="text-center text-sm">
         ├─ Text "계정이 없으신가요?"  →           <span className="text-muted-foreground">...</span>
         └─ Text "회원가입"           →           <a className="underline font-medium">...</a>
```

**결론**: Paper 노드 트리의 계층이 shadcn/ui 컴포넌트 구조와 정확히 대응됨.

### 3. 변환 규칙 검증

| Paper 노드 | 매핑 판단 근거 | shadcn/ui 컴포넌트 |
|-----------|--------------|-------------------|
| Frame (border + shadow + radius-xl) | Card 패턴 | `<Card>` |
| Frame > Text(h2) + Text(p) | CardHeader 패턴 | `<CardHeader>` |
| Text (14px 500) + Frame (border + radius-md) | Label + Input 패턴 | `<Label>` + `<Input>` |
| Frame "Button" (primary bg + white text) | Button default variant | `<Button>` |
| Frame "Button" (transparent + border) | Button outline variant | `<Button variant="outline">` |

**결론**: Paper 노드의 시각적 속성으로 shadcn/ui variant를 판별할 수 있음.

### 4. Paper JSX 추출 결과 — 현실적 갭 ⚠️

사용자가 Paper에서 "Copy as React" 로 직접 추출한 실제 JSX:

```jsx
// Paper가 뱉는 실제 코드
<div style={{
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
}}>
  <div style={{
    boxSizing: 'border-box',
    color: '#0A0A0A',
    fontFamily: '"Geist", system-ui, sans-serif',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '30px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    marginTop: '0px'
  }}>
    로그인
  </div>
  <div style={{
    boxSizing: 'border-box',
    color: '#737373',
    fontFamily: '"Geist", system-ui, sans-serif',
    fontSize: '14px',
    lineHeight: '18px',
    marginBottom: '0px',
    ...
  }}>
    계정에 로그인하세요
  </div>
</div>
```

```jsx
// 우리가 원하는 코드
<CardHeader>
  <CardTitle>로그인</CardTitle>
  <CardDescription>계정에 로그인하세요</CardDescription>
</CardHeader>
```

**갭 분석:**

| 항목 | Paper 출력 | 원하는 결과 | 갭 |
|------|-----------|-----------|-----|
| 컴포넌트 | `<div>` (모든 노드) | `<Card>`, `<Button>`, `<Input>` | Paper는 시맨틱 컴포넌트를 모름 |
| 스타일 | inline style 객체 | Tailwind 클래스 | `fontSize: '24px'` → `text-2xl` 변환 필요 |
| 색상 | hex (`#0A0A0A`) | 토큰 참조 (`text-foreground`) | hex → 토큰 역매핑 필요 |
| 노이즈 | `boxSizing`, `margin: 0px` 등 | 없음 | 기본값 제거 필요 |
| 구조 | flat div 중첩 | 시맨틱 계층 (Card > Header > Title) | AI가 패턴 인식해야 함 |

**결론: Paper의 JSX 출력은 "원시 렌더링 코드"이지 "컴포넌트 코드"가 아니다.**

자동 1:1 변환은 불가능하며, 변환에는 다음이 필요:

```
Paper get_jsx (원시 inline style div)
    ↓
AI가 design-code-mapping.md 참조
    ↓
1. 패턴 인식: "div + 24px + 600 = CardTitle"
2. 색상 매핑: "#0A0A0A → --foreground → text-foreground"
3. 노이즈 제거: boxSizing, margin:0 등 기본값 제거
4. 컴포넌트 조립: div → <Card><CardHeader><CardTitle>
    ↓
shadcn/ui React 코드
```

이것이 **매핑 가이드(design-code-mapping.md)가 필요한 핵심 이유**이며,
향후 자동 변환기(Phase 4~7)의 입력이 되는 규칙 셋이다.

### 5. 미완료 (Paper MCP 한도 초과)

| 항목 | 상태 | 다음 세션에서 |
|------|:---:|-------------|
| `get_computed_styles` 역방향 추출 | ❌ | 토큰 역추출 정확도 측정 |
| 토큰 교체 후 재렌더링 | ❌ | primary 색상 변경 → 양쪽 반영 확인 |
| 스크린샷 시각 비교 | ❌ | Paper 시안 vs React 렌더링 비교 |
| AI 변환 테스트 | ❌ | Paper JSX + 매핑 가이드 → shadcn/ui 자동 변환 정확도 |

## 검증된 가설

| 가설 | 결과 |
|------|------|
| DESIGN.md 토큰 값으로 Paper 시안을 생성할 수 있다 | ✅ 증명 |
| Paper 노드 트리가 shadcn/ui 컴포넌트 구조와 1:1 대응된다 | ✅ 구조적으로 증명 |
| Paper는 CSS 변수(var())를 해석하지 못한다 (ADR-002) | ✅ 증명 |
| Paper는 실제 값(px, oklch, hex)만 해석한다 | ✅ 증명 |
| DESIGN.md 표기는 "실제값 (변수 / Tailwind)" 병기가 필요하다 | ✅ 증명 |
| Paper JSX 출력이 shadcn/ui 코드와 자동 1:1 매핑된다 | ❌ **부정됨** — AI 변환 레이어 필요 |

## 현실적 아키텍처 (수정된 이해)

```
DESIGN.md (공용 명세: 실제값 + 토큰 + Tailwind 병기)
    │                                │
    ↓                                ↓
Paper write_html                 React 코드 직접 작성
(실제 값으로 시안 생성)           (Tailwind + shadcn/ui)
    │
    ↓
Paper get_jsx (원시 inline style div)
    │
    ↓  ← 여기에 AI 변환 레이어 필요
    │     (design-code-mapping.md 참조)
    │     (패턴 인식 + 색상 역매핑 + 노이즈 제거)
    ↓
shadcn/ui React 코드
```

**핵심 인사이트**: Paper는 "디자인 캔버스"이지 "코드 생성기"가 아니다.
Paper → React 변환은 AI + 매핑 가이드가 수행하는 별도 단계이며,
이 변환의 품질은 매핑 가이드의 정밀도에 의존한다.

## 후속 과제

1. **Paper 한도 복구 후**: `get_jsx` + `get_computed_styles` 로 완전한 왕복 검증
2. **Phase 2**: 이 매핑 규칙을 Page Template 아키텍처에 내장
3. **Phase 4**: Paper↔React 자동 변환 파이프라인에 이 매핑 테이블 적용
4. **AGENT.md 템플릿**: 이 변환 규칙을 AI 지시서에 포함하여 코드 생성 시 참조
