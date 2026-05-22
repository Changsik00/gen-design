# Task List: spec-7-11

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] phase-7.md SPEC 표 자동 갱신 (sdd spec new)
- [ ] 사용자 Plan Accept

---

## Task 0: 브랜치 생성

- [x] `git checkout phase-7-design-md` (이미 정렬)
- [x] `git checkout -b spec-7-11-docs-handbook`
- [x] Commit: 없음

---

## Task 1: ADR-008 작성 (per-spec design 파일 정책)

- [x] `docs/decisions/ADR-008-per-spec-design-files.md` 생성 — ADR-007 양식 준수
- [x] 옵션 A/B 비교 + 결정 B + Reconsider trigger (분기당 3+ 충돌 / alpha 3+ 명) 명시
- [x] 후속 액션: handbook §3 / §4 / ADR-009 의 merge 명령 보류 명시
- [x] Commit: `docs(spec-7-11): add ADR-008 per-spec design files policy` (a763acb)

---

## Task 2: ADR-009 작성 (gen-design 명령군)

- [x] `docs/decisions/ADR-009-gen-design-cli.md` 생성 — ADR-007 양식 준수
- [x] 옵션 A (별도 kit) vs B (단일 CLI) 비교 + 결정 B
- [x] 5 명령 표 (lint ⭐1 / diff ⭐2 / paper ⭐3 / react ⭐4 / merge 보류)
- [x] 후속 액션: handbook §7 인용, phase-8 첫 spec = `spec-8-01-gen-design-lint`
- [x] Commit: `docs(spec-7-11): add ADR-009 gen-design CLI command set` (48dc3de)

---

## Task 3: handbook §1-§2 (한 줄 요약 + Glossary)

- [x] §1 한 줄 요약 + mermaid 흐름도 + 4 축 어휘 정합 차별화
- [x] §2 Glossary — SSOT 4 문서 + 2 디렉토리 / Tier 1-3 / L1-L4 / canonical / round-trip
- [x] Commit: `docs(spec-7-11): handbook sections 1-2 (overview + glossary)` (4bfa9b3)

---

## Task 4: handbook §3-§4 (매트릭스 + 워크플로)

- [x] §3 아키텍처 매트릭스 — 8 행 × 4 열 + ADR-008 인용
- [x] §4 Profile Page 시나리오 (Day 1-5)
- [x] Commit: `docs(spec-7-11): handbook sections 3-4 (matrix + weekly workflow)` (a678598)

---

## Task 5: handbook §5-§6 (원칙 + 룰)

- [x] §5 원칙 P1-P5
- [x] §6 룰 R1-R6
- [x] Commit: `docs(spec-7-11): handbook sections 5-6 (principles + rules)` (728dfe6)

---

## Task 6: handbook §7-§8 (도구 + ADR 인덱스)

- [x] §7 도구 — sdd CLI 7 + gen-design CLI 5 + 기존 부분 CLI 5
- [x] §8 ADR 인덱스 — ADR-001 ~ ADR-009 + 타임라인
- [x] 9/9 ADR 링크 실재 파일 매칭 검증
- [x] Commit: `docs(spec-7-11): handbook sections 7-8 (tools + ADR index)` (d8f02a0)

---

## Task 7: handbook 자체-완결성 reading test + 보정

- [x] reading test — 신규 디자이너 페르소나 통독
- [x] 발견 1: §1 mermaid 의 merge 화살표가 ADR-008 옵션 B 와 모순 → 정정
- [x] 발견 2: §6 R5 spec.md grammar 한 줄만 — minimal LoginPage 카피 예시 추가
- [x] Commit: `docs(spec-7-11): handbook self-contained polish` (f9ee5db)

---

## Task 8: icebox 정리 (queue.md)

- [x] 3 항목 제거 + footer 1줄 (`spec-7-11 처리 완료`)
- [x] Commit: `chore(spec-7-11): clear handled follow-ups from queue.md icebox` (aba4bca)

---

## Task 9: 회귀 안전 확인

- [x] `pnpm test` → 724/724 PASS (회귀 0)
- [x] `pnpm --filter studio build` → exit 0
- [x] Commit 불필요

---

## Task 10: Ship

- [x] **walkthrough.md 작성**
- [x] **pr_description.md 작성**
- [x] memory `project_handbook_pending.md` 제거 + MEMORY.md 인덱스 정리
- [ ] **Ship Commit**: `docs(spec-7-11): ship walkthrough and pr description`
- [ ] **Push**: `git push -u origin spec-7-11-docs-handbook`
- [ ] **PR 생성**: `gh pr create` (base = `phase-7-design-md`)
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 11 (0~10) |
| **예상 commit 수** | 약 9~10 (ADR×2 + handbook×4 + polish + icebox + ship) |
| **현재 단계** | Ship |
| **마지막 업데이트** | 2026-05-10 |
