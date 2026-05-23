# feat(spec-12-03): gd tokens 조회 명령 추가 (list/find/show)

## 📋 Summary

### 배경 및 목적

디자이너가 chat.md 작성 시 사용 가능한 토큰 목록을 확인할 방법이 없었음 (v4 retro #2). `gd tokens` 명령으로 tokens.json (DTCG 형식) 을 조회해 chat.md 작성을 도울 수 있다.

### 주요 변경 사항

- [x] `gd tokens list` — 전체 35 토큰 카테고리별 출력 (color / radius / fontFamily)
- [x] `gd tokens list --category <color|radius|fontFamily>` — 카테고리 필터
- [x] `gd tokens find <keyword>` — 이름·설명 키워드 검색
- [x] `gd tokens show <name>` — 단일 토큰 상세 (CSS 변수명 / light / dark / 설명)
- [x] ANSI 컬럼 출력; non-TTY / NO_COLOR 에서 자동 off

### Phase 컨텍스트

- **Phase**: `phase-12`
- **본 SPEC 의 역할**: `gd-chat.md` §5.5 checklist 3단계(토큰 후보 확인) 의 실행 도구 — `gd tokens list` 로 현재 토큰 일람 + `find` 로 후보 검색

## 🎯 Key Review Points

1. **`tokens.ts` — DTCG 파싱**: `$value` 가 `{ light, dark }` 객체 또는 단일 string 양쪽 처리 (`flattenCategory`)
2. **단일 파일 구성**: arg 파서 + 런타임을 하나의 `tokens.ts` 에 — doctor 대비 scope 작아 분리 overhead 불필요

## 🧪 Verification

### 자동 테스트

```bash
cd packages/gd-cli && pnpm test
```

**결과 요약**:
- ✅ 20 test files, 214 tests PASS (기존 186 + 신규 28)
- tokens-args: 15 PASS
- tokens-runtime: 13 PASS

### 수동 검증 시나리오

1. `gd tokens list` → 35 토큰 카테고리별 출력
2. `gd tokens find primary` → primary / primary-foreground 매칭
3. `gd tokens show background` → CSS 변수명, light, dark, 설명 포함 출력
4. `gd tokens show nonexistent` → exitCode 1

## 📦 Files Changed

### 🆕 New Files

- `packages/gd-cli/src/commands/tokens.ts`: tokens 명령 구현 (arg 파서 + 런타임)
- `packages/gd-cli/src/commands/__tests__/tokens-args.test.ts`: arg 파서 단위 테스트 (15 cases)
- `packages/gd-cli/src/commands/__tests__/tokens-runtime.test.ts`: 런타임 단위 테스트 (13 cases)

### 🛠 Modified Files

- `packages/gd-cli/src/cli.ts` (+3, -0): tokens 명령 라우터 등록

**Total**: 4 files changed

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (214 PASS)
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 기존 테스트 regression 없음
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-12.md`
- Walkthrough: `specs/spec-12-03-gd-tokens-query/walkthrough.md`
