# ADR-001: Phase 재구성 — 있는 건 쓰고, 없는 걸 만들자

> **상태**: 승인 (Accepted)
> **날짜**: 2026-04-12
> **의사결정자**: Dennis

## 컨텍스트

프로젝트의 전체 Phase 계획(8개 Phase, 30 Specs)을 수립한 뒤, 기존 도구/생태계와의 중복 여부와 실효성을 비판적으로 검토했다. 핵심 질문은 두 가지:

1. **이미 잘 만들어진 도구가 있는데 우리가 굳이 만들고 있는 건 아닌가?**
2. **디자이너↔프론트 협업 Flow가 Phase에 반영되어 있는가?**

## 리서치 결과

### 이미 존재하는 것 — 재발명 위험 영역

| 기존 Phase 계획 | 이미 있는 도구 | 성숙도 |
|----------------|--------------|--------|
| Phase 1: DESIGN.md Schema 처음부터 정의 | Google Stitch 공식 포맷 + awesome-design-md 9섹션 확장 (35K+ stars) | 높음 |
| Phase 2: 토큰 JSON 구조 자체 설계 | W3C DTCG 스펙 (2025.10 안정판) | 표준화 완료 |
| Phase 2: 토큰→Tailwind 변환 스크립트 | Style Dictionary, Cobalt UI | 프로덕션 검증 |
| Phase 3: Vanilla/Radix/Aria 비교 Showcase | 이미 수많은 비교 자료 존재. Radix는 shadcn/ui 생태계에서 사실상 표준 | 결론 남 |
| Phase 4: Primitive 컴포넌트 직접 구현 | shadcn/ui (코드 복사 모델), Radix Themes, Park UI | 프로덕션 검증 |

### 아무도 안 만든 것 — 진짜 가치 영역

| 영역 | 현재 도구 생태계 상태 | 기회 |
|------|---------------------|------|
| DESIGN.md → 구조화된 페이지 명세 | 없음. DESIGN.md는 "비주얼 규칙"만 기술, "뭘 만들지"는 없음 | 핵심 차별점 |
| Page Template 재사용 시스템 | 없음. shadcn/ui도 Button/Card 수준. LoginPage 통째 재사용은 없음 | 강력한 차별점 |
| Blueprint 질의서 → 컴포넌트 매핑 | 완전히 공백. 요구사항→코드 사이의 구조적 가이드가 없음 | 아무도 안 했음 |
| 디자이너↔프론트 AI 기반 협업 Flow | Figma Dev Mode가 최선이나, AI 워크플로우는 없음 | Paper MCP 결합 시 독보적 |

### 현재 도구 생태계의 갭

```
Design Tool (Figma/Paper/Stitch)
    │
    v
Design Tokens (W3C DTCG JSON) ──→ Token Tools (Style Dictionary)
    │                                      │
    v                                      v
Design-to-Code (Anima/Locofy)      CSS/JS 토큰 파일
    │
    v
Component Framework (shadcn/ui, Radix Themes...)
    │
    v
Component Docs (Storybook, Zeroheight)
```

**누락된 레이어:**

```
DESIGN.md (비주얼 규칙)
    +
Page Catalog (라우트, 레이아웃, 컴포넌트 조합)
    +
Blueprint Questionnaire (브랜드/variant/구성 선택)
    │
    v
[이 갭] ──→ 구성된 테마 + 컴포넌트 레지스트리 + AI 컨텍스트
    │
    v
AI Agent가 shadcn/ui 등을 활용해 일관된 코드 생성
```

### 디자이너-프론트 협업 Flow — 기존 계획의 가장 큰 약점

기존 8 Phase 계획에는 **"누가, 언제, 뭘 하는가"**에 대한 워크플로우가 없었다. 도구는 만들지만 협업 프로토콜이 빠져있었음.

필요한 Flow:

```
디자이너                              프론트
   │                                   │
   ├─ Paper/Figma에서 시안 ──────────→ DESIGN.md 자동 추출
   │                                   │
   │                              Blueprint 질의서 실행
   │                                   │
   │                              Page Template 조합 + 코드 생성
   │                                   │
   ├─ Paper에서 결과 리뷰 ←─────────── 생성된 코드를 Paper에 렌더링
   │                                   │
   ├─ 수정사항 반영 ─────────────────→ DESIGN.md 업데이트 → 코드 재생성
   │                                   │
   └─ 최종 승인 ─────────────────────→ 머지
```

## 결정

**기존 8 Phase를 7 Phase로 재구성한다. 원칙: "있는 건 쓰고, 없는 걸 만들자."**

### 기존 계획 (8 Phase)

| Phase | 제목 | 문제점 |
|-------|------|--------|
| 1 | Schema 정의 | Stitch/awesome-design-md 포맷이 이미 존재 |
| 2 | Design Token 시스템 | W3C DTCG + Style Dictionary로 충분 |
| 3 | Component Showcase (Vanilla/Radix/Aria 비교) | Radix가 사실상 표준, 비교 앱은 과잉 |
| 4 | Component Library 확정 | Primitive를 직접 만드는 건 shadcn/ui 재발명 |
| 5 | App Blueprint 시스템 | ✅ 독자적 가치 — 하지만 Phase 5로 밀려있음 |
| 6 | PoC 검증 | ✅ 필요 |
| 7 | Studio v1 | ✅ 필요 |
| 8 | 디자인 도구 연동 | ✅ 필요하지만 협업 Flow가 없음 |

