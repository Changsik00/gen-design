# Task List: spec-6-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`sdd spec new blueprint-protocol`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-6.md SPEC 표 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + scaffold

### 1-1. 브랜치 분기 + 스캐폴드 커밋
- [x] `git checkout -b spec-6-03-blueprint-protocol`
- [x] add scaffold files
- [x] Commit: scaffold (`763732f`)

---

## Task 2: F-01 — Step 1.5 (NFR) 체크리스트 강화

### 2-1. protocol §Step 1.5 + REQUIREMENTS.md.template
- [x] `schema/blueprint-protocol.md` §Step 1.5: 체크리스트 표 + 6 카테고리 (auth / i18n / theme / performance / security / compatibility) + 출력 YAML schema + fail-fast 검증 명시
- [x] `templates/REQUIREMENTS.md.template`: NFR 6 섹션 (auth / i18n / theme / perf / sec / compat-a11y) 명시
- [x] Commit: `feat(spec-6-03): F-01 add NFR checklist to protocol Step 1.5` (`d40ee8c`)

---

## Task 3: F-04 — `status` 어휘 단일화 (`implemented` literal + 표시 매핑)

### 3-1. protocol + page-catalog
- [x] `blueprint-protocol.md` §Output: `templateMapping.status` `implemented` / `not-implemented` literal 강제 + 어휘 매핑 표 + 룰 3 종 (componentPath 정합 포함)
- [x] `page-catalog.md`: 범례를 machine vs display 분리 형태로 갱신
- [x] Commit: `feat(spec-6-03): F-04 unify status vocabulary to implemented literal + display map` (`3b4e422`)

---

## Task 4: F-03 — `route` / `layout` 자동 + override

### 4-1. protocol Step 3 + REQUIREMENTS.md.template
- [x] `blueprint-protocol.md`: finalPages 예시에 route/layout, 자동 유도 룰 명시, 변환 규칙 표 갱신, DESIGN.md 확장 필드 중복 제거
- [x] `REQUIREMENTS.md.template`: route / layout 자리 추가
- [x] Commit: `feat(spec-6-03): F-03 add auto route/layout with override to finalPages` (`45d15cd`)

---

## Task 5: F-05 — `optionalSections` 빈 배열 규약

### 5-1. protocol + REQUIREMENTS.md.template
- [x] `blueprint-protocol.md` §Output: 빈 배열 표기 표 + 룰 (`[]` / `'none'` 허용, omit 금지) + 마크다운 readability
- [x] `REQUIREMENTS.md.template`: 페이지 블록의 선택 섹션 표기 가이드 추가
- [-] `DESIGN.md.template`: optionalSections 표기 없음 — 변경 불필요 (Pass)
- [x] Commit: `feat(spec-6-03): F-05 define optionalSections empty representation` (`de9c765`)

---

## Task 6: F-06 — Template 이름 유추 규칙

### 6-1. page-catalog 갱신
- [x] `page-catalog.md`: 유추 규칙 + 카테고리 접두 sub-table (auth/profile/dash 예외 + 일반)
- [x] 미구현 12 row 모두 예상 Template 이름 기재 (예: `⬜ MyPage`, `⬜ ContentListPage`)
- [x] Commit: `feat(spec-6-03): F-06 specify template name inference rule` (`a0578db`)

---

## Task 7: F-07 — Template 재사용 / 복제 정책 (soft)

### 7-1. protocol 정책 섹션 추가
- [x] §실행 원칙 #5 추가 (재사용 우선)
- [x] §"Template 재사용 / 복제 정책" 신설 (4 상황 표 + 룰 4 종)
- [x] §Output finalPages 예시에 `derivedFrom` 옵션 주석
- [x] §변환 규칙 표에 `derivedFrom` placeholder 매핑
- [x] Commit: `feat(spec-6-03): F-07 add template reuse policy + derivedFrom optional field` (`b111d97`)

---

## Task 8: F-02 — Placeholder 기원 분류표

### 8-1. blueprint-placeholder-map.md 신설 + DESIGN.md.template 분류
- [x] `schema/blueprint-placeholder-map.md` NEW: 70+ placeholder 5 기원 분류 (B/D/I/M/R) + 입력 폼 후보 + 다운스트림 자동화 가이드
- [x] `blueprint-protocol.md` §자동 주입: 분류표 참조 안내
- [x] `DESIGN.md.template` 헤더: 5 기원 분류 노트
- [x] Commit: `feat(spec-6-03): F-02 add placeholder origin classification map` (`a86a74a`)

---

## Task 9: Schema validator + 단위 테스트 + phase-5 회귀

### 9-1. validator + 테스트
- [x] `scripts/validate-blueprint.mjs` NEW — Node 표준만 사용. CLI + lenient/strict mode
- [x] `scripts/__tests__/validate-blueprint.test.mjs` NEW — 10 case
- [x] `node --test` PASS 10/10
- [x] phase-5 회귀 (poc/app-a/blueprint-session.md) lenient PASS — error 0 / warning N
- [x] Commit: `test(spec-6-03): add blueprint validator with 7-gap coverage + phase-5 regression` (`44f32ff`)

---

## Task 10: Ship

- [x] 전체 테스트 PASS (10/10)
- [x] phase-5 회귀 lenient PASS (15 warning, error 0)
- [x] **walkthrough.md** 작성
- [x] **pr_description.md** 작성
- [x] **Ship Commit**: `docs(spec-6-03): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-6-03-blueprint-protocol`
- [x] **PR 생성**: `gh pr create --base phase-6-studio-v1 ...`
- [x] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (Pre-flight 제외) |
| **예상 commit 수** | 10 (1 scaffold + 7 gap + 1 validator + 1 ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-09 |
