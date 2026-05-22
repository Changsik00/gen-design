# spec-08-04: chat.md grammar 확장 — frontmatter + 3 layers + shell semantics

## 🎯 목적

phase-7 의 *body-only* chat.md grammar 를 *frontmatter + 3-layer sections + chat-type schema* 인식 가능하게 확장. PoC `playground/chats/` 6 파일 회귀 게이트 통과.

## 🔄 Before / After

### Before
```
Document = Block*
```
→ frontmatter / 섹션 / shell semantics 0 인식. PoC chat 의 `type:scene`, `shell.exclude`, `## 💬 Narrative` 등 모두 *MarkdownText* 흘림.

### After
```
Document = Frontmatter? Block*       (post-process: split by ## headings)
+ Frontmatter — YAML-lite subset
+ Sections   — Narrative / Structure / History 분류
+ Schema     — type 별 필수 필드 검증
```

## 📌 핵심 변경

| 파일 | 변경 |
|---|---|
| `studio/src/lib/chat-md/grammar/chat-md.ts` | +200 줄 — Frontmatter rule + section split helpers + dotted ComponentName + scene placeholder |
| `studio/src/lib/chat-md/parser/ast-types.ts` | +60 줄 — ChatFrontmatter / NarrativeSection / StructureSection / HistorySection |
| `studio/src/lib/chat-md/parser/schema.ts` | 신규 — `validateChatSchema(ast)` (shell/scene/component) |
| `studio/src/lib/chat-md/parser/index.ts` | `parse()` 에 schema 단계 통합 (`skipSchema` opt-out) |
| `studio/src/lib/chat-md/parser/__tests__/{frontmatter,sections,schema}.test.ts` | 신규 — 37 케이스 |
| `studio/src/lib/chat-md/__tests__/fixtures-regression.test.ts` | playground/chats 6 파일 추가 |
| `studio/src/lib/chat-md-compiler/{paper,react}/...` | `structure?.body ?? body` 안전 폴백 (3 진입점) |
| `studio/src/lib/paper-inference/{ast-builder,emit}.ts` | 새 Document 타입 호환 |

## 🔑 5 핵심 결정

1. **frontmatter parser = peggy 내부** (외부 YAML 라이브러리 X) — 단일 좌표계 / build size 절감
2. **3-layer 인식 = `## ` heading 명칭** (emoji 옵션, 순서 자유) — 디자이너 자유 형식 보존
3. **shell semantics = 기록만** — 해석 (inject) 은 spec-08-07
4. **recognized section 있을 때만 split** — `## Behavior` 등 기존 compile-time 섹션 보존 (회귀 0)
5. **`Document.body` required + 새 필드 optional** — 합성 Document 호환

## 🛠 PoC dogfooding 으로 발견된 grammar 보강

| 추가 | 예시 |
|---|---|
| PlaceholderKind 에 `scene` | `{{scene.content}}` |
| ComponentName dotted | `<AppFooter.Copy>` |
| frontmatter trailing inline comment | `exclude: [BrandHeader]   # 메모` |
| frontmatter YAML block sequence | `refs:\n  - foo` |

## ✅ 검증

- **신규 테스트**: 37 (frontmatter 13 / sections 8 / schema 16) — **40/40 PASS** (fixtures-regression 3 신규 포함)
- **전체 회귀**: 725 → **762/762 PASS**
- **`pnpm --filter studio build`**: exit 0

## 🔗 후속 spec 영향

- **spec-08-05** paper-mcp-adapter — `frontmatter.identity` ↔ Paper layerNameAnchor
- **spec-08-06** inferChat diff — `shell.{inherit,exclude}` 보존 갱신
- **spec-08-07** chat-react-compiler — `structure.body` + shell inject
- **spec-08-08** gen-design merge — `catalog.{tier,family}` shell 승격 휴리스틱
- **spec-08-09** lint — `validateChatSchema` 통합

## 📦 Commits

1. `feat(spec-08-04): extend AST types with frontmatter and 3 sections`
2. `test(spec-08-04): add failing tests for frontmatter parser`
3. `feat(spec-08-04): implement frontmatter grammar`
4. `test(spec-08-04): add failing tests for 3-layer sections`
5. `feat(spec-08-04): implement 3-layer section grammar`
6. `test(spec-08-04): add failing tests for chat schema validation`
7. `feat(spec-08-04): implement chat schema validation`
8. `refactor(spec-08-04): use structure.body with backward-compat fallback`
9. `test(spec-08-04): extend fixtures-regression with playground/chats`
10. `docs(spec-08-04): ship walkthrough and pr description`

## 🛡️ Rollback

단일 PR. 머지 후 발견 시 `git revert <merge-commit>` — backward-compat 보장 (`Document.body` required + 새 필드 optional).

## 📚 References

- [walkthrough.md](walkthrough.md) — 5 핵심 결정 + 4 dogfooding 발견 + 교훈
- [ADR-005 Grammar & IR](../../docs/decisions/ADR-005-grammar-and-ir.md) — chat.md grammar 의 기반
- [ADR-010 chat 승격 정책](../../docs/decisions/ADR-010-chat-promotion-policy.md) — frontmatter `shell.{inherit,exclude}` 의미 규정 (선행)
