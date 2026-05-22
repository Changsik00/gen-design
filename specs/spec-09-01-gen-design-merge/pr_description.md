# feat(spec-09-01): gen-design merge — shell 승격 조력자

> 첫 줄은 commit subject 와 정확히 일치해야 합니다 (`type(spec-...): description`).

## 📋 Summary

### 배경 및 목적

phase-8 의 `gen-design` CLI 는 `paper-import` / `diff` / `react` 3 명령을 구현했지만, ADR-009 D-4 의 `merge` 명령이 미구현 상태로 남아 있었다. ADR-010 D-4 는 `merge` 를 *조력자 형태* (휴리스틱 제시 → preview → confirm → apply) 로 정의했으나 코드가 없었다.

본 spec 은 `gen-design merge` 서브명령을 구현한다. scene chat.md 들을 스캔하여 3+ scene 에서 공통 참조된 컴포넌트를 shell 승격 후보로 제시하고, `--apply` 플래그로 `_shell.chat.md` 와 scene frontmatter 를 갱신한다.

### 주요 변경 사항

- [x] `studio/scripts/gen-design/merge.ts` 신규 — `parseMergeArgs` / `extractComponents` / `detectCandidates` / `applyPromotion` / `buildPreview` / `runMerge`
- [x] `studio/scripts/gen-design/__tests__/merge-args.test.ts` 신규 — 인수 파싱 14 케이스
- [x] `studio/scripts/gen-design/__tests__/merge-runtime.test.ts` 신규 — 핵심 로직 17 케이스 (실제 tmpdir 사용)
- [x] `studio/scripts/gen-design.ts` 수정 — `merge` 서브명령 등록

### Phase 컨텍스트

- **Phase**: `phase-09` (gen-design 활성화 + 외부 alpha)
- **본 SPEC 의 역할**: gen-design 5 명령 중 `merge` 구현 — phase-9 성공 기준 1 달성

## 🎯 Key Review Points

1. **ADR-010 D-4 조력자 원칙 준수**: `merge` 는 기본 dry-run. `--apply` 플래그 + `y/N` confirm 이후에만 파일 변경. 자동 mv 없음.
2. **extractComponents 정규식 범위**: `<[A-Z][A-Za-z0-9]*` 패턴 — 소문자 HTML 태그 제외, 대문자 시작 JSX 컴포넌트만 추출.
3. **applyPromotion 텍스트 패치**: AST 재생성 대신 정규식 기반 텍스트 패치로 `_shell.chat.md` 수동 편집 형태 보존.
4. **sdd 버그 수정 포함**: `phase new` 의 `08` 8진수 파싱 버그 + `phase-08-ship.md` 파일명 혼입 버그 수정 (본 spec 착수를 위해 필수).

## 🧪 Verification

### 자동 테스트

```bash
cd studio && pnpm test scripts/gen-design/__tests__/merge-args
cd studio && pnpm test scripts/gen-design/__tests__/merge-runtime
cd studio && pnpm test
```

**결과 요약**:
- ✅ merge-args: 14 tests PASS
- ✅ merge-runtime: 17 tests PASS
- ✅ 전체 회귀: 950 tests PASS (127 files)

### 수동 검증 시나리오

1. **dry-run 기본**: `pnpm gen-design merge` → "No shell promotion candidates found." (BrandHeader/AppFooter 이미 shell 에 있음) ✅
2. **threshold 낮춤**: `pnpm gen-design merge --threshold 1` → 단일 scene 컴포넌트 후보 표시 ✅
3. **help**: `pnpm gen-design --help` → merge 서브명령 목록 확인 ✅

## 📦 Files Changed

### 🆕 New Files

- `studio/scripts/gen-design/merge.ts`: gen-design merge 서브명령 구현 (299줄)
- `studio/scripts/gen-design/__tests__/merge-args.test.ts`: 인수 파싱 단위 테스트 (96줄)
- `studio/scripts/gen-design/__tests__/merge-runtime.test.ts`: 핵심 로직 단위 테스트 (264줄)

### 🛠 Modified Files

- `studio/scripts/gen-design.ts` (+3): merge 서브명령 import + 등록
- `.harness-kit/bin/sdd` (+2): phase 번호 파싱 버그 2건 수정

**Total**: 5 files changed, 664 insertions(+)

## ✅ Definition of Done

- [x] 모든 단위 테스트 통과 (950/950)
- [x] Integration Test Required = no
- [x] `walkthrough.md` ship commit 완료
- [x] `pr_description.md` ship commit 완료
- [x] 사용자 검토 요청 알림 완료

## 🔗 관련 자료

- Phase: `backlog/phase-09.md`
- Walkthrough: `specs/spec-09-01-gen-design-merge/walkthrough.md`
- ADR-009: `docs/decisions/ADR-009-gen-design-cli.md` (5 명령 계획)
- ADR-010: `docs/decisions/ADR-010-chat-promotion-policy.md` (Hybrid 정책)
