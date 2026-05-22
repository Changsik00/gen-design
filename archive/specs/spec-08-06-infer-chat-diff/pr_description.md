# spec-08-06: inferChat diff 모드 — 기존 chat 보존 + Paper 변경분만 갱신

## 🎯 목적

기존 chat.md 의 **Narrative / History / frontmatter 를 *bit-for-bit* 보존** 하면서 Paper 변경분만 Structure 영역에 적용. ADR-010 D-3 (제안 + confirm) 호응.

## 🔄 Before / After

### Before
- spec-08-05 `paper-import` → chat.md *전체 생성* 만
- Paper 변경 1 줄 → Narrative 통째로 사라짐 + History 0
- ADR-010 D-3 의 *실행 방식* 미정

### After
- `inferChatDiff()` — 변경분만 적용
- `gen-design diff <chat.md> <tree.json>` — dry-run 기본, `--apply` 명시
- Narrative / History / frontmatter 그대로 복사
- History 자동 라인: `**YYYY-MM-DD** Paper sync — texts X, variants Y, +A / -B`
- 변경 0 시 자동 라인 X (git diff 깔끔)

## 📌 핵심 변경

| 파일 | 변경 |
|---|---|
| `studio/src/lib/paper-inference/diff.ts` | 신규 — `inferChatDiff()` + diffStructure + mergeDocs |
| `studio/src/lib/paper-inference/emit-document.ts` | 신규 — full-Document serialize (frontmatter + 3-layer) |
| `studio/scripts/gen-design/diff.ts` | 신규 — `gen-design diff` 서브커맨드 |
| `studio/scripts/gen-design.ts` | router 에 `diff` 추가 |
| `fixtures/diff-scenarios/{A-E}/` | 5 통합 시나리오 fixtures |
| `studio/src/lib/paper-inference/__tests__/` | diff / emit-document / scenarios / dogfood (4 신규) |
| `studio/scripts/gen-design/__tests__/` | diff-args / diff-runtime (2 신규) |

## 🔑 8 핵심 결정

1. **Narrative / History / frontmatter 불변 보존** — 자연어 의도 보호
2. **Structure 만 inferChat 결과로 교체** — Paper 가 권위
3. **diff 키 = name + props (sorted)** — 간단 + 충분
4. **History 자동 라인 = 단순 통계** — 의미 추론 X (자동화 위험)
5. **변경 0 → 자동 라인 X** — git diff 깔끔
6. **dry-run 기본, `--apply` 명시** — ADR-010 D-3 호응
7. **`emitDocument` 신규** — full-Document serialize
8. **테스트 catalog inline** — 격리 + 의도 명확

## ✅ 검증

- **신규 테스트**: **52/52 PASS** (emit-doc 9 / diff 13 / args 9 / runtime 10 / router 2 / scenarios 5 / dogfood 4)
- **전체 회귀**: 845 → **887/887 PASS**
- **`pnpm --filter studio build`**: exit 0
- **manual CLI**:
  - dry-run → unified diff + stats + preserved 검증
  - `--apply` → Narrative *bit-for-bit* 보존 확인 (`/tmp/test-before.chat.md`)

## 🔗 후속 spec 영향

- **spec-08-07** chat-react-compiler — `emitDocument` 재사용 가능
- **spec-08-08** gen-design merge — diff 알고리즘의 패턴 응용
- **spec-08-09** gen-design lint — 변경 감지 응용
- **spec-08-11** 외부 alpha — dogfood 흐름 실 사용자 검증

## 📦 Commits

1. `test(spec-08-06): add failing tests for emitDocument`
2. `feat(spec-08-06): implement emitDocument with frontmatter and 3-layer sections`
3. `test(spec-08-06): add failing tests for inferChatDiff`
4. `feat(spec-08-06): implement inferChatDiff with preservation`
5. `feat(spec-08-06): add gen-design diff subcommand`
6. `test(spec-08-06): add 5 integration scenarios for diff mode`
7. `test(spec-08-06): add dogfood simulation for login.chat.md evolution`
8. `docs(spec-08-06): ship walkthrough and pr description`

## 🛡️ Rollback

단일 PR. `git revert <merge-commit>` 안전 — 신규 파일만 + router 1 행 추가. 기존 `inferChat` / `paper-import` 영향 0.

## 📚 References

- [walkthrough.md](walkthrough.md) — 8 핵심 결정 + 후속 영향 + 교훈
- [ADR-010 chat 승격 정책](../../docs/decisions/ADR-010-chat-promotion-policy.md) — D-3 (제안 + confirm) 호응의 *실행 방식*
