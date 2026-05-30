# Walkthrough: spec-13-09

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 빌드 도구 | style-dictionary(studio) / 무의존 Node | **무의존 Node** | preset 경량 유지 (FRONT.md "keep it boring"). tokens.json 구조 단순(color.{light,dark}) |
| 생성 범위 | 전체 globals.css / 마커 사이 | **마커 `tokens:start/end` 사이** | `@theme inline`·radius 매핑·@layer 보존 |
| DESIGN.md 강제 | 자동 변환 / 규칙 + lint | **FRONT.md 규칙 + raw hex 금지** | 자동 변환은 과함. DESIGN.md(의도)→TOKEN.md(값) 연결 규칙으로 충분 |
| 실증 토큰 | primary | **primary** | 버튼/링크 등 가장 눈에 띔. 검정→인디고 대비 명확 |

## 💬 사용자 협의

- **주제**: "토큰이랑 design.md는?" → 토큰/DESIGN.md를 안 거쳐 기본 neutral. 시스템 차별화(토큰→React 강제) 미검증.
- **합의**: "토큰이랑 DESIGN.md도 phase-13에서 해결하자" → spec-13-09 추가.

## 🧪 검증 결과

### 1. 근본 원인 확인

preset `tokens.json` `$description`은 "빌드가 globals.css 생성"이라 명시하나 **빌드 스크립트가 preset에 없었음**. studio엔 `pnpm tokens` 존재, preset에 누락.

### 2. 빌드 idempotent

```
node tokens/build.mjs → globals.css 재생성
diff: 토큰 값 100% 동일 (그룹 빈 줄만 차이). 32 colors light+dark.
```

### 3. 토큰 자동반영 실증 (핵심)

```
BEFORE  --primary: oklch(0.205 0 0)   (검정, neutral)
   ↓ tokens.json color.primary 만 인디고로 변경 + pnpm tokens (React 코드 0 변경)
AFTER   --primary: oklch(0.51 0.23 277)  (인디고)
```

- **로그인 버튼 + 회원가입 링크가 검정 → 인디고로 전환** (스크린샷 tok-before/after)
- e2e: `getComputedStyle(--primary)` 값이 인디고로 변경 검증 PASS
- **React `.tsx` 한 줄도 안 바꿈** — `bg-primary` 클래스가 토큰을 따라감

→ "디자이너가 토큰 값만 바꾸면 React 전체 색 전환" = 토큰 시스템의 핵심 가치 작동 확인.

## 🔍 발견 사항

- preset tokens.json엔 fontFamily(sans/mono)도 있으나 globals.css :root엔 없고 `@theme inline`의 `--font-sans`에 직접. 빌드는 color+radius만 생성 (현 구조 유지). fontFamily 토큰화는 후속 여지.
- `/gd-token` 스킬은 색 입력→OKLCH→대비검증→tokens.json까지 안내하나, 마지막 `pnpm tokens` 실행 안내가 추가되면 완결 (FRONT.md §10.3에 명시함).

## 🚧 이월 항목

- fontFamily 토큰 → globals.css 생성 포함 → 후속
- studio/preset 빌드 방식 통일 (style-dictionary vs 무의존) → 필요 시
- DESIGN.md 채움 여부 lint 강제 → 후속

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작업 기간** | 2026-05-30 |
