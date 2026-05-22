# feat(spec-6-02): paper-normalizer 라이브러리 (5 카테고리 정규화)

> phase-6 의 두 번째 spec (Track B 두 번째 전제 조건). Paper ↔ DESIGN.md ↔ React/CSS 사이 표기 차이 5 카테고리를 단일 정규화 라이브러리로 통일. Studio 자동 코드 생성 (spec-6-04 이후), Blueprint UI (spec-6-05), 토큰 편집기 (spec-6-07) 의 빌딩 블록.

## 📋 Summary

### 배경 및 목적

phase-5 회고 (`docs/poc-retro.md` §3.3 TODO-02 + C-07 / F-08) 가 식별한 표기 차이 5 카테고리:

| ID | 카테고리 | 통증 |
|---|---|---|
| C1 | hex / hex-alpha / rgba / oklch | 같은 색이 3+ 표기로 등장 — 등가 비교 / diff 어려움 |
| C2 | padding (shorthand / logical / inline-only) | 동일 의미 4+ 표기 |
| C3 | line-height (px / unitless / percent) | 컴포넌트마다 다른 단위 |
| C4 | font fallback (quote / generic 누락) | 다른 환경에서 fallback 미적용 위험 |
| C5 | border (shorthand / longhand / style 생략) | React inline style 직역 시 깨짐 |

5 카테고리 × parse/serialize = **10 함수** + typed object 5 종 + 변환 utility 2 (`toPx` / `toUnitless`) 를 `studio/src/lib/paper-normalizer/` 에 신설.

### 주요 변경 사항

- [x] **C1 hex-alpha**: 6-hex / 8-hex / rgb / rgba / oklch 입력 → `HexAlpha { r, g, b, a }`. `culori` 위임으로 OKLCH 처리. serialize 형식: `hex` / `hex-alpha` / `rgba`.
- [x] **C2 padding**: shorthand 1~4 value + `padding-inline X` / `padding-block X` keyword 변형 → `Padding { block: { start, end }, inline: { start, end } }`. serialize 자동 단축 + `logical` / `physical` 옵션.
- [x] **C3 line-height**: 3 단위 (px / unitless / percent) discriminated union. `toPx(v, fontSize)` / `toUnitless(v, fontSize)` 변환 utility.
- [x] **C4 font fallback**: quote 정규화 (단어 1개 영문 unquote / 공백 포함 single quote) + generic family 추출 + 누락 시 `'sans-serif'` 보강.
- [x] **C5 border**: shorthand width/style/color 분해. style 누락 시 null 보존, serialize 시 `'solid'` 기본.
- [x] **`docs/paper-normalizer-rules.md`** 신설 — 5 카테고리 룰 명세 + 변환 예시 + 호출 패턴 + LLM agent 사용 가이드. 다른 도구·Blueprint UI·agent prompt 가 추출·취합 시 동일 룰로 작동하도록 *contract*.
- [x] **fixture 회귀 테스트**: `poc/app-a/design-extract/` 5 페이지에서 관찰된 표기 (회고 예시: `#4F46E52E`, `rgba(79, 70, 229, 0.18)`, `padding-inline 14px`, `border 1px #E2E8F0` 등) 명시 expected 와 함께 round-trip 검증.
- [x] **`culori` 의존성 추가** (^4.0.2, ~30 KB). spec-6-07 토큰 편집기에서 재사용 예정.

### Phase 컨텍스트

- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: Track B 두 번째 전제 조건. 다음 Track B (`spec-6-03` Blueprint protocol 정합화), Track A (`spec-6-04` Studio 앱 셋업 ~ `spec-6-08` export), Track B 마지막 (`spec-6-09` Paper sync PoC) 의 자동화 빌딩 블록 제공. 룰 문서가 다른 도구·agent 의 추출·취합 reference 역할.

## 🎯 Key Review Points

1. **rule 문서 (`docs/paper-normalizer-rules.md`) 의 contract 역할**: 5 카테고리별 표기 차이 표 + canonical form + 변환 예시 + Out of Scope. 사용자 요청 ("출 취합 시 이용 가능") 직역.
2. **culori 의존성 도입**: 색상 변환에 한정. 정규식 hot path + culori fallback 분리로 성능 영향 최소화. spec-6-07 토큰 편집기에서 재사용 명시.
3. **prose 표기 (× separator, longhand prefix) 의 Out of Scope 결정**: 본 라이브러리는 표준 CSS string 입력만 다룸. DESIGN.md prose extraction 은 별도 spec (Studio import 단계 또는 Blueprint UI input parser) 책임 — rule 문서에 명시.
4. **font-fallback round-trip 정의**: "값 등가, quote 정규화 허용" — 단어 1개 영문 가족명 (예: `Inter`) 은 unquote 가 canonical. 첫 작성 시 "문자열 정확 일치" 로 정의했다가 1 case 실패 → 정의 보강. 실수가 아닌 *룰 정합화*.
5. **Border serialize 의 color 형식 = `hex` (6-hex)**: alpha 손실 의도. shadow 등 alpha 보존 필요 시 `serializeHexAlpha(v.color, 'hex-alpha')` 별도 호출. rule 문서에 명시.
6. **fixture 회귀 14 case**: 회고 (`docs/poc-retro.md`) 의 모든 hex-alpha / rgba / padding-inline / border-style-생략 예시가 정합 변환 확인.

