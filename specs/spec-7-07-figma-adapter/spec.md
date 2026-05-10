# spec-7-07: Figma → spec.md 어댑터 PoC

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-7-07` |
| **Phase** | `phase-7` |
| **Branch** | `spec-7-07-figma-adapter` |
| **상태** | Planning |
| **타입** | Feature / Research |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-10 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-7-04 에서 Paper → spec.md inference 파이프라인을 완성했다:

```
Paper 노드 트리 → PaperTreeNode
  → component-matcher (어휘 매칭)
  → variant-extractor (dot syntax 파싱)
  → ast-builder (Document AST)
  → emit (spec.md 텍스트)
```

이 파이프라인의 입력은 `PaperTreeNode` — Paper MCP 에서 얻는 레이어 트리. 하지만 시장의 많은 디자이너는 **Figma** 를 주 도구로 쓴다.

### 문제점

Figma 를 쓰는 디자이너가 본 시스템을 활용하려면:
1. Figma 에서 Paper 로 디자인을 옮긴 뒤
2. Paper inference → spec.md 생성

두 단계 진입 비용이 존재한다. Figma 파일을 *직접* spec.md 로 변환할 수 있다면 디자이너 reach 를 대폭 넓힐 수 있다.

### 해결 방안 (요약)

Figma MCP server (2025-10 stable) 의 `get_design_context` 로 Figma 노드 트리를 받아, Paper inference 의 **matching/classification/emit 로직을 그대로 재사용** 하는 어댑터 레이어를 추가한다. Figma 노드 → `PaperTreeNode` 변환(mapper)만 신규 작성하면 된다.

## 📊 개념도

```mermaid
graph LR
  subgraph Figma
    FIG[Figma design context JSON]
  end

  subgraph figma-adapter (신규)
    FT[figma-types.ts]
    FM[figma-node-mapper.ts]
    AD[adapt.ts]
  end

  subgraph paper-inference (재사용)
    CM[component-matcher.ts]
    VE[variant-extractor.ts]
    AB[ast-builder.ts]
    EM[emit.ts]
  end

  FIG --> FT
  FT --> FM
  FM -->|PaperTreeNode| AB
  AB --> CM
  AB --> VE
  CM --> EM
  VE --> EM
  EM -->|spec.md 텍스트| OUT[spec.md]
```

## 🎯 요구사항

### Functional Requirements

1. Figma design context JSON (Figma MCP `get_design_context` 출력 형식) 을 입력으로 받는다.
2. `FRAME`, `COMPONENT`, `INSTANCE`, `TEXT`, `RECTANGLE`, `GROUP` Figma 노드 타입을 `PaperTreeNode` 로 변환한다.
3. Figma 레이어 명명 컨벤션 (`Button/Primary/Large` 슬래시 형식) 을 dot syntax (`Button.primary.large`) 로 정규화한다.
4. 정규화된 트리를 기존 `inferSpec` 파이프라인에 전달해 spec.md 텍스트를 생성한다.
5. CLI (`figma-adapt`) 로 Figma 노드 JSON fixture 파일을 인자로 받아 spec.md 를 stdout 에 출력한다.
6. 정확도 리포트: 매칭된 컴포넌트 수, 신뢰도 분포, 미매칭 레이어 목록을 stderr 에 JSON 으로 출력한다.

### Non-Functional Requirements

1. `figma-adapter` 는 `paper-inference` 의 내부 구현을 **복사하지 않는다** — import 로만 재사용.
2. Figma 노드 타입은 `figma-types.ts` 에 타입 정의로 격리 — MCP API 변경 시 이 파일만 수정.
3. 단위 테스트: figma-node-mapper 입출력 검증, 슬래시→dot 정규화 검증.
4. 통합 테스트: PoC fixture 1개 페이지 변환 → `parse(text).ok === true` 검증.

## 🚫 Out of Scope

- Figma OAuth / API 토큰 관리 — MCP 연결은 사용자 환경에서 이미 세팅된 것으로 가정.
- 멀티 페이지 Figma 파일 변환 — PoC 는 단일 페이지(Frame).
- Figma 이미지 에셋(fills) 다운로드 — 레이어 이름/구조만 추출.
- Studio UI 연동 — PoC 는 CLI + 단위 테스트로 충분; UI 는 후속 spec.
- Figma Auto Layout → CSS Grid/Flex 매핑 — 어휘 매칭 범위 밖.

## ✅ Definition of Done

- [ ] 모든 단위 테스트 PASS (`pnpm test` 기준)
- [ ] 통합 테스트 PASS: fixture 1개 페이지 → `parse(text).ok === true`
- [ ] CLI: `node dist/lib/figma-adapter/cli/figma-adapt.js fixture.json` 실행 성공
- [ ] 정확도 리포트 JSON stderr 출력 (matched / low-confidence / unmatched 분류)
- [ ] `walkthrough.md` 와 `pr_description.md` 작성 및 ship commit
- [ ] `spec-7-07-figma-adapter` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
