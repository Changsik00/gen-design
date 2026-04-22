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
- **phase-4** — 협업 Flow 정의 — 2/2 spec Merged — 다음: spec-4-03 생성 대기 또는 phase 조기 완료 검토
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
