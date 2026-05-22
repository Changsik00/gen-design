# spec-11-03: `gd doctor` — DESIGN/TOKEN/chat 정합 + drift 감지 + 친절한 한국어 메시지

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-11-03` |
| **Phase** | `phase-11` |
| **Branch** | `spec-11-03-gd-doctor` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

- spec-11-01 : scaffold + 41 파일 preset 완성
- spec-11-02 : 4 능동 스킬 (gd-start/chat/token/design) 작성. 스킬들은 *반복적으로* `pnpm gd doctor` 명령을 안내 — 그러나 실제 `doctor` 명령은 *존재하지 않음*.
- studio 에는 `gen-design lint` (6 카테고리) 만 존재 — phase-11 의 본질인 *디자이너 산출물 정합* 은 부분만 검증.

### 문제점

스킬이 안내하는 `pnpm gd doctor` 가 *없으면 스킬 본문이 무의미*. 또한 기존 lint 가 검증 안 하는 항목:

- ❌ DESIGN.md 의 `{token.name}` 참조가 TOKEN.md 에 정의됐는지
- ❌ TOKEN.md / tokens.json 의 DTCG 1.0 strict 형식 검증
- ❌ 토큰 색 대비 WCAG 2.1 AA 자동 측정 (8 페어)
- ❌ chat.md ↔ TSX *drift* (chat 수정됐는데 컴파일 안 됨)
- ❌ chat.md 가 카탈로그 외 컴포넌트 사용 시 **"Did you mean?"** (Levenshtein) 제안
- ❌ orphan TSX (chat.md 가 삭제됐는데 src/scenes/ 만 남음)
- ❌ 친절한 *한국어* 오류 메시지 + *해결 방법 한 줄*

### 해결 방안 (요약)

신규 `gd doctor` subcommand — 기존 `gen-design lint` 의 6 카테고리 superset + 6 신규 검증. 모든 오류 메시지 한국어 + 해결 명령 한 줄. lat.md 개념 차용한 `// @gd:` annotation 으로 drift 감지.

## 🎯 요구사항

### Functional Requirements

1. **`gd doctor` subcommand 추가** — `studio/scripts/gen-design.ts` router 에 추가, `--chat-root` / `--templates-root` / `--no-compile` 옵션
2. **검증 항목 12 개** (기존 6 + 신규 6):

   기존 (lint.ts 에서 흡수):
   - frontmatter / grammar / catalog-ref / shell-inherit / naming / compile

   신규:
   - **`token-ref`**: DESIGN.md 의 `{token.name}` 또는 chat.md 의 `bg-primary` 등이 TOKEN.md / tokens.json 에 정의됐는지
   - **`token-format`**: TOKEN.md / tokens.json 이 DTCG 1.0 strict 형식인지 (`$value` / `$type` 필수)
   - **`contrast`**: 토큰 색 페어 8개의 WCAG 2.1 AA 자동 측정 — 미달 시 가장 가까운 합격 OKLCH 제안
   - **`scene-drift`**: `src/scenes/*.tsx` 의 `// @gd:` annotation 으로 chat.md mtime > TSX mtime 감지
   - **`orphan-scene`**: chat.md 없는데 TSX 만 남은 경우
   - **`vocab-similar`**: 카탈로그 외 컴포넌트 사용 시 Levenshtein 거리 ≤ 3 의 카탈로그 항목 제안 ("Did you mean?")

3. **친절한 한국어 메시지** — 각 진단 출력:
   - 어떤 파일의 어떤 위치 (file:line)
   - 무엇이 잘못됐는지 (한 줄)
   - 어떻게 고치는지 (구체 명령 또는 대안)
4. **`gd react` 가 출력 TSX 에 `// @gd: chats/scenes/<name>.chat.md` annotation 자동 삽입** — drift 감지 기반
5. **exitCode** — 모든 검증 PASS 면 0, 오류 ≥ 1 이면 1 (CI 게이트 가능)
6. **JSON 출력 옵션** — `--json` 시 기계 처리 가능 (CI / agent 활용)

### Non-Functional Requirements

1. 기존 `gen-design lint` 사용 사례 유지 (deprecation X — `doctor` 가 superset)
2. 모든 진단 메시지 한국어
3. 실행 속도: 30 chat.md + 28 catalog 기준 *5초 이내*
4. test 커버: 각 검증 항목 단위 테스트 + 통합 fixture 1건

## 🚫 Out of Scope

- `@gd/cli` 별도 npm package 분리 (phase-12 후보) — 본 spec 은 *studio 내 구현*
- preset 의 `pnpm gd doctor` 실 동작 (scaffold + studio 코드 packaging) — phase-12
- `gd doctor --fix` 자동 수정 모드 (별도 후속)
- Paper drift 감지 — chat ↔ Paper anchor (phase-12+)
- gen-design lint 의 deprecation (계속 alias 유지)
- 토큰 빌드 파이프라인 (`gd build-tokens` — tokens.json → globals.css) — 별도 spec

## 📑 ADR 후보

- [x] `ADR-013-gd-doctor-checks` (type: convention — 12 검증 카테고리 + 한국어 메시지 표준 + `// @gd:` annotation drift 패턴)

## ✅ Definition of Done

- [ ] `studio/scripts/gen-design/doctor.ts` 구현 + 6 신규 검증 함수
- [ ] `studio/scripts/gen-design/lint.ts` 6 카테고리를 doctor 가 흡수 (lint 명령은 alias 로 유지)
- [ ] `studio/scripts/gen-design.ts` router 에 `doctor` 추가
- [ ] `studio/scripts/gen-design/react.ts` 가 TSX 출력에 `// @gd: <chat-path>` annotation 자동 삽입
- [ ] 각 검증 항목 단위 테스트 (vitest, fixture 기반)
- [ ] 통합 fixture: 의도적 오류 6종 → doctor 가 모두 검출 + 한국어 메시지 확인
- [ ] 실행 시간 측정 (5초 목표) + walkthrough 기록
- [ ] `walkthrough.md` 와 `pr_description.md` 작성
- [ ] `spec-11-03-gd-doctor` 브랜치 push 완료
