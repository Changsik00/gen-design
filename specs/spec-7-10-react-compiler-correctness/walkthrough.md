# Walkthrough: spec-7-10

> phase-7 ship 직전 독립 Opus 감사 가 React 컴파일러의 *생성 TSX 가 실제 컴파일 불가* 임을 발견. 본 spec 은 No-Go 권고를 받아 수행된 fix-spec.

## 📌 결정 기록

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| C1 import 경로 — 모든 컴포넌트가 `@/components/ui/{lower}` 로 깨짐 | (A) imports-builder 인자에 디렉토리 메타 추가 / (B) component-registry 에 메타 export 단일 진실 | **B** | import 경로 진실은 이미 component-registry 의 import 문에 존재 — 별도 메타를 다른 곳에 두면 동기 부담. catalog.json 은 *어휘 정의*, registry 는 *studio 내부 매핑* — 역할 분리 유지 |
| C2 JSX 이중 emit — function body + return 양쪽 | (A) jsxBody 를 return 에만 / (B) jsxBody 를 body 에만 | **A** | return 안에 `<>...</>` 가 의도된 형태. function body 는 hooks 만 — React 관례. |
| C9 `LoginPage` 함수명-import 충돌 | (A) 함수명 변경 (예: `LoginPageScreen`) / (B) `excludeName` 옵션으로 self-import 생략 | **B** | spec 의 componentName 사용자 입력 (CLI `--name` 또는 파일명 유래) — 도메인 의미 보존. 컴파일러가 충돌만 회피. |
| C6 registryDependencies PascalCase | (A) deps 자체를 항상 kebab 으로 / (B) URL 도 허용 | **A+B** | shadcn registry 는 *kebab-case* 또는 *URL* 두 형식 모두 허용. URL 은 보존, 식별자는 kebab 으로 정규화. |
| 외부 검증 방식 — phase-7 ship 의 실패 원인 | (A) 별도 Next.js 프로젝트에서 `tsc --noEmit && build` / (B) `typescript` 패키지 in-process API | **B** | 외부 프로젝트 의존성 0, CI 결정성, 로컬 테스트 시간 < 1초. (A) 는 phase-8 의 external alpha 단계로 이연 (재실 검증). |
| 결정성 테스트 검증 범위 | (A) hash 비교만 유지 / (B) 외부 alpha 까지 도달하기 위한 실 빌드 | **A 유지 + ts-diagnose 추가** | 결정성은 *동일 입력 동일 출력* 의 약속. 실제 *유효한 출력* 의 약속은 ts-diagnose 가 별도 책임. 두 약속을 분리. |
| C4 i18n fake-pass — `useTranslation` 주석 매칭 | (A) 주석 자체 제거 / (B) 단언을 더 엄격하게 | **B** | imports-builder 의 비침습 주석 결정 (spec-7-09) 자체는 합리적 — 검증 단언만 강화 (주석 제거 후 `t(...)` 호출 매칭) |

## 💬 사용자 협의

- **주제**: phase-7 ship 권장 여부
  - **사용자 의견**: "권장 대로 진행" — Opus 감사의 No-Go 권고와 spec-7-10 추가 권고를 수용
  - **합의**: spec-7-10 으로 C1/C2/C6/C7/C9 통합 처리. C3/C4 부속 자동 해소. C5/C8 은 phase-8 이연. handbook + alpha 는 별도 트랙.

- **주제**: scope 분할 vs 통합
  - **사용자 의견**: "A로 진행" (옵션 A — 통합)
  - **합의**: 5건 모두 동일 영역 (`react/`) — 한 PR 로 처리. 분할은 과도한 churn.

## 🧪 검증 결과

### 1. 자동화 테스트

#### 단위 테스트
- **명령**: `cd studio && pnpm test`
- **결과**: ✅ Passed (724 tests in 7.69 s)
- **로그 요약**:
```text
 Test Files  103 passed (103)
      Tests  724 passed (724)
   Duration  7.69s
```

#### 통합 테스트 (in-process tsc 진단)
- **명령**: `cd studio && pnpm test src/lib/spec-md-compiler/react/__tests__/ts-diagnose.test.ts`
- **결과**: ✅ Passed (29/29 — 28 fixtures + presence sanity)
- **로그 요약**:
```text
 Test Files  1 passed (1)
      Tests  29 passed (29)
   Duration  753ms
```

### 2. 수동 검증

1. **Action**: `pnpm --filter studio build`
   - **Result**: `✓ built in 208ms` (TS6133 0 건 → C7 해소)
2. **Action**: 컴파일 결과 라이브 확인 — `<LoginPage />` + `componentName=LoginPage` 케이스
   - **Result**: 생성 TSX 가 `import { LoginPage }` 를 *생략*. `export function LoginPage()` 만 선언. C9 회피.
3. **Action**: registryDependencies 출력 확인
   - **Result**: `["button", "login-form", "social-auth-block"]` — kebab 정합 (이전 PascalCase 깨짐).
4. **Action**: `verifyTsx` 가 의도된 결함 (synthetic JSX-statement) 을 잡는지 sanity
   - **Result**: 손으로 만든 broken TSX 는 `transpileModule` 진단 발생 — 본 spec 의 회귀 가드는 진짜 동작.

## 🔍 발견 사항

- **결정성 테스트의 한계**: hash 비교는 *깨진 출력의 결정성* 도 통과시킨다. ts-diagnose 가 *유효한 출력* 의 직교 검증을 제공 — 두 테스트가 함께 있어야 의미. phase-8 에서 실 빌드 (alpha 시) 가 추가로 필요.
- **component-registry 가 사실상 SSOT**: catalog.json + COMPONENT_REGISTRY + COMPONENT_IMPORT_PATHS — 셋이 동기화되어야 함. 현재는 수동 동기화. phase-8 후보: build-time validator (3개가 정확히 동일한 컴포넌트 집합을 가지는지).
- **imports-builder fallback 정책**: 미등록 이름은 `@/components/ui/{lowercase}` — 이는 *catalog 부재* 상황의 호환성 유지. 단, 실제로 미등록 이름이 들어올 가능성 낮음 (knownComponents 가 lookupComponent 로 필터됨).
- **TS6133 이 빌드를 깨고 있었음**: PR 본문에 "672 checks PASS" 만 적혀 빌드 미언급. PR 양식 자체 문제 — phase-8 의 PR description 템플릿 강화 필요 (build/lint/test 분리 표기).

## 🚧 이월 항목 (Out of Scope)

- C5 paper-inference 99.1% self-referential — phase-8 별도 spec
- C8 paper-normalizer / paper-sync production 통합 — phase-8 첫 우선순위
- W2 테스트 부수효과 (`react-compile-report.md`, `bench-report.md` 가 repo 루트에 write) — phase-8
- W3 Tailwind play CDN 외부 참조 — phase-8
- W5 catalog Tier 2 = 1 (Input/Card/Dialog 미등재) — phase-8 어휘 보강
- W9 docs/handbook.md — `spec-x-handbook` 별도 PR
- W10 외부 디자이너 alpha — phase-ship hard gate, 사용자 트랙

## 📅 메타

| 항목 | 값 |
|---|---|
| **작성자** | Agent + dennis |
| **작성 기간** | 2026-05-10 |
| **최종 commit** | `73c0212` (Ship commit 추가 후 갱신 예정) |
