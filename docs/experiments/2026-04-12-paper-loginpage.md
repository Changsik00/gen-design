# 실험: Paper LoginPage 생성 및 JSX 추출

> **날짜**: 2026-04-12
> **목적**: DESIGN.md 토큰 → Paper 시안 → JSX 추출 → shadcn/ui 매핑 가능성 검증
> **Paper 파일**: "Welcome to Paper" / 아트보드: "LoginPage — DESIGN.md E2E Test" (ID: 1AX-0)

## 1. Paper에 전달한 값 (DESIGN.md 기준)

### 사용한 토큰

| 역할 | 전달 값 | CSS 변수 | Tailwind |
|------|---------|----------|---------|
| Card 배경 | #ffffff | --card | bg-card |
| Card 테두리 | oklch(0.922 0 0) | --border | border-border |
| Card radius | 8.75px | --radius-xl | rounded-xl |
| 제목 색상 | oklch(0.145 0 0) | --foreground | text-foreground |
| 보조 텍스트 | oklch(0.556 0 0) | --muted-foreground | text-muted-foreground |
| 버튼 배경 | oklch(0.205 0 0) | --primary | bg-primary |
| 버튼 텍스트 | oklch(0.985 0 0) | --primary-foreground | text-primary-foreground |
| Input 테두리 | oklch(0.922 0 0) | --input | border-input |
| Input radius | 5px | --radius-md | rounded-md |
| 폰트 | Geist Variable, Inter | --font-sans | font-sans |

### Paper에 전달한 HTML (write_html 호출 순서)

**1단계 — 카드 + 헤더**:
```html
<div style="display:flex; flex-direction:column; width:400px; background-color:#ffffff;
  border:1px solid oklch(0.922 0 0); border-radius:8.75px; padding:32px; gap:24px;
  box-shadow:0 1px 3px rgba(0,0,0,0.1);">
  <div style="display:flex; flex-direction:column; gap:4px;">
    <h2 style="font-family:'Geist Variable',Inter,sans-serif; font-size:24px;
      font-weight:600; color:oklch(0.145 0 0); margin:0;">로그인</h2>
    <p style="font-family:'Geist Variable',Inter,sans-serif; font-size:14px;
      color:oklch(0.556 0 0); margin:0;">계정에 로그인하세요</p>
  </div>
</div>
```

**2단계 — Input 폼**:
```html
<div style="display:flex; flex-direction:column; gap:16px;">
  <div style="display:flex; flex-direction:column; gap:6px;">
    <label style="font-family:'Geist Variable',Inter,sans-serif; font-size:14px;
      font-weight:500; color:oklch(0.145 0 0);">이메일</label>
    <div style="display:flex; align-items:center; height:40px; width:100%;
      border:1px solid oklch(0.922 0 0); border-radius:5px; padding:8px 12px;
      font-size:14px; color:oklch(0.556 0 0);">이메일을 입력하세요</div>
  </div>
  <!-- 비밀번호도 동일 구조 -->
</div>
```

**3단계 — Primary 버튼**:
```html
<button style="display:flex; align-items:center; justify-content:center; width:100%;
  height:40px; background-color:oklch(0.205 0 0); color:oklch(0.985 0 0); border:none;
  border-radius:5px; font-size:14px; font-weight:500;">로그인</button>
```

**4단계 — 소셜 Outline 버튼**:
```html
<div style="display:flex; gap:8px; width:100%;">
  <button style="flex:1; height:40px; background-color:transparent;
    color:oklch(0.145 0 0); border:1px solid oklch(0.922 0 0);
    border-radius:5px; font-size:14px; font-weight:500;">Google</button>
  <!-- Apple, Kakao 동일 -->
</div>
```

**5단계 — 회원가입 링크**:
```html
<div style="display:flex; justify-content:center; gap:4px; font-size:14px;">
  <span style="color:oklch(0.556 0 0);">계정이 없으신가요?</span>
  <span style="color:oklch(0.205 0 0); font-weight:500; text-decoration:underline;">회원가입</span>
</div>
```

