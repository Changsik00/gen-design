# feat(spec-13-09): 토큰 빌드 파이프라인 + DESIGN.md 강제

## 📋 Summary

### 배경 및 목적

페르소나 테스트에서 발견: gen-design 차별화 = "디자이너 토큰/디자인 시스템이 React에 일관 강제"인데 preset에서 작동 안 함. 근본 원인 — preset `tokens.json` `$description`은 "빌드가 globals.css 생성"이라 명시하나 **그 빌드 스크립트가 preset에 누락**. tokens.json을 바꿔도 globals.css가 안 바뀌어 토큰이 문서로만 존재했다.

preset에 토큰 빌드 파이프라인을 추가하고, primary 값만 바꿔 React 코드 0 변경으로 전체 색이 전환됨을 실증한다.

### 주요 변경 사항

- [x] `tokens/build.mjs` (무의존 Node) — tokens.json → globals.css `:root`/`.dark`
- [x] `package.json` — `pnpm tokens` script + `build` 선행
- [x] `globals.css` — `/* tokens:start ~ end */` 마커 (생성 영역, 직접 편집 금지)
- [x] FRONT.md §10.3 Token Pipeline + §10.4 DESIGN.md 강제 규칙
- [x] 실증: todo 앱 primary 검정→인디고, React 코드 0 변경

### Phase 컨텍스트

- **Phase**: `phase-13` (성공기준 9 충족, 마지막 spec)
- **역할**: gen-design 차별화의 마지막 조각 — "토큰/디자인 시스템 → React 강제" 작동.

## 🎯 Key Review Points

1. **무의존 빌드** (`tokens/build.mjs`): style-dictionary 없이 tokens.json의 `color.<name>.$value.{light,dark}` + radius → globals.css 마커 영역 생성. preset 경량 유지.

2. **마커 기반 생성**: `:root`/`.dark` 토큰만 재생성, `@theme inline`·radius 매핑·@layer 보존.

3. **자동반영 실증**: `--primary` 검정(`0.205 0 0`)→인디고(`0.51 0.23 277`). 로그인 버튼/링크 색 전환, **`.tsx` 0 변경**.

## 🧪 Verification

```
node tokens/build.mjs           # idempotent (값 동일, 32 colors)
# tokens.json primary → 인디고 + pnpm tokens
e2e: getComputedStyle(--primary) === 인디고  PASS
# before/after 스크린샷: 검정 버튼 → 인디고 버튼 (코드 0 변경)
```

## 📦 Files Changed

### 🆕 New Files
- `packages/create-gd-react/presets-bundled/default/tokens/build.mjs`

### 🛠 Modified Files
- `.../default/package.json` — tokens script
- `.../default/src/styles/globals.css` — 마커 + 헤더 주석
- `.../default/templates/FRONT.md` — §10.3/§10.4 (+50)
- `backlog/phase-13.md` — 성공기준 9 + spec-09 등재

**Total**: 5 tracked files (+ todo-persona 실증 — git 미추적, walkthrough 첨부)

## ✅ Definition of Done

- [x] 토큰 빌드 파이프라인 + pnpm tokens
- [x] globals.css 마커
- [x] FRONT.md 토큰 + DESIGN.md 규칙
- [x] primary 변경 → 자동반영 실증 (스크린샷 + e2e)
- [x] walkthrough / pr_description ship

## 🔗 관련 자료

- ADR-002 (토큰 전략), ADR-011 (chat.md v2)
- FRONT.md §10.3 Token Pipeline
- Walkthrough: `specs/spec-13-09-token-design-pipeline/walkthrough.md`
