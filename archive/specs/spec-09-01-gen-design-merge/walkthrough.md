# Walkthrough: spec-09-01

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| sdd `phase new` 버그 — `08` 을 8진수로 파싱 | sdd 수정 vs 수동 우회 | sdd 수정 (grep 필터 + 10# 산술) | 재현 가능한 버그이므로 근본 수정. `phase-NN-*.md` 파일이 섞여 `08-ship` 이 파싱 실패하는 두 번째 케이스도 함께 수정 |
| fs mock 방식 — `vi.mock('node:fs')` vs 실제 tmpdir | vi.mock | 실제 tmpdir (`mkdtempSync`) | `vi.mock('node:fs')` 가 ESM 환경에서 `shellPaths.find(existsSync)` 호출 시 mock 이 전달되지 않는 문제 발생. 기존 `diff-runtime.test.ts` 와 동일 패턴 (tmpdir) 으로 일관성 유지 |
| `shellPaths.find(existsSync)` vs 명시적 람다 | 직접 전달 | 명시적 람다 `(p) => existsSync(p)` | `Array.prototype.find` 가 `(element, index, array)` 3개 인수를 전달하므로 mock 환경에서 동작 불일치 가능성 제거 |
| Task 3 에서 parseMergeArgs 만 구현 vs 전체 구현 | 분리 구현 | 전체 구현 포함 | 인수 파싱과 핵심 로직이 분리되기 어렵고, Task 5 를 별도 커밋으로 나누면 불완전한 중간 상태가 됨. Task 5 는 [-] Passed 처리 |

### ADR 승격 가이드

- [x] 없음 (ADR-009 D-4 + ADR-010 D-4 가 이미 설계 원칙 명문화)

## 💬 사용자 협의

- **주제**: phase-9 시작 및 spec-09-01 플랜 수립
  - **사용자 의견**: "진행하자" — phase-8 이연 4 spec 을 phase-9 로 묶어 SDD-P 로 진행
  - **합의**: Mode A (SDD-P), base branch `phase-09-gen-design-live`, 순차 실행 (09-01 → 02 → 03 → 04)

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트 — merge-args
- **명령**: `cd studio && pnpm test scripts/gen-design/__tests__/merge-args`
- **결과**: ✅ Passed (14 tests, ~680ms)
- **로그 요약**:
```text
 Test Files  1 passed (1)
      Tests  14 passed (14)
   Duration  680ms
```

#### 단위 테스트 — merge-runtime
- **명령**: `cd studio && pnpm test scripts/gen-design/__tests__/merge-runtime`
- **결과**: ✅ Passed (17 tests, ~559ms)
- **로그 요약**:
```text
 Test Files  1 passed (1)
      Tests  17 passed (17)
   Duration  559ms
```

#### 전체 회귀
- **명령**: `cd studio && pnpm test`
- **결과**: ✅ Passed (950 tests, 127 files, ~8.5s)
- **로그 요약**:
```text
 Test Files  127 passed (127)
      Tests  950 passed (950)
   Duration  8.52s
```

### 2. 수동 검증

1. **Action**: `pnpm gen-design merge` (playground/chats 기준 dry-run)
   - **Result**: `No shell promotion candidates found.` — BrandHeader / AppFooter 이미 `_shell.chat.md` 에 포함되어 있어 정상

2. **Action**: `pnpm gen-design merge --threshold 1` (threshold 낮춰 확인)
   - **Result**: EmptyState / LoginForm 등 단일 scene 컴포넌트가 후보 목록에 표시됨 (기대 동작)

3. **Action**: `pnpm gen-design --help`
   - **Result**: `merge` 서브명령이 목록에 표시됨 (등록 확인)

## 🔍 발견 사항

- **sdd 두 가지 버그 수정**: (1) `08` 을 8진수 산술로 파싱하는 버그 (`10#$n` 으로 수정), (2) `phase-08-ship.md` 같은 파일이 phase 번호 추출에 섞이는 버그 (`grep '^[0-9][0-9]*$'` 필터 추가). 두 수정 모두 `phase new` 가 phase-9 이상 생성 시 필수.
- **vi.mock ESM 한계**: `node:fs` 코어 모듈을 `vi.mock` 으로 교체하면 ESM static import 참조 문제가 발생. 실제 tmpdir 를 사용하는 패턴이 더 신뢰성 높음 (diff-runtime.test.ts 선례 확인).

## 🚧 이월 항목

- 없음 (Out of Scope 항목은 spec.md 에 명시)

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (claude-sonnet-4-6) + dennis |
| **작성 기간** | 2026-05-22 |
| **최종 commit** | `5cc67d6` |
