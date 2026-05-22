# feat(spec-6-03): blueprint protocol 정합화 (7 gap 일괄)

> phase-6 의 세 번째 spec (Track B 마지막). phase-5 회고 (TODO-04 / C-10 / F-01~F-07) 가 식별한 Blueprint protocol 의 7 gap 을 한 PR 로 일괄 정합. spec-6-05 (Blueprint 질의서 UI) 의 데이터 모델 토대.

## 📋 Summary

### 배경 및 목적

Blueprint protocol (`schema/blueprint-protocol.md` 563 lines) + page-catalog + 3 templates 가 phase-2~5 동안 점진 작성되며 누적된 7 gap:

| ID | gap | 처리 |
|---|---|---|
| **F-01** | spec.md 작성 시 NFR 자주 누락 | Step 1.5 에 6 카테고리 (auth/i18n/theme/**performance/security/compatibility**) 체크리스트 + fail-fast |
| **F-02** | DESIGN.md placeholder 50%+ 가 Blueprint 출력만으로 안 채워짐 | `schema/blueprint-placeholder-map.md` 신설 — 70+ placeholder 5 기원 분류 (B/D/I/M/R) |
| **F-03** | route / layout YAML 키 부재 (fail-fast 충돌) | finalPages[]에 명시 필드 + 자동 채움 (`/{id}` / variant 기반) |
| **F-04** | status 어휘 3 종 불일치 (`✅` / `implemented` / `구현 완료`) | YAML literal `implemented`/`not-implemented` 강제 + display 매핑 표 분리 |
| **F-05** | optionalSections 빈 배열 표시 규약 부재 | `[]` / `'none'` 허용, omit 금지 (validator error) |
| **F-06** | 미구현 Template 이름 유추 규칙 없음 | kebab → PascalCase + `Page` + 카테고리 접두 sub-table (auth/profile drop, dash 확장) |
| **F-07** | Phase 2 Template 재사용 / 복제 정책 부재 | soft 재사용 + `derivedFrom` 옵션 필드 + origin 갱신 의무 |

### 주요 변경 사항

- [x] **`schema/blueprint-protocol.md` v2** — Step 1.5 NFR 체크리스트, status 어휘 매핑, route/layout 자동 유도, optionalSections 표기 규약, Template 재사용 정책 신설.
- [x] **`schema/page-catalog.md`** — status 어휘 (machine vs display 분리), Template 이름 유추 규칙 + 카테고리 접두 sub-table, 미구현 12 row 모두 예상 Template 이름 기재.
- [x] **`schema/blueprint-placeholder-map.md` NEW** (152 lines) — 70+ placeholder 5 기원 분류 + 입력 폼 후보 + 다운스트림 자동화 가이드.
- [x] **`templates/REQUIREMENTS.md.template`** — NFR 6 섹션 (auth/i18n/theme/perf/sec/compat-a11y), 페이지별 route / layout 자리.
- [x] **`templates/DESIGN.md.template`** — 헤더에 5 기원 분류 노트.
- [x] **`scripts/validate-blueprint.mjs` NEW** (226 lines) + `__tests__/` (241 lines) — 7 gap 검증, lenient/strict mode, Node 표준만 사용 (외부 의존성 0).

### Phase 컨텍스트

- **Phase**: `phase-6` (Studio v1)
- **본 SPEC 의 역할**: Track B 마지막 전제 조건. 다음 Track A (`spec-6-04` Studio 앱 셋업 → `spec-6-08` export) 가 본 spec 의 schema 를 데이터 모델로 사용. 특히 `spec-6-05` Blueprint 질의서 UI 가 `placeholder-map` + `protocol v2` 두 산출물 모두 직접 import.

## 🎯 Key Review Points

1. **NFR 6 카테고리 신설 (F-01)**: phase-5 시점 3 카테고리 (auth/i18n/theme) → 6 (+ performance / security / compatibility). 마이그레이션 호환은 validator lenient mode 로.
2. **placeholder map (F-02)** 의 다운스트림 영향: spec-6-05 의 입력 폼 자동 생성 + agent prompt reference + Fill Executor 분리 — 5 종 기원이 *각각 다른 자동화* 와 매핑됨.
3. **status 어휘 영역 분리 (F-04)**: YAML 영역만 강제, 마크다운 표 (`✅`) 는 readability 우선. 두 영역 분리로 phase-5 산출물 호환.
4. **validator lenient vs strict (Q5)**: phase-5 산출물은 lenient 통과 (warning 만), 신규 spec 작성은 `--strict` 권장. 마이그레이션 모드로 점진 강화.
5. **F-06 단순 룰 + page-catalog override**: `auth-login` → `LoginPage` (auth 접두 drop), `profile-mypage` → `MypagePage` (단순) 또는 `MyPage` (page-catalog 명시) 두 결과 발생. validator 는 단순 룰 기준 warning, 작성자가 결정.
6. **`derivedFrom` 옵션 필드 (F-07)**: 본 PR 에선 phase-5 산출물 호환 위해 옵션. 향후 phase-6 production app 의 복제 케이스에서 활용.

## 🧪 Verification

```bash
node --test scripts/__tests__/validate-blueprint.test.mjs   # ✅ 10/10 PASS
node scripts/validate-blueprint.mjs poc/app-a/blueprint-session.md
# ⚠ PASS with N warnings (error 0) — phase-5 호환 확인
```

**결과 요약**:
- ✅ validator 단위 테스트 10 case (정상 / F-01 lenient·strict / F-03 / F-04 / F-05 / F-06 + sub-cases / phase-5 회귀)
- ✅ phase-5 회귀 lenient PASS (15 warning, error 0)
- ✅ Studio repo 의 기존 116 case (spec-6-01) + paper-normalizer 87 case (spec-6-02) 영향 없음 (스키마 변경만)

## 📦 Files Changed

### 🆕 New Files

- `schema/blueprint-placeholder-map.md` (152 lines) — 70+ placeholder 5 기원 분류
- `scripts/validate-blueprint.mjs` (226 lines) — 7 gap 검증 CLI
- `scripts/__tests__/validate-blueprint.test.mjs` (241 lines) — 10 case 테스트

### 🛠 Modified Files

- `schema/blueprint-protocol.md` (+128, -3) — Step 1.5 NFR 6 카테고리, status 어휘 매핑, route/layout 자동 유도, optionalSections 규약, Template 재사용 정책, derivedFrom 옵션, placeholder map 참조
- `schema/page-catalog.md` (+57, -7) — status 매핑, Template 이름 유추 룰, 18 row 갱신
- `templates/REQUIREMENTS.md.template` (+34, -4) — NFR 6 섹션, route / layout 자리
- `templates/DESIGN.md.template` (+10, -3) — 5 기원 분류 노트
- `backlog/phase-6.md` / `backlog/queue.md` — sdd auto-update

**Total**: 12 files changed (+1175, -36)

## ✅ Definition of Done

- [x] 7 gap 모두 protocol / template / page-catalog 에 반영
- [x] `scripts/validate-blueprint.mjs` 신설 + 단위 테스트 PASS (10/10)
- [x] phase-5 산출물 (`poc/app-a/blueprint-session.md`) lenient PASS
- [x] `walkthrough.md` 와 `pr_description.md` 작성 + ship commit
- [x] `spec-6-03-blueprint-protocol` 브랜치 push
- [x] PR 생성 (target: `phase-6-studio-v1`)
- [x] 사용자 검토 알림

## 🔗 관련 자료

- 회고: `docs/poc-retro.md` §3.3 TODO-04 + §F-01 ~ §F-07
- 산출 schema: `schema/blueprint-protocol.md` v2, `schema/blueprint-placeholder-map.md` NEW, `schema/page-catalog.md`
- 산출 templates: `templates/REQUIREMENTS.md.template`, `templates/DESIGN.md.template`
- validator: `scripts/validate-blueprint.mjs` + `__tests__/`
- Walkthrough: `specs/spec-6-03-blueprint-protocol/walkthrough.md`
- 직전 spec: `spec-6-02` (paper-normalizer) — 머지 완료
