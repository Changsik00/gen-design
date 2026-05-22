# spec-08-06: inferChat diff 모드 — 기존 chat 보존 + Paper 변경분만 갱신

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-08-06` |
| **Phase** | `phase-08` (chat-agent-flow) |
| **Branch** | `spec-08-06-infer-chat-diff` |
| **상태** | Planning |
| **타입** | Feature (diff 알고리즘 + CLI + Narrative/History 보존) |
| **Integration Test Required** | yes (5+ 시나리오) |
| **작성일** | 2026-05-12 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- spec-08-04 (chat-md-grammar) — chat.md 의 3-layer (Narrative / Structure / History) parse 가능
- spec-08-05 (paper-mcp-adapter) — `gen-design paper-import` 가 Paper tree → chat.md *전체 생성*
- 현재 흐름은 ***전체 덮어쓰기*** 만 가능 — Narrative (자연어 설계 의도) + History (변경 기록) 가 *매번 사라짐*
- ADR-010 D-3 결정 — *agent 제안 + 디자이너 confirm* — 실행 방식 (CLI / 알고리즘) 미정

### 문제점

1. **Narrative 손실 위험**: Paper 변경 1 줄 (텍스트 수정) 만으로 디자이너의 자연어 설계 의도가 통째로 사라짐 — *닫힌 루프 역방향 동기* 의 핵심 가치 훼손
2. **History 누적 불가**: 매 sync 마다 새 chat 으로 덮어쓰면 이전 변경 기록 0 — 디자인 결정의 *이유* 추적 불가
3. **농도 부적합 갱신**: 자식 1 개 추가 시 *전체 chat 재생성* 은 git diff 가 *큼* → 리뷰 / revert 어려움
4. **PoC 미검증** — `playground/chats/scenes/login.chat.md` 의 *진화* 흐름 (Paper 변경 → chat 갱신) 이 phase-8 의 핵심이지만 시뮬레이션 0

### 해결 방안 (요약)

`inferChatDiff(existingChatText, newTree, catalog, options)` 함수:

1. 기존 chat.md parse → old AST
2. 새 Paper tree → inferChat → new AST (Structure 만 사용)
3. **Narrative / History / frontmatter 는 old 보존**
4. **Structure 만 new 로 교체**
5. History 에 자동 1 줄 추가 (예: `**2026-05-12** Paper sync — TextNode 3 변경, variant 1, +1 / -0`)
6. emit → 신규 chat.md 텍스트

`gen-design diff <chat.md> <tree.json>` 서브커맨드 — dry-run (변경 preview) + `--apply` (실제 쓰기).

> **ADR-010 D-3 호응**: dry-run = *agent 제안*, `--apply` = *디자이너 confirm 후 실행*. 무명 flag 강제 X — 디자이너 의도가 명시.

## 🎯 요구사항

### Functional Requirements

#### F-1: `inferChatDiff` 함수

```ts
interface DiffOptions {
  catalog: CatalogMap;
  /** History 라인 자동 추가 — 기본 true. */
  appendHistory?: boolean;
  /** History 라인의 날짜 (테스트 결정성). 기본 today. */
  date?: string;
  /** inferChat 의 confident threshold. 기본 0.8. */
  threshold?: number;
}

interface DiffResult {
  /** 합쳐진 새 chat.md 텍스트 */
  text: string;
  /** 변경 통계 — agent / 디자이너 의사결정용 */
  stats: {
    textChanges: number;
    variantChanges: number;
    added: number;       // ComponentInstance 추가
    removed: number;     // ComponentInstance 삭제
  };
  /** 자동 추가된 History 라인 (appendHistory=true 일 때) */
  historyLineAdded?: string;
  /** Narrative / History / frontmatter 보존 여부 (assertion) */
  preserved: { frontmatter: boolean; narrative: boolean; history: boolean };
}

