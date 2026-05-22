# spec-5-04 walkthrough

> 진행 일자: 2026-05-05
> 브랜치: `spec-5-04-app-b-reusability`
> 결과: ✅ 가설 (80%+ 재사용) 성립

---

## 1. 목표

phase-5 success criteria 중 미검증 항목:
- **#2**: 앱 B 가 앱 A 와 동일 구조에서 토큰 / i18n 만 교체하여 부팅 가능한가?
- **#3**: 공유 코드 비율 80%+ 인가?

---

## 2. 진행 흐름

### Pre-flight
- spec / plan / task 작성 → 사용자 Plan Accept (`/hk-plan-accept`)
- alignment 단계에서 `spec-5-04-app-b-reusability` 브랜치 선제 생성 (constitution §10.1 회피)

### Strict Loop (8 task / 7 commit)

| Task | Commit | 핵심 산출물 |
|---|---|---|
| 1 | `chore(spec-5-04): register poc/app-b in pnpm workspace` | `pnpm-workspace.yaml` 에 `poc/app-b` 추가 |
| 2 | `chore(spec-5-04): bootstrap poc/app-b vite app skeleton` | package.json / vite.config / tsconfig / index.html / main.tsx / index.css / test-setup |
| 3 | `feat(spec-5-04): write tokens.json for app-b (emerald + amber)` | tokens.json (color 만 차이) + 빌드된 `_tokens.css` |
| 4 | `feat(spec-5-04): write i18n/ko.json for app-b` | ko.json 73 키 (en.json 과 1:1) |
| 5 | `feat(spec-5-04): wire 6 pages from app-a with ko mocks` | App.tsx + 6 페이지 + useTexts (ko.json source) |
| 6 | `test(spec-5-04): add routes smoke test for app-b in korean` | routes.test.tsx 5/5 PASS |
| 7 | `docs(spec-5-04): write reuse report with LOC measurement` | reuse-report.md (LOC + hardcode findings) |
| 8 | (this) | walkthrough + pr_description + Ship |

---

## 3. 핵심 결과

### 3.1 LOC 재사용 비율

| 척도 | 비율 |
|---|---:|
| 코드만 (TS/TSX) | **87.1%** |
| 코드 + 데이터 (tokens.json + i18n.json 포함) | **79.8%** |

✅ 80%+ 가설 (코드 기준) **충족**.

### 3.2 토큰 차이

- 변경: 50 토큰 중 ~13 (color 만, **26%**).
- 미변경: radius / spacing / font / elevation 100% 동일.

### 3.3 i18n 차이

- en.json 73 키 ↔ ko.json 73 키, **1:1 정합** (누락 0 / 추가 0).
- 직역 아닌 자연 한국어 (예: "Sign in to TaskFlow" → "플로우데스크 로그인").

### 3.4 컴포넌트 코드 변경

- studio 코드 변경: **0 LOC** (가설 보전).
- app-b 페이지 구조 신규 코드: 326 LOC (~169 LOC 는 app-a 와 사실상 동일, ~157 LOC 만 mock 데이터 차이).

---

## 4. 발견된 Hardcode (Studio)

phase-5 회고 (spec-5-05) 입력으로 기록.

| # | 위치 | 내용 |
|---|---|---|
| H-1 | `studio/src/components/templates/MyPage/index.tsx:23` | `appName = "TaskFlow"` 기본값 |
| H-2 | `studio/src/components/templates/SettingsPage/index.tsx:34` | `appName = "TaskFlow"` 기본값 |

**우회**: app-b 의 mypage / settings 에서 `appName="플로우데스크"` 명시 prop. 권장 수정은 default 제거하여 required 로 강제 (다음 spec).

---

## 5. 검증

- ✅ `pnpm --filter app-b tokens` PASS
- ✅ `pnpm --filter app-b build` PASS (453.52 kB JS, 10.98 kB CSS)
- ✅ `pnpm --filter app-b test` PASS (5/5)
- ✅ `pnpm -r build` PASS (3 패키지)
- ✅ `pnpm -r test` PASS (studio 115 + app-a 5 + app-b 5)

---

## 6. 회고 (spec-5-05 입력)

### 잘된 점

- studio 의 `texts` props pattern 이 정상 작동 — 컴포넌트 코드 변경 0 으로 한국어 / 영어 모두 가능.
- 토큰 파이프라인이 색 변경에 잘 격리됨 — 토큰 50 중 13 만 바꾸고 빌드 / 테스트 즉시 통과.
- vite alias array + regex prefix matching (spec-5-03 에서 정립) 패턴이 다른 패키지에서도 재사용 잘 됨.

### 개선점 (다음 spec 후보)

1. **`appName` 기본값 제거** — required prop 으로 강제. 누락 시 컴파일 에러로 발견.
2. **app-a / app-b 구조 중복 169 LOC** — App.tsx, main.tsx, useTexts.ts, login/signup/error 페이지가 거의 동일. shared template repo or codegen 으로 추출 검토 (단 spec scope 에 비해 과도할 수 있음 — 회고에서 ROI 평가).
3. **mock 데이터 분리** — 페이지 컴포넌트에 mock 이 inline 되어 있음. 별도 `mocks/` 디렉토리로 분리하면 페이지 코드도 100% 동일 가능.

### 가설 보전 평가

- "토큰 + i18n 만 교체로 새 제품 부팅" → ✅ 성립
- "studio 코드 변경 0" → ✅ 보전
- "80%+ 재사용" → ✅ 성립 (코드 기준 87.1%, 데이터 포함 79.8%)
