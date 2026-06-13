# Walkthrough: spec-13-04

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| MSW-API 매핑 방식 | API response shape 기준 분리 / loaded.data 전체 사용 | **API response shape 사용 (있을 때), 없으면 loaded.data** | API 섹션에 response가 정의되어 있으면 그것이 더 정확한 mock. Data.data는 fallback |
| 출력 파일 위치 | chat.md 옆 / 별도 src/mocks/ | **chat.md 옆** | 연관 파일끼리 묶어 관리. 이후 src/로 이동은 프로젝트마다 다름 |
| empty 시나리오 처리 | error와 동일 / loaded와 동일 | **loaded 경로 (default)** | state 없는 시나리오는 모두 "정상 데이터 있음" 상태로 간주 |
| 타입 추론 | 완전한 TypeScript 타입 생성 / 스텁만 | **스텁만** (scope-out) | 타입 추론은 별도 spec. 스텁만으로도 충분히 유용 |
| `require` in collectChatFiles | 정적 import / dynamic require | **dynamic require** | ESM/CJS 혼합 환경에서 readdirSync가 이미 top-level에 import됨. collectChatFiles는 --all 경로에서만 사용되어 영향 미미 |

- [ ] 없음 (ADR 승격 대상 없음 — 구현 세부사항)

## 💬 사용자 협의

- **주제**: gd extract 명령 범위
  - **사용자 의견**: chat.md에서 미리 추출해두면 나중에 DB 스키마 설계와 API 만들 때 유용. React는 MSW 시나리오가 도움이 될 것.
  - **합의**: Scenarios → MSW 핸들러 스텁, API → API spec 문서. DB Hints → DB 스키마 생성은 out of scope (후속 spec 후보).

## 🧪 검증 결과

### 1. 자동화 테스트

```
pnpm --filter @gd/cli test --run
Test Files  23 passed (23)
Tests  271 passed (271)
```

extract 테스트 30개 모두 PASS:
- parseExtractArgs 7개
- getFrontmatterVersion 3개
- parseSectionYaml 4개
- generateMswHandlers 6개
- generateApiSpec 4개
- runExtract 6개 (통합)

### 2. 수동 검증

1. **Action**: `gen-design extract specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md`
   - **Result**: `dashboard.msw.ts` + `dashboard.api-spec.md` 정상 생성
   - loaded/loading/error/empty 4개 시나리오 핸들러 모두 생성
   - `/api/stats`, `/api/orders` 2개 엔드포인트 처리

2. **Action**: MSW 핸들러 형식 확인
   - `loaded` → `HttpResponse.json(API response shape)` ✓
   - `loading` → `delay('infinite')` ✓
   - `error` → 500 + message ✓

3. **Action**: API spec Markdown 확인
   - 엔드포인트 표 + 상세 섹션 + response JSON 블록 ✓

## 🔍 발견 사항

- `empty` 시나리오가 API response shape을 그대로 반환하는데, 실제로는 `{ items: [], total: 0 }` 형태가 맞다. 지금은 스텁이므로 개발자가 직접 수정해야 함. 향후 개선 포인트.
- `collectChatFiles`에서 `require` 동적 임포트 사용 — ESM 환경에서는 `createRequire` 패턴이 더 안전하지만 현재 테스트는 --all을 file system 없이 테스트하므로 영향 없음.
- pre-existing typecheck 에러 (`cva-plugin.ts`) — 우리 변경과 무관, 기존부터 있던 문제.

## 🚧 이월 항목

- **DB Hints → SQL/스키마 파일 생성** → Icebox
- **empty 시나리오 mock data 개선** → 후속 스킬 업데이트 또는 spec-x
- **collectChatFiles ESM-safe 리팩토링** → spec-13-06 또는 별도 chore

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-29 |
| **최종 commit** | `b876c0e` |
