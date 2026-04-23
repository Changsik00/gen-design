# Backlog Queue

> 본 문서는 *대시보드* 입니다. "지금 무엇을 하고 있고, 다음에 무엇을 해야 하는가"를 한눈에 보기 위함.
> sdd 가 마커 사이를 자동 갱신하므로 마커 (`<!-- sdd:... -->`) 는 그대로 두세요.
> 🧊 Icebox 섹션만 사람이 직접 편집합니다.

## 🔴 NOW

<!-- sdd:now:start -->
없음
<!-- sdd:now:end -->

## ⏭ NEXT

<!-- sdd:next:start -->
없음
<!-- sdd:next:end -->

---

## 📦 진행 중 Phase

<!-- sdd:active:start -->
- **phase-4** — 협업 Flow 정의 — 3/3 spec Merged (rigor 반영) — 다음: Phase PR #18 재오픈 검토
<!-- sdd:active:end -->

## 📥 spec-x 대기

<!-- sdd:specx:start -->
없음
<!-- sdd:specx:end -->

## 🧊 Icebox

> 아이디어·보류 항목 보관소. 실행 불가. 관련 항목이 쌓이면 Phase로, 단발이면 spec-x로 승격.
> 이 섹션은 sdd가 건드리지 않습니다. 자유롭게 편집하세요.

### phase-4 이월 follow-ups (2026-04-22 등재)

- **paper-normalizer 유틸리티** — Paper MCP 와 DESIGN.md 사이의 표기 정규화 함수 라이브러리 (oklch↔hex, rgba↔8-hex, padding 단일↔paddingBlock/paddingInline, fontFamily fallback 정리). spec-4-02 에서 4 종 표기 drift 확인. Studio v1 (phase-6) 에서 실제 코드 자동 생성 시 필요하면 spec-x 또는 phase-6 spec 으로 승격.
- **대량 변환 배치 전략 탐색** — spec-4-02 RQ5-5. 페이지 N 개 동시 처리 시 MCP 호출 수 / 속도 이슈. phase-5 앱 A 생성 시 실감 후 검토.
- **harness-kit follow-up** — phase-3 에서 stash 된 `.gitignore` 중복 정리 + `.claude/commands/hk-align.md` 플레이스홀더 포맷 수정. spec-x 로 분리 처리 (아직 원복/커밋 전 상태).

### 거버넌스 부채 — phase-4 회고 발견 (2026-04-22 등재)

- **W4: One Task = One Commit 위반 재발 방지** — spec-4-02 의 commit `2242e89` 가 Task 4 + Task 5 를 하나의 커밋에 통합 (constitution §8 위반). walkthrough 의 "다이프 표는 역추출 해석의 직접 산물" 정당화는 사후 합리화. **조치**: 본 spec-4-03 은 9 commit 으로 엄격 준수 (재발 0). 향후 spec 에서 Task 통합 유혹 시 plan.md 에서 사전 합의 필요.
- **C4: phase-ship.md 템플릿 harness-kit 0.5.0 에 부재** — constitution §3.1 은 "Phase PR body MUST follow the `phase-ship.md` template" 명시하나 `.harness-kit/agent/templates/` 에 해당 파일 없음. PR #18 은 `pr_description.md` 를 임시 확장. **조치**: harness-kit upstream 기여 대상 — `phase-ship.md` 템플릿 추가 요청. 임시로 본 repo 에 로컬 템플릿 만들지는 않음 (harness-kit 자동 업데이트 시 충돌 방지).
- **W2: 6 단계 프로토콜 중 4 단계 미실측** — Stage 1 Ideate (자동화 대상 아님) 제외하고 Stage 3 Blueprint / Stage 4 Compose 는 Phase 5 PoC 에서 앱 A 생성 과정에 흡수 측정.
- **A4: 자기참조적 검증 — critique 미실행** — spec-4-01 / spec-4-02 모두 `/hk-spec-critique` 미호출. 본 spec (4-03) 도 시간 제약으로 생략. **조치**: Phase 5 Research spec 은 critique 기본 수행 (최소 Research 타입은 강제).

## 📋 대기 Phase

<!-- sdd:queued:start -->
| Phase | 제목 | 상태 |
|---|---|---|
| `phase-1` | [Foundation (기반 셋업)](phase-1.md) | Done |
| `phase-2` | [Page Template 시스템](phase-2.md) | Done |
| `phase-3` | [App Blueprint](phase-3.md) | Done |
| `phase-4` | [협업 Flow 정의](phase-4.md) | Active |
| `phase-5` | [PoC 검증](phase-5.md) | Queued |
| `phase-6` | [Studio v1](phase-6.md) | Queued |
| `phase-7` | [디자인 도구 연동 심화](phase-7.md) | Queued |
<!-- sdd:queued:end -->

## ✅ 완료

<!-- sdd:done:start -->
- **phase-1** — Foundation (기반 셋업) — completed 2026-04-14
- **phase-2** — Page Template 시스템 — completed 2026-04-17
- **phase-3** — App Blueprint — completed 2026-04-21
<!-- sdd:done:end -->
