# Plan: spec-12-07 — ComponentRegistry 플러그인 인터페이스

## 핵심 전략

**의존성 주입 (DI) + 중립 모듈 이동**.

`compile.ts` 와 `imports-builder.ts` 가 `paper/component-registry-metadata` 를 직접 import 하는 대신,
`ComponentRegistry` 인터페이스를 매개변수로 받도록 시그니처 변경.
메타데이터는 `paper/` 에서 `registry/` 로 이동. `paper/component-registry-metadata.ts` 는
`registry/metadata.ts` re-export 로 하위 호환 유지.

## 사용자 검토 필요

> [!IMPORTANT]
> - [ ] `react/compile.ts` + `react/imports-builder.ts` 함수 시그니처 변경 (하위 호환 유지, 기존 `registry?` optional 매개변수 추가)
> - [ ] `paper/component-registry-metadata.ts` 내용 교체 (re-export 로, 삭제 아님)

> [!WARNING]
> - [ ] studio 내에서 `from "../paper/component-registry-metadata"` 를 import 하는 다른 파일 있으면 모두 `registry/metadata` 로 갱신 필요 (본 plan 에서 `paper/` re-export 로 커버)

## 영향 파일 목록

| 파일 | 변경 유형 |
|---|---|
| `studio/src/lib/chat-md-compiler/registry/index.ts` | **신규** — `ComponentRegistry` 인터페이스 + `createDefaultRegistry()` |
| `studio/src/lib/chat-md-compiler/registry/metadata.ts` | **신규** — 기존 `paper/component-registry-metadata.ts` 내용 이동 |
| `studio/src/lib/chat-md-compiler/paper/component-registry-metadata.ts` | **수정** — `registry/metadata.ts` re-export 로 교체 |
| `studio/src/lib/chat-md-compiler/react/compile.ts` | **수정** — `CompileInput.registry?` 추가, DI 적용 |
| `studio/src/lib/chat-md-compiler/react/imports-builder.ts` | **수정** — `buildImports()` 에 `registry` 매개변수 추가 |
| `studio/src/lib/chat-md-compiler/react/__tests__/compile.test.ts` | **수정** — 커스텀 레지스트리 케이스 추가 |
| `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-start.md` | **수정** — §2 도구 선택 단계 추가 |

## 단계별 구현

### Step 1: `registry/` 모듈 신규 + TDD Red

`ComponentRegistry` 인터페이스 + `createDefaultRegistry()`:

```typescript
// studio/src/lib/chat-md-compiler/registry/index.ts
export interface ComponentRegistry {
  lookupImportPath(name: string): string | undefined;
  registeredNames(): string[];
}

export function createDefaultRegistry(): ComponentRegistry {
  return {
    lookupImportPath: (name) => COMPONENT_IMPORT_PATHS[name],
    registeredNames: () => Object.keys(COMPONENT_IMPORT_PATHS).sort(),
  };
}
```

`registry/metadata.ts` — 기존 `COMPONENT_IMPORT_PATHS` 를 그대로 이동.

**TDD Red**: `compile.test.ts` 에 커스텀 레지스트리 케이스 추가:
```typescript
it("커스텀 레지스트리 사용 — 커스텀 컴포넌트 import 생성", () => {
  const customRegistry = {
    lookupImportPath: (name: string) => name === "MyCard" ? "@my-lib/card" : undefined,
    registeredNames: () => ["MyCard"],
  };
  const result = compileToReact({ text: source, componentName: "MyScene", registry: customRegistry });
  // registry 미반영이라 실패
});
```

### Step 2: DI 적용 — Green

`CompileInput` 에 `registry?: ComponentRegistry` 추가:
```typescript
export interface CompileInput {
  text?: string;
  ast?: Document;
  componentName: string;
  registry?: ComponentRegistry;
}
```

`compileToReact(input)` 내부:
```typescript
const registry = input.registry ?? createDefaultRegistry();
const knownComponents = new Set(registry.registeredNames());
// buildImports 에도 registry 전달
```

`buildImports(ctx, usedComponents, options, registry)` — 4번째 매개변수 추가.

### Step 3: `paper/component-registry-metadata.ts` re-export

```typescript
export {
  COMPONENT_IMPORT_PATHS,
  lookupImportPath,
  registeredNames,
} from "../../registry/metadata";
```

기존 `paper/component-registry.ts` 는 `registry/metadata.ts` 직접 import 로 갱신.

### Step 4: `gd-start.md` §2 디자인 도구 선택 단계

기존 §1 (프로젝트 초기화) 다음에 §2 삽입:
- Paper / Figma / 손작성 3가지 옵션
- 선택에 따라 이후 스킬 안내 분기 (§3 이후)
- `.gd/tool.txt` 기록 제안 (gd-chat 스킬 참조용)

## ADR 후보

- [x] `ADR-010-component-registry-di` (type: decision) — React 컴파일러에 DI 패턴 도입 결정, `paper/` 경계 명문화

## 하위 호환 보장

- `compileToReact({ text, componentName })` — 기존 시그니처 그대로 동작 (`registry` 기본값 자동 주입)
- `paper/component-registry-metadata.ts` — 삭제하지 않고 re-export. 기존 import 경로 유지.
- `buildImports(ctx, usedComponents, options)` — 기존 3-인자 호출 유지 (4번째 default)

## 검증

```bash
cd studio && pnpm test          # 전체 Green
cd packages/gd-cli && pnpm test # 전체 Green
```

## 예상 commit 수

6 (브랜치 + registry 신규 + TDD Red + Green + re-export/gd-start + ship)
