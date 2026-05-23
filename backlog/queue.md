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
- **phase-12** — conversation-depth-and-orchestration — 2 spec — 다음: spec-12-02-gd-chat-depth-and-intent
<!-- sdd:active:end -->

## 📥 spec-x 대기

<!-- sdd:specx:start -->
없음
<!-- sdd:specx:end -->

## 🧊 Icebox

> 아이디어·보류 항목 보관소. 실행 불가. 관련 항목이 쌓이면 Phase로, 단발이면 spec-x로 승격.
> 이 섹션은 sdd가 건드리지 않습니다. 자유롭게 편집하세요.

### phase-7 진행 중 follow-ups (2026-05-10 등재 / 처리 완료)

> ✓ **위 3 항목 spec-7-11 에서 처리 완료** — `docs/handbook.md` (8 섹션) + `docs/decisions/ADR-008-per-spec-design-files.md` (옵션 B = 글로벌 직접 편집) + `docs/decisions/ADR-009-gen-design-cli.md` (단일 CLI / 5 명령 / `lint global` phase-8 첫 실용).

> 📌 **2026-05-10 phase-7 spec ID 재번호** — ADR-006 D-5 의 우선순위 결정에 따라 phase-7.md 의 spec-7-04~7-07 을 실행 순서대로 재번호:
> - new 7-04 = Paper inference (was 7-06)
> - new 7-05 = React compiler (was 7-04)
> - new 7-06 = Studio reframe (was 7-07)
> - new 7-07 = Figma adapter (was 7-05)
>
> 이후 *번호 순서대로 시행*. 다음 spec = `sdd spec new` 호출 시 자동 7-04 부여 = Paper inference.

### phase-6 이월 follow-ups (2026-05-09 등재)

- **시맨틱 토큰 정리 — `surface-alt` 신규 정의** — spec-6-01 (Studio API 정합화) Task 7 진행 중 발견: 회고 C-06 가 권장한 `bg-surface-alt` 매핑이 토큰 자체가 미정의된 상태. studio 의 `--background` 값 (`#F8FAFC`) 이 이미 Paper page ground 와 일치하므로 시각 결과는 정합 (Task 7 [-] Passed). 시맨틱 측면 정리 — `semantic.color.{light,dark}.surface-alt` 토큰 신규 정의 + body 매핑 — 는 spec-6-07 (토큰 편집기) 또는 별도 spec 으로 승격 검토.

### spec-6-10 fresh-page E2E 이월 (2026-05-09 등재)

- **Playwright + Paper screenshot 자동 pixel-diff** — spec-6-10 Maximum scope 의 진짜 정의. 본 spec 은 사람 눈 + 소스 의미 비교까지. 자동 회귀는 phase-7 spec-x 후보.
- **render-helpers Paper-API-한계 헬퍼** — `inputWithPlaceholder()`, `flexGrid(cols)`, `flexTable(columns, rows)`. spec-6-10 findings.md 에서 5 건 한계 식별. 다른 Paper 렌더 spec 의 공통 도구로 정착 후보.
- **paper-normalizer 의 production 통합** — render-helpers 가 Paper update_styles 호출 시 정규화 함수 호출하는 형태. 현재 paper-sync 만 통합 (C2 부분 해소). phase-6 회고 C2 의 paper-normalizer 미사용 문제 잔존.
- **Lucide 아이콘 SVG 정확 매핑 라이브러리** — spec-6-10 에서 단순화 path 로 fallback. lucide-react 와 정확히 일치하는 Paper SVG 보존 라이브러리가 visual regression 자동화의 전제.
- **HomeButton 의 fluid width 패턴** — Paper flex 컨테이너 안의 `<Button>` 이 stretch 되는 동작. inline 컨텐츠로 감싸는 컨벤션을 Paper 측 디자인 가이드라인에 명문화 필요.
- **dogfooding 정량 측정 방법론** — phase-6 회고 C4 잔존. feature `.tsx` 중 `@/components/ui` import 비율을 정의하는 스크립트 + CI 체크 후보.

### phase-4 이월 follow-ups (2026-04-22 등재)

- **paper-normalizer 유틸리티** — Paper MCP 와 DESIGN.md 사이의 표기 정규화 함수 라이브러리 (oklch↔hex, rgba↔8-hex, padding 단일↔paddingBlock/paddingInline, fontFamily fallback 정리). spec-4-02 에서 4 종 표기 drift 확인. Studio v1 (phase-6) 에서 실제 코드 자동 생성 시 필요하면 spec-x 또는 phase-6 spec 으로 승격.
- **대량 변환 배치 전략 탐색** — spec-4-02 RQ5-5. 페이지 N 개 동시 처리 시 MCP 호출 수 / 속도 이슈. phase-5 앱 A 생성 시 실감 후 검토.
- **harness-kit follow-up** — phase-3 에서 stash 된 `.gitignore` 중복 정리 + `.claude/commands/hk-align.md` 플레이스홀더 포맷 수정. spec-x 로 분리 처리 (아직 원복/커밋 전 상태).

### phase-5 이월 follow-ups (2026-04-27 등재)

- **LoginPage variant 확장 (modal / bottom-sheet)** — spec-5-02 정의에서 이월. 사용자가 spec-5-02 를 "새 페이지 검증" 방향으로 선회 ("기존 페이지 재활용 ❌") 함에 따라 보류. spec-4-02 가 page variant 만 부분 검증해 modal / bottom-sheet 왕복 drift 는 미측정 상태로 남음. 추후 필요 시 spec-x 또는 phase-6 spec 으로 승격.
- **DashboardPage 왕복 drift** — 동일 이유로 이월. 데이터 집약 페이지에서 표기 정규화 패턴 유지 여부 미측정. spec-5-02 의 Settings 페이지 drift 측정으로 form-heavy 패턴 일부는 대체 가능하나 데이터 집약 케이스는 보존되지 않음. 필요 시 spec-x 또는 phase-6 spec 으로 승격.

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
| `phase-4` | [협업 Flow 정의](phase-4.md) | Done |
| `phase-5` | [PoC 검증](phase-5.md) | Done |
| `phase-6` | [Studio v1](phase-6.md) | Queued |
| `phase-7` | [디자인 도구 연동 심화](phase-7.md) | Queued |
<!-- sdd:queued:end -->

## ✅ 완료

<!-- sdd:done:start -->
- **phase-1** — Foundation (기반 셋업) — completed 2026-04-14
- **phase-2** — Page Template 시스템 — completed 2026-04-17
- **phase-3** — App Blueprint — completed 2026-04-21
- **phase-4** — 협업 Flow 정의 — completed 2026-04-24
- **phase-5** — PoC 검증 (End-to-End) — completed 2026-05-05
- **phase-6** — Studio v1 — completed 2026-05-09
- **phase-7** — DESIGN.md 4축 어휘 + 컴파일러 — completed 2026-05-10
- **08** — ? — completed 2026-05-16
- **phase-09** — gen-design 활성화 + 외부 alpha — completed 2026-05-22
- **phase-11** — designer-onboarding-skill — npx 스킬 배포 + dogfooding alpha — completed 2026-05-23
<!-- sdd:done:end -->
