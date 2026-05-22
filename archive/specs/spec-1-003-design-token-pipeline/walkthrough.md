# Walkthrough: spec-1-003

> 본 문서는 *증거 로그* 입니다.

## 📋 실제 구현된 변경사항

- [x] Style Dictionary v5 설치 및 W3C DTCG 토큰 JSON 작성 (primitive + semantic 2계층)
- [x] 커스텀 빌드 스크립트 (`tokens/build.mjs`) — shadcn-light/dark 포맷 + name/shadcn 변환
- [x] `npm run tokens` → `_tokens-light.css`, `_tokens-dark.css` 자동 생성
- [x] `index.css`에서 하드코딩 CSS 변수 제거 → 토큰 출력 import로 교체
- [x] `npm run build`에 토큰 빌드 단계 추가 (tokens → tsc → vite)
- [x] i18n JSON 구조 정의 + 한국어/영어 샘플 (common, login, signup, dashboard)

## 🧪 검증 결과

### 1. 빌드 검증

- **명령**: `cd studio && npm run build`
- **결과**: ✅ Passed
- **로그 요약**:
```text
css ✔︎ _tokens-light.css
css ✔︎ _tokens-dark.css
✅ 토큰 빌드 완료
✓ 1889 modules transformed.
✓ built in 130ms
```

### 2. 수동 검증

1. **Action**: `npm run tokens` 단독 실행
   - **Result**: `src/styles/_tokens-light.css` (37줄), `_tokens-dark.css` (34줄) 생성. shadcn/ui 전체 CSS 변수(32 color + radius + font) 커버

2. **Action**: 생성된 CSS 변수와 shadcn/ui 기존 변수 비교
   - **Result**: 변수명 100% 일치 (--primary, --secondary, --destructive, --border 등). oklch 값도 동일

3. **Action**: i18n JSON 네임스페이스 규약 확인
   - **Result**: `{page}.{section}.{element}.{property}` 패턴 준수. `login.form.email.placeholder` 등

## 🔍 발견 사항

- Style Dictionary v5는 `parseDTCGTokens` 없이 `usesDtcg: true` 옵션으로 DTCG 처리
- buildPath가 cwd 기준이므로 `import.meta.url` 기반 절대 경로 필요
- shadcn/ui가 oklch 포맷을 사용하므로 토큰도 oklch로 통일 — hex→oklch 변환 불필요

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-04-12 |
| **최종 commit** | `9e321f0` |
