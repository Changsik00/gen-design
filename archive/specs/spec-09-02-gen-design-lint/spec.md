# spec-09-02: gen-design lint — chat.md 정합 검증

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-09-02` |
| **Phase** | `phase-09` |
| **Branch** | `spec-09-02-gen-design-lint` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-05-22 |
| **소유자** | dennis |

## 📋 배경 및 문제 정의

### 현재 상황

`gen-design` CLI 는 `paper-import` / `diff` / `react` / `merge` 4 명령을 지원한다 (spec-09-01 구현). ADR-009 D-5 의 `lint` 명령이 마지막으로 미구현 상태이다.

현재 `studio/src/lib/chat-md/lint/` 에 `.spec.md` 대상 4-stage 파이프라인(parse→schema→catalog→axis)이 있다. 그러나 이 파이프라인은 spec.md 용이고, `chat.md` 파일의 frontmatter 유효성 / shell-inherit 정합 / 파일 명명 컨벤션 등은 검증하지 않는다.

### 문제점

- chat.md 파일의 필수 frontmatter 누락 (type / name / identity / created) 이 런타임 오류로만 드러남.
- scene 의 `shell.inherit: true` 설정 후 `_shell.chat.md` 를 삭제해도 아무도 감지 못함.
- 파일 명명 규칙 (`scenes/*.chat.md`, `components/*.chat.md`) 위반이 수동 코드 리뷰에만 의존.
- CI 에서 chat.md 정합을 자동 검증하는 step 이 없어 불량 파일이 머지될 수 있음.

### 해결 방안 (요약)

`studio/scripts/gen-design/lint.ts` 로 `lint` 서브명령을 구현한다. 6 카테고리(frontmatter / grammar / catalog-ref / shell-inherit / compile / naming)를 순서대로 실행하고, 에러를 누적하여 파일별 리포트를 출력한다. 기본 dry-run(read-only), `--no-compile` 으로 느린 TSX 컴파일 단계를 skip 가능. GitHub Actions CI step 으로 자동화.

## 🎯 요구사항

### Functional Requirements

1. `pnpm gen-design lint [--chat-root <dir>] [--no-compile]` 명령 실행 가능.
2. 기본 scan 대상: `chatRoot` 아래 `scenes/*.chat.md` + `components/*.chat.md` + `_shell.chat.md`.
3. **frontmatter**: 필수 필드(type / name / identity / created) 존재 확인. type 허용값(`scene` / `shell` / `component`) 검증. catalog.tier 허용값(1 / 2 / 3) 검증.
4. **grammar**: chat.md peggy 파서(`lintFile`)로 parse 성공 여부 확인.
5. **catalog-ref**: Structure 섹션의 JSX 태그(`<ComponentName`) 가 `catalog.json` 에 등록됐는지 확인 (기존 `lintFile` 의 catalog stage 재활용).
6. **shell-inherit**: type=scene 이고 `shell.inherit: true` 이면 동일 chatRoot 에 `_shell.chat.md` 존재 확인. `shell.exclude` 항목이 있으면 해당 항목이 catalog 에 등록됐는지 검증.
7. **naming**: 파일명이 kebab-case (소문자+하이픈)임을 확인. scene 파일은 `scenes/` 아래, component 파일은 `components/` 아래에 위치.
8. **compile**: `--no-compile` 미지정 시, scene 파일에 대해 `runReact`(stdout-only, 파일 저장 없음) 실행 → exitCode 0 확인. Structure 섹션 없는 파일은 skip.
9. 후보 없음(0 error): `"All checks passed."` 출력 + exit 0. 에러 있음: exit 1.
10. `--help` / `-h`: 도움말 출력 + exit 0.
11. `.github/workflows/ci.yml` — `pnpm -C studio gen-design lint` step 포함.

### Non-Functional Requirements

1. `--no-compile` 없는 전체 실행 시 playground/chats 기준 5 초 이내 완료.
2. 단위 테스트: 인수 파싱(lint-args) + 각 카테고리 함수(lint-runtime) 독립 테스트.
3. compile 카테고리 테스트는 tmpdir + 실제 파일 패턴(merge-runtime.test.ts 와 동일).
4. 기존 4 명령 (`paper-import`, `diff`, `react`, `merge`) 회귀 없음.

## 🚫 Out of Scope

- `--fix` 자동 수정 (조력자 원칙 준수 — 순수 진단만).
- `.spec.md` 파일 linting (기존 `spec-lint.ts` 가 담당).
- TypeScript 타입 검사 (tsc --noEmit) — compile 카테고리는 TSX 생성 성공 여부만 확인.
- templates/*.md 정합 검증 (별도 scope).
- `--fix` 없는 pure diagnosis 외의 모든 자동화.

## 📑 ADR 후보

- [x] 없음 (ADR-009 D-5 가 이미 lint 정책 정의 — 본 구현은 그 코드화)

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`cd studio && pnpm test scripts/gen-design/__tests__/lint`)
- [ ] Integration Test Required = no
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-09-02-gen-design-lint` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
