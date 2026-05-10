# Walkthrough: spec-7-11

> phase-7 ship 직전 Opus 감사가 W9 (handbook 미작성) 으로 지적한 항목 + 사용자 합의에 따라 docs 관련 icebox 3 항목 통합 처리.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| ADR-008 — per-spec 로컬 design 파일 정책 | A) spec dir 안 자동 생성 / B) 글로벌 직접 편집 | **B** | phase-7 9 spec 동안 충돌 0 회. YAGNI. 자동 생성의 영구 부담 회피. Reconsider trigger 명시 (분기당 3+ 충돌 / alpha 3+ 명) |
| ADR-009 — gen-design CLI 위치 | A) 별도 `gen-design-kit/` (harness-kit 형제) / B) `studio/scripts/gen-design.ts` 단일 CLI | **B** | 두번째 프로젝트가 동일 도구 필요한지 *알 수 없음*. premature 분리 회피. 본 프로젝트 의존성 그대로 활용 |
| ADR-009 — 5 명령 중 첫 실용 | lint / diff / paper / react / merge | **lint global** | C1-C6 정합 검증 = 외부 alpha 안전망. 즉시 가치 + read-only + CI 통합 안전. phase-8 첫 spec = `spec-8-01-gen-design-lint` 자동 결정 |
| ADR-009 — `merge` 명령 도입 시점 | phase-8 / phase-9 / 영구 보류 | **ADR-008 옵션 A 도입 시까지 보류 (영구 보류 가능)** | ADR-008 의 옵션 B 가 영구히 채택되면 `merge` 도 영구 보류. 결정의 cascading |
| handbook 시나리오 — Day 1-5 페이지 | LoginPage / DashboardPage / *신규* ProfilePage | **Profile Page** | 기존 fixture 사용 시 *사후 합리화* 위험. 신규 페이지가 *외부 디자이너 reading test* 의 진짜 시뮬레이션 |
| handbook 작성 분할 | 한 commit / Task 단위 4 commit | **4 commit (§1-§2 / §3-§4 / §5-§6 / §7-§8)** | constitution §8 (One Task = One Commit). 처음에 한 번에 썼다가 split 으로 회귀 — *plan 의 신호를 따름* 가 정직한 선택 |
| icebox 정리 형식 | 3 항목 *제거* + footer 1줄 / 항목 *유지* + "처리됨" 마크 | **제거 + footer 1줄** | 항목 유지는 future drift 위험. 처리 history 는 git log 가 영구 진실. queue.md 는 *지금* 의 진실만 |
| handbook §1 mermaid | merge 화살표 유지 / 정정 | **정정 (단방향 + lint phase-8 점선)** | ADR-008 옵션 B 결정 (수동 편집, merge 보류) 과 모순 — Reading test 단계에서 발견 |
| spec.md 예시 | §6 R5 한 줄 설명만 / 카피 가능 minimal 예시 추가 | **카피 가능 예시 추가 (LoginPage + Behavior + Variants)** | Reading test 발견 — 신규 디자이너가 *시작* 가능한 형태 부재 |

## 💬 사용자 협의

- **주제**: phase-ship 전 W9 (handbook) 처리 옵션
  - **사용자 의견**: "2번은 icebox 혹은 다른 계획에 docs 관련 이슈가 있을텐데.. 같이 포함하면 안되나?"
  - **합의**: queue.md icebox 의 docs 관련 3 항목 (handbook / per-spec design / gen-design) 통합 처리. 옵션 B (`spec-7-11-docs-handbook`, phase-7 SDD-P) 선택.

- **주제**: scope 통합 vs 분할
  - **사용자 의견**: "옵션 B로 진행"
  - **합의**: handbook + ADR-008 + ADR-009 + queue.md 정리를 한 PR. 모두 docs / 코드 변경 0.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `cd studio && pnpm test`
- **결과**: ✅ Passed (724 tests in 7.93 s) — 회귀 0
- **로그 요약**:
```text
 Test Files  103 passed (103)
      Tests  724 passed (724)
   Duration  7.93s
```

#### 빌드
- **명령**: `pnpm --filter studio build`
- **결과**: ✅ exit 0 (`built in 210ms`)

### 2. 수동 검증

1. **Action**: `grep -oE "decisions/ADR-[0-9]{3}-[a-z-]+\.md" docs/handbook.md | sort -u | while read f; do test -f "docs/$f" && echo OK $f || echo MISS $f; done`
   - **Result**: 9/9 OK — handbook §8 의 모든 ADR 링크가 실재 파일과 매칭
2. **Action**: handbook 통독 — 신규 디자이너 페르소나 reading test
   - **Result**: §1 mermaid 의 *merge 화살표* 가 ADR-008 옵션 B 결정과 모순 → 정정. §6 R5 의 spec.md grammar 가 *완전한 예시* 부재 → minimal LoginPage 예시 추가.
3. **Action**: ADR-007 vs ADR-008/009 형식 비교
   - **Result**: 헤더 구조 (상태/날짜/의사결정자/연관/컨텍스트/결정/대안/결과/회고) 일치. 임의 섹션 추가 0.
4. **Action**: queue.md icebox 검증
   - **Result**: 3 항목 제거 + footer 1줄 (`spec-7-11 처리 완료`) 만 남김. drift 0.

## 🔍 발견 사항

- **결정의 cascading 패턴이 명확** — ADR-007 (SSOT 구조) → ADR-008 (디렉토리 결정) → ADR-009 (`merge` 명령 보류 결정). *어떤 결정이 어떤 다른 결정의 결과를 변경하는지* 가 ADR 들 사이에 명문화됨. 향후 ADR 작성 시 *선행 ADR* 필드를 통해 같은 패턴 유지.
- **handbook 의 진짜 검증은 외부 alpha** — reading test 만으로 *완전한 self-contained* 보장 불가. phase-7 ship 직후 외부 디자이너 1~2명 alpha 가 진짜 검증.
- **ADR-009 의 `lint global` 이 phase-8 우선순위 자동 결정** — phase-7 ship 직후 phase-8 첫 spec 후보가 *재논의 0* 으로 결정. ADR 의 *후속 액션* 이 phase 계획 부담 감소시키는 좋은 사례.
- **plan 작성 시 task 분할의 trade-off** — handbook 같은 *단일 문서 4 섹션 분할 commit* 의 가독성 가치 vs 분할 churn. 본 spec 은 *plan 신호를 따름* 으로 결정. 다음 docs spec 에서는 *문서 단위* commit 도 합리적 — plan 단계에서 미리 합의 필요.

## 🚧 이월 항목

- 외부 디자이너 alpha + 정성 피드백 (W10) — phase-ship hard gate, 사용자 트랙
- ADR-008 Reconsider trigger 측정 — phase-8 진행 중 다중 spec 흐름이 본격화될 때
- ADR-009 의 `gen-design lint` 구현 — phase-8 첫 spec
- handbook 의 *진짜 self-contained* 검증 — 외부 alpha 시
- handbook §7 의 기존 부분 CLI alias / deprecation 결정 — phase-8 안

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `aba4bca` (Ship commit 추가 후 갱신 예정) |
| **메모리 갱신** | `project_handbook_pending.md` → 완료 처리 (Ship commit 후 사용자에게 알림) |
