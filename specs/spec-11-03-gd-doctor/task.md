# Task List: spec-11-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-11.md SPEC 표 자동 갱신됨)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + culori 의존성 추가

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-11-03-gd-doctor`

### 1-2. culori install + doctor 디렉토리
- [ ] `pnpm --filter studio add culori @types/culori`
- [ ] `studio/scripts/gen-design/doctor/` 디렉토리 생성
- [ ] `doctor/types.ts` — DoctorCategory / DoctorDiag 타입 정의
- [ ] `doctor/messages.ts` — 한국어 메시지 템플릿 모음
- [ ] Commit: `chore(spec-11-03): add culori dep and doctor module skeleton`

---

## Task 2: `checkTokenFormat` — DTCG strict + 24 토큰 잠금 (TDD)

### 2-1.
- [ ] `__tests__/doctor/token-format.test.ts` — fixture: 잘못된 DTCG + shadcn 토큰 누락 (Red)
- [ ] `doctor/check-token-format.ts` 구현 (Green)
- [ ] Commit: `feat(spec-11-03): implement checkTokenFormat (DTCG strict + 24 token lock)`

---

## Task 3: `checkTokenRef` — DESIGN/chat ↔ TOKEN 참조 (TDD)

### 3-1.
- [ ] `__tests__/doctor/token-ref.test.ts` — fixture: DESIGN.md `{brand}` 미정의 / chat.md `bg-fake` (Red)
- [ ] `doctor/check-token-ref.ts` 구현 (Green) — Tailwind 클래스 추출 + tokens.json 매칭
- [ ] Commit: `feat(spec-11-03): implement checkTokenRef (DESIGN/chat → TOKEN reference)`

---

## Task 4: `checkContrast` — WCAG 2.1 AA 8 페어 (TDD)

### 4-1.
- [ ] `__tests__/doctor/contrast.test.ts` — fixture: 낮은 대비 토큰 (Red)
- [ ] `doctor/check-contrast.ts` 구현 — culori OKLCH → luminance → ratio
- [ ] 미달 시 가장 가까운 합격 OKLCH 제안 (L 조정 알고리즘)
- [ ] Commit: `feat(spec-11-03): implement checkContrast (WCAG AA 8 pairs + OKLCH suggestion)`

---

## Task 5: `checkSceneDrift` + `checkOrphanScene` (TDD)

### 5-1.
- [ ] `__tests__/doctor/scene-drift.test.ts` — fixture: chat mtime > tsx mtime
- [ ] `__tests__/doctor/orphan-scene.test.ts` — fixture: TSX 만 남음 + annotation 의 chat 부재
- [ ] `doctor/check-scene-drift.ts` 구현 (`// @gd:` 파싱 + mtime 비교)
- [ ] `doctor/check-orphan-scene.ts` 구현
- [ ] Commit: `feat(spec-11-03): implement checkSceneDrift and checkOrphanScene (// @gd: annotation)`

---

## Task 6: `checkVocabSimilar` — "Did you mean?" Levenshtein (TDD)

### 6-1.
- [ ] `__tests__/doctor/vocab-similar.test.ts` — fixture: `<MyBtn>` → `<Button>` 제안
- [ ] `doctor/check-vocab-similar.ts` 구현 — Levenshtein 직접 구현 + 거리 ≤ 3 제안
- [ ] Commit: `feat(spec-11-03): implement checkVocabSimilar (Levenshtein "Did you mean")`

---

## Task 7: `gen-design react` 에 `// @gd:` annotation 자동 삽입

### 7-1.
- [ ] `__tests__/react-annotation.test.ts` — 출력 TSX 첫 줄 = `// @gd: <relative-path>`
- [ ] `scripts/gen-design/react.ts` 의 출력 코드에 annotation prepend
- [ ] 기존 react 테스트 회귀 확인
- [ ] Commit: `feat(spec-11-03): emit // @gd: annotation in gen-design react output`

---

## Task 8: doctor 통합 + router + 메시지 포맷

### 8-1.
- [ ] `doctor/index.ts` — runDoctor() 통합 (기존 runLint 호출 + 신규 6 검증)
- [ ] 한국어 메시지 + hint 포맷팅 (CLI 출력)
- [ ] `--json` 옵션 (기계 처리)
- [ ] `scripts/gen-design.ts` router 에 `doctor` 추가
- [ ] `__tests__/doctor/integration.test.ts` — 통합 fixture (6 의도적 오류) 모두 검출 검증
- [ ] Commit: `feat(spec-11-03): wire up gd doctor command (router + Korean output + --json)`

---

## Task 9: Ship

- [ ] 코드 품질 점검: `pnpm --filter studio lint`
- [ ] 단위 테스트: `pnpm --filter studio test --run` (998 → 998+ PASS)
- [ ] **실행 시간 측정**: `time pnpm --filter studio exec tsx scripts/gen-design.ts doctor --chat-root playground/chats` (5초 목표)
- [ ] **walkthrough.md 작성** (각 검증 항목 fixture + 시연)
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-11-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-11-03-gd-doctor`
- [ ] **PR 생성**: `gh pr create --base phase-11-designer-onboarding-skill`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 9 |
| **예상 commit 수** | 9 (pre-flight 1 + Task 1: 1 + Task 2-8: 7 + Ship: 1) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |

---

## 작업 의존성

```
Task 1 (브랜치 + culori + 스켈레톤)
  ↓
Task 2-6 (5 신규 검증, 각 TDD — 순차 또는 병렬)
  ↓
Task 7 (react annotation — scene-drift 가 의존)
  ↓
Task 8 (router + 메시지 통합 + 통합 fixture)
  ↓
Task 9 (Ship)
```
