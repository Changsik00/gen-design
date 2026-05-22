# spec-6-02: paper-normalizer 라이브러리 (5 카테고리 정규화 함수)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-6-02` |
| **Phase** | `phase-6` |
| **Branch** | `spec-6-02-paper-normalizer` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-09 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- phase-5 회고 (`docs/poc-retro.md` §3.3 TODO-02 + C-07 / F-08) 가 식별: Paper export ↔ DESIGN.md ↔ React/CSS 사이 표기 차이 5 카테고리 가 ad-hoc 변환 상태.
- spec-5-02 의 `poc/app-a/design-extract/` 5 페이지 (auth-login / auth-signup / dash-overview / profile-mypage / settings-overview) 에 실제 표기 예시 다수 — 동일 의미가 페이지마다 다른 표기로 기록 (예: `padding 40px` vs `padding 20×22` vs `padding-inline 14`, `#4F46E52E` vs `rgba(79, 70, 229, 0.18)`).
- phase-6 의 자동 코드 생성 (spec-6-04 이후), Blueprint UI (spec-6-05), 토큰 편집기 (spec-6-07) 모두 동일 정규화 룰을 필요로 함.

### 문제점

| 카테고리 | 표기 예시 (관찰) | 통증 |
|---|---|---|
| **C1: hex alpha / rgba** | `#4F46E52E`, `rgba(79, 70, 229, 0.18)`, `oklch(...)` | 같은 색이 3 가지 표기로 등장 — 등가 비교 / diff / 포맷 강제 어려움 |
| **C2: padding** | `padding 40px`, `padding 20×22`, `padding 28×40 / 40×40`, `padding-inline 14` | 단일값 ↔ block/inline ↔ variant 별 ↔ inline only — 동일 의미 4 표기 |
| **C3: line-height** | px / unitless / % | 컴포넌트마다 다른 단위로 기록 — CSS 표준화 시 단위 통일 필요 |
| **C4: font fallback** | `'Inter', system-ui, sans-serif`, `Inter, system-ui` 등 | quote / fallback 순서 / generic family 누락 — 다른 환경에서 fallback 미적용 위험 |
| **C5: border** | `border 1 #E2E8F0`, `border 1px #E2E8F0`, `border 1px solid #E2E8F0` | shorthand vs longhand 혼용 — React inline style 으로 직역 시 깨짐 |

### 해결 방안 (요약)

5 카테고리별로 **parse / serialize 페어** 함수를 제공하는 단일 라이브러리 (`studio/src/lib/paper-normalizer/`) 를 만든다. 각 함수는 표준 CSS-like string 입력을 받아 typed structured object 로 parse 하고, 그 객체를 canonical CSS string 으로 serialize 한다. 변환 룰은 `docs/paper-normalizer-rules.md` 에 명세되어 다른 도구 (Studio export, Blueprint UI, agent prompts) 가 동일 룰로 추출·취합 가능하도록 한다.

## 📊 개념도

```mermaid
flowchart LR
  subgraph "입력 (다양한 표기)"
    I1[Paper export]
    I2[DESIGN.md prose]
    I3[React inline style]
    I4[tokens.json $value]
  end
  subgraph "paper-normalizer"
    P1[parseHexAlpha / parsePadding<br/>parseLineHeight / parseFontFallback / parseBorder]
    P2[(structured objects)]
    P3[serializeHexAlpha / ...]
  end
  subgraph "산출"
    O1[canonical CSS]
    O2[typed object]
    O3[다른 표기 (변환)]
  end
  I1 --> P1
  I2 --> P1
  I3 --> P1
  I4 --> P1
  P1 --> P2 --> P3 --> O1
  P2 --> O2
  P3 --> O3
```

## 🎯 요구사항

### Functional Requirements

