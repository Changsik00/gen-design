# Task List: spec-08-02

> One Task = One Commit.

## Pre-flight

- [x] sdd spec new — spec-08-02-handbook-and-conventions
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [x] base 정렬 + spec branch 생성 + cherry-pick
- [x] phase-08.md / queue.md 마커 충돌 해결 (theirs)

---

## Task 1: README 진입점 추가

- [x] 첫 단락 직후 *🚀 신규 진입자* 섹션 추가
- [x] §1-§4 통독 5분 약속 명시
- [x] Commit: `docs(spec-08-02): add handbook entry point in README` (12ca6e2)

---

## Task 2: handbook §1 mermaid 갱신

- [x] 한 줄 정의 갱신 (자연어 → MCP agent → 3층 chat.md)
- [x] mermaid 재구성 — agent 매개 흐름 (디자이너 → agent → 컨텍스트 read → 제안 → chat.md + Paper)
- [x] 4 축 어휘 정합 박스 갱신 (Paper 축에 layer-name 식별자 추가)
- [x] Commit: `docs(spec-08-02): rewrite handbook §1 with agent-mediated flow` (08ebcba)

---

## Task 3: handbook §2 Glossary 대폭 확장

- [x] SSOT 4 문서 + 3 디렉토리 (fixtures/playground/chats) 행 갱신
- [x] chat 3층 구조 (Narrative + Structure + History) 신규 정의
- [x] shell / scene / component 어휘 정의
- [x] agent (도서관 사서) — Claude in MCP, 컨텍스트 + 능동 제안
- [x] Paper layer-name 컨벤션 — `[chat:type/slug]`
- [x] Tier 1-3 / L1-L4 / Canonical / Round-trip 유지
- [x] Commit: `docs(spec-08-02): expand handbook §2 glossary (chat / shell / agent / identity)` (170e767)

---

## Task 4: handbook §3 매트릭스 갱신

- [x] chat.md 행 3 분리 + shell 행 + 변동 빈도 컬럼
- [x] 디렉토리 결정 (ADR-008) 갱신 — harness-kit / 디자인 도구 분리, ADR-010 reconsider 명시
- [x] 가변성 등급 3 정도 (🪨 고정 / 🌊 변동 / 💨 가변) 시각화
- [x] Commit: `docs(spec-08-02): refresh handbook §3 matrix with playground/chats split` (7cedea8)

---

## Task 5: handbook §4 워크플로 + agent mermaid

- [x] Profile *Page* → *Scene*
- [x] agent 매개 흐름 mermaid 신규
- [x] Day 1: Paper MCP 직접 (디자이너 환경, Studio 패널 = phase-9 명시)
- [x] Day 2: agent 자연어 정리 → 3층 chat.md
- [x] Day 3: 양방향 sync (자연어 + Paper 손 수정 → diff)
- [x] Day 4: 글로벌 SSOT 직접 편집
- [x] Day 5: 검증 (chat-react + test + build) + PR
- [x] 각 Day 마지막에 playground 살아있는 예시 링크 (3건)
- [x] Commit: `docs(spec-08-02): rewrite §4 workflow with agent-mediated 5-day scenario` (cb16731)

---

## Task 6: handbook §4.5 새 컴포넌트 워크플로

- [x] EmptyState 5 단계 (chat.md / 코드 / catalog 자동 / status 갱신 / 재사용)
- [x] vocabulary-first (P3) 적용 흐름
- [x] PoC playground/chats/components/empty-state.chat.md 인용
- [x] Commit: `docs(spec-08-02): add §4.5 new component workflow (EmptyState case study)` (a8cb50a)

---

## Task 7: handbook §5-§6 신규 원칙 / 룰

- [x] P6 (agent 는 도서관 사서) 신규
- [x] P7 (chat 은 살아있다) 신규
- [x] R7 (Paper layer-name 식별성 컨벤션) 신규
- [x] minimal chat.md 예시 — LoginPage → LoginScene 어휘 정정
- [x] Commit: `docs(spec-08-02): add §5 P6/P7 + §6 R7 (agent + identity principles)` (3b7e002)

---

## Task 8: handbook §7 도구 + §8 ADR 인덱스

- [x] §7 paper-import (⭐ 0) 행 신규
- [x] §7 merge 행 갱신 (ADR-010 결정 후 도입 명시)
- [x] §8 ADR-010 자리 예약 행 + history 타임라인 phase-8 행 추가
- [x] Commit: `docs(spec-08-02): refresh §7 tools (paper-import) + §8 ADR-010 placeholder` (53bda49)

---

## Task 9: 회귀 안전 + 수동 검증

- [x] `pnpm test` → 725/725 PASS (회귀 0)
- [x] `pnpm --filter studio build` → exit 0
- [x] 분량: 664 줄 (plan 의 700-900 하단)
- [x] 링크 정합성: 9 ADR + 3 playground markdown 링크 모두 OK
- [x] Reading test 통과 (5분 §1-§4 통독)
- [x] Commit 불필요 (변경 0)

---

## Task 10: Ship

- [x] **walkthrough.md 작성** — 13 결정 + 사용자 협의 2건 + reading test 결과
- [x] **pr_description.md 작성** — 9 변경 사항 + Before/After + 5 review points + 5 verification
- [ ] **Ship Commit**: `docs(spec-08-02): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-02-handbook-and-conventions`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 11 (0~10) |
| **예상 commit 수** | 9~10 (Task 0 = 0 commit, Task 9 가능 0 commit) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
