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
- [ ] `specs/spec-4-02-paper-mcp-roundtrip/fixtures/LoginPage.DESIGN.md` 신규 작성
  - 14 섹션 구조 (§1~§14, 본 PoC 에선 §2/§3/§5/§6/§11 중심)
  - `e2e-demo-loginpage.md` 의 LoginPage 명세 재구성
  - 15 측정 토큰 (plan.md §측정 토큰) 모두 명시적으로 포함
- [ ] 토큰 값이 Phase 2 studio/src/components/templates/LoginPage/ 실제 구현과 일치 확인 (수동)
- [ ] Commit: `docs(spec-4-02): add LoginPage DESIGN.md fixture`

---

## Task 3: 정방향 PoC 실행 (DESIGN → Paper)

> ⚠ **실제 Paper 환경 쓰기 작업**. Plan Accept 시점에 사용자가 승인한 작업 위치 사용.

### 3-1. 환경 확인
- [ ] Paper MCP `get_basic_info` 실행 → 파일명 / 사용 가능 폰트 확인
- [ ] 작업 페이지 존재 여부 확인 → 없으면 `create_artboard` 이전 단계에서 사용자 안내

### 3-2. 아트보드 생성 + 렌더링
- [ ] `get_font_family_info` — 픽스처 폰트 사용 가능 여부 확인
- [ ] `create_artboard` — 새 아트보드 생성 (격리 영역)
- [ ] `write_html` — LoginPage HTML 을 Tailwind 클래스 기반으로 주입
- [ ] `update_styles` — 필요 시 토큰 대응 조정
- [ ] `get_screenshot` — 렌더링 결과 스크린샷 획득 (증거)
- [ ] 각 MCP 호출 입력/출력을 `docs/experiments/paper-roundtrip-2026-04-22.md` 에 시간순 기록
- [ ] Commit: `docs(spec-4-02): execute forward render proof of concept`

---

## Task 4: 역방향 PoC 실행 (Paper → DESIGN)

### 4-1. 역추출
- [ ] `get_tree_summary` — 생성된 아트보드 노드 계층 요약
- [ ] `get_computed_styles (batch)` — 주요 노드들의 CSS 토큰 추출
- [ ] `get_node_info` — 텍스트 노드 폰트/크기 정보
- [ ] `get_font_family_info` — 실제 적용된 폰트 패밀리
- [ ] 추출 결과 → `DESIGN.md' (prime)` 로 재구성 (픽스처와 동일 섹션 구조)
- [ ] Commit: `docs(spec-4-02): execute reverse extract proof of concept`

---

## Task 5: Diff 측정 + 계열별 자동화율

### 5-1. 15 토큰 diff 표 작성
- [ ] `docs/experiments/paper-roundtrip-2026-04-22.md` 에 15 × {원본 / Paper observed / extracted / 일치} 표 추가
- [ ] 계열별 (색상/타이포/간격/그림자) 자동화율 계산
- [ ] 기준 통과 여부 판정 (색상 ≥90% / 타이포 ≥85% / 간격 ≥75% / 그림자 ≥70%)
- [ ] Commit: `docs(spec-4-02): measure roundtrip diff across 15 tokens`

---

## Task 6: Research 보고서 작성 + 프로토콜 피드백

### 6-1. `report.md` 작성
- [ ] `specs/spec-4-02-paper-mcp-roundtrip/report.md` 신규
  - 결론 한 줄 (Go/No-Go)
  - Trade-off (정방향 vs 역방향)
  - 자동화 경계 서술
  - RQ1~RQ5 답변
  - MCP 도구 커버리지 갭
  - 후속 spec 권장사항
- [ ] Commit: `docs(spec-4-02): add research report with go/no-go recommendation`

### 6-2. (조건부) 프로토콜 피드백
- [ ] `docs/guides/collaboration-flow.md` Stage 2 / Stage 5 Done 기준 갱신 여부 결정
- [ ] 수정 필요 시 commit: `docs(spec-4-02): refine collaboration-flow Done criteria from roundtrip findings`
- [ ] 수정 불필요 시 스킵 (`[-]` 로 passed 표시 + 이유 명시)

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
