# Walkthrough: spec-08-04 — chat.md grammar 확장

## 🎯 한 줄 요약

phase-7 의 **body-only** chat.md grammar (`Document = Block*`) 를 확장 — frontmatter (YAML-lite) + 3-layer sections (Narrative/Structure/History) + chat-type schema 검증 추가. PoC `playground/chats/` 6 파일 회귀 PASS.

## 📊 Before / After

### Before (phase-7)

```
Document = Block*
Block    = Comment / ComponentTag / Placeholder / MarkdownText
```

→ frontmatter / 섹션 / shell semantics 인식 0. PoC chats 의 `type:scene`, `shell.exclude`, `## 💬 Narrative` 등 의미 정보 모두 *MarkdownText* 로 흘림.

### After (spec-08-04)

```
Document = Frontmatter? Block*       (post-process splits sections)
Frontmatter — YAML-lite subset
Sections   — ## Narrative / Structure / History 헤딩 인식
Schema     — type 별 필수 필드 검증 (validateChatSchema)
```

AST 확장:

```ts
Document {
  body: Block[],            // 기존 — 항상 채워짐
  frontmatter?: ChatFrontmatter | null,
  title?: string | null,
  narrative?: NarrativeSection | null,
  structure?: StructureSection | null,
  history?: HistorySection | null,
}
```

## 🔑 5 핵심 결정

| ID | 결정 | 근거 |
|---|---|---|
| **D-1** | frontmatter parser = peggy grammar 내부 | 단일 파서 / 단일 에러 좌표계. 외부 YAML 라이브러리 도입 X (build size + 일관성) |
| **D-2** | 3-layer section 인식 = `## ` heading 명칭 (emoji 옵션, 순서 자유) | 디자이너 자유 형식 보존 + 의미 분류 |
| **D-3** | shell semantics = *기록만* (AST 에 raw 보존) | 책임 분리 — grammar = 문법, compile = 의미 (해석은 spec-08-07) |
| **D-4** | recognized section 있을 때만 split | `## Behavior` / `## Variants` 같은 기존 compile-time 섹션 보존 — 회귀 0 |
| **D-5** | `Document.body` 항상 채워짐 (required), 새 5 필드 optional | 합성 Document (paper-inference, 테스트) 호환 + parser 결과 일관성 |

## 🛠 부수 grammar 보강 (PoC dogfooding)

playground/chats 파싱 중 발견한 자연 패턴 4 가지 — 작은 grammar 추가로 수용:

| 추가 | 예시 |
|---|---|
| PlaceholderKind 에 `scene` | `{{scene.content}}` (shell inherit 시 본문 삽입 마커) |
| ComponentName dotted | `<AppFooter.Copy>`, `<BrandHeader.Logo>` (compound component) |
| frontmatter trailing inline comment | `exclude: [BrandHeader]   # 디자이너 명시` |
| frontmatter YAML block sequence | `references:\n  - chats/components/foo.chat.md` |

## 🧪 테스트 결과

| 영역 | 신규 | 결과 |
|---|---|---|
| frontmatter (top-level / nested / inline / 부재 / 에러) | 13 | 13/13 PASS |
| sections (3-layer / emoji 옵션 / 순서 자유 / legacy) | 8 | 8/8 PASS |
| schema (shell/scene/component / opt-out) | 16 | 16/16 PASS |
| fixtures-regression playground 6 파일 | 3 | 3/3 PASS |
| **총 신규** | **40** | **40/40 PASS** |
| **전체 회귀** | **762** | **762/762 PASS** |
| **studio build** | — | exit 0 |

## 🔗 후속 spec 연결점

| spec | 활용 |
|---|---|
| **spec-08-05** paper-mcp-adapter | `frontmatter.identity` ↔ Paper layerNameAnchor 매칭 |
| **spec-08-06** inferChat diff 모드 | `frontmatter.shell.{inherit,exclude}` 보존 갱신 |
| **spec-08-07** chat-react-compiler | `structure.body` + `frontmatter.shell.inherit` → shell wrapping inject |
| **spec-08-08** gen-design merge | `frontmatter.catalog.{tier,family}` shell 승격 휴리스틱 |
| **spec-08-09** lint | `validateChatSchema` 가 lint 단계 일부로 통합 |

## 💬 사용자 협의

- **frontmatter parser 위치** — 외부 YAML 라이브러리 도입 X (peggy 내부 통합) 합의. YAML 1.2 fully-compatible X. multi-line string / anchor 는 후속 검토.
- **shell semantics** — grammar 차원 = *기록만*. 해석 (inject) 은 spec-08-07 의 책임으로 분리 합의.
- **PoC dogfooding gap 처리** — `<AppFooter.Copy>`, `{{scene.content}}` 등 PoC 가 자연 발생시킨 패턴은 본 spec 에서 grammar 보강 (스코프 내 — *grammar 확장*).

## 🎓 교훈

- **dogfooding 의 가치** — `playground/chats/` 6 파일이 grammar 의 4 가지 누락 패턴 자연 노출 (compound component, scene 마커, inline comment, block sequence). 사양 단계에서 미리 알기 어려운 케이스.
- **section split 의 회귀 안전성** — `## Behavior` / `## Variants` 같은 기존 compile-time 섹션이 깨질 위험을 *recognized section 만 split* 정책으로 회피. 미지의 H2 는 보존.
- **AST type 의 균형** — body required + 새 필드 optional 조합이 *parser 결과 일관성* 과 *합성 Document 자유도* 양쪽 만족.
- **Grammar action 의 String.raw 트랩** — backtick literal (` ``` `) 가 `String.raw\`...\`` 안에서 closure terminator 와 충돌. `String.fromCharCode(96)` 로 회피.
