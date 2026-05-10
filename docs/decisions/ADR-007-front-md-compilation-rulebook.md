# ADR-007: FRONT.md = 공식 컴파일 룰북 + SSOT 4 문서 구조

> **상태**: 승인 (Accepted)
> **날짜**: 2026-05-10
> **의사결정자**: Dennis
> **연관 문서**: ADR-004 (어휘 + 4 layer variant), ADR-005 (grammar + IR), ADR-006 (Paper-first workflow), docs/vision.md
> **선행 ADR**: ADR-006 (방향 pivot 의 후속 — SSOT 구조 명확화)

## 컨텍스트

ADR-006 이 디자이너 워크플로의 *방향* (Paper → spec.md → React) 을 정정한 후, 자연스럽게 다음 질문이 떠올랐다:

> *"SSOT 의 방향이 우리가 만든 문서가 맞을까? DESIGN.md, TOKEN.md, Assets, FRONT.md 이런식으로 말야 .. FRONT.md 에는 사용기술을 어떻게 처리해야 하는 맵핑 정보도 들어가야 할 것 같은데 shadcn 관리룰 같은것도 말야.."*

### 현재 상태 (spec-7-01 시점)

- **DESIGN.md**: Stitch 0.1 superset, 9 섹션 + 본 프로젝트 확장 — 페이지 / 화면 명세
- **TOKEN.md**: DTCG 1.0 strict — 토큰 narrative
- **FRONT.md**: 3-tier 어휘 카탈로그 narrative + Paper 매핑 컨벤션 + shadcn registry 메타 (vision.md 의 가벼운 정의)
- **catalog.json / tokens.json / spec-schema.json**: machine-readable 동반 파일
- **spec/<component>.spec.md**: 28 fixture (spec-7-02 에서 추가)

### 문제점

1. **FRONT.md 의 책임 영역이 모호** — vision.md 가 "어휘 카탈로그 + Paper 매핑" 정도로 가볍게 정의했지만, 실무에서는 *모든 기술 변환 룰* (shadcn 관리 / 라이브러리 버전 / 4-layer variant 적용 / spec → React 컴파일 정책) 의 SSOT 가 필요.
2. **spec.md 와 DESIGN.md 의 관계 미정의** — DESIGN.md 의 §11 같은 섹션이 spec/<x>.spec.md 와 어떻게 연결되는지 결정 안 됨.
3. **4 layer variant 룰** (ADR-004) 이 ADR 안에만 있고 *공식 명세* 가 없음. 디자이너 / 컴파일러 / lint 가 같은 룰을 따라야 하는데 참조점이 분산.

## 결정

### D-1: SSOT = 4 문서 + 2 디렉토리

```
프로젝트 root /
├── DESIGN.md          ① 페이지 / 화면 구조 + 인터랙션 명세 (Stitch superset)
├── TOKEN.md           ② 토큰 narrative + tokens.json 결정 근거 (DTCG)
├── FRONT.md           ③ 컴파일 룰북 — 본 ADR 의 D-3
├── README.md / vision.md / docs/decisions/  (메타)
│
├── assets/            ④ 이미지 / 폰트 / 아이콘 (binary)
├── spec/              ⑤ DESIGN.md 의 machine-readable 인스턴스
│   ├── login-page.spec.md
│   ├── ...
│
└── studio/src/lib/vocabulary/catalog/
    ├── catalog.json   (auto-extracted, FRONT.md 의 동반)
    ├── spec-schema.json
    └── tier1-aria.ts
```

위 6 가 *모든* 입력의 SSOT. studio 의 React 코드 / Paper 캔버스 / 빌드 결과물은 *모두* 이 SSOT 에서 파생.

### D-2: spec.md ↔ DESIGN.md 관계 — 별도 파일 + DESIGN.md 가 참조

- DESIGN.md 의 §X 페이지 섹션은 narrative 텍스트 + `→ see spec/<x>.spec.md` 링크
- spec/<x>.spec.md 는 machine-readable 컴포넌트 트리 (spec-7-02 grammar)
- 이유: git diff 단위 명확, 각 페이지의 변경 추적 용이, lint / parser 가 spec/ 만 처리하면 됨
- DESIGN.md 자체는 *narrative + 결정 근거*; spec/ 는 *기계 처리 가능 instance*

### D-3: FRONT.md 의 공식 섹션 (컴파일 룰북)