## 🧪 Verification

### 자동 테스트

```bash
cd studio
pnpm exec tsc --noEmit --ignoreDeprecations 6.0   # ✅ 0 errors
pnpm exec vitest run                               # ✅ 36 files / 203 tests PASS
```

**결과 요약**:
- ✅ paper-normalizer 87 case (5 카테고리 6 파일):
  - hex-alpha 13 / padding 17 / line-height 15 / font-fallback 15 / border 13 / fixture-regression 14
- ✅ 기존 회귀 116 case (spec-6-01 정합화) 모두 유지
- ✅ tsc 0 errors

### 수동 검증 시나리오

1. **fixture 표기 round-trip**: `#4F46E52E` ↔ `rgba(79, 70, 229, 0.18)` 등가, `#0F172A0A` 8-hex round-trip, `padding-inline 14px` 표준화.
2. **rule 문서 ↔ 코드 1:1 일치**: rule 문서의 모든 변환 예시 표가 실제 테스트와 동일 expected.
3. **culori OKLCH 변환**: `parseHexAlpha("oklch(0.7 0.15 250)")` 정상 sRGB clip.

## 📦 Files Changed

### 🆕 New Files

**Library**
- `studio/src/lib/paper-normalizer/types.ts`: 5 typed object (HexAlpha / Padding / LineHeight / FontFallback / Border)
- `studio/src/lib/paper-normalizer/hex-alpha.ts`: parseHexAlpha + serializeHexAlpha (3 format)
- `studio/src/lib/paper-normalizer/padding.ts`: parsePadding + serializePadding (3 format, 자동 단축)
- `studio/src/lib/paper-normalizer/line-height.ts`: parseLineHeight + serializeLineHeight + toPx + toUnitless
- `studio/src/lib/paper-normalizer/font-fallback.ts`: parseFontFallback + serializeFontFallback (quote 정규화 + generic 보강)
- `studio/src/lib/paper-normalizer/border.ts`: parseBorder + serializeBorder (style 보강)
- `studio/src/lib/paper-normalizer/index.ts`: 단일 진입점 re-export

**Tests**
- `studio/src/lib/paper-normalizer/__tests__/hex-alpha.test.ts` (13 case)
- `studio/src/lib/paper-normalizer/__tests__/padding.test.ts` (17 case)
- `studio/src/lib/paper-normalizer/__tests__/line-height.test.ts` (15 case)
- `studio/src/lib/paper-normalizer/__tests__/font-fallback.test.ts` (15 case)
- `studio/src/lib/paper-normalizer/__tests__/border.test.ts` (13 case)
- `studio/src/lib/paper-normalizer/__tests__/fixture-regression.test.ts` (14 case)

**Documentation**
- `docs/paper-normalizer-rules.md`: 5 카테고리 룰 명세 + 변환 예시 + 호출 패턴 + LLM agent 가이드 (306 lines)

**Spec artifacts**
- `specs/spec-6-02-paper-normalizer/spec.md` / `plan.md` / `task.md` / `walkthrough.md` / `pr_description.md`

### 🛠 Modified Files

- `studio/package.json` (+`culori`, +`@types/culori` devDep)
- `pnpm-lock.yaml` (자동 갱신)
- `backlog/phase-6.md` (sdd:specs 표 자동 갱신)
- `backlog/queue.md` (active spec 자동 갱신)

**Total**: 21 files changed (+1876, -1)

## ✅ Definition of Done

- [x] 5 카테고리 × parse/serialize = 10 함수 + typed object 5 종 + utility 2 모두 export
- [x] 모든 단위 테스트 PASS (203/203)
- [x] Fixture 회귀 PASS (`poc/app-a/design-extract/` 5 페이지)
- [x] TypeScript 통과 (0 errors)
- [x] `docs/paper-normalizer-rules.md` 작성
- [x] `culori` 의존성 추가 + lock 갱신
- [x] `walkthrough.md` 와 `pr_description.md` 작성 + ship commit
- [x] `spec-6-02-paper-normalizer` 브랜치 push
- [x] PR 생성 (target: `phase-6-studio-v1`)
- [x] 사용자 검토 요청 알림

## 🔗 관련 자료

- Phase: `backlog/phase-6.md`
- 회고 출처: `docs/poc-retro.md` §3.3 TODO-02 + §F-08
- 룰 명세: `docs/paper-normalizer-rules.md`
- Walkthrough: `specs/spec-6-02-paper-normalizer/walkthrough.md`
- 직전 spec: `spec-6-01` (Studio API 정합화) — 머지 완료