1. **C1 — `parseHexAlpha` / `serializeHexAlpha`**: 6-hex (`#RRGGBB`), 8-hex (`#RRGGBBAA`), `rgba(r, g, b, a)`, `rgb(r, g, b)`, `oklch(...)` 모두 입력 가능. structured object: `{ r, g, b, a }` (0~255 r/g/b, 0~1 a). serialize 옵션: `'hex' | 'hex-alpha' | 'rgba'` (oklch 는 culori 활용).
2. **C2 — `parsePadding` / `serializePadding`**: CSS shorthand (`"40px"`, `"20px 16px"`, `"8px 16px 12px 24px"`) 또는 keyword 형태 (`"padding-inline 14px"` 단순 케이스) 입력. structured object: `{ block: { start, end }, inline: { start, end } }` (각 px number). serialize 옵션: `'shorthand' | 'logical' | 'physical'`.
3. **C3 — `parseLineHeight` / `serializeLineHeight`**: `"24px"`, `"1.5"`, `"150%"` 입력. structured object: `{ value, unit: 'px' | 'unitless' | 'percent' }`. serialize 는 입력 unit 보존 + 변환 옵션 (`toPx(fontSize)` / `toUnitless(fontSize)`).
4. **C4 — `parseFontFallback` / `serializeFontFallback`**: `"'Inter', system-ui, sans-serif"` 등 입력. structured object: `{ primary: string, fallbacks: string[], generic: 'sans-serif' | 'serif' | 'monospace' | null }`. serialize: quote 일관 (single quote 강제) + generic 필수 보강.
5. **C5 — `parseBorder` / `serializeBorder`**: shorthand (`"1px solid #E2E8F0"`) / longhand 일부 (`"1px #E2E8F0"` width+color, style 생략) 입력. structured object: `{ width: number, style: 'solid' | 'dashed' | 'dotted' | null, color: HexAlpha }`. serialize: shorthand 강제 (`width style color` 순), style 누락 시 `solid` 기본.
6. **단위 테스트**: 각 함수당 정상 케이스 3+, 경계 케이스 2+ (잘못된 입력 시 `throw`), round-trip (parse → serialize → parse 동일성) 테스트 1+.
7. **Fixture 회귀 테스트**: `poc/app-a/design-extract/` 5 페이지 에서 추출한 CSS-like string 을 명시 expected 와 함께 테스트 — 페이지당 카테고리 발견 시점마다 1 case.
8. **룰 명세 문서 (`docs/paper-normalizer-rules.md`)**: 5 카테고리별 룰 표 + 변환 예시 + 사용 가이드. 다른 도구 / agent prompt / Blueprint UI 가 추출·취합 시 이 문서 기준으로 작동.

### Non-Functional Requirements

1. **TypeScript**: `pnpm typecheck` PASS. 모든 함수가 구체 타입 (interface) 으로 export.
2. **단위 테스트**: `pnpm test` 전수 PASS. 카테고리 5 × 함수 2 (parse/serialize) × 평균 4 케이스 = ~40 케이스.
3. **외부 의존성 1 추가** (Q3 결정): `culori` (~30 KB) — color 변환 (oklch ↔ rgb / hex). `pnpm add culori @types/culori`.
4. **No facade**: 5 함수만 export. high-level facade (`normalizeAll(designExtractText)`) 는 spec-6-04 이후 추가.
5. **순수 함수**: 부작용 없음. 잘못된 입력 시 `throw new Error(...)` (Q2).

## 🚫 Out of Scope

- **DESIGN.md prose 에서 자유 표기 추출** (예: `"padding 28×40 / 40×40"` 의 `×` separator 직접 parse) — 본 spec 은 표준화된 CSS string 만 입력. 추출은 별도 spec (Studio import 단계 또는 Blueprint UI).
- **High-level facade** (`normalizeAll(...)`) — spec-6-04 이후 호출 패턴이 명확해질 때.
- **Paper Variable API 호출 / Paper screenshot wrapper** — `spec-6-09`.
- **5 카테고리 외 정규화** (shadow, gradient, transform 등) — 발견 시 별도 spec (queue.md Icebox).
- **i18n / a11y 정규화** — 본 spec 은 시각 표기 한정.
- **`oklch → hex` 의 perceptual gamut mapping 정확성 검증** — culori 의 기본 동작 채택. 정확성 검증은 별도 research spec 후보.

## 🔍 Critique 결과 (선택)

> `/hk-spec-critique` 미실행. 본 spec 은 명세가 5 카테고리로 매우 명확하고 input/output 이 typed object 라 구조적 모호성이 적음. 다만 Q1~Q5 결정 (parse/serialize, throw, culori, facade 없음, 명시 expected) 은 사용자와 협의 완료. 추가 비판 필요 시 Plan Accept 전 호출 가능.

## ✅ Definition of Done

- [ ] 5 카테고리 × parse/serialize = 10 함수 + typed object 정의 모두 export
- [ ] 모든 단위 테스트 PASS (목표 ~40 case)
- [ ] Fixture 회귀 테스트 PASS (`poc/app-a/design-extract/` 5 페이지)
- [ ] TypeScript 통과 (`pnpm exec tsc --noEmit`)
- [ ] **`docs/paper-normalizer-rules.md` 작성** — 5 카테고리 룰 명세 + 변환 예시
- [ ] `culori` 의존성 추가 + `pnpm-lock.yaml` 갱신
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-6-02-paper-normalizer` 브랜치 push 완료
- [ ] PR 생성 (target: `phase-6-studio-v1`)
- [ ] 사용자 검토 요청 알림 완료
