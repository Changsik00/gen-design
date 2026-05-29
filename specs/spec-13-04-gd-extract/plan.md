# Implementation Plan: spec-13-04

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-04-gd-extract`
- 시작 지점: `phase-13-vertical-slice`
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **MSW 핸들러 API 매핑 방식**: Scenarios의 `data` 필드를 모든 API 엔드포인트에 동일하게 적용 vs 각 API별로 data를 분리해서 매핑. 현재 계획: **단순 매핑** — loaded scenario의 data 전체를 각 endpoint response에 배분 (Data 레이어의 `source` 필드 기준).
> - [ ] **출력 파일 위치**: chat.md와 같은 디렉토리 (`chats/scenes/dashboard.msw.ts`) vs 별도 디렉토리 (`src/mocks/dashboard.msw.ts`). 현재 계획: **chat.md 옆**.

## 🎯 핵심 전략

### YAML 파싱 전략

chat.md 섹션에서 YAML fenced block 추출:

```
섹션 분리 로직:
1. 파일을 줄 단위로 읽기
2. `^## ` 헤더로 섹션 분리
3. "Scenarios" 포함 헤더 섹션 → Scenarios YAML 추출
4. "API" 포함 헤더 섹션 → API YAML 추출
5. 각 섹션에서 ` ```yaml\n...\n``` ` fenced block 추출
6. js-yaml.load()로 파싱
```

### MSW v2 핸들러 생성 전략

Scenario type별 handler 생성:

```typescript
// loaded / empty → 정상 응답
http.get('/api/stats', () => HttpResponse.json({
  total_sales: 12450000,
  active_users: 234,
}))

// loading → 무한 대기
http.get('/api/stats', async () => {
  await delay('infinite')
  return HttpResponse.json({})
})

// error → 500 오류 (message 있으면 포함)
http.get('/api/stats', () => new HttpResponse(
  JSON.stringify({ message: "데이터를 불러오지 못했어요." }),
  { status: 500, headers: { 'Content-Type': 'application/json' } }
))
```

**API-Scenarios 매핑**:
- Data 레이어의 `source: GET /api/stats` → scenarios의 loaded.data에서 해당 API response 추출
- source가 없으면 → scenarios의 data 전체를 응답으로 사용

### 파일 구조

```
packages/gd-cli/src/commands/
├── extract.ts          ← 신규
└── __tests__/
    └── extract.test.ts ← 신규 (TDD)
```

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| YAML 파서 | `js-yaml` (이미 의존성) | 별도 패키지 추가 불필요 |
| 섹션 감지 | 헤더에 "Scenarios"/"API" 포함 여부 | 이모지 포함 헤더 대응 |
| 출력 위치 | chat.md 옆 (같은 디렉토리) | 연관 파일끼리 묶어 관리 |
| 덮어쓰기 | 항상 덮어쓰기 (--dry-run 예외) | 幂等성 보장 |
| 타입 추론 | 생략 (스텁만 생성) | scope-out, 충분히 유용한 보일러플레이트 |

## 📂 Proposed Changes

### [NEW] `packages/gd-cli/src/commands/extract.ts`

```typescript
// 핵심 exports:
export interface ExtractArgs { ... }
export function parseExtractArgs(argv: string[]): ExtractArgs | { error: string }
export async function runExtract(argv: string[], opts?): Promise<RunResult>

// 내부 함수:
function parseSectionYaml(content: string, sectionKeyword: string): unknown
function generateMswHandlers(slug: string, scenarios: Scenario[], apis: ApiEndpoint[]): string
function generateApiSpec(slug: string, apis: ApiEndpoint[]): string
```

### [MODIFY] `packages/gd-cli/src/cli.ts`

`extract` 명령 등록:

```typescript
import { runExtract } from "./commands/extract";
// COMMANDS에 추가
"extract": runExtract,
// COMMAND_DESCRIPTIONS에 추가
"extract": "chat.md v2 Scenarios+API → MSW 핸들러 스텁 + API spec 생성 (spec-13-04)",
```

### [NEW] `packages/gd-cli/src/commands/__tests__/extract.test.ts`

TDD 테스트 케이스:
1. Scenarios + API 있는 chat.md → MSW 핸들러 파일 내용 검증
2. Scenarios만 있고 API 없는 경우 → MSW 핸들러만 생성 (API spec skip)
3. v2 frontmatter 없는 파일 → skip + 경고
4. YAML 파싱 오류 → exit 1 + 에러 메시지
5. loaded/loading/error 각 시나리오 타입별 handler 형식 검증
6. `--dry-run` → 파일 미생성, stdout에 결과 출력

## 🧪 검증 계획

### 단위 테스트

```bash
pnpm --filter @gd/cli test
```

### 수동 검증

```bash
# 예시 파일로 테스트
node packages/gd-cli/bin/gen-design.mjs extract specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md
# → specs/spec-13-01-chatmd-v2-format/examples/dashboard.msw.ts
# → specs/spec-13-01-chatmd-v2-format/examples/dashboard.api-spec.md
```

## 🔁 Rollback Plan

- 신규 파일만 추가, 기존 코드 수정 최소 → git revert 안전
- cli.ts의 extract 등록만 revert하면 명령 즉시 비활성화

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
