# Walkthrough: spec-6-02

> 본 문서는 *작업 기록* 입니다. 결정 과정, 사용자 협의, 검증 결과를 미래의 자신과 리뷰어에게 남깁니다.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 함수 시그니처 (Q1) | (a) string→string / (b) parse/serialize 페어 | **(b)** | structured object 가 testability + 정합성 검증 강함. 토큰 편집기 등에서 객체 형태 활용 |
| 에러 처리 (Q2) | (a) throw / (b) Result / (c) null | **(a) throw** | 가장 단순. 호출부 try/catch. Result boilerplate 부담 없음 |
| color 의존성 (Q3) | (a) 순수 정규식 / (b) culori | **(b) culori** | OKLCH 정확성, spec-6-07 토큰 편집기에서도 재사용. ~30 KB 가치 있음 |
| facade (Q4) | (a) 5 함수만 / (b) facade 포함 | **(a) 5 함수만** | 호출 패턴이 명확해질 때 (spec-6-04 이후) 추가. YAGNI |
| fixture 검증 (Q5) | (a) 명시 expected / (b) snapshot | **(a) 명시 expected** | 변환 의도가 코드에서 직접 읽힘 (snapshot 은 회귀만 잡고 의도 불명) |
| 산출물 — rule 문서 | (a) studio/src/lib/paper-normalizer/RULES.md / (b) docs/paper-normalizer-rules.md | **(b) docs/** | 사용자 요청 — 다른 도구 / Blueprint UI / agent prompt 가 import / 인용 가능. studio repo 한정 아님 |
| Task 6 (font-fallback) round-trip 정의 | "문자열 정확 일치" / "값 등가, quote 정규화 허용" | "값 등가, quote 정규화 허용" | 단어 1개 영문 family 는 unquote 가 정상. 첫 작성 후 1 case 실패 → 정의 보강 |
| C2 padding 의 prose 표기 (`×` separator) | (a) 라이브러리 합류 / (b) Out of Scope | **(b) Out of Scope** | DESIGN.md prose extraction 은 별도 spec. 본 라이브러리는 표준 CSS string 만 다룸 |
| C5 border 의 longhand prefix (`border-bottom`) | (a) 합류 / (b) Out of Scope | **(b) Out of Scope** | 호출 전 shorthand 변환 책임 — 본 라이브러리는 `width style? color` 형태만 |

## 💬 사용자 협의

- **주제**: 시간 위장 (-1h) 룰 — 다음 spec 부터 적용 여부
  - **사용자 의견**: "커밋은 -1 룰은 삭제"
  - **합의**: spec-6-02 부터 자연 시각으로 commit. spec-6-01 한정 일회성 정책.

- **주제**: archive 처리 시점
  - **사용자 의견**: "아카이브는 phase 시작 전에 하자 지금은 spec 에 집중해"
  - **합의**: phase-6 진행 중에는 archive 보류. 다음 phase (phase-7) 시작 전 일괄.

- **주제**: Q1~Q5 결정
  - **사용자 의견**: "권장대로"
  - **합의**: parse/serialize 페어 / throw on invalid / culori / facade 없음 / 명시 expected.

- **주제**: 룰 문서 산출물
  - **사용자 의견**: "룰이 정해진거라면 문서 남겨서 출 취합할때 이용할 수 있어야 함"
  - **합의**: `docs/paper-normalizer-rules.md` 신규 — 5 카테고리 룰 명세 + 변환 예시 + 호출 패턴 + LLM agent 사용 가이드 (prose → 표준 CSS string 변환). 다른 도구 / Blueprint UI / agent prompt 모두 동일 reference.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트

- **명령**: `pnpm exec vitest run` (studio/)
- **결과**: ✅ Passed (**203 tests in 36 files / 3.26 s**)
- **로그 요약**:

```text
 RUN  v4.1.5 /Users/dennis/Project/Design/studio
 Test Files  36 passed (36)
      Tests  203 passed (203)
   Start at  10:37:20
   Duration  3.26s
```

- **paper-normalizer 단위 테스트**: 87 case (5 카테고리 6 파일)
  - hex-alpha: 13 / padding: 17 / line-height: 15 / font-fallback: 15 / border: 13 / fixture-regression: 14
- **기존 회귀**: spec-6-01 의 116 case 모두 PASS 유지

#### TypeScript

- **명령**: `pnpm exec tsc --noEmit --ignoreDeprecations 6.0`
- **결과**: ✅ 통과 (오류 0)

### 2. 통합 테스트 (Integration Test Required = no)

해당 없음 — 단위 테스트 + fixture 회귀로 충분.

### 3. 수동 검증

1. **Action**: `grep "sidebar-width" studio/src/styles/_tokens-light.css`
   - **Result**: 직전 spec-6-01 의 `--sidebar-width: 240px` 그대로 — 본 spec 영향 없음.
2. **Action**: `git diff --stat phase-6-studio-v1..HEAD`
   - **Result**: 21 files / +1876 -1. 라이브러리 코드 + 6 테스트 파일 + rule 문서 + spec 산출물.
3. **Action**: `git log --oneline phase-6-studio-v1..HEAD`
   - **Result**: 9 commit (scaffold + dep + 5 카테고리 + fixture + rule doc). 자연 시각 (10:30~10:37 KST) — 시간 위장 정책 폐기 적용 확인.

## 🔍 발견 사항

- **culori 의 `parse(...)` API 가 fallback 에 적합**: `oklch(...)` / `lab(...)` 등 다양한 CSS 색 형식을 single-call 로 처리. 정규식 매칭이 빠지는 형식만 culori 로 위임 — 빠른 hot path 와 fallback 분리.
- **DESIGN.md prose 의 `×` separator (예: `padding 20×22`)** 가 5 fixture 페이지에 다수 등장하나 본 라이브러리 Out of Scope. 다음 spec 또는 Studio import 단계에서 표준 CSS string 으로 변환 책임. rule 문서에 명시.
- **font-fallback round-trip 정의 보강**: 첫 작성 시 "문자열 정확 일치" 로 작성했으나 단어 1개 영문 가족명 (예: `Inter`) 은 unquote 가 정상 — round-trip 정의를 "값 등가, quote 정규화 허용" 으로 수정 (Task 6 1 case 실패 → 보강). 실수가 아닌 *룰 정합화* 사례.
- **Border serialize 의 color 형식이 `hex` (alpha 손실)**: 의도. shadow 등 alpha 보존이 필요한 호출은 `parseHexAlpha` + `serializeHexAlpha(_, 'hex-alpha')` 별도 사용. rule 문서에 명시.
- **C3 line-height fixture 누락**: design-extract 5 페이지에 line-height 직접 표기가 거의 없음. 단위 테스트로 충분히 커버됨 (15 case).

## 🚧 이월 항목

- **shadow 정규화** → queue.md Icebox `phase-6 이월 follow-ups` 향후 등재 후보.
- **gradient / transform 정규화** → 동일.
- **OKLCH gamut mapping 정확성 검증 (research spec)** → 동일.
- **prose 표기 추출기** (`×` separator, longhand prefix `border-bottom` 등) → 별도 spec — Studio import 단계 또는 Blueprint UI 의 input parser.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성일** | 2026-05-09 |
| **최종 commit** | `8f8898a` (ship commit 직전) |
| **commit timestamp 정책** | 자연 시각 (시간 위장 룰 spec-6-01 한정 — 본 spec 부터 폐기) |
