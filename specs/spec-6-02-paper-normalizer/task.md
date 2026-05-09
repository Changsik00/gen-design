# Task List: spec-6-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.
> **Commit timestamp**: 자연 시각 (시간 위장 룰은 spec-6-01 한정 — 이번부터 폐기).

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new paper-normalizer` 완료)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-6.md SPEC 표 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + scaffold

### 1-1. 브랜치 분기 + 스캐폴드 커밋
- [x] `git checkout -b spec-6-02-paper-normalizer` (base: `phase-6-studio-v1`)
- [x] `git add backlog/phase-6.md backlog/queue.md specs/spec-6-02-paper-normalizer/`
- [x] Commit: `docs(spec-6-02): scaffold spec/plan/task for paper-normalizer` (`48e2b43`)

---

## Task 2: 의존성 추가 (`culori`)

### 2-1. culori 설치 + types
- [x] `pnpm add culori` (^4.0.2)
- [x] `pnpm add -D @types/culori` (^4.0.1)
- [x] `studio/package.json` + `pnpm-lock.yaml` 갱신 확인
- [-] quick check 빈 .ts — 다음 task 에서 hex-alpha.ts 가 직접 import 하므로 생략 (Pass)
- [x] Commit: `chore(spec-6-02): add culori dependency for color normalization` (`52b6832`)

---

## Task 3: `parseHexAlpha` / `serializeHexAlpha` (C1 — color)

### 3-1. types.ts + hex-alpha.ts + 단위 테스트
- [x] `types.ts` — `HexAlpha` interface (r/g/b 0~255, a 0~1)
- [x] `hex-alpha.ts` — parseHexAlpha (hex/rgb/rgba/oklch via culori) + serializeHexAlpha (3 format)
- [x] `index.ts` — re-export
- [x] `__tests__/hex-alpha.test.ts` — 13 case
- [x] `tsc --noEmit` PASS / `vitest run paper-normalizer` 13/13 PASS
- [x] Commit: `feat(spec-6-02): implement hex-alpha parse/serialize (color C1)` (`6e863aa`)

---

## Task 4: `parsePadding` / `serializePadding` (C2 — padding)

### 4-1. padding.ts + 단위 테스트
- [x] `types.ts`: `Padding` interface (block.start/end + inline.start/end px)
- [x] `padding.ts`: shorthand 1~4 + padding-inline / padding-block keyword 변형 + 자동 단축 직렬화 + logical/physical 옵션
- [x] `index.ts` re-export
- [x] `__tests__/padding.test.ts` — 17 case
- [x] `tsc --noEmit` PASS / `vitest run padding` 17/17 PASS
- [x] Commit: `feat(spec-6-02): implement padding parse/serialize (C2)` (`9e4c49e`)

---

## Task 5: `parseLineHeight` / `serializeLineHeight` (C3 — line-height)

### 5-1. line-height.ts + 단위 테스트
- [x] `types.ts`: `LineHeight` discriminated union (px / unitless / percent)
- [x] `line-height.ts`: parseLineHeight + serializeLineHeight + toPx/toUnitless utility
- [x] `index.ts` re-export
- [x] `__tests__/line-height.test.ts` — 15 case
- [x] `tsc` PASS / `vitest run line-height` 15/15 PASS
- [x] Commit: `feat(spec-6-02): implement line-height parse/serialize (C3)` (`33eca46`)

---

## Task 6: `parseFontFallback` / `serializeFontFallback` (C4 — font fallback)

### 6-1. font-fallback.ts + 단위 테스트
- [x] `types.ts`: `FontFallback` interface (primary / fallbacks / generic)
- [x] `font-fallback.ts`: quote 정규화 (단어 1개 영문 unquote / 공백 포함 single quote) + fallback 분리 + generic 누락 시 'sans-serif' 보강
- [x] `index.ts` re-export
- [x] `__tests__/font-fallback.test.ts` — 15 case (round-trip 정의는 "값 등가, quote 정규화 허용")
- [x] `tsc` PASS / `vitest run font-fallback` 15/15 PASS
- [x] Commit: `feat(spec-6-02): implement font-fallback parse/serialize (C4)` (`2c32ec0`)

---

## Task 7: `parseBorder` / `serializeBorder` (C5 — border)

### 7-1. border.ts + 단위 테스트
- [x] `types.ts`: `Border` interface (width / style nullable / color: HexAlpha)
- [x] `border.ts`: parseBorder (style 생략 허용) + serializeBorder ('solid' 기본 보강) — color 는 hex-alpha 위임
- [x] `index.ts` re-export
- [x] `__tests__/border.test.ts` — 13 case
- [x] `tsc` PASS / `vitest run border` 13/13 PASS
- [x] Commit: `feat(spec-6-02): implement border parse/serialize (C5)` (`3b00370`)

---

## Task 8: Fixture 회귀 테스트

### 8-1. design-extract 5 페이지 명시 expected 회귀
- [x] `__tests__/fixture-regression.test.ts` — 14 case (페이지당 2~4 + 공통 typography 2)
- [x] prose 표기 (×separator, border-bottom 등) 는 Out of Scope 명시 (test 주석 + spec.md)
- [x] `vitest run paper-normalizer` 87/87 PASS (5 카테고리 + fixture 회귀)
- [x] Commit: `test(spec-6-02): add fixture regression suite from design-extract` (`dface47`)

---

## Task 9: Rule 명세 문서

### 9-1. `docs/paper-normalizer-rules.md` 작성
- [x] 5 카테고리별 표기 차이 표 (Paper / DESIGN.md / CSS / React)
- [x] canonical form (TypeScript interface) 정의
- [x] 변환 예시 표 (입력 → parse → serialize 모든 format 옵션)
- [x] 함수 시그니처 + 룰 6 종 카테고리당 평균
- [x] 호출 패턴 + LLM agent 사용 가이드 (prose → 표준 CSS string 변환)
- [x] Out of Scope + 향후 확장 후보 (Icebox)
- [x] 모든 변환 예시가 실제 코드 동작과 1:1 일치 확인 (테스트와 대조)
- [x] Commit: `docs(spec-6-02): add paper-normalizer rule specification` (`8f8898a`)

---

## Task 10: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [x] 타입 체크: `pnpm exec tsc --noEmit --ignoreDeprecations 6.0` — 0 errors
- [x] 전체 테스트: `pnpm exec vitest run` — 36 files / **203 tests PASS** (기존 116 + 신규 paper-normalizer 87)
- [x] 외부 영향 grep: 본 spec 은 라이브러리 신설만, 외부 호출 0 (의도)
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-6-02): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-6-02-paper-normalizer`
- [x] **PR 생성**: `gh pr create --base phase-6-studio-v1 ...`
- [x] **사용자 알림**: PR URL 보고 + merge 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (Pre-flight 제외) |
| **예상 commit 수** | 10 (1 scaffold + 1 dep + 5 카테고리 + 1 fixture + 1 rule doc + 1 ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-09 |
