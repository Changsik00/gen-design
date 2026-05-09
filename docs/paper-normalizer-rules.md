# paper-normalizer Rule Specification

> Paper ↔ DESIGN.md ↔ React/CSS 사이 표기 차이 5 카테고리의 정규화 룰 명세.
> 본 문서는 `studio/src/lib/paper-normalizer/` 의 동작 계약 (contract) 이며, 다른 도구·Blueprint UI·agent prompt 가 추출·취합 시 동일 룰로 작동하도록 한다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **소속 spec** | `spec-6-02` |
| **라이브러리 위치** | `studio/src/lib/paper-normalizer/` |
| **버전** | 1.0 (5 카테고리 — color / padding / line-height / font-fallback / border) |
| **외부 의존성** | `culori` (color 변환) |
| **에러 처리 정책** | 잘못된 입력 시 `throw new Error(...)` (Q2 결정) |
| **함수 시그니처** | `parse*` / `serialize*` 페어 (Q1 결정) |
| **facade** | 없음 (Q4) — 5 카테고리 직접 호출 |

## 📌 사용 가이드 — 누가 언제 호출하는가

| 호출 시점 | 함수 | 목적 |
|---|---|---|
| **Studio import** (DESIGN.md / Paper export 읽기) | `parse*` 5 종 | 외부 표기 → typed object |
| **Studio export** (코드/Markdown 생성) | `serialize*` 5 종 | typed object → canonical CSS string |
| **Blueprint UI input 정규화** | `parse*` + `serialize*` round-trip | 사용자 입력의 다양한 표기를 표준화 |
| **agent prompt 인용** | 본 문서 + 함수 docstring | LLM 이 추출 시 동일 룰 따르도록 reference |
| **토큰 편집기 (`spec-6-07`)** | `parseHexAlpha` / `serializeHexAlpha` | 색상 피커 출력 OKLCH ↔ hex 변환 |

## 🚫 본 라이브러리 Out of Scope

- **DESIGN.md prose 의 자유 표기 추출** — 예: `padding 20×22` (× separator), `border-bottom 1px` (longhand prefix), `padding 28×40 / 40×40` (variant). 추출은 별도 spec (Studio import 단계 또는 Blueprint UI).
- **5 카테고리 외 표기** — shadow, gradient, transform 등. 발견 시 별도 spec 으로 promote (queue.md Icebox).
- **High-level facade** (`normalizeAll(...)`) — `spec-6-04` 이후 호출 패턴이 명확해질 때.

---

## §C1 — color (hex / hex-alpha / rgba / oklch)

### 표기 차이 표

| Source | 표기 예시 |
|---|---|
| **Paper export** | `oklch(0.6 0.18 270)`, `rgba(79, 70, 229, 0.18)` |
| **DESIGN.md (회고 fixture)** | `#4F46E5`, `#4F46E52E`, `rgba(79, 70, 229, 0.18)` |
| **CSS / React inline** | 모든 형식 가능 |
| **tokens.json `$value`** | `#4F46E5` (6-hex 권장) |

### Canonical Form

```typescript
interface HexAlpha { r: number; g: number; b: number; a: number; }
// r/g/b: 0~255 정수, a: 0~1 실수
```

### 변환 예시

| 입력 | parse 결과 | serialize (`hex-alpha`) | serialize (`hex`) | serialize (`rgba`) |
|---|---|---|---|---|
| `#4F46E5` | `{ r:79, g:70, b:229, a:1 }` | `#4F46E5FF` | `#4F46E5` | `rgba(79, 70, 229, 1)` |
| `#4F46E52E` | `{ r:79, g:70, b:229, a:0.18 }` | `#4F46E52E` | `#4F46E5` | `rgba(79, 70, 229, 0.18)` |
| `rgba(79, 70, 229, 0.18)` | `{ r:79, g:70, b:229, a:0.18 }` | `#4F46E52E` | `#4F46E5` | `rgba(79, 70, 229, 0.18)` |
| `oklch(0.7 0.15 250)` | culori 변환 (sRGB clip) | (변환된 hex) | (변환된 hex) | (변환된 rgba) |