## 2. Paper가 생성한 노드 트리

```
Frame "LoginPage — DESIGN.md E2E Test" (1AX-0) 1440×900
  └─ Frame (1AY-0) 400×?
      ├─ Frame (1AZ-0) 334×52          ← CardHeader
      │   ├─ Text "로그인" (1B0-0)       ← CardTitle
      │   └─ Text "계정에 로그인하세요" (1B1-0) ← CardDescription
      ├─ Frame (1B2-0) 334×144         ← CardContent (폼)
      │   ├─ Frame (1B3-0) 334×64       ← 이메일 그룹
      │   │   ├─ Text "이메일" (1B4-0)    ← Label
      │   │   └─ Frame (1B5-0) 334×40    ← Input
      │   └─ Frame (1B7-0) 334×64       ← 비밀번호 그룹
      │       ├─ Text "비밀번호" (1B8-0)   ← Label
      │       └─ Frame (1B9-0) 334×40    ← Input
      ├─ Frame "Button" (1BB-0) 334×40  ← Button (default)
      ├─ Frame (1BD-0) 334×40           ← 소셜 버튼 그룹
      │   ├─ Frame "Button" (1BE-0)      ← Button (outline) Google
      │   ├─ Frame "Button" (1BG-0)      ← Button (outline) Apple
      │   └─ Frame "Button" (1BI-0)      ← Button (outline) Kakao
      └─ Frame (1BK-0) 334×18           ← 회원가입 링크
          ├─ Text "계정이 없으신가요?" (1BL-0)
          └─ Text "회원가입" (1BM-0)
```

## 3. Paper "Copy as React" 출력 (사용자 제공)

```jsx
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
    marginLeft: '0px',
    marginRight: '0px',
    marginTop: '0px'
  }}>
    계정에 로그인하세요
  </div>
</div>
```

### Paper 출력의 특징

- 모든 노드가 `<div>` (시맨틱 태그 없음)
- 모든 스타일이 inline style 객체
- `boxSizing: 'border-box'` 기본값 포함
- `margin: '0px'` 네 방향 개별 기술
- 색상이 hex (`#0A0A0A`)로 변환됨 (oklch → hex 자동 변환)
- `paddingInline`, `paddingBlock` 등 논리적 속성 사용

### oklch → hex 변환 확인

| 입력 (oklch) | Paper 출력 (hex) | 시맨틱 |
|-------------|-----------------|--------|
| oklch(0.145 0 0) | #0A0A0A | --foreground |
| oklch(0.556 0 0) | #737373 | --muted-foreground |
| oklch(0.205 0 0) | (미확인 — 버튼 영역 미추출) | --primary |
| oklch(0.922 0 0) | (미확인 — 테두리 영역 미추출) | --border |

> Paper가 oklch를 hex로 자동 변환하므로, 역매핑 시 hex → 토큰 테이블이 필요.

## 4. 이상적인 변환 결과 (목표)

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input placeholder="이메일을 입력하세요" />
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input type="password" placeholder="비밀번호를 입력하세요" />
          </div>
          <Button className="w-full">로그인</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Google</Button>
            <Button variant="outline" className="flex-1">Apple</Button>
            <Button variant="outline" className="flex-1">Kakao</Button>
          </div>
          <p className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <a className="underline font-medium">회원가입</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 5. 후속 실험 (Paper 한도 복구 후)

- [ ] `get_jsx` (tailwind 포맷) 로 추출 → 위 목표 코드와 diff
- [ ] `get_computed_styles` 로 모든 노드의 계산된 스타일 추출 → hex→토큰 역매핑 정확도
- [ ] 토큰 교체 (primary 색상 변경) → Paper 재렌더링 → 스크린샷 비교
- [ ] 전체 카드의 Paper 스크린샷 vs React 렌더링 스크린샷 시각 비교
