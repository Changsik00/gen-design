# Task List: spec-12-04

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-12.md SPEC 표 갱신 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

- [ ] `git checkout -b spec-12-04-similar-scenes-and-token-reuse` (base: `phase-12-conversation-depth-and-orchestration`)
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: gd-chat.md §5.6 추가 — 비슷한 화면 발견 가이드

- [ ] `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` 수정:
  - §5.5 checklist 항목 3 → "§5.6 가이드 실행" 참조로 업데이트
  - §5.5 와 §6 사이에 §5.6 삽입 (탐지 기준 + 4-옵션 결정 + decisions.md 기록 템플릿)
- [ ] Commit: `feat(spec-12-04): add §5.6 similar-scene detection and reuse guide`

---

## Task 3: gd-chat.md §5.7 추가 — 토큰 재사용 vs 확장 결정

- [ ] `gd-chat.md` §5.6 직후 §5.7 삽입:
  - 트리거: Structure 작성 중 tokens.json 에 없는 토큰 필요 시
  - `gd tokens find <keyword>` 안내 (spec-12-03 명령 연동)
  - 3-옵션 결정 (재사용 / 확장 / 보류) + decisions.md 기록
- [ ] Commit: `feat(spec-12-04): add §5.7 token reuse vs extension decision guide`

---

## Task 4: §10/§11/§12 업데이트

- [ ] `gd-chat.md` 보강:
  - §10 decisions.md 패턴: "유사 신 재사용 결정" entry 템플릿 + "토큰 재사용/확장 결정" entry 템플릿 추가
  - §11 안티 패턴: "기존 씬과 유사한데 비교 없이 신규" + "토큰 없다고 바로 신규 정의" 추가
  - §12 종료 조건: §5.6 / §5.7 확인 항목 추가
- [ ] Commit: `feat(spec-12-04): update §10/§11/§12 for reuse-decision patterns`

---

## Task 5: v5 시뮬레이션 검증

- [ ] `experiments/dogfood-alpha-v5/` 환경에서 새 씬 (`settings.chat.md`) 작성 시뮬레이션:
  - §5.6 유사 신 발견 flow 동작 확인 (login/signup 과 비교)
  - §5.7 토큰 결정 flow 동작 확인
  - `decisions.md` 에 "재사용 vs 확장" entry ≥1 기록 확인
- [ ] 시뮬 결과를 `experiments/dogfood-alpha-v5/transcripts/scene-5-settings.md` 로 저장
- [ ] Commit: `docs(spec-12-04): v5 settings-scene simulation transcript`

---

## Task 6: Ship

- [ ] 최종 검토: `gd-chat.md` 총 행수 ≤ 482
- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
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
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-23 |
