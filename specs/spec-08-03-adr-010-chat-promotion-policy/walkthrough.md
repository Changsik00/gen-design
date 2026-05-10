# Walkthrough: spec-08-03 — ADR-010 chat 승격 정책 (Hybrid)

## 🎯 한 줄 요약

ADR-008 (per-spec design = 옵션 B) 의 *글로벌 직접 편집* 정신은 유지하되, chat-매개 흐름의 *agent 능동 제안* 가치를 더한 **Hybrid (제안 자동 + 실행 수동)** 정책을 ADR-010 으로 확정.

## 📜 배경

phase-7 까지 ADR-008 옵션 B (글로벌 SSOT 직접 편집, 자동 mv 0) 가 매끄러웠음 — 단일 디자이너 흐름에서 충돌 0 회.

phase-8 의 PoC `poc-chat-agent-flow` 검증 중 *부분 충돌* 자연 발생:

- **세션 3 (shell 승격)**: agent 가 *2+ scene 공통 패턴* (BrandHeader / AppFooter) 자동 감지 → *글로벌 shell 승격 제안* → 디자이너 합의 → 4 파일 일관 갱신.
- **사용자 비전**: *"자유롭게 만들되 결국 정리된다"* — *결국 정리* 의 *책임자* 미정.
- **handbook §6 P6 (도서관 사서)**: agent 의 *능동 제안* 의무가 명문화 — 단 *실행 권한* 미정.
- **gen-design merge 명령**: ADR-009 D-4 가 *"옵션 A 도입 시까지 보류 — 영구 보류 가능"* 으로 미정의 상태.

→ ADR-008 의 *수동 정신* 과 chat-매개 흐름의 *자동 제안 가치* 가 *부분 충돌*.
→ ADR-010 = *Hybrid* — 두 정신의 균형점.

## 🔑 5 핵심 결정

| ID | 결정 | 의미 |
|---|---|---|
| **D-1** | **chat 승격** (playground → chats) = *수동 git mv + agent 조력 제안* | 자동 mv 의 *잘못 승격 위험* 회피. 디자이너의 *명시 의도* 가 영구 git history 에 기록 |
| **D-2** | **shell 승격** (component → shell 글로벌) = *agent 휴리스틱 + 디자이너 합의* | PoC 세션 3 검증된 패턴. *agent 가 잘 발견* + *디자이너가 잘 결정* |
| **D-3** | **글로벌 SSOT 자동 정리** (templates/) = *agent 제안 + confirm* | 글로벌 SSOT 는 *디자인 결정의 진실*. 자동 갱신은 *디자인 결정 자동화* 와 동치 — 위험 |
| **D-4** | **gen-design merge 명령** = *조력자* | 휴리스틱 후보 제시 + 변경 *preview* + 디자이너 *confirm* + 각 파일 atomic commit |
| **D-5** | **agent 책임 분리** = *제안 (자동) + 실행 (수동)* | P6 도서관 사서 비유의 한계 (사서는 책도 옮김) 를 넘어 *agent 는 제안만* 으로 명확화 |

## 🚦 Reconsider trigger (3 측정 가능 조건)

다음 중 *하나* 이상 발생 시 ADR-010-revised 작성:

1. **디자이너 이동 부담 누적**: 주 1회 이상 *동일 패턴 반복 mv* → *자동* (옵션 A) 시그널
2. **외부 alpha 마찰 보고**: alpha 디자이너 3+ 명이 *수동 mv 가 부담* 보고 → confirm UX 개선 또는 옵션 A 검토
3. **자동 mv 안전성 데이터**: agent 의 *잘못 mv* 0 사례 5+ 회 누적 → 자동 mv 권한 부여 검토

## 🔗 후속 영향

| spec | 영향 |
|---|---|
| **`spec-08-04`** chat-md grammar | frontmatter 의 `shell.{inherit, exclude}` 형식 정착 — 수동 편집 + agent 조력 갱신 둘 다 지원 |
| **`spec-08-06`** inferChat diff 모드 | Paper 변경 → chat 갱신 *제안* (자동) + 디자이너 confirm (수동) 패턴 채용 |
| **`spec-08-08`** gen-design merge | *조력자* 의미로 구현 — ADR-009 ⭐ 5 (보류) → ⭐ 5 (도입 확정) |
| **`spec-08-11`** 외부 alpha | alpha 디자이너의 *수동 mv 부담* 측정 — Reconsider trigger #2 의 데이터 |

## ✏️ 변경 파일

| 파일 | 변경 |
|---|---|
| `docs/decisions/ADR-010-chat-promotion-policy.md` | 신규 (138 줄) |
| `docs/handbook.md` §3 | "chat 승격 / shell 승격 정책 (ADR-010)" 절 추가 |
| `docs/handbook.md` §7 | gen-design merge 행 갱신 — (보류) → ⭐ 5 / *조력자* 명시 |
| `docs/handbook.md` §8 | ADR-010 자리 예약 → 작성 완료 + 결정 history 타임라인 갱신 |

코드 변경 0. 회귀 0 (725/725 PASS, build exit 0).

## 💬 사용자 협의

- **Hybrid 채택 정당성**: ADR-008 옵션 B 의 *수동* 정신을 깨지 않으면서 chat-매개 흐름의 *자동 제안* 가치 보존 → 사용자 합의.
- **gen-design merge = 조력자**: 디자이너 *합의 없이는 mv 0* — `spec-08-08` 에서 이 의미로 구현.
- **ADR-008 의 위치**: ADR-010 가 ADR-008 *재해석* (Hybrid) 이지 *대체* X. ADR-008 의 *글로벌 직접 편집* 정신 유지.

## 🎓 교훈

- ADR-008 의 *글로벌 직접 편집* 정신은 *디자이너 결정 권한 보호* 가 본질. ADR-010 은 그 정신을 *유지* 하면서 chat-매개 흐름의 *자동 제안 가치* 를 더함 — *대체* 가 아닌 *재해석*.
- *제안* 과 *실행* 의 분리가 *agent 의 능력* 과 *디자이너의 권한* 사이 자연 균형. 도서관 사서 비유의 한계를 넘어 명확화.
- Reconsider trigger 가 *측정 가능 데이터* 기반 (ADR-008 D-4 패턴 차용) — *기분이 아닌 데이터* 로 미래 결정 재논의.
- gen-design merge 의 *조력자* 의미가 ADR-009 D-4 의 *영구 보류* 가능성을 해소 — phase-8 안에서 *명확한 의미* 로 도입 가능 (`spec-08-08`).