```markdown
# FRONT.md — Frontend Stack & Compilation Rules

## §1 사용 기술 스택
   - React (버전), TypeScript (버전)
   - shadcn/ui (버전 + 사용 컴포넌트 목록)
   - base-ui/react, Tailwind CSS, class-variance-authority, clsx, tailwind-merge
   - 결정 근거 + ADR 참조 (예: ADR-003 headless UI selection)

## §2 어휘 카탈로그 (3-tier)
   - Tier 1: ARIA 1.3 roles (참조: tier1-aria.ts)
   - Tier 2: shadcn primitives (참조: catalog.json — auto-extracted)
   - Tier 3: 본 프로젝트 composites + templates
   - Narrative + 추가/제거 룰 + ADR-004 참조

## §3 4 Layer Variant System (ADR-004 D-3)
   - L1 named variant: cva variants 의 첫 axis (보통 `variant`)
   - L2 multi-axis sub-variant: cva 의 2+ axis (size / tone / 등)
   - L3 theme context: brand-a / brand-b CSS data-theme
   - L4 inline tokens: spec.md 의 tokens={...} → CSS var 직접 override
   - 각 layer 의 *언제 사용 / 충돌 해결 정책*

## §4 shadcn 관리 룰
   - registry-item.json 형식 (shadcn add 가능)
   - 새 shadcn primitive 추가 시 절차 (catalog.json 자동 갱신)
   - shadcn 업그레이드 시 회귀 테스트
   - theme override 처리 (semantic tokens.json 와 매핑)

## §5 Paper Layer ↔ Component 매핑 (다음 spec 의 핵심)
   - 레이어 이름 = 컴포넌트 이름 (PascalCase)
   - variant 표현: `Button:primary` 또는 `Button[variant="primary"]` 컨벤션
   - 이미지 영역 → Image 컴포넌트
   - children 트리 → spec.md 의 children
   - 실제 매핑 grammar 는 ADR-008 (예정)

## §6 spec.md → React 컴파일 정책
   - import 경로 (`@/components/ui/button` 등)
   - cn() 사용 룰
   - i18n placeholder → t() 호출 또는 정적 치환
   - registry-item.json 형식 emit

## §7 spec.md → Paper 컴파일 정책 (역방향, ADR-006 reframe)
   - paper-sync 토큰 해소
   - paper-e2e pageWrapper
   - Tailwind 처리 (현재: play CDN, phase-8: PostCSS)

## §8 lint 정책 (어휘 + 토큰 + 형식)
   - catalog.json 미등록 컴포넌트 거부
   - axis enum 위반 거부
   - raw 색상 거부 (token 참조만)
```

### D-4: TOKEN.md vs tokens.json 관계

- **tokens.json** (machine): DTCG strict, build pipeline 의 입력
- **TOKEN.md** (narrative): 토큰 *결정 근거* + 디자인 의도 + 사용 가이드 + tokens.json 의 변경 이력 narrative
- 둘은 항상 함께; tokens.json 변경 시 TOKEN.md 갱신.

### D-5: 마이그레이션 (현 상태 → 새 구조)

| 항목 | 현재 | 새 위치 |
|---|---|---|
| Tier 2 / Tier 3 어휘 narrative | spec-7-01 의 FRONT.md 초안 | FRONT.md §2 |
| ADR-004 의 4 layer 결정 | ADR 안에만 | FRONT.md §3 (ADR 참조 + 운영 룰) |
| shadcn 관리 룰 | 미정 | FRONT.md §4 (신규) |
| Paper layer 매핑 룰 | 미정 (다음 spec) | FRONT.md §5 + ADR-008 (예정) |
| 컴파일 정책 (spec → React) | spec-md-compiler/react 에 흩어짐 | FRONT.md §6 (코드 + 룰북 동기) |
| 컴파일 정책 (spec → Paper) | spec-md-compiler/paper | FRONT.md §7 |

→ 본 마이그레이션 자체는 *별도 spec* 으로 진행 (FRONT.md 작성 spec). spec-7-04-paper-inference 가 §5 를 채우는 일부.

## 결과

### 즉시 영향

- spec-7-04 (다음 — Paper → spec.md inference) 의 *입력 그라운드* 가 명확해짐: FRONT.md §5 (Paper layer 매핑) 가 spec 의 결정 근거.
- 향후 *모든* 컴파일 / 변환 결정은 FRONT.md 에서 출발 → ADR / 코드로 분기.

### 장기 영향

- FRONT.md 가 *살아있는 룰북* — 새 라이브러리 / 새 변환 룰 / 새 layer 추가 시 갱신 필수.
- spec-md-compiler 의 *코드 결정* 들 (예: `default-props.ts` 의 mock data 정책) 도 FRONT.md 의 §6 / §7 에 narrative 로 기록.
- 디자이너가 *"이 컴포넌트의 variant 는 어떻게 표현하나요?"* 같은 질문에 FRONT.md 가 답함.

### Out of scope (본 ADR)

- FRONT.md 자체의 작성 (별도 spec — phase-7 후반 또는 phase-8 초)
- Paper layer 매핑 grammar 의 구체 룰 (ADR-008 예정 + spec-7-04-paper-inference 안에서 구현)

## 회고

- ADR-006 가 *방향* 정정 후 자연스럽게 SSOT 구조 질문이 부상 — *layered abstraction* 이 역시 가치 있다.
- vision.md 의 "DESIGN.md / TOKEN.md / FRONT.md" 3 문서 모델은 옳았으나 *각 문서의 책임* 이 모호했음. 본 ADR 가 명확화.
- 향후 시스템의 *어떤 결정이든* "FRONT.md 의 어느 §X 에 들어가나?" 가 첫 질문.
