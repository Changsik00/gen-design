# Implementation Plan: spec-6-09

## 📋 Branch Strategy

- 신규 브랜치: `spec-6-09-paper-sync`
- 시작 지점: `phase-6-studio-v1`

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] **Research spec**: 코드 라이브러리 + PoC 실행 + 보고서. 일반 Feature spec 과 달리 결론이 "Go" 또는 "No-Go" 로 나뉨.
> - [ ] Paper MCP 도구 비활성 시 PoC 실행 파트 스킵, 라이브러리 + 보고서만 Ship.
> - [ ] `paper-normalizer` 와 독립적인 `paper-sync` 라이브러리 — 상호 import 없음.

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
studio/src/lib/paper-sync/
  ├── types.ts           — TokenNode / ResolvedTokens / PaperStylePayload
  ├── resolver.ts        — {primitive.xxx} 참조 재귀 해소
  ├── converter.ts       — 해소된 토큰 → CSS vars + Paper 페이로드
  ├── index.ts           — public API
  └── __tests__/
        ├── resolver.test.ts
        └── converter.test.ts

specs/spec-6-09-paper-sync/
  └── poc-report.md      — PoC 실행 결과 + Go/No-Go
```

### resolver 설계

```typescript
// {primitive.indigo.500} → "#6366F1"
resolveTokenValue(raw: string, primitives: Record<string, unknown>): string

// 전체 semantic.color.light 해소 → { "--primary": "#6366F1", ... }
resolveSemanticColors(tokens: TokensJson): Record<string, string>
```

### converter 설계

```typescript
interface PaperStylePayload {
  nodePattern: string;        // Paper 노드 이름 패턴 (예: "bg-primary")
  styles: Record<string, string>;  // { fill: "#6366F1" }
}

// CSS 변수 레코드 → Paper update_styles 페이로드 배열
tokensToPaperPayloads(resolved: Record<string, string>): PaperStylePayload[]
```

### PoC 평가 항목

| 평가 항목 | 방법 |
|---|---|
| 토큰 참조 해소 정확도 | resolver 단위 테스트 |
| Paper update_styles 적용 성공 여부 | MCP 도구 직접 호출 |
| 스크린샷 비교 가능성 | get_screenshot before/after |
| 노드-토큰 매핑 현실성 | Paper 파일 구조 분석 |

## 📂 Proposed Changes

#### [NEW] `studio/src/lib/paper-sync/types.ts`
#### [NEW] `studio/src/lib/paper-sync/resolver.ts`
#### [NEW] `studio/src/lib/paper-sync/converter.ts`
#### [NEW] `studio/src/lib/paper-sync/index.ts`
#### [NEW] `studio/src/lib/paper-sync/__tests__/resolver.test.ts`
#### [NEW] `studio/src/lib/paper-sync/__tests__/converter.test.ts`
#### [NEW] `specs/spec-6-09-paper-sync/poc-report.md`

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) poc-report.md + walkthrough.md / pr_description.md ship
