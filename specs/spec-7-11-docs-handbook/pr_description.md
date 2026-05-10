# docs(spec-7-11): docs/handbook.md + ADR-008/009 — phase-7 docs 통합 정리

## 📋 Summary

### 배경 및 목적

phase-7 ship 직전 독립 Opus 감사가 W9 (handbook 미작성) 을 done 조건 미충족으로 지적. queue.md icebox 에는 phase-7 진행 중 등재된 docs 관련 follow-up 3 항목 (handbook + per-spec design 결정 + gen-design CLI 결정) 이 *처리되지 않은 상태* 로 잔존. 사용자 합의에 따라 본 spec 으로 통합 처리.

### 주요 변경 사항

- [x] **`docs/decisions/ADR-008-per-spec-design-files.md`** 신규 — 옵션 B (글로벌 직접 편집) 채택. spec dir 안 design 슬라이스 = 생성 안 함. Reconsider trigger 명시 (분기당 3+ 충돌 / alpha 3+ 명).
- [x] **`docs/decisions/ADR-009-gen-design-cli.md`** 신규 — 옵션 B (단일 CLI `studio/scripts/gen-design.ts`). 5 명령 표 (lint ⭐1 / diff ⭐2 / paper ⭐3 / react ⭐4 / merge 보류). phase-8 첫 실용 = `lint global`.
- [x] **`docs/handbook.md`** 신규 — 8 섹션 살아있는 핸드북. 신규 디자이너의 첫 spec.md 작성까지 self-contained 진입점.
  1. 한 줄 요약 + mermaid 흐름도 + 4 축 어휘 정합 차별화
  2. Glossary — SSOT 4 문서 + 2 디렉토리 / Tier 1-3 / L1-L4 variant
  3. 아키텍처 매트릭스 (정보 종류 × 진실의 위치) — ADR-008 디렉토리 결정 인용
  4. 디자이너 일주일 워크플로 — Profile Page 추가 시나리오 (Day 1-5)
  5. 원칙 P1-P5 / 6. 룰 R1-R6
  7. 도구 — sdd CLI + gen-design CLI (ADR-009 인용) + 기존 부분 CLI
  8. ADR 인덱스 — ADR-001 ~ ADR-009 1줄 요약 + 결정 history 타임라인
- [x] **`backlog/queue.md`** icebox 정리 — phase-7 docs follow-up 3 항목 제거 + footer 1줄 (처리 history)

### Phase 컨텍스트

- **Phase**: `phase-7` (DESIGN.md 4축 어휘 + 컴파일러)
- **본 SPEC 의 역할**: phase-7 ship 의 W9 (handbook 미작성) 해소 + phase-7 동안 합의된 두 결정 (ADR-008, ADR-009) 의 공식 기록. phase-ship 자격 회복.

## 🎯 Key Review Points

1. **ADR-008 결정 근거**: phase-7 9 spec 동안 충돌 0 회의 *실증*. YAGNI 원칙. Reconsider trigger 가 *측정 가능* (분기당 3+, alpha 3+ 명) — 기분이 아닌 데이터로 재논의 가능.
2. **ADR-009 의 5 명령 우선순위 결정**: `lint global` 첫 실용 = 외부 alpha *안전망*. 즉시 가치 + read-only + CI 통합 안전 — phase-8 첫 spec 후보 자동 결정.
3. **handbook §3 매트릭스의 디렉토리 결정**: ADR-008 옵션 B 를 *모든 정보 종류* 에 일관 적용. spec dir 의 구조 변경 0 — `specs/spec-X-Y-{slug}/` 는 spec/plan/task/walkthrough/pr_description 그대로.
4. **handbook §4 시나리오 = 신규 페이지**: 기존 fixture (login-page 등) 가 아닌 *Profile Page* (28 fixture 에 없는 페이지) — 외부 디자이너 reading test 의 진짜 시뮬레이션.
5. **§1 mermaid + §6 R5 보정 (Reading test 발견)**: merge 화살표 정정 (옵션 B 결정 반영) + spec.md minimal 예시 추가 (카피로 시작 가능).

## 🧪 Verification

### 자동 테스트
```bash
cd studio && pnpm test
```

**결과 요약**: ✅ 103 test files / 724 tests passed (회귀 0).

### 빌드
```bash
pnpm --filter studio build
# ✓ built in 210ms
```

### 수동 검증 시나리오

1. **ADR 링크 정합성**:
   ```bash
   grep -oE "decisions/ADR-[0-9]{3}-[a-z-]+\.md" docs/handbook.md | sort -u | while read f; do test -f "docs/$f" && echo OK || echo MISS; done
   ```
   **결과**: 9/9 OK
2. **ADR 형식 통일성**: ADR-007 ↔ ADR-008/009 헤더 구조 일치 (상태/날짜/의사결정자/연관/컨텍스트/결정/대안/결과/회고)
3. **icebox 동기화**: `backlog/queue.md` 의 phase-7 follow-up 3 항목 제거 확인 + footer 1줄 추가 확인
4. **handbook reading test**: 신규 디자이너 페르소나로 통독 → minimal spec.md 예시 + Profile Page 시나리오 도달 가능

## 📦 Files Changed

### 🆕 New Files

- `docs/decisions/ADR-008-per-spec-design-files.md` (+95): per-spec design 파일 정책 = 옵션 B (글로벌 직접 편집)
- `docs/decisions/ADR-009-gen-design-cli.md` (+115): gen-design CLI = 단일 CLI / 5 명령 / phase-8 첫 실용 = lint
- `docs/handbook.md` (+340): 살아있는 핸드북 8 섹션 (mermaid × 1 + spec.md minimal 예시 + ADR 인덱스 9 개)
- `specs/spec-7-11-docs-handbook/spec.md`, `plan.md`, `task.md`, `walkthrough.md`, `pr_description.md`: SDD 산출물

### 🛠 Modified Files

- `backlog/queue.md` (+4, -14): phase-7 docs follow-up 3 항목 제거 + footer 1줄
- `backlog/phase-7.md`: spec-7-11 표 자동 갱신 (sdd spec new)

**Total**: 9 files changed (+670 / -15 추정)

## ✅ Definition of Done

- [x] ADR-008 + ADR-009 양식 준수 + 9 ADR 링크 정합성 검증
- [x] handbook 8 섹션 모두 채움 (신규 디자이너 self-contained)
- [x] queue.md icebox 정리 (3 항목 처리 완료 표시)
- [x] 회귀 0 — `pnpm test` 724/724 / `pnpm build` exit 0
- [x] walkthrough.md ship commit 완료
- [x] pr_description.md ship commit 완료
- [ ] 사용자 검토 + 머지

## 🔗 관련 자료

- Phase: `backlog/phase-7.md`
- Walkthrough: `specs/spec-7-11-docs-handbook/walkthrough.md`
- 관련 ADR: ADR-006 (Paper-first) / ADR-007 (FRONT.md 룰북) — handbook §8 인덱스
- 처리 범위 외: 외부 디자이너 alpha (W10 — phase-ship hard gate, 사용자 트랙)
