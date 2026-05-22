# Task List: spec-7-07

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-7-07-figma-adapter` (phase-7-design-md 기준)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: figma-types + figma-node-mapper 단위 테스트 (TDD Red)

- [ ] `studio/src/lib/figma-adapter/figma-types.ts` 타입 정의 (테스트용 최소 구조)
- [ ] `studio/src/lib/figma-adapter/__tests__/figma-node-mapper.test.ts` 작성
  - `normalizeLayerName`: 슬래시→dot, 대소문자, 엣지케이스(빈 세그먼트, 단일 이름)
  - `mapFigmaNode`: FRAME→Frame, TEXT→Text, INSTANCE→Frame, 재귀 children
- [ ] `pnpm test figma-node-mapper` → Fail 확인
- [ ] Commit: `test(spec-7-07): figma-node-mapper 단위 테스트 (red)`

---

## Task 3: figma-node-mapper 구현 (TDD Green)

- [ ] `studio/src/lib/figma-adapter/figma-node-mapper.ts` 구현
  - `normalizeLayerName(name: string): string`
  - `mapFigmaNode(node: FigmaNode): PaperTreeNode` (재귀)
- [ ] `pnpm test figma-node-mapper` → Pass 확인
- [ ] Commit: `feat(spec-7-07): figma-node-mapper 구현`

---

## Task 4: adapt.ts 단위 테스트 (TDD Red)

- [ ] `studio/src/lib/figma-adapter/__tests__/adapt.test.ts` 작성
  - 최소 픽스처 (FRAME 1개) → `adaptFigma` 호출 → `result.text` 비어있지 않음
  - `result.report.matched >= 0` 검증
- [ ] `pnpm test adapt.test` → Fail 확인
- [ ] Commit: `test(spec-7-07): adapt.ts 단위 테스트 (red)`

---

## Task 5: adapt.ts 구현 (TDD Green)

- [ ] `studio/src/lib/figma-adapter/adapt.ts` 구현
  - `adaptFigma(figmaNode, catalog, options?)` → `InferResult`
  - `mapFigmaNode` + `inferSpec` 조합
- [ ] `pnpm test adapt.test` → Pass 확인
- [ ] Commit: `feat(spec-7-07): adapt.ts 구현`

---

## Task 6: 픽스처 + 통합 테스트 (TDD Red → Green)

- [ ] `studio/src/lib/figma-adapter/fixtures/sample-page.json` 수동 작성
  - 최상위 FRAME "LoginPage"
  - 자식: INSTANCE "Button/Primary", FRAME "Input/Default", TEXT "제목"
- [ ] `studio/src/lib/figma-adapter/__tests__/adapt.integration.test.ts` 작성
  - fixture 로드 → `adaptFigma` → `parse(result.text).ok === true`
  - `result.report` 에 matched > 0 (또는 unmatched 목록 존재) 검증
- [ ] `pnpm test adapt.integration` → Pass 확인
- [ ] Commit: `test(spec-7-07): 통합 테스트 + 픽스처`

---

## Task 7: CLI figma-adapt.ts

- [ ] `studio/src/lib/figma-adapter/cli/figma-adapt.ts` 작성
  - `process.argv[2]` → JSON 파일 읽기
  - `adaptFigma` 호출
  - `console.log(result.text)` (stdout)
  - `console.error(JSON.stringify(reportSummary))` (stderr)
  - `import.meta.url` guard
- [ ] 수동 확인: `pnpm exec tsx src/lib/figma-adapter/cli/figma-adapt.ts fixtures/sample-page.json`
- [ ] Commit: `feat(spec-7-07): CLI figma-adapt`

---

## Task 8: Ship

- [ ] `pnpm -C studio typecheck` → PASS
- [ ] `pnpm -C studio test` → 전체 PASS
- [ ] 통합 테스트 PASS 확인
- [ ] **walkthrough.md 작성** (각 task 결과 + 리포트 예시 포함)
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-7-07): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-7-07-figma-adapter`
- [ ] **PR 생성**: `gh pr create --base phase-7-design-md`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 8 |
| **예상 commit 수** | 7 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
