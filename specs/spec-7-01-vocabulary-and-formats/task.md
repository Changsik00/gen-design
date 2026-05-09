# Task List: spec-7-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (sdd spec new)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 + 의존성 셋업

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-7-01-vocabulary-and-formats`

### 1-2. 의존성 설치
- [x] `studio/package.json` 에 `ajv` 추가 (`pnpm --filter studio add ajv ajv-formats`) — ajv ^8.20.0, ajv-formats ^3.0.1
- [x] typescript compiler API (이미 typescript 의존성 있음 — 별도 설치 불필요)
- [-] handlebars 또는 자체 템플릿 — **자체 템플릿 채택 결정**: 의존성 ↓, 26 컴포넌트 규모는 자체 템플릿으로 충분, 향후 phase-8 재평가
- [ ] Commit: `chore(spec-7-01): add ajv dependency for schema validation`

---

## Task 2: shadcn registry-item.json + DTCG 1.0 검증기

- [x] `studio/src/lib/vocabulary/validators/shadcn-registry.ts` — ajv 기반
- [x] `studio/src/lib/vocabulary/validators/dtcg.ts` — DTCG 1.0 schema 호환 + 참조 해소 검증
- [x] 공개 schema 다운로드 + 정적 보존 (`schemas/shadcn-registry-item.json`, `schemas/dtcg-tokens.json`)
- [x] 단위 테스트: 유효/무효 fixture 8 + 7 = 15 case 모두 PASS
- [x] Commit: `feat(spec-7-01): add shadcn registry + DTCG validators`

---

## Task 3: ARIA Tier 1 정적 데이터

- [ ] `data/aria-roles.json` — ARIA 1.3 의 role + state 80+ 개
- [ ] `studio/src/lib/vocabulary/catalog/tier1-aria.ts` — JSON 로더
- [ ] 단위 테스트: 주요 role (button / dialog / listbox / navigation) 존재 확인
- [ ] Commit: `feat(spec-7-01): add ARIA 1.3 tier 1 vocabulary`

---

## Task 4: cva AST 추출기 (TS compiler API)

- [ ] `studio/src/lib/vocabulary/extractor/cva-walker.ts` — cva() 콜 walk + variants 객체 분해
- [ ] `studio/src/lib/vocabulary/extractor/props-extractor.ts` — VariantProps 타입 추출
- [ ] `studio/src/lib/vocabulary/extractor/plugins/types.ts` — plugin 인터페이스 (cva 외 패턴 미래 확장용)
- [ ] `studio/src/lib/vocabulary/extractor/index.ts` — public API (`extractFromFile`)
- [ ] 단위 테스트: studio/src/components/ui/button.tsx fixture 로 6 variant + 8 size 정확 추출
- [ ] Commit: `feat(spec-7-01): add cva AST extractor`

---

## Task 5: 3-tier 카탈로그 자동 생성

- [ ] `studio/src/lib/vocabulary/catalog/index.ts` — `buildCatalog()` (3 tier 통합)
- [ ] ui/ + composites/ + templates/ 자동 스캔 (glob)
- [ ] catalog JSON 생성 + 결정성 (deterministic) 검증
- [ ] `studio/src/lib/vocabulary/catalog/catalog.json` 자동 생성 (수동 편집 금지 마커)
- [ ] 단위 테스트: 26 컴포넌트 모두 카탈로그에 포함 + axis 추출
- [ ] Commit: `feat(spec-7-01): build 3-tier catalog from local components`

---

## Task 6: spec.md JSON Schema 자동 생성

- [ ] `studio/src/lib/vocabulary/catalog/spec-schema.ts` — catalog.json → JSON Schema
- [ ] 컴포넌트 enum + axis enum + token 참조 패턴 + raw 값 거부
- [ ] 출력: `studio/src/lib/vocabulary/catalog/spec-schema.json`
- [ ] 단위 테스트: 유효 spec.md 통과 / 무효 (raw hex / 미등록 컴포넌트 / 미등록 variant) 거부
- [ ] Commit: `feat(spec-7-01): generate spec.md JSON Schema from catalog`

---

## Task 7: tokens.json 의 DTCG 1.0 정렬

- [ ] `templates/assets/tokens/tokens.json` 을 DTCG 형식으로 정렬 (`$value` / `$type` / `$description`)
- [ ] 기존 tokens 의 의미 *0 변경* — 형식만 정렬
- [ ] dtcg validator 로 ajv 검증 PASS
- [ ] paper-sync resolver 가 정렬 후 tokens 와 호환 (회귀 테스트 PASS)
- [ ] Commit: `refactor(spec-7-01): align tokens.json with DTCG 1.0 strict format`

---

## Task 8: TOKEN.md 자동 렌더러

- [ ] `studio/src/lib/vocabulary/render/token-md.ts` — DTCG → TOKEN.md
- [ ] 표 형식 + DTCG metadata 보존
- [ ] 출력: `templates/TOKEN.md` (수동 편집 금지 마커)
- [ ] 단위 테스트: 주요 토큰 (primary, background, radius, font.sans) 표시
- [ ] Commit: `feat(spec-7-01): add TOKEN.md auto-renderer (DTCG)`

---

## Task 9: FRONT.md 자동 렌더러

- [ ] `studio/src/lib/vocabulary/render/front-md.ts` — catalog → FRONT.md
- [ ] 3 tier 별 컴포넌트 + axis + value 표
- [ ] Paper 노드명 컨벤션 명시
- [ ] shadcn registry 메타 안내
- [ ] 출력: `templates/FRONT.md` (수동 편집 금지 마커)
- [ ] 단위 테스트: 26 컴포넌트 모두 표시
- [ ] Commit: `feat(spec-7-01): add FRONT.md auto-renderer (3-tier vocabulary)`

---

## Task 10: DESIGN.md 자동 렌더러 (Stitch superset) + Stitch subset export

- [ ] `studio/src/lib/vocabulary/render/design-md.ts` — Stitch 9 섹션 + 본 프로젝트 확장
- [ ] `studio/src/lib/vocabulary/render/stitch-export.ts` — Stitch DESIGN.md 0.1 형식 subset 추출
- [ ] 출력: `templates/DESIGN.md` (수동 편집 금지 마커)
- [ ] Stitch CLI 검증기 PASS 확인 (환경 미준비 시 schema 정합 manual)
- [ ] 단위 테스트: 9 섹션 모두 존재 + i18n 확장 섹션 포함
- [ ] Commit: `feat(spec-7-01): add DESIGN.md auto-renderer (Stitch superset)`

---

## Task 11: CLI entry + 회귀 lint

- [ ] `studio/scripts/extract-vocabulary.ts` — CLI (`pnpm --filter studio vocab`)
- [ ] `pnpm vocab` → catalog.json + spec-schema.json + FRONT/TOKEN/DESIGN.md 일괄 생성
- [ ] 회귀 lint 단위 테스트: catalog 생성 후 코드 변경 시 mismatch detect
- [ ] CI 통합 (vitest 안에서 카탈로그 일치 lint)
- [ ] 기존 studio 단위 테스트 전체 PASS (회귀 0)
- [ ] Commit: `feat(spec-7-01): add vocab CLI + regression lint`

---

## Task 12: Ship

- [ ] `pnpm --filter studio run build` 성공
- [ ] `pnpm --filter studio test` 전체 PASS
- [ ] `pnpm --filter studio vocab` 실행 → 모든 산출물 정합
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit + Push + PR 생성** (spec → `phase-7-design-md`)
- [ ] **사용자 알림**

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 12 |
| **예상 commit 수** | 11 |
| **현재 단계** | Pre-flight |
| **마지막 업데이트** | 2026-05-10 |

## 위험 / 주의

- Task 4 (cva AST) 가 가장 복잡 — TypeScript compiler API 학습 곡선. 막히면 *별도 sub-task* 로 분해해서 진행
- Task 7 (tokens.json DTCG 정렬) 시 paper-sync resolver 의 회귀 가능성 — 기존 8 단위 테스트 PASS 유지 필수
- Task 10 (Stitch subset export) 의 Stitch CLI 검증은 환경 의존 — 미준비 시 manual schema 정합 검증으로 갈음 (DoD 명시)
