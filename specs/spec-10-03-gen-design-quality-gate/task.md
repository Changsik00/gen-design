# Task List: spec-10-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 백로그 업데이트 (phase-10.md SPEC 표 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: workspace root gen-design alias 추가

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-10-03-gen-design-quality-gate`
- [ ] Commit: 없음 (브랜치 생성만)

### 1-2. alias 추가 + 검증
- [ ] `package.json` (repo root) `scripts` 에 `"gen-design": "pnpm --filter studio gen-design"` 추가
- [ ] `pnpm gen-design lint --chat-root playground/chats` (repo root) → 정상 실행 확인
- [ ] Commit: `feat(spec-10-03): add workspace root gen-design script alias`

---

## Task 2: StatCard variant cva 구현 + catalog 갱신

### 2-1. 타입 + 컴포넌트 + 테스트 (TDD)
- [ ] `studio/src/components/templates/types.ts` — `StatCardData.variant` 추가
- [ ] `studio/src/components/composites/StatCard/StatCard.test.tsx` — variant 테스트 3건 추가 (Red)
- [ ] `pnpm --filter studio test --run` → 3건 Fail 확인
- [ ] `studio/src/components/composites/StatCard/index.tsx` — cva `statCardVariants` 구현 (Green)
- [ ] `pnpm --filter studio test --run` → 995+ PASS 확인
- [ ] `pnpm --filter studio vocab` → catalog 재생성
- [ ] catalog.json StatCard axes 에 `variant` 등재 확인
- [ ] Commit: `feat(spec-10-03): add StatCard variant axis and update catalog`

---

## Task 3: dogfooding-score.ts 스크립트 + CI step

### 3-1. 스크립트 작성 + CI 추가
- [ ] `studio/scripts/dogfooding-score.ts` 신규 작성
- [ ] `studio/package.json` 에 `"dogfooding": "tsx scripts/dogfooding-score.ts"` 추가
- [ ] `pnpm --filter studio dogfooding` → 표 출력 확인
- [ ] `.github/workflows/ci.yml` `test` job 마지막에 `Dogfooding score` step 추가
- [ ] Commit: `feat(spec-10-03): add dogfooding-score script and CI step`

---

## Task 4: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

- [ ] 코드 품질 점검: `pnpm --filter studio lint`
- [ ] 단위 테스트: `pnpm --filter studio test --run` (995+ PASS)
- [ ] workspace alias 검증: `pnpm gen-design lint --chat-root playground/chats`
- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-10-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-10-03-gen-design-quality-gate`
- [ ] **PR 생성**: `gh pr create --base phase-10-verification-automation`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 4 (pre-flight 1 + task 3) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
