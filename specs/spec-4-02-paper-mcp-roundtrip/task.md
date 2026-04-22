# Task List: spec-4-02

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성 (`specs/spec-4-02-paper-mcp-roundtrip/`)
- [x] spec.md 작성 (Research 타입)
- [x] plan.md 작성 (15 토큰 / 계열별 기준 / Paper 위치 확인)
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-4.md SPEC 표 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + 스캐폴드 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-4-02-paper-mcp-roundtrip phase-4-collab-flow`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. 스캐폴드 커밋
- [ ] `specs/spec-4-02-paper-mcp-roundtrip/{spec,plan,task}.md` + sdd-auto backlog 갱신
- [ ] Commit: `docs(spec-4-02): scaffold spec/plan/task and register in backlog`

---

## Task 2: 픽스처 준비

### 2-1. LoginPage DESIGN.md 픽스처 작성
- [x] `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md` 신규 작성
  - 14 섹션 구조 (§1~§14, 본 PoC 에선 §2/§3/§5/§6/§11 중심)
  - `e2e-demo-loginpage.md` 의 LoginPage 명세 재구성
  - 15 측정 토큰 (plan.md §측정 토큰) 모두 명시적으로 포함
- [x] 토큰 값이 Phase 2 studio/src/components/templates/LoginPage/ 실제 구현과 일치 확인 (수동 대조)
- [x] Commit: `docs(spec-4-02): add LoginPage DESIGN.md fixture`

---

## Task 3: 정방향 PoC 실행 (DESIGN → Paper)

> ⚠ **실제 Paper 환경 쓰기 작업**. Plan Accept 시점에 사용자가 승인한 작업 위치 사용.

### 3-1. 환경 확인
- [x] Paper MCP `get_basic_info` 실행 → "Welcome to Paper" / Inter/Geist/JetBrains Mono
- [x] 작업 페이지 확인 → 단일 Page 1. Paper MCP 에 page 생성 도구 부재 → 새 아트보드로 격리 (RQ5-1)

### 3-2. 아트보드 생성 + 렌더링
- [x] `get_font_family_info(["Inter","Geist"])` — Inter 선택 (500/600 weight 존재)
- [x] `create_artboard` → `1BN-0` (1440×900, bg oklch(1 0 0), fontFamily Inter)
- [x] `write_html` × 6 — Card / CardHeader / LoginForm / Divider / SocialAuthBlock / SignupPrompt
- [x] `update_styles` — 해당 없음 (inline style 로 첫 write 시 확정)
- [x] `get_screenshot` — 중간 + 최종 2 회. Review Checkpoint PASS
- [x] `finish_working_on_nodes([1BN-0])` — working indicator 해제
- [x] 실험 로그 `docs/experiments/paper-roundtrip-2026-04-22.md` 시간순 기록
- [x] Commit: `docs(spec-4-02): execute forward render proof of concept`

---

## Task 4: 역방향 PoC 실행 (Paper → DESIGN)

### 4-1. 역추출
- [x] `get_tree_summary(1BO-0, depth=3)` — Card 하위 트리 확인
- [x] `get_computed_styles(9 nodes batch)` — 15 토큰 대응 노드 배치 조회
- [x] `get_node_info` — Task 3 의 create 결과로 대체 (트리와 배치 스타일로 충분)
- [x] `get_font_family_info` — Task 3-2 에서 이미 확인
- [x] 추출 결과 → 실험 로그 §5~§6 에 정리 (DESIGN.md' 전체 재구성은 값 변환 표기뿐이라 생략)
- [x] Commit: `docs(spec-4-02): execute reverse extract proof of concept`

---

## Task 5: Diff 측정 + 계열별 자동화율

### 5-1. 15 토큰 diff 표 작성
- [x] 실험 로그 §6 에 15 × {원본 / Paper Observed / 일치 / 비고} 표 추가
- [x] 계열별 자동화율 계산 — §7 표
- [x] 기준 통과 여부 판정 — **15/15 = 100%, 전 계열 PASS**
- [x] Commit: Task 4 와 통합 (`docs(spec-4-02): execute reverse extract proof of concept`) — diff 는 역추출 해석의 직접 산물이라 분리 커밋 불필요

---

## Task 6: Research 보고서 작성 + 프로토콜 피드백

### 6-1. `report.md` 작성
- [x] `specs/spec-4-02-paper-mcp-roundtrip/report.md` 신규 (8 섹션)
  - 결론: **Go** — LoginPage 스코프에서 왕복 자동화 가능 (단서: 다른 variant / 상호작용은 후속)
  - Trade-off: 역방향이 5× 효율적 (호출 11 vs 2)
  - 자동화 경계 (자동 / 수동 보정 / 미결)
  - RQ1~RQ5 답변 (모두 긍정)
  - MCP 도구 커버리지 갭 5 개 (모두 낮음/중간 심각도)
  - 후속 spec 권장: spec-4-03 / variant 확장 / Dashboard / paper-normalizer
- [x] Commit: `docs(spec-4-02): add research report with go/no-go recommendation`

### 6-2. 프로토콜 피드백
- [x] `docs/guides/collaboration-flow.md` Stage 2 Done 기준에 색공간 정규화 주석 + hook-paper-extract 앵커에 검증 결과 링크
- [x] Stage 5 Done 기준에 폰트 가용성 사전 확인 + Review Checkpoint 6 항 + hook-paper-render 앵커에 검증 결과 링크
- [x] Commit: `docs(spec-4-02): refine collaboration-flow Done criteria from roundtrip findings`

---

## Task 7: Ship

### 7-1. 품질 점검
- [ ] `sdd ship --check` 통과
- [ ] 실험 로그 링크 유효성 확인

### 7-2. Ship artifacts
- [ ] `walkthrough.md` 작성 (결정 / 사용자 협의 / 수동 검증 결과)
- [ ] `pr_description.md` 작성 (Research DoD 기반)
- [ ] Ship Commit: `docs(spec-4-02): ship walkthrough and pr description`

### 7-3. Push + PR
- [ ] Push: `git push -u origin spec-4-02-paper-mcp-roundtrip`
- [ ] PR 생성: `gh pr create --base phase-4-collab-flow --head spec-4-02-paper-mcp-roundtrip ...`
- [ ] 사용자 알림: 푸시 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (브랜치+스캐폴드 / 픽스처 / 정방향 / 역방향 / diff / 보고 / Ship) |
| **예상 commit 수** | 7 ~ 8 (6-2 조건부) |
| **현재 단계** | Planning (Plan Accept 대기) |
| **마지막 업데이트** | 2026-04-22 |
