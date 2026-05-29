# Task List: spec-13-01

> 모든 task는 한 commit에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신합니다.

## Pre-flight

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 사용자 Plan Accept

---

## Task 1 — 브랜치 생성

- [x] `git checkout -b spec-13-01-chatmd-v2-format`
- Commit: 없음 (브랜치 생성만)

---

## Task 2 — 기존 포맷 분석 (읽기 전용)

기존 구조를 파악하고 v2 설계 기준선 확보.

- [x] `packages/gd-cli/src/commands/react.ts` — 파서 구조 분석 (폐기 대상 파악)
- [x] `packages/gd-skills/skills/gd-chat.md` — 현재 포맷 기준선 검토
- [x] `packages/gd-cli/src/commands/extract.ts` 가 필요로 할 파싱 인터페이스 메모
- [x] Commit: `docs(spec-13-01): analysis notes — existing chat.md parser and format baseline`

---

## Task 3 — chat.md v2 포맷 정의 문서 작성

포맷 결정(YAML hybrid) + 레이어별 규칙 문서화.

- [x] `docs/chatmd-v2-format.md` 신규 작성
  - 레이어 5개 정의 (UI / Data / API / Scenarios / DB Hints)
  - 필수 / 선택 여부
  - 각 레이어 작성 규칙 + 예시 스니펫
  - 토큰-variant 컨텍스트 주입 전략 ("LLM에게 주입할 규칙")
  - v1 → v2 마이그레이션 방향 메모
- [ ] Commit: `docs(spec-13-01): define chat.md v2 format — 5-layer vertical slice spec`

---

## Task 4 — 예시 파일 작성 (대시보드)

모든 레이어를 포함한 실제 예시 파일.

- [ ] `specs/spec-13-01-chatmd-v2-format/examples/dashboard.chat.md` 신규 작성
  - Narrative: 대시보드 화면 의도
  - Structure: StatCard × 2 + 주문 Table (bare Markdown)
  - Data: total_sales, active_users, recent_orders (YAML)
  - API: GET /api/stats, GET /api/orders (YAML)
  - Scenarios: loaded / loading / error 3개 (YAML)
  - DB Hints: orders, users 테이블 (YAML)
- [ ] Commit: `docs(spec-13-01): add dashboard example in chat.md v2 format`

---

## Task 5 — ADR-011 작성

컴파일러 폐기 + 수직 단면 포맷 채택 결정 장기 기록.

- [ ] `docs/decisions/ADR-011-chatmd-v2-vertical-slice.md` 신규 작성
  - `.harness-kit/agent/templates/adr.md` 템플릿 준수
  - 컴파일러 폐기 근거 (LLM-native 전환)
  - 수직 단면 포맷 채택 이유
  - YAML hybrid 선택 트레이드오프
  - type: decision
- [ ] Commit: `docs(spec-13-01): add ADR-011 — chat.md v2 vertical slice and compiler removal`

---

## Task 6 — Ship

- [ ] `pnpm --filter @gen-design/cli typecheck` (타입 체크, 코드 변경 없으나 확인용)
- [ ] **walkthrough.md 작성** — 포맷 설계 과정 + 핵심 결정 기록
- [ ] **pr_description.md 작성** — 템플릿 준수
- [ ] **Ship Commit**: `docs(spec-13-01): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-13-01-chatmd-v2-format`
- [ ] **PR 생성**: `phase-13-vertical-slice` 타겟 (첫 spec이므로 base branch 동시 생성)
- [ ] **사용자 알림**: PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 6 |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-29 |
