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
- [ ] `git checkout -b spec-6-02-paper-normalizer` (base: `phase-6-studio-v1`)
- [ ] `git add backlog/phase-6.md backlog/queue.md specs/spec-6-02-paper-normalizer/`
- [ ] Commit: `docs(spec-6-02): scaffold spec/plan/task for paper-normalizer`

---

## Task 2: 의존성 추가 (`culori`)

### 2-1. culori 설치 + types
- [ ] `cd studio && pnpm add culori`
- [ ] `cd studio && pnpm add -D @types/culori`
- [ ] `package.json` / `pnpm-lock.yaml` 변경 확인
- [ ] (검증) `import { converter } from "culori"` 가 컴파일 통과하는 빈 .ts 파일로 quick check
- [ ] Commit: `chore(spec-6-02): add culori dependency for color normalization`

---

## Task 3: `parseHexAlpha` / `serializeHexAlpha` (C1 — color)

### 3-1. types.ts + hex-alpha.ts + 단위 테스트
- [ ] `studio/src/lib/paper-normalizer/types.ts` — `HexAlpha` interface 정의 + (placeholder for 나머지 4 카테고리)
- [ ] `studio/src/lib/paper-normalizer/hex-alpha.ts` — `parseHexAlpha`, `serializeHexAlpha` 구현
- [ ] `studio/src/lib/paper-normalizer/index.ts` — re-export
- [ ] `studio/src/lib/paper-normalizer/__tests__/hex-alpha.test.ts` — 정상 케이스 (6-hex / 8-hex / rgba / rgb / oklch) + 경계 (잘못된 입력 throw) + round-trip
- [ ] `pnpm typecheck` PASS / `pnpm exec vitest run hex-alpha` PASS
- [ ] Commit: `feat(spec-6-02): implement hex-alpha parse/serialize (color C1)`

---

## Task 4: `parsePadding` / `serializePadding` (C2 — padding)

### 4-1. padding.ts + 단위 테스트
- [ ] `types.ts` — `Padding` interface 추가
- [ ] `padding.ts` — shorthand parse (1/2/3/4 값 모두 지원), inline-only prefix (`padding-inline X`) 지원
- [ ] `index.ts` — re-export
- [ ] `__tests__/padding.test.ts` — shorthand 1/2/3/4-value + inline-only + 경계 + round-trip
- [ ] `pnpm typecheck` PASS / `pnpm exec vitest run padding` PASS
- [ ] Commit: `feat(spec-6-02): implement padding parse/serialize (C2)`

---

## Task 5: `parseLineHeight` / `serializeLineHeight` (C3 — line-height)

### 5-1. line-height.ts + 단위 테스트
- [ ] `types.ts` — `LineHeight` discriminated union 추가
- [ ] `line-height.ts` — px / unitless / percent 3 단위 + `toPx(v, fontSize)` / `toUnitless(v, fontSize)` utility
- [ ] `index.ts` — re-export
- [ ] `__tests__/line-height.test.ts` — 3 단위 + 변환 utility + 경계 + round-trip
- [ ] `pnpm typecheck` PASS / `pnpm exec vitest run line-height` PASS
- [ ] Commit: `feat(spec-6-02): implement line-height parse/serialize (C3)`

---

## Task 6: `parseFontFallback` / `serializeFontFallback` (C4 — font fallback)

### 6-1. font-fallback.ts + 단위 테스트
- [ ] `types.ts` — `FontFallback` interface 추가
- [ ] `font-fallback.ts` — quote 정규화 (single quote 강제), fallback 분리, generic family 추출 + 보강 (누락 시 `'sans-serif'` 기본)
- [ ] `index.ts` — re-export
- [ ] `__tests__/font-fallback.test.ts` — quote 변형 + fallback 순서 + generic 누락 케이스 + round-trip
- [ ] `pnpm typecheck` PASS / `pnpm exec vitest run font-fallback` PASS
- [ ] Commit: `feat(spec-6-02): implement font-fallback parse/serialize (C4)`

---

## Task 7: `parseBorder` / `serializeBorder` (C5 — border)

### 7-1. border.ts + 단위 테스트
- [ ] `types.ts` — `Border` interface 추가
- [ ] `border.ts` — shorthand (`width style color`) + style 생략 케이스 (`width color` → style null → serialize 시 `solid` 기본)
- [ ] `index.ts` — re-export
- [ ] `__tests__/border.test.ts` — shorthand 정상 + style 생략 + width-only 거부 + round-trip
- [ ] `pnpm typecheck` PASS / `pnpm exec vitest run border` PASS
- [ ] Commit: `feat(spec-6-02): implement border parse/serialize (C5)`

---

## Task 8: Fixture 회귀 테스트

### 8-1. design-extract 5 페이지 명시 expected 회귀
- [ ] `__tests__/fixture-regression.test.ts` — `poc/app-a/design-extract/` 5 페이지 (auth-login / auth-signup / dash-overview / profile-mypage / settings-overview) 각각에서 발견된 카테고리별 표기를 명시 expected 와 함께 round-trip 검증
- [ ] 페이지당 발견된 카테고리에 대해 1+ case (총 ~15+ case)
- [ ] `pnpm exec vitest run fixture-regression` PASS
- [ ] Commit: `test(spec-6-02): add fixture regression suite from design-extract`

---

## Task 9: Rule 명세 문서

### 9-1. `docs/paper-normalizer-rules.md` 작성
- [ ] 5 카테고리별 표기 차이 표 (Paper / DESIGN.md / CSS / React)
- [ ] canonical form 정의
- [ ] 변환 예시 (정상 + 경계)
- [ ] 함수 매핑 (`parse*` / `serialize*` 호출 가이드)
- [ ] 다른 도구 참조 가이드 (Studio export / Blueprint UI / agent prompt 인용 시점)
- [ ] 모든 변환 예시가 실제 코드와 1:1 일치 확인 (수동)
- [ ] Commit: `docs(spec-6-02): add paper-normalizer rule specification`

---

## Task 10: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 타입 체크: `pnpm exec tsc --noEmit --ignoreDeprecations 6.0`
- [ ] 전체 테스트: `pnpm exec vitest run` — 기존 116 + 신규 paper-normalizer ~50 case 모두 PASS
- [ ] 외부 영향 grep: `git grep "paper-normalizer" studio/src` (의도된 import 만 존재 확인 — 본 spec 에선 외부 호출 0 가정)
- [ ] **walkthrough.md 작성** (각 task 의 변경 / 측정 / 의사결정)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-6-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-6-02-paper-normalizer`
- [ ] **PR 생성**: `gh pr create --base phase-6-studio-v1 ...`
- [ ] **사용자 알림**: PR URL 보고 + merge 대기

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (Pre-flight 제외) |
| **예상 commit 수** | 10 (1 scaffold + 1 dep + 5 카테고리 + 1 fixture + 1 rule doc + 1 ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-09 |
