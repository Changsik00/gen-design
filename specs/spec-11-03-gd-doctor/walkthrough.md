# Walkthrough: spec-11-03 — `gd doctor` 구현

## 실행 증거

### 1. 단위 테스트 — 1055 PASS (998 → 1055, +57)

```
 Test Files  138 passed (138)
      Tests  1055 passed (1055)
   Duration  9.86s
```

doctor 6 files / 53 tests:
- token-format.test.ts — 7
- token-ref.test.ts — 10
- contrast.test.ts — 11
- scene-drift.test.ts — 10
- vocab-similar.test.ts — 9
- integration.test.ts — 6 (runDoctor + parseDoctorArgs)

### 2. 실 동작 검증 — playground/chats + templates

```
$ pnpm --filter studio exec tsx scripts/gen-design.ts doctor \
    --chat-root /Users/dennis/Project/Design/playground/chats \
    --templates-root /Users/dennis/Project/Design/templates

✗ [token-format] templates/assets/tokens/tokens.json
  shadcn 표준 토큰 --card 이 tokens.json 에 정의되어 있지 않습니다.
  → shadcn 표준 토큰 이름은 잠금입니다. 값만 조정하세요.
...
✗ 29 errors (4ms)
```

→ **4ms** (5초 budget 의 0.08%). 의도된 진단 — 현재 main 의 tokens.json 이 shadcn 24 토큰 풀셋이 아니어서 누락 토큰 검출. *본질 검증의 정확성*을 보여줌.

### 3. lint — 0 errors

### 4. 기존 회귀 — gen-design 16 files / 162 tests PASS 유지

---

## 산출물 (9 commits)

| # | Commit | 내용 |
|---|---|---|
| 1 | (pre-flight) | spec / plan / task |
| 2 | culori dep + doctor 스켈레톤 | types.ts (DoctorCategory 12) + messages.ts (한국어 템플릿) |
| 3 | checkTokenFormat | DTCG strict + shadcn 24 토큰 잠금 — 7 tests |
| 4 | checkTokenRef + Levenshtein | DESIGN/chat ↔ TOKEN + "Did you mean?" — 10 tests |
| 5 | checkContrast | culori OKLCH → luminance → AA 8 페어 + L 조정 제안 — 11 tests |
| 6 | checkSceneDrift + checkOrphanScene | // @gd: annotation + mtime + orphan 감지 — 10 tests |
| 7 | checkVocabSimilar | PascalCase 추출 + Levenshtein 제안 — 9 tests |
| 8 | gd react annotation | TSX 첫 줄 `// @gd: <chat-path>` 자동 삽입 (idempotent) — 4 tests |
| 9 | doctor 통합 + router + --json | runDoctor + integration tests — 6 tests |

---

## 12 검증 카테고리

기존 (lint 흡수):
- frontmatter / grammar / catalog-ref / shell-inherit / naming / compile

신규:
| 카테고리 | 동작 |
|---|---|
| `token-format` | DTCG 1.0 strict + shadcn 24 토큰 잠금 + light/dark 동기 검증 |
| `token-ref` | DESIGN.md `{token}` + chat.md `bg-X` ↔ tokens.json 정의 매칭 |
| `contrast` | WCAG 2.1 AA 8 페어 × 2 mode = 16 측정 + 합격 OKLCH 제안 |
| `scene-drift` | `// @gd:` annotation + chat.md/TSX mtime 비교 |
| `orphan-scene` | annotation 가리키는 chat 부재 → error / annotation 없음 → unmanaged warn |
| `vocab-similar` | 카탈로그 외 컴포넌트 + Levenshtein "Did you mean?" |

---

## 핵심 기술 결정

### 1. OKLCH → relative luminance (culori)

```ts
const xyz = converter("xyz65")(parse("oklch(0.546 0.252 264.05)"));
// xyz.y = relative luminance (CIE Y, 0~1)
```

WCAG contrast ratio = `(L_lighter + 0.05) / (L_darker + 0.05)`.

### 2. 합격 OKLCH 제안 — L 만 조정

- Hue / Chroma 보존 → 색 *의도* 유지
- direction: fg < bg → L 감소 / fg > bg → L 증가
- step 0.01, 최대 100 iter

### 3. Levenshtein + Segment 약어 매칭

```
"muted-fg" vs "muted-foreground"
  - Levenshtein = 8 (높음)
  - 같은 segment 수 (2 == 2) + 첫 segment 일치 ("muted") → score = 2
```

shadcn 토큰 / 컴포넌트의 *약어 인식* 가능.

### 4. `// @gd:` annotation (lat.md 차용)

`gen-design react` 출력 TSX 첫 줄:
```ts
// @gd: chats/scenes/login.chat.md
import { useTranslation } from "react-i18next";
...
```

→ doctor 의 scene-drift / orphan-scene 검증 기반.
→ idempotent — 재컴파일 시 annotation 교체.

### 5. 친절한 한국어 메시지 표준

```
✗ [contrast] templates/assets/tokens/tokens.json
  light primary-foreground on primary 대비비 3.80:1 — WCAG 2.1 AA 미달 (필요 4.5:1).
  → primary-foreground 을 oklch(0.985 0 0) 로 조정하면 4.60:1 — AA PASS.
```

각 진단: 카테고리 + 파일:라인 + *무엇이 잘못됐는가* + *어떻게 고치는가* (구체 명령).

---

## DoD 체크

- [x] `studio/scripts/gen-design/doctor/` 6 검증 함수 구현
- [x] router 등록 (`doctor` subcommand)
- [x] `gen-design react` TSX 출력에 `// @gd:` annotation 자동 삽입
- [x] 각 검증 단위 테스트 (53 tests, 6 files)
- [x] 실 fixture 실행 (playground/chats) → 4ms (5초 budget 안)
- [x] 친절한 한국어 메시지 + hint
- [x] `--json` 옵션 (기계 처리)
- [x] lint 0 errors / 1055 tests PASS (회귀 0)

---

## 후속 작업

| 항목 | spec |
|---|---|
| dogfooding alpha — dennis 가 본 doctor 사용해 zero → React | spec-11-04 |
| `@gd/cli` 별도 npm 분리 + scaffold preset 의 `pnpm gd doctor` 실 동작 | phase-12 |
| `gd doctor --fix` 자동 수정 모드 | phase-12 |
| MSW handler 자동 생성 (`gd api`) | phase-12 |
