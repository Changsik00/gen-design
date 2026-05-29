# test(spec-13-05): 시나리오 기반 e2e 재설계 — smoke + Chat Viewer 시나리오 + CI 복원

## 📋 Summary

### 배경 및 목적

기존 e2e(라우트 로딩만 검증)를 삭제한 후 `studio/e2e/`가 비어있고 CI e2e job이 비활성화 상태였다. 의미 있는 시나리오 기반 e2e로 재설계하고 CI를 복원한다.

### 주요 변경 사항

- [x] `studio/e2e/smoke.spec.ts` — 6개 라우트 로딩 + JS 오류 없음 (9 PASS)
- [x] `studio/e2e/chats.spec.ts` — Chat Viewer 3개 시나리오 (파일 목록 / 파일 선택 / 탭 전환)
- [x] `studio/vite.config.ts` — chatApiPlugin 경로 수정 (`chats/` → `fixtures/chats/`)
- [x] `studio/scripts/generate-fixtures-index.ts` — 누락 디렉토리에 graceful 처리 추가
- [x] `.github/workflows/ci.yml` — e2e job 복원 (`fixtures:gen` → Chromium → `test:e2e`)

### Phase 컨텍스트

- **Phase**: `phase-13`
- **본 SPEC의 역할**: phase-13 성공 기준 "MSW 시나리오 기반 e2e 3개 이상 PASS (CI 통합)" 충족.

## 🎯 Key Review Points

1. **Chat Viewer 파일 소스 변경** (`vite.config.ts`): DEV 모드에서 삭제된 `../chats`가 아닌 `../fixtures/chats/`를 스캔. 앞으로 fixtures 파일 추가/삭제 시 자동 반영.

2. **CI `fixtures:gen` step**: Chat Viewer가 `fixtures.generated.ts`에 의존하므로 e2e 실행 전 반드시 갱신 필요. CI에 추가됨.

3. **3개 시나리오 패턴**: 파일 목록(A) → 선택(B) → 탭 전환(C)으로 상태 전이를 검증.

## 🧪 Verification

```bash
pnpm --filter studio test:e2e
# 9 passed (2.5s)
```

- smoke: 6개 라우트 PASS
- chats: 시나리오 A/B/C PASS

## 📦 Files Changed

### 🆕 New Files
- `studio/e2e/smoke.spec.ts`: 라우트 smoke 테스트
- `studio/e2e/chats.spec.ts`: Chat Viewer 시나리오 테스트

### 🛠 Modified Files
- `studio/vite.config.ts`: chatApiPlugin 경로 `fixtures/chats/`로 수정
- `studio/scripts/generate-fixtures-index.ts`: 누락 디렉토리 graceful 처리
- `.github/workflows/ci.yml`: e2e job 복원

**Total**: 5 files changed

## ✅ Definition of Done

- [x] `pnpm --filter studio test:e2e` 9개 PASS
- [x] CI e2e job 복원
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-13.md`
- Walkthrough: `specs/spec-13-05-e2e-scenario-based/walkthrough.md`
- 다음 Spec: spec-13-06 (gd react 컴파일러 제거)
