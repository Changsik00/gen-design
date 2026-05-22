# spec-5-04: 앱 B 재사용성 검증 (토큰 + i18n 만 교체)

## Summary

- **목적**: phase-5 success criteria #2/#3 검증 — 토큰/i18n 만 교체하여 새 제품을 80%+ 재사용으로 부팅 가능한가?
- **결과**: ✅ 가설 성립. **코드 87.1%** / 데이터 포함 79.8% 재사용. studio 코드 변경 0.
- **부산물**: studio 의 hardcode 2 건 발견 (`appName = "TaskFlow"` 기본값) — phase-5 회고 입력으로 기록.

## 변경 내역

### 신규 패키지: `poc/app-b/` (FlowDesk / 플로우데스크)

| 파일 | 역할 |
|---|---|
| `tokens.json` (113 LOC) | DTCG 토큰. **color 만 차이** (primary emerald-600, accent amber-500). radius/spacing/font/elevation 은 app-a 와 100% 동일 |
| `i18n/ko.json` (144 LOC) | DESIGN.md §14 의 73 키 한국어 번역. en.json 과 1:1 정합 |
| `tokens/build.mjs` | style-dictionary → `_tokens.css` |
| `src/App.tsx` + 6 pages | login / signup / dashboard / mypage / settings / error |
| `src/hooks/useTexts.ts` | i18n 매핑 (ko.json source) |
| `src/__tests__/routes.test.tsx` | 5 라우트 smoke (한국어 텍스트 검증) |
| `reuse-report.md` | LOC 측정 + hardcode findings |

### 수정

- `pnpm-workspace.yaml`: `poc/app-b` 등록

### studio: **변경 0** (가설 보전)

## 검증

| 명령 | 결과 |
|---|---|
| `pnpm --filter app-b tokens` | PASS |
| `pnpm --filter app-b build` | PASS (453.52 kB JS, 10.98 kB CSS) |
| `pnpm --filter app-b test` | PASS (5/5) |
| `pnpm -r build` | PASS (3 패키지) |
| `pnpm -r test` | PASS (studio 115 + app-a 5 + app-b 5) |

## 핵심 측정

| 척도 | 비율 |
|---|---:|
| 코드 재사용 (TS/TSX) | **87.1%** |
| 코드 + 데이터 재사용 | 79.8% |
| 변경된 토큰 비율 | 26% (50 중 13) |
| i18n 키 정합 | 100% (73/73) |

## Hardcode Findings (회고 입력)

| # | 위치 | 내용 |
|---|---|---|
| H-1 | `studio/src/components/templates/MyPage/index.tsx:23` | `appName = "TaskFlow"` 기본값 |
| H-2 | `studio/src/components/templates/SettingsPage/index.tsx:34` | `appName = "TaskFlow"` 기본값 |

**우회**: app-b 의 mypage / settings 에서 `appName="플로우데스크"` 명시.
**권장 수정**: default 제거 → required prop 으로 강제 (다음 spec 후보).

## Test plan

- [x] `pnpm --filter app-b dev` 후 6 라우트 모두 한국어 + emerald primary 색 확인
- [x] `pnpm -r build` PASS
- [x] `pnpm -r test` PASS
- [x] reuse-report.md 측정 검증

## 관련

- closes phase-5 success criteria #2 (앱 B 부팅), #3 (80%+ 재사용)
- 입력: spec-5-03 (app-a / studio 산출물)
- 다음: spec-5-05 (회고) — H-1 / H-2 수정 후보 + 169 LOC 중복 ROI 평가

🤖 Generated with [Claude Code](https://claude.com/claude-code)
