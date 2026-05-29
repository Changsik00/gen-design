# Task List: spec-13-02

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
- [x] `git checkout -b spec-13-02-intake-existing-assets`
- Commit: 없음 (브랜치 생성만)

---

## Task 2 — gd-start 현행 분석

gd-start.md와 연관 스킬 흐름을 검토하고 변경 기준선 확보.

- [ ] `packages/gd-skills/skills/gd-start.md` 전체 검토 (이미 컨텍스트에 있음)
- [ ] `packages/gd-skills/skills/gd-design.md` §2 빈 섹션 스캔 로직 확인 (재활용 대상)
- [ ] `packages/gd-skills/skills/gd-token.md` §3 색 입력 처리 로직 확인 (재활용 대상)
- [ ] Commit: `docs(spec-13-02): analysis — gd-start intake redesign baseline`

---

## Task 3 — gd-start.md 재작성

자산 감지 + 4가지 intake 경로 + 기존 온보딩 흐름 통합.

- [ ] `packages/gd-skills/skills/gd-start.md` 업데이트:
  - §1 자동 로딩 컨텍스트 — 기존 자산 파일 포함
  - §2 환영 메시지 — intake 가능 언급
  - **§3 자산 감지 (신규)** — AskUserQuestion 4가지 타입
  - **§4 intake 경로 (신규)** — 타입별 처리 (기획/DESIGN.md/TOKEN.md/빈 슬레이트)
  - §5 4축 어휘 요약 (기존 §5, 번호 조정)
  - §6 워크플로 다이어그램 (기존 §6)
  - §7 다음 단계 안내 (기존 §7, intake 완료 케이스 추가)
  - §8~§10 기존 내용 유지
- [ ] Commit: `docs(spec-13-02): rewrite gd-start with asset intake paths`

---

## Task 4 — Ship

- [ ] **walkthrough.md 작성**
- [ ] **pr_description.md 작성**
- [ ] **Ship Commit**: `docs(spec-13-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-13-02-intake-existing-assets`
- [ ] **PR 생성**: `phase-13-vertical-slice` 타겟
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 |
| **예상 commit 수** | 3 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-29 |
