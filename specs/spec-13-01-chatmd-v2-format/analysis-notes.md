# 기존 포맷 분석 노트

> spec-13-01 Task 2 — 설계 기준선 파악용. walkthrough에 핵심 내용 반영 후 이 파일은 참조용으로 보관.

## 1. 현재 컴파일러 구조 (react.ts)

```
gd react <slug>
  → compileScene(slug, { chatRoot }) @ studio/src/lib/chat-md-compiler/react/compile-scene
  → { ok, tsx, errors }
  → .order.md 감지 → injectOrderChunks (zod schema + useForm 주입)
  → @gd: <path> annotation 삽입 (doctor drift 감지용)
  → stdout 또는 파일 출력
```

**폐기 시 영향 범위:**
- `packages/gd-cli/src/commands/react.ts` — CLI entry (삭제 대상)
- `studio/src/lib/chat-md-compiler/` — 실제 파서 (spec-13-06에서 판단)
- `packages/gd-cli/src/commands/order.ts` — form order 주입 (react와 결합, 함께 검토 필요)
- `gd doctor`의 `@gd:` annotation 기반 drift 감지 — extract 제거 후 대안 필요

## 2. gd-chat v1 포맷 기준선

현재 chat.md 구조:
```
---
frontmatter (type / name / identity / shell.inherit)
---

## 💬 Narrative       ← 화면 의도 (자유 텍스트)
## 🧩 Structure       ← UI 컴포넌트 (bare Markdown, 파서가 읽음)
## 📜 History         ← 변경 이력
```

**Structure 섹션 파싱 규칙 (핵심):**
- 컴포넌트 태그는 최상위 bare 형식 (`<Card>...</Card>`)
- code fence 안에 있으면 파서가 무시 (spec-11-05 fix)
- `{{i18n.ko.X}}` placeholder → i18n 키로 변환
- `className="..."` Tailwind 클래스 → 그대로 출력

## 3. gd extract 파싱 인터페이스 요구사항 (설계 참고)

v2 포맷에서 `gd extract`가 파싱해야 할 것:

```typescript
interface ExtractTarget {
  chatFile: string;         // 입력 chat.md 경로
  dataLayer?: DataShape;    // ## 📦 Data YAML
  apiLayer?: ApiContract[]; // ## 🔌 API YAML
  scenarios?: Scenario[];   // ## 🎬 Scenarios YAML
  dbHints?: DbHint[];       // ## 🗄️ DB Hints YAML (선택)
}

interface Scenario {
  name: string;             // loaded | loading | error | custom
  description?: string;
  state?: 'pending' | 'error';
  data?: Record<string, unknown>;  // mock data
  message?: string;         // error 시
}

// 출력
interface ExtractOutput {
  mswHandlerFile: string;   // chats/scenes/<slug>.msw.ts
  apiSpecFile: string;      // chats/scenes/<slug>.api-spec.md
}
```

→ YAML fenced block 선택의 핵심 이유: `js-yaml` 로 직접 파싱 가능, LLM 자연어 파싱 불필요.

## 4. doctor drift 감지 대안 (spec-13-06 참고용)

현재: `@gd: <path>` annotation → doctor가 chat mtime vs TSX mtime 비교
제거 후: TSX가 없으므로 drift 개념 자체 변경
→ doctor 역할 재정의 필요: "chat.md v2 포맷 유효성 검증" (YAML 문법 + 필수 레이어 존재 여부)
