# Walkthrough: spec-09-02 — gen-design lint

## 커밋 순서

| 커밋 | 설명 |
|---|---|
| `921f2a7` | test(spec-09-02): add failing lint-args tests |
| `29771ef` | feat(spec-09-02): implement parseLintArgs |
| `8a20712` | test(spec-09-02): add failing lint-runtime tests |
| `3a99611` | feat(spec-09-02): register lint subcommand and add GitHub Actions CI |

## 주요 결정 로그

### 1. gray-matter 미사용 — 정규식 frontmatter 파서 직접 구현

`plan.md` 에서 gray-matter 를 예상했으나 studio 패키지에 설치되어 있지 않았고, merge.ts 패턴과 일관성을 맞추기 위해 정규식 기반 `parseFrontmatter()` 를 직접 구현했다.

단순 1-depth 파서로 시작했으나 `shell.inherit: true` 와 같은 중첩 YAML 블록을 파싱하지 못해 `checkShellInherit` 테스트가 실패했다. 인덴트 기반으로 중첩 블록을 수집하는 방식으로 수정하여 해결했다.

### 2. grammar + catalog-ref 카테고리 — 기존 lintFile() 재활용

`studio/src/lib/chat-md/lint/index.ts` 의 `lintFile()` 는 4-stage (parse → schema → catalog → axis) 파이프라인을 제공한다. `parse` stage 에러를 `grammar` 카테고리로, `catalog`/`axis` stage 에러를 `catalog-ref` 카테고리로 분기하여 중복 구현을 피했다.

단, `lintFile()` 은 `.spec.md` 용으로 설계된 schema 를 필요로 한다. `chatRoot` 에서 상대 경로로 catalog.json / spec-schema.json 을 찾는 방식이므로, 경로가 없으면 해당 카테고리를 skip 한다 (graceful degradation).

### 3. compile 카테고리 — runReact exitCode 확인

TypeScript `tsc --noEmit` 는 속도가 느리고 vitest 환경에서 테스트하기 복잡하다. `runReact` 를 직접 호출하고 exitCode 0 여부로 "컴파일 성공" 을 판단하는 방식을 채택했다. Structure 섹션이 없는 파일은 skip 한다 (draft 단계 chat.md 배려).

### 4. 최초 GitHub Actions CI 파일 생성

이 프로젝트의 첫 `.github/workflows/ci.yml`. pnpm 10 + Node.js 24 기반, `pnpm test --run` + `gen-design lint --no-compile` 두 step. compile 단계는 CI 에서 실행 환경(Paper artboard 등) 없이 실패할 수 있어 `--no-compile` 사용.

### 5. Task 5 skip — Task 3 에서 전체 구현 완료

Task 3 (parseLintArgs Green) 커밋에서 이미 lint.ts 전체 로직을 구현했다. 코어 로직이 args 파싱보다 앞서 작성되어 Task 5 를 별도 커밋 없이 `[-]` 처리.

## 테스트 결과

| 테스트 | 결과 |
|---|---|
| `lint-args.test.ts` | 12/12 PASS |
| `lint-runtime.test.ts` | 17/17 PASS |
| 전체 회귀 (`pnpm test`) | **979/979 PASS** |
