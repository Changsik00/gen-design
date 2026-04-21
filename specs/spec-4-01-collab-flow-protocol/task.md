# Task List: spec-4-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`specs/spec-4-01-collab-flow-protocol/`)
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-4.md SPEC 표 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + 스캐폴드 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-4-01-collab-flow-protocol phase-4-collab-flow` (phase base 에서 분기)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 스캐폴드 커밋
- [ ] `specs/spec-4-01-collab-flow-protocol/{spec,plan,task}.md` (신규)
- [ ] `backlog/phase-4.md` — sdd 가 spec 표에 spec-4-01 행 추가
- [ ] `backlog/queue.md` — sdd 가 active 섹션 spec 카운트 갱신
- [ ] Commit: `docs(spec-4-01): scaffold spec/plan/task and register in backlog`

---

## Task 2: 협업 Flow 프로토콜 본문 작성

> docs-only. 단일 커밋으로 `collaboration-flow.md` 의 핵심 본문 (서문 / 3 역할 / 6 단계 상세 / Phase 매핑 / 도구 부록) 을 한번에 작성.

### 2-1. 문서 본문 작성
- [ ] `docs/guides/collaboration-flow.md` 신규 작성
  - 서문 · 3 역할 정의 · 6 단계 개요
  - 각 단계 상세 (목적 / 입력 / 출력 / 주 역할 / 도구 / Done 기준 / PoC 훅)
  - Phase 1~3 산출물 매핑 표
  - 부록 A (도구 매핑: Paper MCP / Figma / Tokens Studio)
  - 부록 B (관련 문서 cross-link 목록)
- [ ] 내부 상대 링크 유효성 확인 (수동 grep 기반 — plan.md §대체 자동 검증 참고)
- [ ] Commit: `docs(spec-4-01): add collaboration flow protocol`

---

## Task 3: 관련 문서 양방향 cross-link

> 기존 3 개 문서 상단에 본 프로토콜 참조 노트 추가.

### 3-1. cross-link 적용
- [ ] `docs/integrations/paper-mcp.md` 상단 `> [!NOTE]` 추가 (Stage 2 Extract / Stage 5 Render 인용)
- [ ] `docs/integrations/figma-sync.md` 상단 `> [!NOTE]` 추가 (Stage 2 Extract / Stage 6 Iterate 인용)
- [ ] `docs/guides/e2e-demo-loginpage.md` 상단 `> [!NOTE]` 추가 (본 프로토콜의 E2E 구현 사례 명시)
- [ ] 3 개 파일의 링크 유효성 수동 확인
- [ ] Commit: `docs(spec-4-01): cross-link integrations and e2e demo to flow protocol`

---

## Task 4: Ship

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 4-1. 품질 점검
- [ ] 링크 유효성 재확인 (`grep -Eo "\]\([^)]+\.md[^)]*\)" docs/guides/collaboration-flow.md`)
- [ ] Markdown 렌더링 이상 없음 (GitHub preview 또는 로컬 VSCode preview)
- [ ] Integration test — 해당 없음 (docs-only)

### 4-2. Ship artifacts
- [ ] `walkthrough.md` 작성 (증거 로그 — 각 단계에서 작성된 내용 요약 + 수동 검증 시나리오 결과)
- [ ] `pr_description.md` 작성 (템플릿 준수, base = `phase-4-collab-flow`)
- [ ] Ship Commit: `docs(spec-4-01): ship walkthrough and pr description`

### 4-3. Push + PR
- [ ] Push: `git push -u origin spec-4-01-collab-flow-protocol`
- [ ] PR 생성: `gh pr create --base phase-4-collab-flow --head spec-4-01-collab-flow-protocol ...` (자동) → URL 사용자 보고
- [ ] 사용자 알림: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (브랜치+스캐폴드 / 본문 작성 / cross-link / Ship) |
| **예상 commit 수** | 4 (스캐폴드 1 + 본문 1 + cross-link 1 + ship 1) |
| **현재 단계** | Execution (Task 1 진행 중) |
| **마지막 업데이트** | 2026-04-21 |
