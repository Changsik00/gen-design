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

- [x] `data/aria-roles.json` — ARIA 1.3 의 78 role (abstract/widget/composite/documentStructure/landmark/liveRegion/windowLike 카테고리)
- [x] `studio/src/lib/vocabulary/catalog/tier1-aria.ts` — JSON 로더 + lookup map + isAriaRole 헬퍼
- [x] 단위 테스트: 7 case (widget/composite/dialog/landmark/미등록/총수/메타) 모두 PASS
- [x] Commit: `feat(spec-7-01): add ARIA 1.3 tier 1 vocabulary`

---

## Task 4: cva AST 추출기 (TS compiler API)

- [x] `studio/src/lib/vocabulary/extractor/plugins/types.ts` — plugin 인터페이스 + ExtractedComponent / ExtractedAxis 타입
- [x] `studio/src/lib/vocabulary/extractor/plugins/cva-plugin.ts` — cva() 콜 walk + variants/defaultVariants/ARIA role 휴리스틱
- [x] `studio/src/lib/vocabulary/extractor/index.ts` — public API (extractFromFile/Source/Directory)
- [x] 단위 테스트: 실 ui/button.tsx 추출 (6 variant + 8 size + ARIA "button") + 합성 케이스 6 = 8 case PASS
- [-] props-extractor (VariantProps 별도 추출) — cva-plugin 에 통합. ADR-004 NFR-1 의 plugin 구조는 보존
- [x] Commit: `feat(spec-7-01): add cva AST extractor`

---

## Task 5: 3-tier 카탈로그 자동 생성

- [x] `studio/src/lib/vocabulary/catalog/index.ts` — `buildCatalog()` (3 tier 통합) + buildLookup + allComponentNames
- [x] manual 패턴 plugin 추가 — composites/templates 가 cva 안 써도 카탈로그 등재 가능
- [x] 결정성 (deterministic) 검증 통과 — 같은 입력 → 동일 JSON
- [x] 단위 테스트: 7 case + 기존 manual case 1 = 8 추가, 총 38 case PASS
- [-] catalog.json 파일 자동 출력 — Task 11 (CLI) 에 흡수 (build 시점에 생성)
- [x] Commit: `feat(spec-7-01): build 3-tier catalog from local components`

---

## Task 6: spec.md JSON Schema 자동 생성

- [x] `studio/src/lib/vocabulary/catalog/spec-schema.ts` — `generateSpecSchema(catalog)` → JSON Schema
- [x] 컴포넌트 enum (oneOf) + axis enum + tokens override 의 token 참조 패턴 + raw 색상 거부
- [x] children 재귀 검증
- [x] theme attribute 지원 (D-3 Layer 3)
- [x] 단위 테스트: 11 case (유효/무효 컴포넌트, raw hex 거부, i18n 참조, children 재귀 등) PASS
- [-] spec-schema.json 파일 출력 — Task 11 (CLI) 에서 build 시점 생성
- [x] Commit: `feat(spec-7-01): generate spec.md JSON Schema from catalog`

---

## Task 7: tokens.json 의 DTCG 1.0 정렬

- [x] `templates/assets/tokens/tokens.json` 검사 — *이미 DTCG 1.0 strict 호환* ($value/$type 사용, group 상속, references)
- [x] dtcg validator 의 root metadata ($schema URL) 허용으로 schema 갱신 — 의미 변경 없이 정렬
- [x] tokens-dtcg-compliance.test.ts 추가 — 실 tokens.json 이 DTCG schema 통과 검증
- [x] studio 전체 단위 테스트 328/328 PASS — 회귀 0 (paper-sync resolver 8 case 포함)
- [x] Commit: `refactor(spec-7-01): align tokens.json with DTCG 1.0 strict format`

---

## Task 8: TOKEN.md 자동 렌더러

- [x] `studio/src/lib/vocabulary/render/token-md.ts` — DTCG → TOKEN.md (flatten + group + 표)
- [x] 표 형식 + DTCG metadata ($type, $description) 보존
- [x] AUTO-GENERATED 마커 + 외부 도구 호환 안내 포함
- [x] 단위 테스트 5 case PASS (주요 토큰 + 결정성 + Total 카운트)
- [-] 파일 출력 (`templates/TOKEN.md`) — Task 11 (CLI) 에서
- [x] Commit: (Task 9 와 통합)

---

## Task 9: FRONT.md 자동 렌더러

- [x] `studio/src/lib/vocabulary/render/front-md.ts` — catalog → FRONT.md
- [x] 3 tier 별 컴포넌트 + axis + value 표 + 4 layer 설명
- [x] Paper 노드명 컨벤션 + raw 금지/미등록 금지 강제 명시
- [x] shadcn registry install 안내 (`npx shadcn add @designmd/...`)
- [x] AUTO-GENERATED 마커 + 결정성
- [x] 단위 테스트 7 case PASS (4 layer + Tier 1/2/3 + raw 금지 명시 + 결정성)
- [-] 파일 출력 — Task 11 (CLI) 에서
- [x] Commit: `feat(spec-7-01): add TOKEN.md + FRONT.md auto-renderers`

---

## Task 10: DESIGN.md 자동 렌더러 (Stitch superset) + Stitch subset export

- [x] `studio/src/lib/vocabulary/render/design-md.ts` — Stitch 9 섹션 (Overview/Colors/Typography/Layout/Elevation/Shapes/Components/Dos-Donts/Iconography) + 확장 §10 i18n / §11 컴포넌트 인스턴스 어휘 / §12 Paper 매핑
- [x] `studio/src/lib/vocabulary/render/stitch-export.ts` — Stitch 0.1 호환 subset 추출 (§10~12 제거 + frontmatter 정렬)
- [x] AUTO-GENERATED 마커 + frontmatter (schema, supersetOf, name, version)
- [x] 단위 테스트 9 case (9 섹션 + 확장 + Components 어휘 + Do's/Don'ts + Stitch 추출 3 case) PASS
- [-] Stitch CLI 검증 — Stitch CLI 환경 부재. schema 정합 manual 검증으로 갈음
- [-] 파일 출력 — Task 11 (CLI) 에서
- [x] Commit: `feat(spec-7-01): add DESIGN.md auto-renderer (Stitch superset)`

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
