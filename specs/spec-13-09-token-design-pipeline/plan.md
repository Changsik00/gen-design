# Implementation Plan: spec-13-09

## 📋 Branch Strategy

- 신규 브랜치: `spec-13-09-token-design-pipeline`
- 시작 지점: `phase-13-vertical-slice` (spec-13-08 머지 반영됨)
- PR 타겟: `phase-13-vertical-slice`

## 🛑 사용자 검토 필요

> [!IMPORTANT]
> - [ ] **빌드 방식**: 경량 무의존 Node 스크립트 (studio의 style-dictionary 미사용). preset 경량 유지 목적. 동의?
> - [ ] **globals.css 생성 범위**: 마커(`/* tokens:start/end */`) 사이의 `:root`/`.dark` 토큰 vars만 생성. `@theme inline` 매핑·radius 등 나머지는 보존.

## 🎯 핵심 전략

### 토큰 빌드 (tokens.json → globals.css)

```
tokens.json
  color.<name>.$value.{light, dark}    # oklch 값
  radius.<name>.$value (있으면)
        ↓ tokens/build.mjs (무의존)
globals.css
  /* tokens:start */
  :root  { --<name>: <light>; ... }
  .dark  { --<name>: <dark>;  ... }
  /* tokens:end */
```

- `color.background` → `--background`, `color.primary` → `--primary` (이름 평탄화)
- light → `:root`, dark → `.dark`
- 마커 밖(`@theme inline`, `@custom-variant` 등)은 건드리지 않음

### 빌드 스크립트 골격 (무의존)

```js
// tokens/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
const tokens = JSON.parse(readFileSync("templates/assets/tokens/tokens.json"));
function emit(mode) {
  return Object.entries(tokens.color)
    .map(([name, t]) => `  --${name}: ${t.$value[mode]};`).join("\n");
  // + radius 등
}
const block = `/* tokens:start — auto-generated, do not edit */\n`
  + `:root {\n${emit("light")}\n}\n\n.dark {\n${emit("dark")}\n}\n`
  + `/* tokens:end */`;
// globals.css 의 마커 사이 교체
```

### DESIGN.md 강제 (FRONT.md 연결)

- FRONT.md §11 또는 §10에 "생성 시 DESIGN.md의 컨벤션(Brand/Typography/Layout 의도)을 반영" 규칙 추가
- raw hex 금지(이미 §10/§26)와 연결 — DESIGN.md 색 의도는 TOKEN.md 토큰으로만 표현

### 주요 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 빌드 도구 | 무의존 Node | preset 경량, tokens.json 구조 단순 |
| 생성 범위 | 마커 사이만 | globals.css의 @theme/radius 보존 |
| DESIGN.md | LLM 컨텍스트 + FRONT.md 규칙 | 자동변환은 과함 — 규칙 강제로 충분 |
| 실증 | primary → 인디고 | 가장 눈에 띄는 토큰 (버튼/강조) |

## 📂 Proposed Changes

### [NEW] `packages/create-gd-react/presets-bundled/default/tokens/build.mjs`
무의존 빌드 스크립트.

### [MODIFY] `.../default/package.json`
`"tokens": "node tokens/build.mjs"` + `"build": "pnpm tokens && tsc -b && vite build"`.

### [MODIFY] `.../default/src/styles/globals.css`
`:root`/`.dark` 토큰 영역에 `/* tokens:start/end */` 마커.

### [MODIFY] `.../default/templates/FRONT.md`
§11 토큰 빌드 파이프라인 + DESIGN.md 연결 규칙.

### [검증] todo-persona (git 미추적)
- `tokens/build.mjs` + `pnpm tokens` 셋업 (preset과 동일)
- `tokens.json` primary 변경 → 빌드 → 색 전환 e2e + 스크린샷

## 🧪 검증 계획

```bash
# todo-persona
# 1. primary 기본(neutral) 스크린샷
# 2. tokens.json primary → 인디고
# 3. pnpm tokens
# 4. globals.css --primary 갱신 확인 + 버튼 색 전환 스크린샷
# 5. e2e: getComputedStyle 로 --primary CSS var 값 검증
```

## 🔁 Rollback Plan

빌드 스크립트 추가 + globals.css 마커. git revert 안전. todo-persona 미추적.

## 📦 Deliverables 체크

- [ ] task.md 작성
- [ ] 사용자 Plan Accept
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough / pr_description ship
