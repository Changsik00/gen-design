# phase-9: gen-design 활성화 + 외부 alpha

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-09-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어디까지 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-09` |
| **상태** | Planning |
| **시작일** | 2026-05-22 |
| **목표 종료일** | 2026-05-29 |
| **소유자** | dennis |
| **Base Branch** | `phase-09-gen-design-live` (opt-in) |

## 🎯 배경 및 목표

### 현재 상황

**phase-8 결과물**: chat.md grammar + Paper MCP adapter + inferChat diff + chat→React 컴파일러 — *닫힌 루프 인프라* 완성.

**phase-8 에서 이연된 4 spec** (📌 D-1, 2026-05-12):
- **gen-design merge** (8-08): chat 슬라이스 → 글로벌 SSOT 누적 명령. ADR-010 Hybrid 정책 의존.
- **gen-design lint** (8-09): catalog ↔ chats ↔ templates 정합 검증 6 카테고리. CI 통합 가능.
- **Studio 런타임** (8-10): `fixtures.generated.ts` 빌드타임 → 런타임 동적 fetch. chat 편집 UI (3층 표시) + shell preview.
- **외부 디자이너 alpha** (8-11): handbook 만 읽고 30 분 도그푸딩. phase-7 W10 이행.

이연 이유: 인프라 ship 후 *실 사용 데이터로 더 명확한 정의* 가 가능하고, external alpha 는 인프라 안정 후 외부 노출이 안전하기 때문 (phase-8 D-1).

### 목표 (Goal)

phase-9 종료 시:

- **`gen-design` 5 명령 완전 구현** — paper-import / diff / react (phase-8) + **merge / lint** (본 phase). ADR-009 전 명령 작동.
- **Studio 런타임 동적 fetch** — 디자이너가 Studio UI 안에서 chats 편집 내용을 즉시 확인. shell preview 포함.
- **외부 디자이너 alpha 1 명** — 진짜 도그푸딩. handbook 만 읽고 EmptyState 또는 ProfileScene 신규 작성 30 분 + 정성 피드백 보고.
- **전체 회귀 0** — phase-8 의 925/919 tests PASS 기준 유지 이상.

### 성공 기준 (Success Criteria) — 정량 우선

1. **`pnpm gen-design merge <chat-id>`** — chat 슬라이스 3개 이상 공통 패턴 → `_shell.chat.md` 승격 제안 자동 감지. Hybrid 실행(제안 자동 + 실행 수동) PASS. ADR-010 정책 준수.
2. **`pnpm gen-design lint`** — 6 카테고리 (frontmatter / grammar / catalog-ref / shell-inherit / compile / naming) 검증. 정합 오류 0 fixtures에서 PASS / 의도 오류 주입 → 카테고리별 검출 PASS.
3. **Studio 런타임** — `fixtures.generated.ts` 빌드타임 의존 제거. `/api/chats` dev endpoint → UI 에서 chats/ + playground/chats/ 동적 인식. chat 3층 (Narrative/Structure/History) 표시 + shell preview 렌더.
4. **외부 alpha 보고서** — `docs/external-alpha-1.md` 작성. 차단점 N건 / 매끄러운 흐름 / handbook 보정 후보 정리.
5. **회귀** — `cd studio && pnpm test` 전체 PASS. `pnpm build` exit 0.

## 🧩 작업 단위 (SPECs)

> 본 표는 phase 의 *작업 지도* 입니다. SPEC 은 *요점 + 방향성 + 참조* 까지만 적습니다.
> 자세한 spec/plan/task 는 `specs/spec-09-{seq}-{slug}/` 에서 작성합니다.
> sdd 가 `<!-- sdd:specs:start --> ~ <!-- sdd:specs:end -->` 사이를 자동 갱신하므로 마커는 그대로 두세요.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-09-01` | gen-design-merge | P? | Merged | `specs/spec-09-01-gen-design-merge/` |
| `spec-09-02` | gen-design-lint | P? | Merged | `specs/spec-09-02-gen-design-lint/` |
| `spec-09-03` | studio-runtime | P? | Merged | `specs/spec-09-03-studio-runtime/` |
| `spec-09-04` | external-alpha | P? | Merged | `specs/spec-09-04-external-alpha/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`
> sdd가 ship 시 자동으로 `Merged`로 갱신합니다. `In Progress`는 active spec에 자동 마킹됩니다.

