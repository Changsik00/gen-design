# external-alpha-1: handbook 도그푸딩 보고서

> **작성일**: 2026-05-22
> **Spec**: spec-09-04-external-alpha
> **방법론 주의**: 본 세션은 *실제 외부 디자이너 없음*. agent 가 "handbook 만 읽은 첫날 디자이너" 역할극(role-play)으로 수행. 투명성 확보를 위해 명시.

---

## 1. 방법론

| 항목 | 내용 |
|---|---|
| **방식** | agent 역할극 — agent 가 handbook 만 읽은 신규 디자이너 역할 취함 |
| **제약** | handbook.md 외 사전 지식 차단. 내부 코드/ADR 직접 참조 금지 (단, 막혔을 때 검증용으로 catalog.json 참조 허용) |
| **대상 task** | handbook §4 워크플로를 따라 `playground/chats/scenes/profile.chat.md` 작성 |
| **시간 시뮬레이션** | §4 각 단계 진행 중 막히는 지점 실시간 기록 (30분 제한 시뮬레이션) |
| **산출물** | `playground/chats/scenes/profile.chat.md` (세션 artifact) |

---

## 2. 차단점 (Blockers)

> 최소 3건 요구 — 실제 발견 **5건** 기록.

| # | 단계 | 현상 | 원인 | 예상 소요 시간 | 심각도 |
|---|---|---|---|---|---|
| B-1 | §5 R5 읽기 (grammar) | "frontmatter 미사용 (현재)"라고 되어 있어 frontmatter 를 쓰지 말아야 하나 의문 발생. §4 Day 2 예시에는 frontmatter 있음. 실제 파일들도 모두 frontmatter 사용. | §5 R5 의 설명이 구버전(미사용 시점) 상태로 방치됨. 예시와 설명이 충돌 | **15분** — 어느 쪽이 맞는지 불확실해 예시 파일 직접 열어 확인 필요 | 🔴 HIGH |
| B-2 | §4 Day 1 (Paper 시작) | handbook 이 "Paper artboard 먼저 생성" 으로 시작. Paper MCP 환경 미준비 시 "paper: null 로 chat.md 먼저 시작 가능한가?" 가 불명확 | §4 Day 1 가 Paper-first 워크플로만 설명하며, Paper 없이 시작하는 대안 경로 미제공 | **10분** — 실제 playground 파일을 열어 `paper: artboard: null` 패턴 발견 후 해소 | 🟡 MEDIUM |
| B-3 | §4 Day 2 Structure 작성 | `<StatCard variant="compact">` / `<StatCard variant="highlighted">` 를 handbook 예시대로 쓰려 했으나, catalog.json 확인 시 StatCard 의 `axes: []` — variant 정의 없음. handbook 예시와 catalog 가 불일치 | StatCard 컴포넌트가 variant 를 코드에 구현하지 않았거나 catalog extractor 가 아직 추출 못 한 상태 | **10분** — gen-design lint 실행 후 오류 없음이지만, 코드 컴파일 시 타입 오류 가능성 잔존 | 🟡 MEDIUM |
| B-4 | frontmatter `references:` 필드 | 실제 파일들(`main.chat.md`)에서 `references:` 필드 사용. handbook §5 R5 에서 frontmatter 필드 설명 전무 — 어떤 frontmatter 키가 공식 스펙인지 알 수 없음 | handbook 이 frontmatter 를 "미사용" 으로 분류한 탓에 필드 목록 정의 없음 | **5분** — 실제 파일 패턴 따라 복사 | 🟡 MEDIUM |
| B-5 | gen-design lint 실행 경로 | handbook §7 에서 `pnpm gen-design lint` 로 표기. workspace root 에서 `pnpm --filter studio exec tsx scripts/gen-design.ts lint ...` 가 필요한지, 별칭 `gd` 가 실제 동작하는지 불명확 | alias 정의와 실제 workspace script 연결이 handbook 에 누락 | **5분** — studio 디렉토리에서 `pnpm exec tsx scripts/gen-design.ts lint ...` 로 해결 | 🟠 LOW |

---

## 3. 매끄러운 부분 (Smooth Points)

> 최소 2건 요구 — 실제 발견 **3건** 기록.

