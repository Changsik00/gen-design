# spec-09-01: gen-design merge — shell 승격 조력자

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-09-01` |
| **Phase** | `phase-09` |
| **Branch** | `spec-09-01-gen-design-merge` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gen-design` CLI 는 `paper-import` / `diff` / `react` 3 명령을 지원한다 (phase-8 구현). ADR-009 D-4 의 5 명령 중 `merge` / `lint` 2 개가 미구현이다.

현재 `playground/chats/` 에 `_shell.chat.md` + 2 scene + 3 component 가 수동으로 작성되어 있다. shell 승격은 PoC 세션 3 에서 *agent 가 수동 제안* → *디자이너 합의* 로 이루어졌지만 공식 CLI 흐름이 없다.

### 문제점

- shell 승격 패턴 감지가 agent 의 즉흥 판단에 의존 → 감지 기준 불일치, 재현성 없음.
- `pnpm gen-design merge` 명령이 없어 ADR-009 D-4 의 `merge` 정의가 "구현 미정" 상태로 방치.
- ADR-010 D-4 의 *조력자 형태* (휴리스틱 제시 → preview → confirm → apply) 가 코드로 명문화되지 않음.

### 해결 방안 (요약)

`studio/scripts/gen-design/merge.ts` 로 `merge` 서브명령을 구현한다. scene chat.md 들에서 공통 컴포넌트를 파싱하고, `threshold`(기본 3) 이상의 scene 에 등장하는 컴포넌트를 shell 승격 후보로 제시한다. 기본 dry-run (preview 출력), `--apply` 플래그로 `_shell.chat.md` + 영향 scene frontmatter 를 갱신한다.

## 🎯 요구사항

### Functional Requirements

1. `pnpm gen-design merge [--chat-root <dir>] [--apply] [--yes] [--threshold <N>]` 명령 실행 가능.
2. 기본 scan 대상: `playground/chats/` + `chats/` 의 `scenes/*.chat.md`.
3. 각 scene 의 Structure 섹션에서 JSX 태그 (`<ComponentName`, `<ComponentName/>`) 파싱 → component 참조 목록 추출.
4. `threshold` (기본 3) 이상의 scene 에서 참조된 component → 승격 후보 표시.
5. 이미 `_shell.chat.md` 의 Structure 에 포함된 component 는 후보 제외.
6. Dry-run (기본): 후보 목록 + 영향 scene 목록을 stdout 에 출력하고 종료 (파일 변경 없음).
7. `--apply`: preview 출력 → interactive y/N 확인 → confirm 된 component 를 `_shell.chat.md` Structure 에 추가 + History 갱신. `--yes` 로 non-interactive 자동 확인.
8. `--apply` 시 영향 scene 의 frontmatter `shell.inherit: true` 설정 (이미 true 이면 skip).
9. 후보 없음 시 `"No shell promotion candidates found."` 출력 + exit 0.

### Non-Functional Requirements

1. `--apply` 없는 dry-run 은 파일 변경 없음.
2. 단위 테스트: 인수 파싱 / 컴포넌트 추출 / 후보 감지 / preview 형식 / apply 로직 각각 독립 테스트 (파일시스템 mock).
3. 기존 3 명령 (`paper-import`, `diff`, `react`) 회귀 없음.

## 🚫 Out of Scope

- 글로벌 SSOT (`templates/*.md`) 로의 chat 내용 merge (ADR-009 원래 의미 중 templates 갱신 — 별도 spec).
- `playground → chats/` 파일 mv (ADR-010 D-1 — 수동 git mv).
- paper-import / diff / react 명령 수정.
- `--fix` 자동 rename (조력자 원칙 준수).

## 📑 ADR 후보

- [x] 없음 (ADR-009 D-4 + ADR-010 D-4 가 이미 정책 정의 — 본 구현은 그 코드화)

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`cd studio && pnpm test scripts/gen-design/__tests__/merge`)
- [ ] Integration Test Required = no
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-09-01-gen-design-merge` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