export function inferChatDiff(
  existingChatText: string,
  newTree: PaperTreeNode,
  options: DiffOptions,
): DiffResult;
```

#### F-2: Structure diff 알고리즘

- old Structure body vs new Structure body 의 ComponentInstance 비교
- 비교 키: ComponentInstance 의 *name + props.variant* (axis 의 첫번째 prop)
- 변경 분류:
  - **text-change**: 같은 component, props 같지만 children 안 MarkdownText / Placeholder 본문 다름
  - **variant-change**: 같은 component, props 다름 (variant / size / 기타 axis)
  - **added**: old 에 없는 new 의 component
  - **removed**: old 에 있는 new 에 없는 component
- 결과는 `stats` 에 집계

#### F-3: Narrative / History / frontmatter 보존

- `existingChatText` parse → old AST
- `result.frontmatter = old.frontmatter` (그대로 복사)
- `result.title = old.title`
- `result.narrative = old.narrative` (그대로 복사 — *없으면* null 유지)
- `result.history = old.history` + (optional) 자동 1 줄 추가
- `result.structure = new structure` (inferChat 결과)
- emit 단계에서 `Frontmatter → Title → Narrative → Structure → History` 순서로 serialize

#### F-4: History 자동 라인

기본 형식:
```
- **YYYY-MM-DD** Paper sync — texts X, variants Y, +A / -B
```

옵션:
- `appendHistory: false` → 자동 추가 0
- 변경 *전혀 없음* → 자동 추가 0 (no-op 시 history 그대로)

#### F-5: `gen-design diff` 서브커맨드

```
gen-design diff <chat.md> <tree.json> [options]

Options:
  --apply               diff 결과를 chat.md 에 실제 쓰기 (기본: dry-run)
  --output <path>       --apply 시 다른 경로로 출력 (기본: chat.md 덮어쓰기)
  --threshold <0-1>     inferChat threshold (기본 0.8)
  --no-history          History 라인 자동 추가 비활성
  --date <YYYY-MM-DD>   History 날짜 명시 (기본 today)
  --help, -h
```

기본 (dry-run):
- stdout — diff 결과 (unified diff 또는 색깔 diff)
- stderr — stats 요약 + preserved 검증

`--apply`:
- chat.md 덮어쓰기 (또는 `--output`)
- stdout — 변경 통계 한 줄

### Non-Functional Requirements

1. **회귀 0**: 기존 `inferChat` (전체 생성) 영향 0 — 새 함수 `inferChatDiff` 별도
2. **결정성**: 같은 입력 (chat + tree + options.date) → 같은 출력 (deep equal)
3. **테스트 커버리지**: diff 알고리즘 10+ / CLI 6+ / 5+ 통합 시나리오 (text / variant / add / remove / mixed)
4. **dogfood**: `playground/chats/scenes/login.chat.md` 의 진화 시뮬레이션 — tree.json 변경 → diff → 변경분만 적용 + Narrative 보존 확인

## 🚫 Out of Scope

- **shell.inherit 자동 적용** — `spec-08-07` (chat-react-compiler)
- **catalog 어휘 매칭의 회귀 모드** (잘못 매칭 사용자 합의) — phase-9 후보
- **컴포넌트 *이름 변경* 검출** (Button → IconButton) — `add + remove` 로 처리. 정확한 rename 검출은 후속
- **3-way merge** (chat 직접 수정 + Paper 동시 수정) — phase-9 후보 (현재는 *Paper 우선* 만)
- **studio runtime 안 diff UI** — spec-08-10 후보
- **agent 의 자연어 confirm 응답** — 본 spec 은 CLI / 알고리즘만. agent 통합은 handbook §6 (P6) 의 일반 패턴

## ✅ Definition of Done

- [ ] `studio/src/lib/paper-inference/diff.ts` 신규 — `inferChatDiff()`
- [ ] Structure diff 알고리즘 단위 테스트 10+
- [ ] Narrative/History/frontmatter 보존 단위 테스트 4+
- [ ] History 자동 라인 형식 테스트 3+
- [ ] `studio/scripts/gen-design/diff.ts` 신규 — `gen-design diff` 서브커맨드
- [ ] gen-design router 에 `diff` 추가
- [ ] CLI 단위 테스트 6+ (dry-run / apply / output / no-history / 오류)
- [ ] 5+ 통합 시나리오 fixture + 테스트:
  - [ ] 시나리오 A — 텍스트만 변경 (Narrative 보존 확인)
  - [ ] 시나리오 B — variant 변경 (`size: md` → `size: lg`)
  - [ ] 시나리오 C — 컴포넌트 추가
  - [ ] 시나리오 D — 컴포넌트 삭제
  - [ ] 시나리오 E — 혼합 (텍스트 + variant + 추가 동시)
- [ ] dogfood 시뮬레이션 — `playground/chats/scenes/login.chat.md` + 변경된 tree → diff PASS
- [ ] `pnpm test` 회귀 0 (≥ 836, 신규 +)
- [ ] `pnpm --filter studio build` exit 0
- [ ] walkthrough.md + pr_description.md ship commit
- [ ] PR 생성 + 사용자 검토
