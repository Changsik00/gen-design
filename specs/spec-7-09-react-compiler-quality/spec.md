# spec-7-09: React compiler 품질 개선

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-09` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-09-react-compiler-quality` |
| **상태** | Planning |
| **타입** | Fix |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

Phase-7 독립 감사 (Opus) 가 React compiler (spec-7-05) 에서 4 가지 품질 문제를 발견:

**C1 — 잘못된 JS 식별자**: `spec-react` CLI 가 `login-page.spec.md` 를 처리 시 `basename(..., ".md")` → `"login-page.spec"` → `"LoginPage.spec"` (invalid JS). `--name` 없이 `.spec.md` 파일 처리 시 항상 발생.

**C2 — 존재하지 않는 import 방출**: `imports-builder.ts` 가 `react-i18next` (package.json 미설치)와 `@/lib/tokens` (모듈 미존재) 를 import 구문으로 방출 → 생성된 TSX 가 타입체크 즉시 실패.

**C4 — self-referential accuracy 측정**: `benchmark.test.ts` 가 ground truth AST → `astToSyntheticTree` → 같은 catalog 로 `inferSpec` → 자기 자신 비교. 실제 디자이너의 자유로운 레이어 명명 (오타, 약어, 한글 등) 시뮬레이션 없음. phase-5 회고의 "관대한 측정 함정" 정확히 재현.

**C5 — 두 파이프라인 동등성 0 검증**: UI 는 `buildReactTree` (React node 트리), CLI 는 `compileToReact` (TSX 문자열). 생성 TSX 가 유효한 TypeScript 인지 검증하는 테스트 없음.

### 해결 방안

- C1: basename 처리 시 `.spec` suffix 제거
- C2: `react-i18next` → 프로젝트 내 실제 i18n 패턴 (literal string + comment) 으로 대체; `@/lib/tokens` → CSS var reference string 으로 대체
- C4: 노이즈 주입 픽스처 5개 추가 (오타, 약어, 한글 레이어명 등)
- C5: 생성 TSX 의 `tsc --noEmit` 통과 검증 (또는 동등한 parse-level 검증)

## 🚫 Out of Scope

- UI React preview 와 CLI TSX 의 *의미적* 동등성 — 두 파이프라인은 목적이 다름 (UI=live preview, CLI=downloadable code). 유효성만 검증.
- `react-i18next` 설치 및 완전한 i18n 런타임 — 다음 phase 과제.
- paper-normalizer production 통합 (C3) — 별도 spec 필요, 이번 범위 밖.

## ✅ Definition of Done

- [ ] `spec-react login-page.spec.md` 실행 시 `export function LoginPage()` (valid identifier)
- [ ] 생성 TSX import 구문이 `@/lib/tokens`, `react-i18next` 를 포함하지 않음
- [ ] noise fixture 5개 추가, benchmark 테스트 PASS
- [ ] 전체 655 테스트 PASS
- [ ] ship commit + push + PR
