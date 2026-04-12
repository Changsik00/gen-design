# ADR-002: 토큰 네이밍 전략 — Paper 렌더링 테스트 결과

> **상태**: 승인 (Accepted)
> **날짜**: 2026-04-12
> **의사결정자**: Dennis

## 컨텍스트

DESIGN.md가 디자인 도구(Paper)와 코드(React/shadcn/ui) 사이의 **공용 언어** 역할을 해야 한다. 토큰을 어떤 형태로 기술해야 양쪽 모두 이해하는지 테스트가 필요했다.

## 테스트 결과 (Paper MCP)

Paper에서 Button 3종을 3가지 방식으로 렌더링 테스트:

| 방식 | 예시 | Paper 렌더링 | 결론 |
|------|------|:---:|------|
| **실제 값 (px/hex)** | `border-radius: 6px; background: #18181b` | ✅ 정상 | Paper가 이해하는 유일한 방식 |
| **CSS 변수 (var())** | `border-radius: var(--radius-sm, 6px)` | ❌ 무시됨 | fallback 값도 무시, 스타일 전체 탈락 |
| **Tailwind class** | `class="bg-primary rounded-sm"` | ❌ 무시됨 | Paper는 class 미해석 (inline style만) |

**핵심 발견**: Paper는 인라인 스타일의 **실제 값만** 해석한다. CSS 변수, Tailwind 클래스는 Paper 렌더링에 영향 없음.

## 결정

DESIGN.md의 토큰 표기를 **실제 값 우선, 토큰 참조 병기** 방식으로 한다.

### 표기 규칙

```
{실제 값} ({CSS 변수} / {Tailwind 클래스})
```

예시:
```
- Background: #18181b (--primary / bg-primary)
- Radius: 6px (--radius-sm / rounded-sm)
- Text: #fafafa (--primary-foreground / text-primary-foreground)
- Font: Inter 14px 500 (text-sm font-medium)
- Padding: 10px 16px (py-2.5 px-4)
```

### 읽는 주체별 사용 방식

| 주체 | 읽는 부분 | 예시에서 |
|------|----------|---------|
| **Paper (디자인 도구)** | 실제 값 | `#18181b`, `6px` |
| **React 개발자/AI** | Tailwind 클래스 | `bg-primary`, `rounded-sm` |
| **토큰 시스템** | CSS 변수 | `--primary`, `--radius-sm` |
| **DESIGN.md 작성자** | 전체 | 세 값이 같은 것을 가리킴을 확인 |

## 영향

- `schema/design-md-schema.md` §4 (Component Stylings), §13 (Token Mapping) 포맷 수정 필요
- Phase 2 (Page Template) 작성 시 이 표기 규칙 적용
- AGENT.md 템플릿에 이 규칙 포함
