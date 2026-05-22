# Walkthrough: spec-08-07 — chat → React compiler (shell inherit + scene 통합)

## 🎯 한 줄 요약

spec-08-04 의 grammar 가 *기록* 한 `shell.{inherit, exclude}` + `{{scene.content}}` placeholder 를 *해석* 으로 승격 → **단일 scene TSX 출력**. phase-8 dogfooding 흐름 (Paper → chat → React) 의 마지막 단계 완성.

## 📊 Before / After

### Before

- spec-08-04 가 `shell.inherit`, `shell.exclude`, `{{scene.content}}` 의미 *기록* 만 가능
- 기존 `compileToReact()` — 단일 component 단위 (chat → TSX). scene + shell 합성 X
- PoC `playground/chats/scenes/login.chat.md` 는 *meta 만 인식*, 실제 TSX 출력 0
- phase-8 의 *마지막 단계* (chat → React) 비어있음

### After

- `compileScene(slug, opts)` — chat 디렉토리에서 scene + shell 로드 + merge
- `mergeShellAndScene` — exclude 적용 + `{{scene.content}}` substitute
- `gen-design react <slug>` — CLI 진입점 (slug 기반)
- dogfood: `playground/chats/scenes/login` → BrandHeader 제외, AppFooter 포함, LoginForm 본문 inject
- 기존 jsx-emitter / imports-builder / variant-emitter / behavior-emitter 모두 *재사용*

## 🔑 8 핵심 결정

| ID | 결정 | 근거 |
|---|---|---|
| **D-1** | shell 해석 위치 = **AST 합성 (compile *전*)** | 기존 emit 파이프라인 재사용 극대화. emit 단계 수정 0 |
| **D-2** | shell.exclude = ComponentInstance 통째 제거 (자식 포함, 재귀) | 단순 + 디자이너 의도 일치. 부분 exclude 는 후속 |
| **D-3** | `{{scene.content}}` Placeholder → scene.structure.body 교체 | grammar 의 의미 정보 1:1 활용. AST walk 단계에서 splice |
| **D-4** | 다중 placeholder = 동일 body 복제 | 단순 + 일반적 use case. 변형은 후속 |
| **D-5** | shell.inherit ≠ true → scene 단독 컴파일 | 기존 compileToReact 동등. 회귀 0 |
| **D-6** | CLI = slug 입력 (`gen-design react login`) | dogfooding 자연 명령형 — 파일 경로 X |
| **D-7** | catalog 위임 (jsx-emitter 규칙 그대로) | 일관성 + 회귀 0 |
| **D-8** | `structuredClone` 으로 AST aliasing 회피 | 다중 placeholder 시 같은 노드 참조 위험 차단 |

## 🧪 테스트 결과

| 영역 | 신규 | 결과 |
|---|---|---|
| shell-merge (exclude / placeholder / 메타 보존) | 7 | 7/7 PASS |
| compile-scene (inherit / no-inherit / 오류 / 결정성) | 6 | 6/6 PASS |
| react-args | 6 | 6/6 PASS |
| react-runtime | 5 | 5/5 PASS |
| router (2 신규) | 9/9 PASS | |
| react-dogfood (playground login + main) | 6 | 6/6 PASS |
| **총 신규** | **32** | **32/32 PASS** |
| **전체 회귀** | **919** | **919/919 PASS** |
| **studio build** | — | exit 0 |
| **manual CLI** | login + 결정성 | PASS (BrandHeader X, AppFooter O, LoginForm O, 2회 동일) |

## 🔗 후속 spec 연결점

| spec | 활용 |
|---|---|
| **spec-08-08** gen-design merge | shell 승격 휴리스틱 — `compileScene` 의 *역방향* 패턴 |
| **spec-08-09** gen-design lint | scene + shell 정합성 (exclude 의 component 가 catalog 에 존재?) 검증 |
| **spec-08-10** studio runtime | compileScene 의 결과를 vite 에 라이브 inject |
| **spec-08-11** 외부 alpha | dogfood 흐름의 *최종 산출물* (TSX) 검증 |

## 💬 사용자 협의

- **shell 해석 위치 = AST 합성** — 기존 jsx-emitter 재사용으로 변경 최소화. 합의.
- **shell.exclude = 통째 제거** — 부분 exclude 는 후속 spec. 합의.
- **CLI = slug 입력** — 디자이너 자연 명령형. 합의.
- **comment 노이즈** — playground/chats/_shell.chat.md 의 markdown 텍스트가 JSX 안 comment 로 흘러감. 결과는 정확하지만 *시각적 잡음* — 별도 cleanup 후보 (out of scope).

## 🎓 교훈

- **AST 합성 전략의 가치** — emit 단계 X 수정 + 기존 파이프라인 재사용 = 변경 최소 + 회귀 0. spec-08-08 (merge) 도 같은 패턴 적용 가능.
- **placeholder substitute 의 단순함** — `{{scene.content}}` 마커 단일 *kind* 가 다양한 use case (단일 / 다중 / 부재) 를 자연스럽게 처리. grammar 결정의 *깊이* 가 컴파일 *간단함* 으로 이어짐.
- **slug 기반 CLI 의 dogfooding 친화성** — `gen-design react login` 이 디자이너 자연 명령형. 파일 경로 입력보다 *컨텍스트* (chats/ 디렉토리 구조) 활용.
- **manual CLI 의 노이즈 = 의미 있는 신호** — `_shell.chat.md` 의 markdown 본문 (디자이너 의도 설명) 이 JSX 안 comment 로 흘러감. 기능은 정확하지만 *결과 가독성* 개선 후보. 향후 *Structure 영역만 emit* 으로 조정 가능 (현재는 *body 전체* emit).
