# Walkthrough: spec-7-09

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| C2 i18n import | react-i18next 설치 vs 주석 힌트 | 주석 힌트 | 프로젝트가 자체 ko.json 번들 사용, react-i18next 미설치 — 생성 코드에 존재하지 않는 dep 불가 |
| C2 token import | @/lib/tokens 모듈 생성 vs 주석 | 주석 힌트 | tokens 는 CSS var 로 이미 해소됨 — 별도 TS 모듈 불필요 |
| C4 noise 테스트 | 기존 benchmark 수정 vs 별도 파일 | 별도 `noise-fixtures.test.ts` | benchmark 는 synthetic round-trip 측정 목적 — 섞으면 혼란 |
| C5 검증 방법 | tsc --noEmit 실행 vs regex 검증 | regex + 구조 검증 | CI 에서 tsc 실행 시 컴포넌트 import 경로 못 찾는 환경 의존성 회피 |

## 🧪 검증 결과

### 단위 테스트
- **결과**: ✅ 99 files, 672 tests PASS

### CLI 수동 검증
```bash
pnpm exec tsx src/lib/spec-md-compiler/react/cli/spec-react.ts \
  ../../spec/login-page.spec.md
```
출력:
- `export function LoginPage()` ✅ (수정 전: `export function LoginPage.spec()`)
- `react-i18next` import 없음 ✅
- `@/lib/tokens` import 없음 ✅
- i18n/token 힌트 주석 포함 ✅

## 🔍 발견 사항

- `deriveComponentName` 을 export 함수로 분리하니 CLI 테스트가 훨씬 쉬워짐 — 함수 추출의 테스트용 장점
- noise 테스트: "Btn" (약어) 는 Levenshtein distance=2 로 fuzzy match 가능 — 아슬아슬한 경계. MAX_FUZZY_DISTANCE=2 설정이 실제 노이즈를 일부 흡수함. 향후 신뢰도 임계값 조정 시 재확인 필요.
- 28 fixture 중 i18n placeholder 가 있는 파일들은 이제 `// i18n: ...` 주석으로 힌트만 남김 — 다음 phase 에서 실제 i18n 런타임 연결 시 이 주석을 find-replace 하면 됨.

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + Dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `a618d9b` |
