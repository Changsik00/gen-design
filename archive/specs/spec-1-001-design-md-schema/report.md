# DESIGN.md 레퍼런스 분석 보고서

> 66개 awesome-design-md 브랜드 파일의 구조 분석 결과

## 1. 섹션 출현 빈도

| 섹션 | 출현 수 (/66) | 판별 |
|------|:---:|:---:|
| 1. Visual Theme & Atmosphere | 66 | **필수** |
| 2. Color Palette & Roles | 66 | **필수** |
| 3. Typography Rules | 66 | **필수** |
| 4. Component Stylings | 66 | **필수** |
| 9. Agent Prompt Guide | 66 | **필수** |
| 5. Layout Principles | 64 | **필수** (2개 파일 `Layout`으로 축약) |
| 6. Depth & Elevation | 64 | **필수** (2개 파일 축약 제목) |
| 8. Responsive Behavior | 63 | **필수** (3개 파일 변형 제목) |
| 7. Do's and Don'ts | 61 | **선택** (5개 파일이 다른 주제로 대체) |

**결론**: 섹션 1~6, 8, 9는 사실상 필수. 섹션 7은 "특별 주제 슬롯"으로 기능.

## 2. 구조 이탈 파일 (7개)

| 파일 | 위치 | 표준 제목 | 실제 제목 | 비고 |
|------|:---:|----------|----------|------|
| airtable.md | 5, 6 | Layout Principles / Depth & Elevation | `Layout` / `Depth` | 축약 — 초기/간략 생성 |
| webflow.md | 5, 6, 8 | Layout Principles / Depth & Elevation / Responsive | 축약 + 과도하게 구체적 | 최하위 상세도 |
| cursor.md | 7 | Do's and Don'ts | `Interaction & Motion` | 애니메이션/모션 특화 |
| opencode.ai.md | 7 | Do's and Don'ts | `Interaction & Motion` | cursor와 동일 패턴 |
| mintlify.md | 7 | Do's and Don'ts | `Dark Mode` | 다크 모드 전용 문서화 |
| notion.md | 7, 8 | Do's and Don'ts / Responsive | Responsive / `Accessibility & States` | Do's/Don'ts 완전 제거, 접근성 추가 |
| nvidia.md | 7, 8 | Do's and Don'ts / Responsive | Responsive / `Responsive (Extended)` | 반응형을 두 섹션으로 분리 |

## 3. 상세도 분포

| 등급 | 라인 수 | 파일 수 | 대표 |
|------|---------|:---:|------|
| 간략 | 89~150 | ~10 | airtable (89), webflow (92), miro (108) |
| 표준 | 150~280 | ~40 | airbnb (246), spotify (246) |
| 상세 | 280~370 | ~16 | stripe (322), vercel (310), linear (367) |

## 4. 대표 파일 정독 결과

### stripe.md (322줄) — 가장 정밀

- **고유 패턴**: Shadow Colors를 Color Palette 서브섹션으로 분리 (5개 RGBA 값을 1급 팔레트로 취급)
- **타이포 테이블**: Features 열 존재 (ss01/tnum OpenType 기능) — 유일
- **Agent Prompt Guide**: 8단계 Iteration Guide가 프로덕션 체크리스트로 기능
- **암묵적 페이지 명세**: hero, card, badge, nav, dark-section 5개 패턴을 예시 프롬프트로 커버

### linear.app.md (367줄) — 전체 최대 상세도

- **고유 패턴**: Light Mode Neutrals를 다크 테마 팔레트 내 별도 서브섹션으로 문서화 — 유일
- **Radix UI 명시 참조**: "6 detected primitives" — 컴포넌트 라이브러리 기반을 명시한 유일 파일
- **타이포 테이블**: 24행 (Link 3종 + Mono 3종 포함)
- **암묵적 페이지 명세**: command palette 프롬프트 → 인터랙티브 UI 데모 페이지 암시

### claude.md (312줄) — 편집적 차별화

- **고유 패턴**: "gradient-free" 선언 — 기능의 부재를 명시적 디자인 결정으로 문서화
- **Distinctive Components**: Model Comparison Cards (Opus/Sonnet/Haiku), Organic Illustrations, Dark/Light Alternation — 비즈니스 맥락을 가진 명명된 컴포넌트
- **3폰트 시스템**: Anthropic Serif/Sans/Mono + 엄격한 콘텐츠 유형→폰트 매핑 규칙
- **암묵적 페이지 명세**: Model Comparison → 가격/플랜 페이지, Dark/Light 교대 → 마케팅 페이지 아키텍처

