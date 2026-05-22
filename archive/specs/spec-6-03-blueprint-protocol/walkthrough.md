# Walkthrough: spec-6-03

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| status 어휘 (Q1) | (a) `implemented` literal / (b) icon / (c) 한국어 | **(a) literal + 표시 매핑** | machine-readable, 표시는 별도 매핑. 자동화 정합성 |
| placeholder 분류 깊이 (Q2) | (a) 카테고리만 / (b) placeholder 별 명시 | **(b) 70+ placeholder 명시** | spec-6-05 질의서 UI 폼 자동 생성 토대 |
| route / layout (Q3) | (a) 자동 + override / (b) 명시 필수 | **(a) 자동 + override** | fail-fast 충돌 해소 + 작성자 친화 |
| Template 재사용 (Q4) | (a) soft / (b) hard | **(a) soft** | PoC 마찰 ↓, derivedFrom 으로 origin 추적 |
| 검증 방식 (Q5) | (a) 수동 / (b) validator + 테스트 | **(b) validator + 회귀** | schema 변경 회귀 자동 차단 |
| validator lenient vs strict | warning 만 vs error | **lenient default + `--strict` flag** | phase-5 산출물 호환 (마이그레이션 모드), 신규 작성은 strict |
| F-04 status 어휘 영역 | YAML + 마크다운 모두 / YAML 만 | **YAML 만 검증** | 마크다운 표 (`✅`) 는 readability 우선, 영역 분리 |
| F-05 omit vs `[]` vs `'none'` | omit 허용 / 금지 | **omit 금지 (error), `[]` / `'none'` 둘 다 허용** | "단순 누락 vs 의도 빈" 구분 가능해야 |
| F-06 페이지 이름 유추 — `MyPage` 같은 예외 | 룰 강제 / page-catalog override | **단순 룰 + page-catalog override (warning)** | 단순 규칙 + 명시적 예외 = 실용 |
| validator 외부 의존성 | js-yaml / 정규식 only | **정규식 only** | 외부 의존성 0, ~226 lines |
| Q3 route 자동 채움 알고리즘 | `/{id}` / `/{first-segment 제거 후 slash 변환}` | **두 형식 모두 허용** (예: `auth-login` → `/auth/login` 권장, `/auth-login` 도 허용) | 작성자 직관 vs URL 구조 균형 |

## 💬 사용자 협의

- **주제**: Q1~Q5 결정
  - **사용자 의견**: "i accepted your recommandations"
  - **합의**: (a) status literal / (b) placeholder 별 / (a) route 자동+override / (a) soft 재사용 / (b) validator + 회귀

## 🧪 검증 결과

### 1. 자동화 테스트

#### validator 단위 테스트

- **명령**: `node --test scripts/__tests__/validate-blueprint.test.mjs`
- **결과**: ✅ **10/10 PASS**
- **케이스**:
  - 정상 입력 (warning 0 / error 0)
  - F-01 lenient (warning) + strict (error)
  - F-03 route/layout 누락 (warning)
  - F-04 비표준 status (✅) (error)
  - F-05 omit (error) + `[]` / `'none'` 통과
  - F-06 미준수 (warning) + sub-cases (5 변형)
  - phase-5 산출물 회귀 (lenient PASS)

#### phase-5 회귀

- **명령**: `node scripts/validate-blueprint.mjs poc/app-a/blueprint-session.md`
- **결과**: ✅ **PASS with N warnings** (error 0)
- **warning 분류**:
  - F-01: `performance` / `security` / `compatibility` 누락 (3 건) — phase-5 시점엔 카테고리 미정의
  - F-03: 5 페이지 모두 `route` / `layout` 누락 (10 건) — protocol v2 신규 필드
  - F-06: `MyPage` / `DashboardPage` 가 단순 룰 결과 (`MypagePage` / `DashboardOverviewPage`) 와 다름 (2 건) — page-catalog override 의도

### 2. 수동 검증

1. **NFR 누락 케이스**: 의도적으로 mock YAML 작성 → lenient 에서 warning, strict 에서 error 확인.
2. **status `✅` 케이스**: error 발생 + 메시지에 "비표준" 명시.
3. **placeholder map ↔ DESIGN.md.template 일치**: 70+ placeholder 모두 분류표 등재 (수동 grep 비교).

## 🔍 발견 사항

- **F-04 의 "machine vs display 분리"**: phase-5 산출물의 마크다운 표 (`✅ LoginPage`) 는 그대로 두고, YAML 영역의 `status` 만 검증. validator 가 마크다운 영역을 건드리지 않음 — 호환성 확보.
- **F-06 의 단순 규칙 한계**: `profile-mypage` → `MypagePage` (단순), `MyPage` (페이지 카탈로그 명시) 두 결과 차이. validator 는 단순 규칙 결과를 expected 로 두고 다른 이름 시 warning. 실제 source of truth 는 페이지 카탈로그 — warning 으로 작성자에게 알리는 정도가 적정.
- **NFR 카테고리 4~6 (perf / sec / compat-a11y) 신설**: phase-5 시점엔 NFR-auth/i18n/theme 3 카테고리뿐. 신설 후 phase-6 이후 작성되는 모든 spec 이 자동으로 NFR 누락 fail-fast 적용. 마이그레이션 호환은 lenient 모드로 처리.
- **placeholder 분류표가 spec-6-05 의 진정한 토대**: 5 종 기원 (B/D/I/M/R) 각각이 다른 입력 폼 후보 — Studio Blueprint UI 가 `B` 만 form 으로, `D` 는 디자인 도구 importer, `I` 는 파일 업로드, `M` 은 textarea, `R` 은 비표시. 분류 없이는 폼 자동 생성 불가능했을 것.
- **`derivedFrom` 옵션 필드 (F-07)**: 본 spec 에선 phase-5 산출물에 없는 필드라 실제 검증 케이스 없음. 향후 phase-6 production app 에서 복제 시 사용.

## 🚧 이월 항목

- **마크다운 영역 검증 확장**: 본 validator 는 YAML 만 검증. REQUIREMENTS.md 의 마크다운 표 (페이지 블록의 status / 선택 섹션 표시) 도 검증하려면 별도 spec.
- **page-catalog 의 단순 룰 예외 (`MyPage` 등) 자동 인식**: 본 validator 는 단순 규칙만 — page-catalog 의 명시 이름을 source of truth 로 보려면 별도 룰 / loader.
- **DESIGN.md.template 14 섹션 schema 보강 (TODO-05)**: §12 Composite + §14 i18n 4-part. 별도 spec 후보 (queue.md Icebox).

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent (Opus 4.7) + Dennis |
| **작성일** | 2026-05-09 |
| **최종 commit (ship 직전)** | `44f32ff` |
| **commit timestamp 정책** | 자연 시각 (시간 위장 spec-6-01 한정) |