### 함수

- `parseHexAlpha(input: string): HexAlpha` — throw on invalid
- `serializeHexAlpha(v: HexAlpha, format: 'hex' | 'hex-alpha' | 'rgba' = 'hex-alpha'): string`

### 룰

1. **6-hex 입력 → `a = 1`**.
2. **8-hex 입력 → `a = HH / 255`**.
3. **rgba alpha 는 0~1 실수 그대로**.
4. **OKLCH 등 다른 CSS 색은 culori `converter('rgb')` 로 sRGB clip 후 → 0~255 정수**.
5. **잘못된 입력은 `throw new Error("parseHexAlpha: 알 수 없는 색 표기 — \"...\"")`**.
6. **serialize 시 8-hex 의 alpha 가 정확 round-trip 안 될 수 있음** (예: 0.18 → 0x2E ≈ 0.180392) — fixture 회귀에서 `toBeCloseTo` 사용.

---

## §C2 — padding

### 표기 차이 표

| Source | 표기 예시 |
|---|---|
| **Paper export** | `padding: 8px 16px` (CSS shorthand) |
| **DESIGN.md (회고 fixture)** | `padding 20×22` (×), `padding-inline 14`, `padding 28×40 / 40×40` (variant) |
| **CSS / React** | shorthand `padding: 8px 16px` 또는 longhand `padding-block` / `padding-inline` |

### Canonical Form

```typescript
interface Padding {
  block: { start: number; end: number };
  inline: { start: number; end: number };
}
// 모두 px number
```

### 변환 예시

| 입력 | parse 결과 | serialize (`shorthand`) | serialize (`logical`) | serialize (`physical`) |
|---|---|---|---|---|
| `40px` | block/inline 모두 40 | `40px` | `padding-block: 40px 40px; padding-inline: 40px 40px;` | `padding: 40px 40px 40px 40px;` |
| `20px 16px` | block 20, inline 16 | `20px 16px` | `padding-block: 20px 20px; padding-inline: 16px 16px;` | `padding: 20px 16px 20px 16px;` |
| `8px 16px 12px` | block.start 8, end 12 / inline 16 | `8px 16px 12px` | `padding-block: 8px 12px; padding-inline: 16px 16px;` | `padding: 8px 16px 12px 16px;` |
| `8px 16px 12px 24px` | block 8/12 / inline (start 24, end 16) | `8px 16px 12px 24px` | `padding-block: 8px 12px; padding-inline: 24px 16px;` | `padding: 8px 16px 12px 24px;` |
| `padding-inline 14px` | block 0/0, inline 14/14 | `0px 14px` | `padding-block: 0px 0px; padding-inline: 14px 14px;` | `padding: 0px 14px 0px 14px;` |

### 함수

- `parsePadding(input: string): Padding`
- `serializePadding(v: Padding, format: 'shorthand' | 'logical' | 'physical' = 'shorthand'): string`

### 룰

1. **CSS shorthand 표준 순서**: 4-value 는 `top right bottom left` (시계방향).
2. **3-value 는 `top inline bottom`** (좌우 동일).
3. **2-value 는 `block inline`**.
4. **1-value 는 모두 동일**.
5. **`padding-inline X` keyword** 단순 prefix 매칭 — block 은 0 으로.
6. **자동 단축 직렬화**: 4 동일 → 1-value, block/inline 그룹 → 2 또는 3-value.
7. **prose 표기 (`×`, `/`)는 Out of Scope** — 호출 전에 표준 CSS string 으로 변환할 것.

---

## §C3 — line-height

### 표기 차이 표

| Source | 표기 예시 |
|---|---|
| **Paper export** | `line-height: 24px` 또는 `line-height: 1.5` |
| **DESIGN.md** | `line-height 24`, `1.5`, `150%` (단위 자유) |
| **CSS** | px / unitless / percent 모두 표준 |

### Canonical Form

```typescript
type LineHeight =
  | { value: number; unit: 'px' }
  | { value: number; unit: 'unitless' }
  | { value: number; unit: 'percent' };
```