| # | 항목 | 내용 |
|---|---|---|
| S-1 | 3층 구조 (Narrative / Structure / History) | §2 glossary 의 표가 각 층의 역할 (*왜* / *어떻게* / *언제*) 을 명확히 설명. 처음 보는 디자이너도 섹션 구분 즉시 이해. 산출물 작성 중 막힘 없음. |
| S-2 | 살아있는 예시 링크 | §4 각 단계에 `📁 살아있는 예시` 링크 존재. main.chat.md / empty-state.chat.md 를 즉시 참조해 frontmatter 형식과 Structure 패턴을 빠르게 파악 가능. 링크가 없었다면 B-1 해소에 30분+ 소요 예상. |
| S-3 | catalog 컴포넌트 이름 탐색 | `studio/src/lib/vocabulary/catalog/catalog.json` 위치와 역할이 §2 + §3 에 명시됨. ProfileScene 작성 시 AvatarUpload / ProfileInfoCard / StatCard 를 catalog 에서 즉시 확인 가능. 어휘 불일치 오류 방지. |

---

## 4. handbook 보정 후보

> 최소 3건 요구 — 실제 발견 **4건** 기록.

| # | 항목 | 위치 | 현재 문구 | 보정안 | 임팩트 |
|---|---|---|---|---|---|
| C-1 | frontmatter 현황 명시 | `§5 R5 chat.md grammar` | "frontmatter 미사용 (현재). 향후 도입 시 chat-md grammar 갱신 필수" | "frontmatter 사용 중 (spec-08-01 이후). 필수 필드: `type` / `name` / `identity` / `shell` / `catalog` / `paper` / `created`. 선택 필드: `references`. [필드 정의 표] 추가" | 🔴 **HIGH** — B-1 (15분 차단) 해소 |
| C-2 | Paper 없이 시작하는 경로 | `§4 Day 1` | Day 1 가 Paper artboard 생성으로만 시작 | Day 1 시작 직전에 "Paper 없이 시작" 경로 추가: "Paper MCP 미준비 시: `paper: artboard: null` 로 chat.md 먼저 작성 가능. Paper 생성은 Day 2 이후로 이월." | 🟡 MEDIUM — B-2 (10분 차단) 해소 |
| C-3 | StatCard variant 정의 | `§4 Day 2 예시` 또는 catalog | 예시에 `variant="compact"` / `variant="highlighted"` 사용 — catalog 에는 `axes: []` | 예시와 catalog 를 일치시킴: (A) catalog 에 StatCard variant 추가 (`compact` / `highlighted`) 하고 §4 예시 유지, 또는 (B) §4 예시에서 variant 제거 후 catalog 현재 상태 반영. (A) 권장 — 예시의 의도가 variant 사용 | 🟡 MEDIUM — B-3 (10분 차단, 잠재적 컴파일 오류) 해소 |
| C-4 | gen-design lint 실행 경로 명시 | `§7 도구 gen-design CLI 표` | `pnpm gen-design lint` (alias 만 표기) | 실제 실행 경로 추가: "workspace root: `pnpm --filter studio exec tsx scripts/gen-design.ts lint --chat-root <path>` / studio 디렉토리: `pnpm exec tsx scripts/gen-design.ts lint --chat-root <path>`" | 🟠 LOW — B-5 (5분 차단) 해소 |

---

## 5. 요약 및 다음 액션

**총 차단 시간 시뮬레이션**: 약 45분 (30분 제한 초과). handbook 개선 시 B-1/B-2 해소만으로 ~25분 단축 예상.

**즉시 적용 보정 (spec-09-04 내)**:
- C-1 (임팩트 최대, §5 R5 frontmatter 명시) → `docs/handbook.md` 직접 반영 (Task 4)

**후속 검토 권고**:
- C-3: StatCard variant 구현 여부는 studio 컴포넌트 코드 확인 후 catalog 갱신 spec 분리
- C-4: `pnpm gen-design` alias 가 workspace root 에서 동작하도록 `package.json` script 추가 검토

---

> **주의**: 본 보고서는 agent 역할극 결과이며 실제 외부 디자이너 피드백이 아닙니다. 비편향적 관점 확보를 위해 다음 external-alpha iteration 에서 실제 외부인 섭외를 권장합니다.