### 새 계획 (7 Phase)

| Phase | 제목 | 내용 | 근거 |
|-------|------|------|------|
| **1** | **Foundation (기반 셋업)** | 기존 Phase 1+2+3 압축. Stitch 포맷 분석→확장 포인트 정의, shadcn/ui+Tailwind 셋업, W3C DTCG+Style Dictionary 파이프라인 | 기존 도구 조합에 집중, 자체 발명 최소화 |
| **2** | **Page Template 시스템** | Primitive→Composite→Page Template 3계층. Auth(Login/Signup), Dashboard 등 페이지 단위 재사용 컴포넌트. variant(page/modal/bottom-sheet), 토큰/i18n 교체 | **핵심 차별점.** shadcn/ui에 없는 것 |
| **3** | **App Blueprint** | 페이지 카탈로그 + 질의서 + REQUIREMENTS.md→컴포넌트 매핑 | **아무도 안 만든 영역** |
| **4** | **협업 Flow 정의** | 디자이너↔프론트 워크플로우 프로토콜, Paper MCP 양방향 동기화 PoC, Figma Variables↔토큰 동기화 PoC | 기존 계획에서 **완전히 누락**되었던 부분 |
| **5** | **PoC 검증** | 전체 파이프라인 실증 (앱 A→B 토큰/i18n 교체 재사용) | 기존 유지 |
| **6** | **Studio v1** | Blueprint + 산출물 생성 웹앱 (dogfooding) | 기존 유지 |
| **7** | **디자인 도구 연동 심화** | Paper/Stitch/Figma 양방향 파이프라인 안정화 | 기존 유지 |

### 핵심 변경 사항

| 변경 | 이유 |
|------|------|
| Phase 1+2+3 → Phase 1로 압축 | Schema, Token, Headless UI 비교를 처음부터 만드는 대신 기존 도구(Stitch 포맷, W3C DTCG, shadcn/ui+Radix)를 채택 |
| Page Template을 Phase 2로 앞당김 | 프로젝트의 핵심 차별점을 최우선으로 |
| App Blueprint을 Phase 3으로 앞당김 | 아무도 안 만든 영역에 빠르게 진입 |
| 협업 Flow를 Phase 4로 신설 | 기존 계획에서 완전히 누락. 디자이너↔프론트 워크플로우가 없으면 "도구만 있고 쓰는 방법이 없는" 상태 |

## 채택하는 외부 도구/표준

| 영역 | 채택 도구 | 이유 |
|------|----------|------|
| DESIGN.md 포맷 | Stitch/awesome-design-md 9섹션 기반 + 자체 확장 | 35K+ stars, 사실상 표준. 확장만 하면 됨 |
| 디자인 토큰 | W3C DTCG 포맷 (`.tokens.json`) | 2025.10 안정판. 10+ 도구 지원 |
| 토큰 변환 | Style Dictionary | Amazon 오픈소스, DTCG 레퍼런스 구현체 |
| Headless UI | Radix UI 기본값 / React Aria 후보 유보 | Radix는 shadcn/ui 생태계 표준이나, React Aria가 AI 코드 생성에 더 투명할 수 있음 (hooks 기반, 암묵적 동작 없음). Phase 2에서 LoginPage 하나로 양쪽 가볍게 비교 후 최종 결정 (→ ADR-002 예정) |
| 컴포넌트 배포 모델 | shadcn/ui registry 모델 참고 | 코드 복사→소유 패턴이 커스터마이즈에 최적 |
| 스타일링 | Tailwind CSS | AI 친화적, 유틸리티 퍼스트 |

## 결과

- **낭비 제거**: 이미 검증된 도구를 재발명하지 않음
- **차별점 집중**: Page Template + Blueprint + 협업 Flow에 리소스 집중
- **실효성 확보**: "아무도 안 만든 것"을 만드므로 프로젝트 존재 이유가 명확
- **협업 가능**: 디자이너↔프론트 워크플로우가 Phase에 명시적으로 포함

## 위험

| 위험 | 완화 |
|------|------|
| shadcn/ui 의존도가 높아져 lock-in | Page Template 계층은 shadcn/ui 위에 얹는 구조이므로 교체 가능 |
| Stitch 포맷이 변경될 수 있음 | 확장 포인트만 자체 정의, 코어는 Stitch 따름 |
| Page Template 재사용 범위 판단 어려움 | Phase 5 PoC에서 실제 앱 2개로 검증 |
| 협업 Flow가 Paper MCP에 의존 | Figma 경로도 병행 탐색 (spec-4-003) |
| Headless UI 선택 미확정 | Phase 2 지연 가능 | LoginPage 하나로 가볍게 비교, 전체 Showcase 앱은 만들지 않음 |