### 변환 예시 (fontSize=16 가정)

| 입력 | parse 결과 | serialize | toPx(_, 16) | toUnitless(_, 16) |
|---|---|---|:-:|:-:|
| `24px` | `{ value:24, unit:'px' }` | `24px` | 24 | 1.5 |
| `1.5` | `{ value:1.5, unit:'unitless' }` | `1.5` | 24 | 1.5 |
| `150%` | `{ value:150, unit:'percent' }` | `150%` | 24 | 1.5 |

### 함수

- `parseLineHeight(input: string): LineHeight`
- `serializeLineHeight(v: LineHeight): string` — unit 보존
- `toPx(v: LineHeight, fontSize: number): number` — 절대 px 환산
- `toUnitless(v: LineHeight, fontSize: number): number` — 비율 환산

### 룰

1. **`Xpx` → unit 'px'**.
2. **`X%` → unit 'percent'**.
3. **숫자만 (`X`) → unit 'unitless'** — CSS 표준의 가장 권장 형식.
4. **`em` 등 다른 단위는 throw** — 본 라이브러리 1.0 범위 외.
5. **serialize 는 입력 unit 보존** — 변환은 `toPx` / `toUnitless` 명시 호출.

---

## §C4 — font fallback

### 표기 차이 표

| Source | 표기 예시 |
|---|---|
| **Paper export** | `font-family: Inter, system-ui, sans-serif` |
| **DESIGN.md** | `'Inter', system-ui, sans-serif` (single quote) 또는 `"Inter", ...` (double) |
| **CSS / React** | 자유 — quote / fallback 누락 위험 |

### Canonical Form

```typescript
interface FontFallback {
  primary: string;        // quote 제거된 가족명
  fallbacks: string[];    // 중간 fallback 목록 (quote 제거)
  generic: 'sans-serif' | 'serif' | 'monospace' | null;
}
```

### 변환 예시

| 입력 | parse 결과 | serialize |
|---|---|---|
| `'Inter', system-ui, sans-serif` | `{ primary:'Inter', fallbacks:['system-ui'], generic:'sans-serif' }` | `Inter, system-ui, sans-serif` |
| `Inter, system-ui` (generic 누락) | `{ primary:'Inter', fallbacks:['system-ui'], generic:null }` | `Inter, system-ui, sans-serif` (보강) |
| `'Geist Variable', system-ui, sans-serif` | `{ primary:'Geist Variable', fallbacks:['system-ui'], generic:'sans-serif' }` | `'Geist Variable', system-ui, sans-serif` |
| `'JetBrains Mono', monospace` | `{ primary:'JetBrains Mono', fallbacks:[], generic:'monospace' }` | `'JetBrains Mono', monospace` |

### 함수

- `parseFontFallback(input: string): FontFallback`
- `serializeFontFallback(v: FontFallback): string`

### 룰

1. **쉼표 구분, 공백 무관**.
2. **single / double quote 둘 다 parse 가능, serialize 는 single quote 만**.
3. **serialize 의 quote 정책**: `^[A-Za-z0-9-]+$` 매칭 가족은 unquoted, 그 외 (공백 / 특수문자) 는 single quote.
4. **마지막 토큰이 generic family 셋 (`sans-serif` / `serif` / `monospace`) 중 하나면 `generic` 으로 추출**, 그 외는 `fallbacks` 끝에 추가.
5. **generic 누락 시 serialize 단계에서 `'sans-serif'` 자동 보강** — fallback 미지정 환경 보호.
6. **primary 필수** — generic 만 있고 primary 없으면 throw.

---

## §C5 — border

### 표기 차이 표

| Source | 표기 예시 |
|---|---|
| **Paper export** | `border: 1px solid #E2E8F0` (CSS shorthand) |
| **DESIGN.md (회고 fixture)** | `border 1 #E2E8F0` (px 누락), `border 1px #E2E8F0` (style 누락), `border 1px solid #E2E8F0` |
| **CSS / React** | shorthand 또는 longhand (`borderWidth` / `borderStyle` / `borderColor`) |