### spec-09-01 — gen-design-merge

- **요점**: ADR-009 의 `merge` 명령 구현 — chat 슬라이스 → 글로벌 SSOT (`templates/{DESIGN,FRONT,TOKEN}.md`) 누적. shell 승격 자동 감지.
- **방향성**: ADR-010 Hybrid 정책 (제안 자동 + 실행 수동) 구현. 휴리스틱: *3+ scene 공통 패턴* → `_shell.chat.md` 승격 후보 제안. `studio/scripts/gen-design.ts` 에 `merge` 서브명령 추가.
- **참조**:
  - `backlog/phase-08.md` §spec-8-08 (원본 이연 정의)
  - `docs/decisions/ADR-009-gen-design-cli.md` (5 명령 계획)
  - `docs/decisions/ADR-010-chat-promotion-policy.md` (Hybrid 정책)
- **연관 모듈**: `studio/scripts/gen-design.ts`, `studio/src/lib/paper-inference/`

### spec-09-02 — gen-design-lint

- **요점**: ADR-009 의 `lint` 명령 — catalog ↔ chats ↔ templates 정합 검증 6 카테고리. Read-only 진단. CI 통합 가능.
- **방향성**: 6 카테고리: frontmatter 유효성 / grammar PASS / catalog ref 존재 / shell-inherit 정합 / compile dry-run (ts-diagnose) / naming 컨벤션. `--fix` 없는 순수 진단. GitHub Actions step 추가.
- **참조**:
  - `backlog/phase-08.md` §spec-8-09 (원본 이연 정의)
  - `docs/decisions/ADR-009-gen-design-cli.md` §D-5
  - `docs/handbook.md` §4 (명명 컨벤션)
- **연관 모듈**: `studio/scripts/gen-design.ts`, `.github/workflows/`

### spec-09-03 — studio-runtime

- **요점**: Studio UI 의 `fixtures.generated.ts` 빌드타임 의존 → 런타임 동적 fetch. fixtures + playground + chats 세 source 동적 인식. chat 편집 UI (3층 표시) + shell preview.
- **방향성**: Vite dev server 의 fs API 또는 별도 `/api/chats` dev endpoint. `fixtures.generated.ts` 는 CI/테스트 용으로만 유지. UI chat 뷰어: Narrative (마크다운) / Structure (AST 요약) / History (타임라인) 탭. shell preview: shell + scene 합성 결과 미리보기.
- **참조**:
  - `backlog/phase-08.md` §spec-8-10 (원본 이연 정의)
  - `studio/src/features/spec-editor/` (현재 UI)
  - PoC 통증 #5 (동적 fetch 부재)
- **연관 모듈**: `studio/src/features/spec-editor/`, `studio/vite.config.ts`, `studio/server/`

### spec-09-04 — external-alpha

- **요점**: 외부 디자이너 1 명 alpha — handbook 만 읽고 *EmptyState 또는 ProfileScene* 작성. 30 분 + 정성 피드백 보고. phase-7 W10 이행.
- **방향성**: 사용자 트랙 의뢰 (실제 외부인 또는 역할극). `docs/external-alpha-1.md` 보고서 작성 — 차단점 N건 / 매끄러운 부분 / handbook 보정 후보. 결과로 handbook §4~§5 최소 1 항목 보정.
- **참조**:
  - `backlog/phase-08.md` §spec-8-11 (원본 이연 정의)
  - `docs/handbook.md` (평가 대상)
  - phase-7 의 W10 (외부 도그푸딩 미이행)
