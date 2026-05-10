# ADR-006: Paper-first workflow + spec.md 의 역할 재정의

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: docs/vision.md, ADR-004 (어휘 + variant), ADR-005 (grammar + IR), backlog/phase-7.md
> **선행 ADR**: ADR-005 (의 *방향성* 부분 정정)

## 컨텍스트

phase-7 의 첫 3 spec (7-01 어휘 / 7-02 grammar / 7-03 Paper compiler) 이 ship 된 후 사용자 리뷰 시점에 *근본적 방향 미스매치* 가 표면화:

> *"디자이너 입장에서는 React 에서 바로 결과를 보고 싶진 않을 거야. 익숙한 design tool 을 쓰겠지. … 디자인 툴에 레이어 영역에 컴포넌트 이름이 잡혀 있다면 그 부분이 우리가 말하는 컴포넌트 이름이 되어야 할 것 같아. … 디자이너가 ai 를 통해서 디자인툴에 주입 시킨 내용을 수정을 하고 그걸 픽스 하면.. 최종본으로 리액트로 뽑아서 결과를 보고 싶은거야. 그런데 지금은 그 반대의 느낌이거든?"*

### 문제 진단

phase-7 가 만든 흐름 vs 사용자가 의도한 흐름:

```
실제 구축 (phase-7 spec 7-01/7-02/7-03):
  spec.md (텍스트, source of truth) → AST → Paper / React

사용자 의도 (vision.md 의 깊은 의미):
  Paper (canonical) → spec.md (선택적 IR) → React
```

→ phase-7 는 *implementation-easy* 순서 (parser 먼저, compiler 나중) 로 진행했고, 그 결과 *디자이너의 워크플로 시작점* 이 빠져있었다.

ADR-005 D-1 (자체 grammar) 와 D-2 (자체 JSON tree IR) 의 *형식* 결정은 유효하지만 *방향성* 가정이 잘못되었음 — spec.md 를 *디자이너가 직접 작성하는 1차 입력* 으로 가정.

### 디자이너의 실제 워크플로

1. 디자이너가 Paper 캔버스를 연다 (또는 Figma)
2. AI 가 MCP 로 초기 디자인 주입
3. 디자이너가 시각적으로 수정 (컴포넌트 이름은 *레이어 이름* 으로 표현)
4. 디자이너가 fix → React 컴포넌트 코드로 export
5. 텍스트 (spec.md) 는 디자이너가 *볼 일 없는 IR* 또는 *git diff 도구*

## 결정

### D-1: Paper-first canonical 방향

**Paper → spec.md → React** 가 main flow. spec.md 는 *기본적으로 자동 생성되는 IR*. 디자이너는 Paper 만 본다.

```
[Paper (designer's primary workspace)]
   │  infer (Paper layer tree → spec.md)
   ▼
[spec.md (canonical IR — git-tracked)]
   │  compile
   ▼
[React (registry-item.json)]
```

### D-2: spec.md 는 *Designer 선택 사항* 양방향

**디자이너 선택 사항**: 평소엔 Paper 만, *원하면* spec.md 직접 편집 + Studio Preview Panel 로 Paper 시각화 round-trip.

- canonical: Paper (주된 워크플로)
- 보조: spec.md 직접 편집 (디자이너가 텍스트 IR 도 익숙해지면 빠른 반복 가능)
- 검증: spec.md → Paper 라운드트립 (이미 spec-7-03 으로 구축)

### D-3: Layer name = Component name 매핑

Paper 의 레이어 이름이 컴포넌트 어휘 (catalog.json 의 Tier 2 / Tier 3) 와 1:1.

| Paper 레이어 이름 | spec.md 출력 |
|---|---|
| `LoginForm` | `<LoginForm />` |
| `Button:primary` 또는 `Button[variant="primary"]` | `<Button variant="primary" />` |
| `Image` (이미지 fill 영역) | `<Image src="..." />` |
| `Card > Title + Body` | `<Card><Title /><Body /></Card>` (자식 트리) |

세부 매핑 룰은 다음 spec (Paper → spec.md inference) 에서 결정.

### D-4: spec-7-03 의 역할 재정의

spec-7-03 (spec.md → Paper compiler) 은 폐기 X. *역할 재정의*:

- **이전**: "디자이너가 spec.md 작성 → Paper 시각화" (primary direction)
- **이후**: "spec.md → Paper round-trip 검증 + spec.md 직접 편집한 디자이너의 보조 미리보기" (secondary direction)

코드 / 테스트 변경 0. *의미와 우선순위* 만 reframe.

### D-5: phase-7 spec 우선순위 재정렬

| 기존 ID | 기존 이름 | 새 우선순위 | 이유 |
|---|---|---|---|
| spec-7-04 | spec.md → React compiler | 연기 → 7-05 다음 | spec.md 는 *IR*, React 컴파일은 Paper inference 후 |
| spec-7-05 | Figma adapter | 후순위 (그대로) | 무관 |
| **spec-7-06** | **Paper → spec.md inference** | **즉시 다음 (긴급)** | **디자이너 워크플로의 foundation** |
| spec-7-07 | studio reframe | spec-7-06 후 재평가 | 인프라 정리, 본 pivot 후 재검토 |

## 결과

### 살아남는 자산 (영향 0)

- catalog.json — Paper layer name 매칭의 사전 (오히려 핵심)
- spec.md grammar + parser — IR 형식으로 그대로 유효
- spec-7-03 의 compileToPaper / Studio Preview Panel — 양방향 보조 도구

### 변경되는 자산

- phase-7.md backlog 표 — spec-7-06 을 즉시 다음으로 표시 + 사유 추가
- 다음 spec ID = `spec-7-04-paper-to-spec` (재번호 — 7-06 was paper-to-spec, 이제 7-04)
  - 실제로는 ID 충돌 방지 위해 *새 ID* 로 발행 가능 (e.g. spec-7-04-paper-inference)
  - sdd 가 7-04 다음을 7-05/06/07 로 자동 부여하므로, 기존 7-04 (spec.md → React) 는 *연기 / re-spec* 처리

### 향후 ADR 예정

- ADR-007: Paper layer name 매핑 grammar (variant 표현 규칙) — spec-7-04 의 일부
- ADR-008: spec.md ↔ Paper 양방향 *모호 케이스* (e.g. designer 가 Paper 와 spec.md 동시 편집 시 충돌 해결)

## 회고 (이번 ADR 의 교훈)

- *Implementation-easy* 순서 (parser → compiler) 와 *user-value* 순서 (designer's first step → final output) 는 다르다.
- vision.md 가 명시적으로 디자이너 워크플로를 그렸지만, ADR-005 의 *grammar* 결정 시점에 *spec.md 를 누가 어떻게 작성하나* 의 가정을 명시하지 않았음.
- 향후 ADR 작성 시 *Who creates this artifact?* 를 명시 항목으로.