### vercel.md (310줄) — 기술적 정밀, 최고의 암묵적 페이지 명세

- **고유 패턴**: Workflow Accent Colors (Develop=Blue, Preview=Pink, Ship=Red) — 제품 워크플로우 단계별 색상
- **Distinctive Components**: Workflow Pipeline, Trust Bar/Logo Grid, Metric Cards — 페이지 섹션 인벤토리로 기능
- **간격 이상 주석**: "20px, 24px가 없는 16→32 점프" 자체 스케일 이상을 주석으로 문서화
- **암묵적 페이지 명세**: 6개 대표 파일 중 가장 높음. 워크플로우→홈페이지, 메트릭→벤치마크, Trust Bar→소셜 증명

### airbnb.md (246줄) — 소비자 UX 특화

- **고유 패턴**: Premium Tiers (Luxe Purple, Plus Magenta) — 비즈니스 계층별 브랜드 색상
- **반응형**: "61 detected breakpoints" — CSS 소스 분석 깊이 최대
- **암묵적 페이지 명세**: 리스팅 그리드 (5→4→3→2→1 컬럼), 지도 패널 (사이드→오버레이), 카테고리 필 바 → 검색/탐색 페이지 아키텍처

### notion.md (309줄) — 접근성 강화

- **고유 패턴**: `Accessibility & States` 섹션이 Responsive를 대체 — WCAG 대비 비율 정량값 (18:1, 5.5:1) 포함하는 유일 파일
- **상태 시스템**: hover/active/pressed/focus/disabled 상태를 체계적 테이블로 문서화
- **시맨틱 억양 색상**: 6개 명명 억양 (Teal, Green, Orange, Pink, Purple, Brown) — 블록 유형별 색상 시스템
- **암묵적 페이지 명세**: Feature Cards, Trust Bar, Metric Cards → 3가지 마케팅 페이지 섹션

## 5. 교차 파일 핵심 발견

### 발견 1: 섹션 1~4, 9는 철벽
모든 66개 파일이 동일한 H2 제목 텍스트를 사용. 스키마의 비협상 핵심.

### 발견 2: 섹션 7은 "특별 주제 슬롯"
Do's/Don'ts (61), Interaction & Motion (2), Dark Mode (1), Responsive (2). 브랜드 특성에 따라 대체 가능한 유일 위치.

### 발견 3: Distinctive Components가 암묵적 페이지 명세 역할
claude, vercel, notion, linear의 `### Distinctive Components` 서브섹션은 사실상 "이 브랜드의 페이지에 어떤 구성 요소가 있는가"를 기술. **이것이 우리 확장 섹션의 시드.**

### 발견 4: 간략 파일은 AI 활용도 낮음
89~130줄 파일은 Agent Prompt Guide가 빈약해서 실제 코드 생성 시 참고 가치가 낮음. **확장 Schema는 상세 파일(280줄+)을 기준으로 설계해야 함.**

### 발견 5: 토큰 매핑은 모든 파일에서 암묵적
`#533afd` (Stripe Purple), `#5e6ad2` (Linear Indigo) 같은 값이 있지만, CSS 변수명이나 Tailwind 클래스로의 매핑은 어디에도 없음. **확장 섹션 13 (Token Mapping)의 존재 이유.**

## 6. 기존 포맷의 한계점 요약

| 한계 | 설명 | 우리 확장 |
|------|------|----------|
| 페이지 구조 명세 없음 | "어떤 페이지가 있고 어떻게 구성되는가"를 기술할 방법 없음 | §11. Page Specifications |
| 컴포넌트 명명 규약 없음 | 디자인 도구 레이어명↔코드 컴포넌트명 연결 불가 | §10. Naming Convention |
| 복합 컴포넌트 참조 없음 | LoginForm 같은 재사용 단위를 참조하는 문법 없음 | §12. Composite Components |
| 토큰↔코드 매핑 없음 | hex 값은 있지만 CSS 변수/Tailwind 클래스 매핑 없음 | §13. Token Mapping |
| i18n 참조 없음 | 다국어 텍스트를 어떻게 외부화하는지 정의 없음 | §14. i18n References |
| 스키마 검증 불가 | 마크다운이므로 "올바른 DESIGN.md인가"를 검증하는 방법 없음 | (향후 과제) |