- **연관 모듈**: `docs/handbook.md`, `docs/external-alpha-1.md` (신규)

> **의존성**:
> - 09-01 선행 0 (ADR-010 이미 작성됨)
> - 09-02 ← 09-01 독립 (병행 가능)
> - 09-03 ← 09-01 독립 (병행 가능, spec-09-03 은 UI 영역)
> - 09-04 ← 09-03 권장 (Studio 런타임 안정 후 외부 노출) — 09-01/02 와 병행 착수 가능

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| phase-8 이연 4 spec 순서 | 01→02→03→04 순차 vs 01/02/03 병행 | 01→02→03→04 순차 (단일 dev) | 단일 작업자 환경. 09-01 merge 가 ADR-010 을 코드로 검증 → 이후 lint(09-02) 가 merge 결과를 검사 대상으로 포함 가능 |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: gen-design 5 명령 end-to-end

- **Given**: `playground/chats/` 의 shell + 2 scene + 3 component
- **When**: `pnpm gen-design merge` → 공통 패턴 감지 → 수동 승격 → `pnpm gen-design lint` → `pnpm gen-design react login`
- **Then**: merge 제안 PASS / lint 0 오류 / react TSX ts-diagnose critical 0
- **연관 SPEC**: spec-09-01, spec-09-02, (spec-08-07 기존)

### 시나리오 2: Studio 런타임 동적 인식

- **Given**: `chats/` 에 새 scene.chat.md 파일 추가 (빌드 없이)
- **When**: Studio UI dev server 실행 → chats 목록 갱신 확인
- **Then**: 새 파일 즉시 목록 노출 + 3층 탭 렌더 + shell preview 정상
- **연관 SPEC**: spec-09-03

### 시나리오 3: 외부 alpha 도그푸딩

- **Given**: handbook 만 가진 외부 디자이너 1 명
- **When**: 30 분 EmptyState 또는 ProfileScene 신규 작성 시도
- **Then**: `docs/external-alpha-1.md` — 차단점 기록 + handbook 보정 최소 1 항목
- **연관 SPEC**: spec-09-04

### 통합 테스트 실행

```bash
cd studio && pnpm test
pnpm gen-design merge && pnpm gen-design lint
pnpm gen-design react login --chat-root playground/chats
```

## 🔗 의존성

- **선행 phase**: phase-08 (chat.md grammar + paper-import + diff + react 컴파일러 모두 완료)
- **외부 시스템**: Paper MCP (디자이너 환경), 외부 디자이너 1 명 (spec-09-04)
- **연관 ADR**:
  - `docs/decisions/ADR-009-gen-design-cli.md` (5 명령 계획 — 잔여 2 명령 본 phase 구현)
  - `docs/decisions/ADR-010-chat-promotion-policy.md` (merge 정책 — Hybrid 확정)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| merge 휴리스틱 (3+ scene 공통 패턴) 의 정확도 | 과검출 / 미검출 | playground/chats 실제 데이터로 튜닝 + Hybrid (제안만) 이므로 false positive 허용 |
| Studio dev endpoint 의 보안 (dev only) | prod 빌드에 노출 위험 | `import.meta.env.DEV` 게이트 + vite build 시 트리셰이킹 |
| 외부 alpha 섭외 — 실제 외부인 없을 경우 | W10 미이행 | 역할극(사용자가 디자이너 역할) 으로 대체 가능 — 단 보고서에 방법론 명시 |
| spec-09-01/02/03 병행 착수 시 충돌 | gen-design.ts 동시 편집 | 순차 진행 (단일 dev 환경) — 09-01 → 09-02 → 09-03 → 09-04 |

## 🏁 Phase Done 조건

- [ ] spec-09-01 ~ spec-09-04 전체 Merged (`phase-09-gen-design-live` base branch → main)
- [ ] 통합 테스트 시나리오 1, 2, 3 PASS
- [ ] 성공 기준 1~5 정량 측정 결과 (§📊 검증 결과)
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
