# spec-08-03: ADR-010 chat 승격 정책 — Hybrid (제안 자동 + 실행 수동)

## 🎯 목적

ADR-008 (per-spec design = 옵션 B) 의 *글로벌 직접 편집* 정신은 유지하되, chat-매개 흐름의 *agent 능동 제안* 가치를 더한 **Hybrid** 정책을 ADR-010 으로 확정. handbook §3 / §7 / §8 일관 갱신.

## 🔄 Before / After

### Before

- **ADR-008 옵션 B**: 디자이너 글로벌 직접 편집, 자동 mv 0. phase-7 단일 디자이너 흐름에서 매끄러움.
- **ADR-009 D-4**: gen-design `merge` 명령 = *"옵션 A 도입 시까지 보류 — 영구 보류 가능"* (미정).
- **chat-매개 흐름 PoC**: agent 가 *능동 제안* (shell 승격, 정리) 자연 발생 → ADR-008 *수동* 정신과 *부분 충돌*.
- **handbook §8**: ADR-010 = *"작성 예정 (spec-08-05)"*.

### After

- **ADR-010 = Hybrid (제안 자동 + 실행 수동)** 5 D-항목 확정:
  - D-1 chat 승격 = 수동 git mv + agent 조력 제안
  - D-2 shell 승격 = agent 휴리스틱 (3+ scene 공통) + 디자이너 합의
  - D-3 글로벌 SSOT 자동 정리 = agent 제안 + confirm
  - D-4 gen-design merge = *조력자* (휴리스틱 + preview + confirm)
  - D-5 agent 책임 분리 = 제안 (자동) + 실행 (수동)
- **gen-design merge** 우선순위: (보류) → **⭐ 5** (`spec-08-08` 도입 확정)
- **handbook §8**: ADR-010 *작성 완료 (2026-05-10)*

## 📌 핵심 변경

| 파일 | 변경 |
|---|---|
| `docs/decisions/ADR-010-chat-promotion-policy.md` | 신규 (138 줄) — Hybrid 결정, 5 D-항목, 3 Reconsider trigger |
| `docs/handbook.md` §3 | "chat 승격 / shell 승격 정책 (ADR-010)" 절 추가 |
| `docs/handbook.md` §7 | gen-design merge 행 갱신 — *조력자* 명시, ⭐ 5 |
| `docs/handbook.md` §8 | ADR-010 인덱스 행 + 결정 history 타임라인 갱신 |

## 🚦 Reconsider trigger (측정 가능 3 조건)

1. 디자이너 이동 부담: 주 1회 이상 동일 패턴 반복 mv
2. 외부 alpha 마찰: alpha 디자이너 3+ 명 수동 mv 부담 보고
3. 자동 mv 안전성: agent 잘못 mv 0 사례 5+ 회 누적

## 🔗 후속 spec 영향

- **`spec-08-04`** chat-md grammar — `shell.{inherit, exclude}` frontmatter 형식
- **`spec-08-06`** inferChat diff 모드 — Paper 변경 제안 + confirm 패턴
- **`spec-08-08`** gen-design merge — 조력자 의미로 구현 (도입 확정)
- **`spec-08-11`** 외부 alpha — Reconsider trigger #2 데이터 수집

## ✅ 검증

- `pnpm test`: **725/725 PASS** (코드 변경 0)
- `pnpm --filter studio build`: **exit 0**
- ADR-010 양식 — ADR-007 헤더 구조 정확 준수
- 9 ADR 링크 정합성 + ADR-010 자체 (006/007/008/009 연관) 검증

## 📦 Commits

1. `docs(spec-08-03): add ADR-010 chat promotion policy (Hybrid)` — ADR-010 본문
2. `docs(spec-08-03): add chat promotion section in handbook §3` — §3 절 추가
3. `docs(spec-08-03): update §7 gen-design merge as helper-mode` — §7 행 갱신
4. `docs(spec-08-03): mark ADR-010 as accepted in handbook §8` — §8 인덱스 + 타임라인
5. `docs(spec-08-03): ship walkthrough and pr description` — ship

## 🛡️ Rollback

단일 PR. 머지 후 발견 시 `git revert <merge-commit>`. 코드 변경 0 → revert 영향 0.

## 📚 References

- [ADR-008](../../docs/decisions/ADR-008-per-spec-design-files.md) — 선행 (옵션 B)
- [ADR-009](../../docs/decisions/ADR-009-gen-design-cli.md) — gen-design CLI / merge 명령 보류 해소
- [ADR-010](../../docs/decisions/ADR-010-chat-promotion-policy.md) — 본 spec 산출물
- [walkthrough.md](walkthrough.md) — 결정 근거 + 5 D-항목 상세
