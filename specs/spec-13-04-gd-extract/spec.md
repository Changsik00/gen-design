# spec-13-04: gd extract — chat.md v2 → MSW 핸들러 + API spec 자동 생성

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-04` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-04-gd-extract` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

chat.md v2에 Scenarios / API 레이어가 정의됐으나 (ADR-011, spec-13-03), 이 레이어에서 실제 개발 자산을 생성하는 도구가 없다. 개발자가 Scenarios를 보고 MSW 핸들러를 수동으로 작성해야 한다.

### 문제점

- MSW 핸들러 작성이 반복 작업 — chat.md Scenarios와 구조가 동일한데 수동 작성
- API spec 문서가 chat.md API 레이어와 분리됨 — drift 발생
- 프론트엔드 개발 시 mock 서버 준비 시간이 걸림

### 해결 방안 (요약)

`gd extract <chat-file>` 명령을 구현한다. chat.md v2의 Scenarios + API YAML을 파싱하여 MSW v2 핸들러 스텁 파일(`.msw.ts`)과 API spec 문서(`.api-spec.md`)를 자동 생성한다.

## 📊 개념도

```
gd extract chats/scenes/dashboard.chat.md
    │
    ├── Scenarios YAML 파싱
    │     └── loaded / loading / error / empty ...
    │
    ├── API YAML 파싱
    │     └── GET /api/stats, GET /api/orders ...
    │
    ├── 출력 1: chats/scenes/dashboard.msw.ts
    │     └── MSW v2 핸들러 스텁
    │         export const dashboardHandlers = {
    │           loaded: [http.get('/api/stats', () => HttpResponse.json({...}))],
    │           loading: [http.get('/api/stats', async () => { await delay(...) })],
    │           error: [http.get('/api/stats', () => new HttpResponse(null, {status:500}))],
    │         }
    │
    └── 출력 2: chats/scenes/dashboard.api-spec.md
          └── API 계약 문서
              ## GET /api/stats
              Response: { total_sales: number, active_users: number }
```

## 🎯 요구사항

### Functional Requirements

1. **CLI 명령**: `gen-design extract <chat-file>` — 단일 파일 처리
2. **일괄 처리**: `gen-design extract --all [--chat-root <dir>]` — 모든 v2 chat.md 처리
3. **Scenarios 파싱**: `## 🎬 Scenarios` 섹션의 YAML fenced block을 파싱
4. **API 파싱**: `## 🔌 API` 섹션의 YAML fenced block을 파싱
5. **MSW v2 핸들러 생성**: 시나리오별 handler 배열 (`loaded`, `loading`, `error`, ...)
   - `loaded`/`empty` → `HttpResponse.json(data)`
   - `loading` → `delay('infinite')` + `HttpResponse.json({})`
   - `error` → `new HttpResponse(null, { status: 500 })`, 또는 `message`가 있으면 `HttpResponse.json({ message })` with 500
6. **API spec 문서 생성**: 각 엔드포인트를 Markdown 표/섹션으로 정리
7. **v2 전용**: `version: 2` frontmatter 없으면 skip + 경고 메시지
8. **幂等성**: 같은 파일 두 번 실행해도 동일 출력

### Non-Functional Requirements

1. 파싱 실패(잘못된 YAML)는 에러 메시지 + exit code 1 (다른 파일은 계속 처리)
2. Scenarios/API 섹션이 없으면 skip + 안내 메시지 (에러 아님)
3. 기존 `.msw.ts` 파일 덮어쓰기 — `--dry-run` 플래그로 미리 보기 가능

## 🚫 Out of Scope

- 완전한 타입 추론 (Scenarios data에서 TypeScript 타입 자동 생성)
- React Query / TanStack Query 훅 자동 생성
- DB 스키마 파일 생성 (DB Hints → SQL)
- MSW handler를 테스트 파일에 자동 import

## 📑 ADR 후보

- [ ] 없음 (구현 세부사항, 장기 기록 불필요)

## ✅ Definition of Done

- [ ] `packages/gd-cli/src/commands/extract.ts` 구현
- [ ] `packages/gd-cli/src/cli.ts`에 `extract` 명령 등록
- [ ] 단위 테스트 PASS (`packages/gd-cli/src/commands/__tests__/extract.test.ts`)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-13-04-gd-extract` 브랜치 push 완료
- [ ] PR → `phase-13-vertical-slice` 타겟
