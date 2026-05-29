# feat(spec-13-04): gd extract — chat.md v2 Scenarios/API → MSW 핸들러 + API spec 자동 생성

## 📋 Summary

### 배경 및 목적

chat.md v2에 Scenarios/API 레이어가 정의됐으나 이를 실제 개발 자산으로 변환하는 도구가 없었다. MSW 핸들러 수동 작성은 반복 작업이고 chat.md와 drift가 발생한다.

`gen-design extract` 명령을 구현하여 Scenarios YAML → MSW v2 핸들러 스텁 TypeScript, API YAML → API spec Markdown을 자동 생성한다.

### 주요 변경 사항

- [x] `packages/gd-cli/src/commands/extract.ts` 신규 구현
- [x] `packages/gd-cli/src/cli.ts`에 `extract` 명령 등록
- [x] 단위 테스트 30개 PASS (`extract.test.ts`)
- [x] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.msw.ts` — 생성 예시
- [x] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.api-spec.md` — 생성 예시

### Phase 컨텍스트

- **Phase**: `phase-13`
- **본 SPEC의 역할**: spec-13-05 (e2e 재설계)의 MSW 핸들러 소스. e2e 테스트가 이 핸들러를 사용하여 시나리오별 화면 검증.

## 🎯 Key Review Points

1. **시나리오 타입별 핸들러 생성** (`generateMswHandlers`):
   - `loaded`/`empty` → `HttpResponse.json(API response shape)`
   - `loading` → `delay('infinite')`
   - `error` → 500 + optional message

2. **API-Scenarios 매핑**: API 섹션의 `response` shape을 우선 사용, 없으면 Scenarios `data` fallback.

3. **v2 전용 처리**: `version: 2` frontmatter 없으면 skip + 안내. 기존 v1 파일 보호.

## 🧪 Verification

```bash
pnpm --filter @gd/cli test --run
# Test Files  23 passed | Tests  271 passed
```

### 수동 검증

```bash
gen-design extract specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md
# ✓ .../dashboard.msw.ts
# ✓ .../dashboard.api-spec.md
```

## 📦 Files Changed

### 🆕 New Files

- `packages/gd-cli/src/commands/extract.ts`: 구현 (parser + generator + runner)
- `packages/gd-cli/src/commands/__tests__/extract.test.ts`: 단위 테스트 30개
- `specs/spec-13-01-chatmd-v2-format/examples/dashboard.msw.ts`: 생성 예시
- `specs/spec-13-01-chatmd-v2-format/examples/dashboard.api-spec.md`: 생성 예시

### 🛠 Modified Files

- `packages/gd-cli/src/cli.ts` (+3): `extract` 명령 등록

**Total**: 5 files changed

## ✅ Definition of Done

- [x] 단위 테스트 30개 PASS
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 수동 검증 완료 (dashboard.chat.md → MSW + API spec 생성)
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- Walkthrough: `specs/spec-13-04-gd-extract/walkthrough.md`
- 포맷 스펙: `docs/chatmd-v2-format.md`
- 생성 예시: `specs/spec-13-01-chatmd-v2-format/examples/dashboard.msw.ts`
- 다음 Spec: spec-13-05 (e2e — MSW 시나리오 기반 Playwright 테스트)
