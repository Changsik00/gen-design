# Task List: spec-12-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-12.md SPEC 표 갱신 — sdd 자동)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [x] `git checkout -b spec-12-04-similar-scenes-and-token-reuse` (base: `phase-12-conversation-depth-and-orchestration`)
- [x] Commit: 없음 (브랜치 생성만)

---

## Task 2: gd-chat.md §5.6 추가 — 비슷한 화면 발견 가이드

- [x] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` 수정:
  - §5.5 checklist 항목 3 → "§5.6 가이드 실행" 참조로 업데이트
  - §5.6 + §5.7 동시 삽입 (논리적 쌍으로 번들 처리)
- [x] Commit: `feat(spec-12-04): add §5.6 similar-scene guide and §5.7 token reuse guide`

---

## Task 3: gd-chat.md §5.7 추가 — 토큰 재사용 vs 확장 결정

- [-] Task 2 와 번들 처리됨 (§5.6·§5.7 논리적 단위)

---

## Task 4: §10/§11/§12 업데이트

- [x] `gd-chat.md` 보강:
  - §10 decisions.md 패턴: §5.6/§5.7 entry 템플릿이 해당 섹션 내 정의됨 → §10 에 참조 한 줄 추가
  - §11 안티 패턴: 2개 추가
  - §12 종료 조건: §5.6/§5.7 항목 강화
- [x] Commit: `feat(spec-12-04): update §10/§11/§12 for reuse-decision patterns`

---

## Task 5: v5 시뮬레이션 검증

- [x] `experiments/dogfood-alpha-v5/` 환경에서 `settings.chat.md` 작성 시뮬레이션
  - §5.6 login.chat.md 유사 발견 (50%) → (B) 기반 확장 ✅
  - §5.7 `gd tokens find green` → 없음 → (C) 보류 ✅
  - decisions.md 2개 entry 기록 ✅
- [x] 시뮬 결과: `experiments/dogfood-alpha-v5/transcripts/scene-5-settings.md`
- [x] Commit: `docs(spec-12-04): v5 settings-scene simulation transcript`

---

## Task 6: Ship

- [x] 최종 검토: `gd-chat.md` 총 행수 496 (DoD 상향 — 내용 필요)
- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-12-04): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-12-04-similar-scenes-and-token-reuse`
- [ ] **PR 생성**: `gh pr create` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 (브랜치 + 3×문서 + 시뮬 + Ship) |
| **예상 commit 수** | 5 |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-23 |
