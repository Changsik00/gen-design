# Implementation Plan: spec-12-03

## 📋 Branch Strategy

- 신규 브랜치: `spec-12-03-gd-tokens-query`
- 시작 지점: `phase-12-conversation-depth-and-orchestration` (phase base branch)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [x] `--tokens-root` 기본값: `templates/assets/tokens` (doctor 와 동일 규칙) — 별도 override 불필요

> [!WARNING]
> - [x] 기존 명령 없음 → cli.ts 에 `tokens` 키 추가 (breaking 아님, 신규 항목)

## 🎯 핵심 전략

### 아키텍처 컨텍스트

```
packages/gd-cli/
├── src/
│   ├── cli.ts                          [MODIFY] — tokens 명령 등록
│   └── commands/
│       ├── tokens.ts                   [NEW]    — list/find/show 구현
│       └── __tests__/
│           ├── tokens-args.test.ts     [NEW]    — arg parser 단위 테스트
│           └── tokens-runtime.test.ts  [NEW]    — 런타임 출력 단위 테스트
```

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **파싱** | tokens.json 직접 파싱 (재사용 없음) | doctor 의 `checkTokenFormat` 은 진단용; 별도 쿼리 로직 필요 |
| **출력** | `printf "%-N s"` 컬럼 정렬 + ANSI bold | doctor messages.ts 와 시각 일관성 |
| **서브명령 라우팅** | `tokens.ts` 내부 switch (list/find/show) | doctor 와 동일 패턴, 별도 하위 파일 불필요한 크기 |
| **ANSI 제어** | `process.stdout.isTTY && !process.env.NO_COLOR` | 파이프 / CI 환경 대응 |

### 📑 ADR 후보

- [x] 없음

## 📂 Proposed Changes

### gd-cli

#### [NEW] `packages/gd-cli/src/commands/tokens.ts`

tokens.json 파싱 + list/find/show 3 서브명령 구현.

```text
interface TokenEntry {
  name: string;       // "background"
  category: string;   // "color"
  type: string;       // "color" | "dimension" | "fontFamily"
  light: string;      // "$value.light" or "$value" (단일값)
  dark: string;       // "$value.dark" or ""
  description: string;
}

parseTokensArgs(argv)  → TokensArgs | { error }
runTokens(argv)        → Promise<{ exitCode, stdout, stderr }>

내부:
  loadTokens(tokensRoot) → TokenEntry[]
  formatList(entries)    → string
  formatShow(entry)      → string
```

#### [NEW] `packages/gd-cli/src/commands/__tests__/tokens-args.test.ts`

`parseTokensArgs` 경계값 테스트 — list/find/show 분기, `--category`, `--tokens-root`, `--help`, 오류.

#### [NEW] `packages/gd-cli/src/commands/__tests__/tokens-runtime.test.ts`

`runTokens` 런타임 테스트 — 실제 tokens.json 픽스처 사용 (`poc/app-a/tokens.json` 또는 인라인 픽스처).

#### [MODIFY] `packages/gd-cli/src/cli.ts`

```text
import { runTokens } from "./commands/tokens";

COMMANDS["tokens"] = runTokens;
COMMAND_DESCRIPTIONS["tokens"] = "토큰 조회 — list / find / show (spec-12-03)";
```

## 🧪 검증 계획

### 단위 테스트

```bash
cd packages/gd-cli && pnpm test
```

### 수동 검증 시나리오

1. `pnpm gen-design tokens list` → 35 토큰 카테고리별 출력
2. `pnpm gen-design tokens list --category color` → color 29 토큰만 출력
3. `pnpm gen-design tokens find primary` → `primary` / `primary-foreground` 2 행 출력
4. `pnpm gen-design tokens show background` → light/dark/type/description 상세 출력
5. `pnpm gen-design tokens show nonexistent` → 종료코드 1 + 오류 메시지
6. `pnpm gen-design tokens --help` → 사용법 출력

## 🔁 Rollback Plan

- `cli.ts` 에서 tokens 항목 제거, `commands/tokens.ts` 삭제 — 기존 명령 무영향

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