### Canonical Form

```typescript
interface Border {
  width: number;                              // px
  style: 'solid' | 'dashed' | 'dotted' | null;
  color: HexAlpha;
}
```

### 변환 예시

| 입력 | parse 결과 | serialize |
|---|---|---|
| `1px solid #E2E8F0` | `{ width:1, style:'solid', color:{r:226,g:232,b:240,a:1} }` | `1px solid #E2E8F0` |
| `1px #E2E8F0` (style 생략) | `{ width:1, style:null, color:... }` | `1px solid #E2E8F0` (보강) |
| `2px dashed #FF0000` | `{ width:2, style:'dashed', color:... }` | `2px dashed #FF0000` |
| `1px solid rgba(79, 70, 229, 0.18)` | `{ ..., color:{a:0.18} }` | `1px solid #4F46E5` *(주의: 'hex' format — alpha 손실)* |

### 함수

- `parseBorder(input: string): Border`
- `serializeBorder(v: Border): string` — `width style color` 순서 강제, color 는 `hex` (6-hex) 형식

### 룰

1. **첫 토큰은 `Xpx` 형태 width** — `1` 같이 px 누락 시 throw (회고 fixture 의 `border 1 #E2E8F0` 같은 prose 입력 거부).
2. **두 번째 토큰이 `solid` / `dashed` / `dotted` 중 하나면 `style`** — 그 외는 color 토큰 시작으로 간주.
3. **color 부분은 `parseHexAlpha` 로 위임** — rgba / 8-hex / oklch 모두 가능.
4. **serialize 의 color 형식은 'hex' (6-hex)** — alpha 보존 필요 시 `hex-alpha` 형식으로 별도 호출 가이드.
5. **style null 시 'solid' 자동 보강**.
6. **`border-bottom`, `border-right` 등 longhand prefix 는 Out of Scope** — 호출 전에 shorthand 로 변환 필요.

---

## 🔁 호출 패턴 — 추출 / 취합 시 동일 룰 적용

다른 도구 / agent prompt 가 따라야 할 호출 패턴:

```typescript
import {
  parseHexAlpha, serializeHexAlpha,
  parsePadding, serializePadding,
  parseLineHeight, serializeLineHeight,
  parseFontFallback, serializeFontFallback,
  parseBorder, serializeBorder,
} from "@/lib/paper-normalizer";

// 추출 (외부 표기 → typed object)
const color = parseHexAlpha(rawHexOrRgba);
const padding = parsePadding(rawPaddingString);

// 취합 (typed object → canonical CSS string)
const cssBgColor = serializeHexAlpha(color, "hex");        // tokens.json 합류용
const cssRgba   = serializeHexAlpha(color, "rgba");        // shadow / overlay
const cssPad    = serializePadding(padding, "shorthand");  // 컴포넌트 inline
```

### LLM agent 사용 시 권장 사항

추출 단계에서 LLM 이 prose 표기 (`padding 20×22` 등) 를 발견하면, 본 라이브러리 호출 전 표준 CSS string 으로 변환할 것:

```text
"padding 20×22"  →  "20px 22px"   (block × inline 가정)
"border 1 #X"    →  "1px #X"       (px 단위 보강)
"border-bottom"  →  longhand 별도 처리 (본 라이브러리 외)
```

## 📝 향후 확장 후보 (queue.md Icebox)

- shadow 정규화 (5+ stop / inset / spread)
- gradient 정규화 (linear / radial / conic)
- transform 정규화 (matrix / translate / rotate / scale 합성)
- OKLCH gamut mapping 정확성 검증 — research spec
- prose 표기 (×separator, longhand prefix) 추출기 — 별도 spec

## 🔗 관련 자료

- 회고: `docs/poc-retro.md` §3.3 TODO-02 + §F-08
- spec: `specs/spec-6-02-paper-normalizer/spec.md`
- 코드: `studio/src/lib/paper-normalizer/`
- fixture: `poc/app-a/design-extract/` (5 페이지)
