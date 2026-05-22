# Task List: spec-09-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-09.md SPEC 표 자동 갱신 by sdd)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [x] `git checkout -b spec-09-04-external-alpha`
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: handbook 통독 + 역할극 도그푸딩 세션

- [x] `docs/handbook.md` 전체 통독 — 처음 보는 디자이너 관점
- [x] handbook §4 워크플로를 따라 `playground/chats/scenes/profile.chat.md` 작성 시도
  - 막히는 지점 기록 (단계, 현상, 예상 소요 시간)
  - 불명확한 용어 / 예시 부족 항목 메모
- [x] Commit: `feat(spec-09-04): add profile.chat.md (external-alpha session artifact)`

---

## Task 3: external-alpha-1.md 보고서 작성

- [x] `docs/external-alpha-1.md` 작성
  - 방법론 섹션 (역할극 명시)
  - 차단점 표 (최소 3 건)
  - 매끄러운 부분 (최소 2 건)
  - handbook 보정 후보 표 (최소 3 건)
- [x] Commit: `docs(spec-09-04): add external-alpha-1 report`

---

## Task 4: handbook 보정 적용

- [x] 보고서의 보정 후보에서 임팩트 가장 큰 1 항목 이상 `docs/handbook.md` 에 반영
- [x] Commit: `docs(spec-09-04): apply handbook corrections from external-alpha-1`

---

## Task 5: Ship

> `/hk-ship` 절차를 따릅니다.

- [ ] `cd studio && pnpm test` → PASS (코드 변경 없으므로 회귀 없음)
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-09-04): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-09-04-external-alpha`
- [ ] **PR 생성**: `phase-09-gen-design-live` 브랜치 대상
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (+ Ship) |
| **예상 commit 수** | 4 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-22 |
