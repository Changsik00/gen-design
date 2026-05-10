# Task List: spec-08-03

> One Task = One Commit. 작은 spec — 5 task.

## Pre-flight

- [x] sdd spec new — spec-08-03-adr-010-chat-promotion-policy
- [x] spec.md / plan.md / task.md 작성
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [ ] `git checkout phase-08-chat-agent-flow && git pull --ff-only`
- [ ] `git checkout -b spec-08-03-adr-010-chat-promotion-policy`
- [ ] Commit: 없음

---

## Task 1: ADR-010 작성

- [ ] `docs/decisions/ADR-010-chat-promotion-policy.md` 신규
- [ ] ADR-007 양식 정확 준수 (상태/날짜/의사결정자/연관/선행 ADR)
- [ ] 컨텍스트 — ADR-008 옵션 B 의 *부분 충돌* + PoC 세션 3 사례 + 사용자 비전
- [ ] 결정 5 항목 (D-1 chat 승격 / D-2 shell 승격 / D-3 글로벌 SSOT / D-4 gen-design merge / D-5 agent 책임 분리)
- [ ] 대안 비교 (옵션 A 풀 자동 / B 자동 0 / **C Hybrid 채택**)
- [ ] Reconsider trigger 3 조건
- [ ] 후속 액션 (8-04 frontmatter / 8-08 merge)
- [ ] 회고
- [ ] Commit: `docs(spec-08-03): add ADR-010 chat promotion policy (Hybrid)`

---

## Task 2: handbook §3 갱신 — chat 승격 정책 절 추가

- [ ] §3 (디렉토리 결정 후) 신규 절 *"chat 승격 / shell 승격 정책 (ADR-010)"*
- [ ] 제안 자동 + 실행 수동 의 한 줄 정의
- [ ] gen-design merge = 조력자 명시
- [ ] Commit: `docs(spec-08-03): add chat promotion section in handbook §3`

---

## Task 3: handbook §7 갱신 — gen-design merge 행

- [ ] gen-design CLI 표의 `merge` 행 갱신
- [ ] 우선순위 (보류) → ⭐ 5 (phase-8 후보, spec-08-08)
- [ ] 의미 — *조력자* (휴리스틱 + preview + confirm) 명시
- [ ] Commit: `docs(spec-08-03): update §7 gen-design merge as helper-mode`

---

## Task 4: handbook §8 ADR-010 자리 예약 → 작성 완료

- [ ] §8 ADR 인덱스 표의 ADR-010 행 갱신
- [ ] 1 줄 요약 — *"Hybrid — 제안 자동 + 실행 수동. ADR-008 옵션 B 정신 유지 + agent 능동 제안 추가"*
- [ ] 결정 history 타임라인 phase-8 행 갱신 (ADR-010 명시)
- [ ] 링크 정합성 — ADR-010 자체 파일 + 연관 ADR 4건 검증
- [ ] Commit: `docs(spec-08-03): mark ADR-010 as accepted in handbook §8`

---

## Task 5: 회귀 안전 + 검증

- [ ] `cd studio && pnpm test` → 725/725 PASS (코드 0 변경)
- [ ] `pnpm --filter studio build` → exit 0
- [ ] ADR-010 형식 비교 (ADR-007 와 헤더 구조)
- [ ] handbook 의 ADR-010 결정 일관 (§3 / §7 / §8 동일 메시지)
- [ ] Commit 불필요 (변경 0)

---

## Task 6: Ship

- [ ] **walkthrough.md 작성** — Hybrid 결정 근거 + 5 D-항목 + Reconsider trigger
- [ ] **pr_description.md 작성** — Before/After + ADR-010 핵심 + 후속 spec 영향
- [ ] **Ship Commit**: `docs(spec-08-03): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-08-03-adr-010-chat-promotion-policy`
- [ ] **PR 생성**: `gh pr create --base phase-08-chat-agent-flow ...`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 (0~6) |
| **예상 commit 수** | 5~6 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-05-10 |
