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
- [ ] `git checkout -b spec-6-03-blueprint-protocol` (base: `phase-6-studio-v1`)
- [ ] `git add backlog/phase-6.md backlog/queue.md specs/spec-6-03-blueprint-protocol/`
- [ ] Commit: `docs(spec-6-03): scaffold spec/plan/task for blueprint protocol alignment`

---

## Task 2: F-01 — Step 1.5 (NFR) 체크리스트 강화

### 2-1. protocol §Step 1.5 + spec 템플릿
- [ ] `schema/blueprint-protocol.md` §Step 1.5 — NFR 체크리스트 (성능 / 보안 / 호환성 / 접근성 / i18n / 등 minimum 6 항목) 추가, 누락 시 fail-fast 명시
- [ ] `templates/REQUIREMENTS.md.template` — NFR 자리 명시 강화
- [ ] Commit: `feat(spec-6-03): F-01 add NFR checklist to protocol Step 1.5`

---

## Task 3: F-04 — `status` 어휘 단일화 (`implemented` literal + 표시 매핑)

### 3-1. protocol + page-catalog
- [ ] `schema/blueprint-protocol.md` §Output — `templateMapping.status` 값 `implemented` / `not-implemented` literal 강제
- [ ] `schema/page-catalog.md` — 표시 매핑 표 (✅ / `구현 완료` / `not-implemented` / `❌`) 추가, 표 헤더 갱신
- [ ] Commit: `feat(spec-6-03): F-04 unify status vocabulary to implemented literal + display map`

---

## Task 4: F-03 — `route` / `layout` 자동 + override

### 4-1. protocol Step 3 + REQUIREMENTS.md.template
- [ ] `schema/blueprint-protocol.md` §Step 3 — `finalPages[].route` / `.layout` 자동 채움 규칙 (`/{id}` / `default`) + override 가능
- [ ] `templates/REQUIREMENTS.md.template` — `route` / `layout` 출력 자리 추가
- [ ] Commit: `feat(spec-6-03): F-03 add auto route/layout with override to finalPages`

---

## Task 5: F-05 — `optionalSections` 빈 배열 규약

### 5-1. protocol + REQUIREMENTS.md.template
- [ ] `schema/blueprint-protocol.md` §Step 3 — 빈 `optionalSections` 표기 룰 (`none` 권장 / `[]` 허용)
- [ ] `templates/REQUIREMENTS.md.template` + `templates/DESIGN.md.template` — 빈 배열 예시 보강
- [ ] Commit: `feat(spec-6-03): F-05 define optionalSections empty representation`

---

## Task 6: F-06 — Template 이름 유추 규칙

### 6-1. page-catalog 갱신
- [ ] `schema/page-catalog.md` — 페이지 id (kebab-case) → Template 이름 (PascalCase + `Page`) 유추 규칙 명시
- [ ] 미구현 페이지 카탈로그 항목에도 예상 Template 이름 기재
- [ ] Commit: `feat(spec-6-03): F-06 specify template name inference rule (kebab → PascalCase + Page)`

---

## Task 7: F-07 — Template 재사용 / 복제 정책 (soft)

### 7-1. protocol 정책 섹션 추가
- [ ] `schema/blueprint-protocol.md` — 새 §"Template 재사용 정책" 추가 (재사용 우선, 복제 시 origin 갱신 의무)
- [ ] `schema/blueprint-protocol.md` §Output — `templateMapping.derivedFrom` 옵션 필드 명시
- [ ] Commit: `feat(spec-6-03): F-07 add template reuse policy + derivedFrom optional field`

---

## Task 8: F-02 — Placeholder 기원 분류표

### 8-1. blueprint-placeholder-map.md 신설 + DESIGN.md.template 분류
- [ ] `schema/blueprint-placeholder-map.md` 신설 — `templates/DESIGN.md.template` 의 모든 placeholder 를 *기원* 별 (Blueprint / 디자인도구 / 수동) 표
- [ ] `templates/DESIGN.md.template` — 각 placeholder 위에 `<!-- origin: ... -->` 주석 또는 분류표 참조 노트
- [ ] `schema/blueprint-protocol.md` — placeholder map 참조 안내 추가
- [ ] Commit: `feat(spec-6-03): F-02 add placeholder origin classification map`

---

## Task 9: Schema validator + 단위 테스트 + phase-5 회귀

### 9-1. validator + 테스트
- [ ] `scripts/validate-blueprint.mjs` 신설 — REQUIREMENTS.md 입력 받아 7 gap 룰 모두 검증
- [ ] `scripts/__tests__/validate-blueprint.test.mjs` — 7 gap 각각 정상 / 위반 케이스 + phase-5 산출물 회귀
- [ ] `node --test scripts/__tests__/validate-blueprint.test.mjs` PASS
- [ ] `node scripts/validate-blueprint.mjs poc/app-a/REQUIREMENTS.md` PASS (또는 명시된 경고만)
- [ ] Commit: `test(spec-6-03): add blueprint validator with 7-gap coverage + phase-5 regression`

---

## Task 10: Ship

- [ ] 전체 테스트 (`node --test scripts/__tests__/validate-blueprint.test.mjs`) PASS
- [ ] phase-5 회귀 통과 확인
- [ ] **walkthrough.md** 작성
- [ ] **pr_description.md** 작성
- [ ] **Ship Commit**: `docs(spec-6-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-6-03-blueprint-protocol`
- [ ] **PR 생성**: `gh pr create --base phase-6-studio-v1 ...`
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 10 (Pre-flight 제외) |
| **예상 commit 수** | 10 (1 scaffold + 7 gap + 1 validator + 1 ship) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-09 |
