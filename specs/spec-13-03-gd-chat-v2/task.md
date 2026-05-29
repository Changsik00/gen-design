# Task List: spec-13-03

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout phase-13-vertical-slice && git pull`
- [x] `git checkout -b spec-13-03-gd-chat-v2`
- Commit: 없음

---

## Task 2 — gd-chat.md v2 재작성

v2 레이어 안내 추가 + 컴파일러 참조 제거.

- [ ] `packages/gd-skills/skills/gd-chat.md` 업데이트:
  - frontmatter 예시에 `version: 2` 추가
  - §5.5 checklist에 Data/API/Scenarios 확인 추가
  - §5.8 Data 레이어 작성 안내 (신규)
  - §5.9 API 레이어 작성 안내 (신규)
  - §5.10 Scenarios 레이어 작성 안내 (신규, 최소 3개 강제)
  - §5.11 DB Hints 선택 안내 (신규)
  - §9 컴파일 명령 → LLM 직접 요청 + gd extract 안내로 교체
  - §11 안티 패턴 업데이트
  - §12 종료 조건에 Scenarios 체크 추가
- [ ] Commit: `docs(spec-13-03): rewrite gd-chat for v2 format — add data/api/scenarios layers`

---

## Task 3 — Ship

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] **Ship Commit**: `docs(spec-13-03): ship walkthrough and pr description`
- [x] **Push**: `git push -u origin spec-13-03-gd-chat-v2`
- [x] **PR 생성**: `phase-13-vertical-slice` 타겟
- [x] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 |
| **예상 commit 수** | 2 |
| **현재 단계** | Done |
| **마지막 업데이트** | 2026-05-29 |
