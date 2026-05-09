# 프로젝트 비전

> **작성일**: 2026-05-10
> **목적**: 본 프로젝트가 *무엇을 만드는가*, *누구를 위한가*, *왜 이 방식인가* 를 명문화한다. 향후 모든 spec 의 북극성. 방향이 흔들릴 때마다 본 문서로 회귀.
> **상태**: Living document — 큰 결정 변경 시 갱신 + 변경 이력 명시.

## 🎯 한 문장 정의

**디자이너가 spec markdown 으로 의도를 적으면, Paper 에서 시각화되고 React (shadcn + Tailwind) 코드로 결정적으로 컴파일되는 — designer-publisher 페어 도구.**

## 👤 타깃 페르소나

**디자이너-publisher**: 프론트엔드 개발자까지는 아니지만 *퍼블리셔 수준* (구조화된 마크업 + 토큰 기반 스타일링) 까지는 책임지고 싶은 디자이너.

페르소나 특징:
- Figma 또는 유사 도구를 일상으로 사용 — 단 Paper 와 본 프로젝트 도구를 *병용* 가능
- 마크다운 작성에 거부감 없음 (PR 설명, 노션 등을 markdown 으로 적은 경험)
- shadcn/ui / Tailwind / cn 같은 *어휘* 를 들어본 적은 있으나 직접 React 를 짜진 못함
- AI (Claude, ChatGPT) 와 페어로 작업하는 데 익숙
- *production frontend* 까지는 욕심이 없음 — *publisher 수준의 정합성과 일관성* 이 목표
- 디자인 시스템(token / component 카탈로그) 의 가치를 이해

**비-페르소나** (이 도구의 타깃이 아닌):
- 풀-LLM 으로 production frontend 까지 한 번에 뽑고 싶은 사람 (→ Lovable, v0, Bolt 가 적합)
- Figma 를 떠나고 싶은 사람 — 본 도구는 Figma *대체* 가 아님
- 백엔드/풀스택 개발이 목표인 사람

## 🌟 4 중 어휘 정합 (핵심 차별화)

본 프로젝트의 가장 강력한 *real & defensible* 차별화 portion:

```
[디자이너 작성 어휘]   spec.md 의 <Component variant="x"> 태그
       =
[Paper 시각 어휘]      Paper 노드 이름 + 컴포넌트 인스턴스
       =
[React 출력 어휘]      shadcn/ui 컴포넌트 + 프로젝트 composites
       =
[LLM 학습 어휘]        shadcn 이름은 LLM 훈련 데이터에 풍부
```

**이 4 축이 *같은 어휘로 통일*될 때**:
- 디자이너 의도 ⇒ 시각 결과 ⇒ 코드 출력의 *결정적* 변환 가능
- LLM hallucination 표면적 *최소* (어휘가 고정되어 있으므로)
- Paper ↔ React 1:1 정합이 *수학적으로* 가능

시장 어디에도 4 축이 같은 어휘로 통일된 도구는 없다.
- v0: 4 축만 (출력)
- Code Connect: 3, 4 축만 (Figma 인스턴스 ↔ 코드)
- Markdoc: 1 축만 (작성) + docs 용
- 본 프로젝트: 1 ⟷ 2 ⟷ 3 ⟷ 4 통일 시도

## 📐 작동 방식 — 사용자 흐름

### 0. 디자이너의 시작점

디자이너는 Claude Code (또는 Cursor 등 IDE) 안에서 Paper MCP + 본 프로젝트 도구를 사용한다. *Studio* 는 본 프로젝트가 제공하는 웹앱으로, spec.md 편집 + Paper preview + React preview + export 를 통합한다.

### 1. 디자이너가 spec.md 작성

```markdown
# Login Page

## Layout
<Page>
  <Section variant="brand-panel" background="brand-dark">
    <BrandHeader appName="TaskFlow" tagline={{i18n.ko.tagline}} />
  </Section>

  <Section variant="form-panel">
    <LoginForm
      emailLabel={{i18n.ko.email-label}}
      emailPlaceholder={{i18n.ko.email-placeholder}}
      passwordLabel={{i18n.ko.password-label}}
      submitLabel={{i18n.ko.login-submit}}
    />
    <Divider label={{i18n.ko.or-continue-with}} />
    <SocialAuthBlock providers={["google", "github"]} />
  </Section>
</Page>

## Tokens
- spacing.section: 32
- radius.card: 16

## Behavior
- onSubmit: validate email format, then redirect to /dashboard
- "forgot password" link → /forgot-password

## Variants
- bottom-sheet: 동일 콘텐츠를 modal layout 으로
```

**spec.md 의 본질**:
- *자연어 명세 + 컴포넌트 태그 + i18n placeholder + 토큰 참조* 의 혼합
- 디자이너가 *직접 손으로* 또는 *Claude 와 대화하며* 작성
- 컴포넌트 어휘는 *고정 카탈로그* (FRONT.md 가 정의)

### 2. Claude (또는 본 프로젝트 컴파일러) 가 Paper 에 그림

spec.md → spec AST → Paper write_html 페이로드 (paper-sync resolver 가 토큰 해소). 디자이너는 Paper 에서 *바로 시각 결과* 확인.

### 3. 디자이너가 Paper 에서 review + iterate

- 메인 루프: spec.md 직접 수정 → 다시 Paper 그림
- 보조 루프: Paper 에서 직접 조정한 변경분만 spec.md 로 *역추출* (옵션 B inference, *극히 일부 보조*)

### 4. spec.md → React 컴파일

같은 spec.md → React (shadcn + Tailwind + cn). i18n placeholder → t() 호출. ## Behavior → state hook + handler stub.

### 5. Export — 프로젝트 ZIP

```
project-export.zip
├── DESIGN.md          (Stitch DESIGN.md 0.1 superset — 9 sections + 본 프로젝트 확장)
├── TOKEN.md           (DTCG 1.0 strict 호환)
├── FRONT.md           (shadcn registry + 컴포넌트 어휘 카탈로그 + Paper 매핑 컨벤션)
├── spec/              (각 페이지의 spec.md 들)
│   ├── login.spec.md
│   └── dashboard.spec.md
├── assets/
│   ├── i18n/
│   │   ├── ko.json
│   │   └── en.json
│   └── images/
└── src/               (생성된 React 코드, shadcn registry 형식 호환)
```

## 🤝 4 축 어휘 — 3-tier 구조

본 프로젝트가 채택하는 컴포넌트 어휘는 3 계층:

```
[Tier 1 — 최저층] ARIA 1.3 roles
  button, dialog, listbox, navigation, ...
  → 접근성 자동 정합. 기본 의미.

[Tier 2 — 중간층] shadcn/ui 컴포넌트
  Button, Card, Input, Select, Slider, Switch, Dialog, ...
  → LLM 훈련 데이터 풍부. de facto 어휘. 그대로 사용.

[Tier 3 — 상위층] 프로젝트 composites + templates
  LoginForm, ActivityTable, BrandHeader, LoginPage, DashboardPage, ...
  → 본 프로젝트가 추가하는 도메인 어휘. shadcn 의 조립.
```

**각 tier 의 책임**:
- Tier 1: a11y 자동 보장 (ARIA role 매핑)
- Tier 2: 시각 + 행동의 표준 (shadcn 정합)
- Tier 3: 도메인 의미 + 페이지 macros (프로젝트 차별화)

## 🛡️ 표준 호환 결정 (4 축 결정)

벤치마킹 결과 시장에 *이미 정착된 표준* 들이 있어 본 프로젝트는 이를 **즉시 채택** 한다 (NIH 회피).

### D1. DESIGN.md 명칭 + 형식 = Stitch superset

- 사용자 결정 (2026-05-10): **명칭 유지** (인지도 가치 ↑)
- 본 프로젝트 DESIGN.md = Stitch DESIGN.md 0.1 의 *superset*
  - Stitch 9 섹션 (Overview / Colors / Typography / Layout / Elevation / Shapes / Components / Do's-Don'ts / Iconography) 모두 보존
  - 본 프로젝트 확장: i18n schema, 컴포넌트 인스턴스 어휘, Paper 매핑 컨벤션, FRONT.md 참조
- Stitch DESIGN.md export 는 자동 생성 가능 (subset)
- 명칭 충돌 방지: README/문서에서 *항상* "DESIGN.md (Stitch superset)" 명시

### D2. TOKEN.md = DTCG 1.0 strict 호환

- W3C Design Tokens Community Group spec 1.0 stable (2025-10-28) 형식 그대로
- `$value` / `$type` / `$description` 키
- Style Dictionary v4+ / Tokens Studio / Stitch DESIGN.md export 모두와 *공짜* 호환
- 본 프로젝트 tokens.json (phase-6 자산) 은 거의 호환 — 정렬 작업만 필요

### D3. React 출력 = shadcn registry 형식

- `npx shadcn@latest add` 한 줄로 외부 codebase 에 install 가능한 형식
- registry.json 표준 + namespaced (`@designmd/...`) 제공
- v0 / Cursor / Claude Code / 21st.dev 모두에 흘려보내는 *native 채널*

### D4. Paper 의 시장 포지셔닝 — *AI-pair 디자인 노트북*

- Paper 는 Figma *대체* 가 아니다 — 디자이너 점유율 0 시장의 함정 회피
- 포지션: "디자이너가 spec.md 와 함께 *AI 페어 작업* 하는 시각 노트북"
- 디자이너는 *Figma 를 떠나지 않는다* — 본 프로젝트는 *Figma 와 병용* 가능
- 우선 개발: **Figma → spec.md 어댑터** (디자이너 진입 비용 ↓)
- Paper 의 가치 = *spec.md 시각화 + 즉시 반복 가능*. 디자인 도구 경쟁 ❌, *컴파일러 preview* ✅

### D5. 컴포넌트 어휘 sweet spot

- ARIA 1.3 + shadcn + 프로젝트 composites 의 *3-tier 카탈로그*
- 디자이너 자유도 = "어떤 컴포넌트로 그릴지" 결정의 자유
- 정확도 = 어휘가 *고정* 되어 있으므로 LLM 환각 ↓
- 신규 컴포넌트 추가는 *카탈로그 등록 절차* (가벼움)

### D6. 마케팅 ceiling — 명시적 구분

본 프로젝트는 *publisher-ready* 까지만 약속:
- ✅ 페이지 레이아웃 / 토큰 / 컴포넌트 조립 / i18n / 기본 인터랙션
- ❌ production-ready frontend (state management 깊이, 복잡 인증, real-time 등)

이 ceiling 을 마케팅/문서/대화 *모든 contact point 에서 일관 유지*. Lovable/v0/Bolt 의 *production 약속 → backlash* 함정 회피.

## 🚫 시장 함정 회피 약속

벤치마킹에서 식별된 11 가지 함정 중 본 프로젝트가 *명시적으로 회피* 약속:

| # | 함정 | 본 프로젝트 회피 약속 |
|---|---|---|
| 1 | "AI 매직 production" 거짓말 | D6 (publisher ceiling) — 약속 자체를 안 한다 |
| 2 | Iteration breakage | spec.md 를 SoT 로 → *결정적* 변환 검증 (test) |
| 3 | 15~20 컴포넌트 context 붕괴 | spec 분할 + 참조 그래프 (Spec Kit 패턴 차용) |
| 4 | 반응형/breakpoint 무시 | spec.md 에 *명시적* breakpoint 어휘 1급 시민 |
| 5 | Vendor lock-in | 모든 산출물 markdown export. AGPL+비상속 라이선스 검토 |
| 6 | 수동 매핑 비용 | *컴포넌트 이름 = 매핑* 사상 — 별도 매핑 파일 없음 |
| 7 | 자유도 vs 정합성 trade-off | 3-tier 어휘 + 카탈로그 등록 (가벼움) |
| 8 | 다중 framework 너비 추구 | React + shadcn 단일 깊이 |
| 9 | NIH | DTCG / shadcn registry / Stitch DESIGN.md superset 채택 |
| 10 | 보안/접근성 부채 | 컴포넌트 어휘 + ARIA role 매핑으로 *기본 a11y* 자동 |
| 11 | 디자이너 점유율 0 | Figma 병용 (어댑터) — 점유율 의존 ❌ |

## ⏰ Timing 전제

벤치마킹 진단:
- 현재 (2026-05): window 열려 있으나 좁아지는 중
- 2026-11: Stitch DESIGN.md 1.0 + Figma Canvas Skills 채택 윤곽
- 2027-11: 시장 정착, winner 1~3 결정

본 프로젝트 timing 전제:
- 2026 하반기 안에 spec.md grammar + Paper compiler + React compiler MVP 도달
- 2027 상반기 안에 Stitch DESIGN.md 호환 + Figma 어댑터 + Studio 재구성
- 2027 후반: niche 또는 winner 진입 결정

## 🔄 phase-6 자산 재해석

phase-6 까지의 작업은 *대부분 살아남는다* (정직한 평가):

| phase-6 자산 | phase-7 이후 새 역할 |
|---|---|
| `studio/src/components/ui/` (shadcn-style) | **Tier 2 어휘 (그대로 사용)** |
| `studio/src/components/composites/` (20 개) | **Tier 3 어휘 (도메인 카탈로그)** |
| `studio/src/components/templates/` (6 개) | **페이지 매크로 어휘** |
| `studio/src/lib/paper-normalizer/` | **컴파일러 값 정규화 단계 (production)** |
| `studio/src/lib/paper-sync/` | **컴파일러 토큰 해소 단계 (production)** |
| `studio/src/lib/paper-e2e/` (spec-6-10) | **render-helpers 의 첫 instance — 컴파일러로 진화** |
| `templates/assets/tokens/tokens.json` | **TOKEN.md (DTCG 정렬 후)** |
| `studio/src/features/blueprint` (Studio v1) | **재구성 — spec.md 편집기 안의 한 모드** |
| `studio/src/features/editor` | **재구성 — DESIGN.md / FRONT.md / TOKEN.md 편집기** |
| `studio/src/features/tokens` | **재구성 — DTCG 호환 TOKEN.md 편집기** |
| `studio/src/features/export` | **재구성 — shadcn registry 출력 + Stitch DESIGN.md superset export** |

**폐기 대상**: 거의 없음. *Studio UI 라우팅 구조* (4 feature 가 sidebar 의 메인 메뉴) 만 *재배치* 필요. *코드 자산 자체는 모두 유지*.

따라서 사용자가 "지금까지 한 걸 완전 폐기 하고 새로 해도 상관없어" 라고 했지만 — **폐기는 권장하지 않는다**. *재해석 + UI 재구성* 이 합리적.

## 🎬 phase-7 이후의 큰 그림

```
[phase-6] Studio v1 — 도구 부품 (composites, templates, paper lib, tokens)
   ↓ (재해석)
[phase-7] 4 축 어휘 정합 + 컴파일러 — DESIGN.md / TOKEN.md / FRONT.md + spec.md grammar + Paper/React compiler
   ↓
[phase-8] Studio v2 — spec.md 편집기 + dual preview + export
   ↓
[phase-9] 외부 도구 통합 — Figma 어댑터 / shadcn registry / 21st.dev
   ↓
[phase-10] 검증 자동화 — Playwright + Paper screenshot + visual regression + a11y 자동 검증
   ↓
[v1.0] Open beta — 디자이너 페르소나 채택 단계
```

phase-7 의 5~8 spec 이 핵심. phase-8 부터는 phase-7 결과 위에서 결정.

## 📜 변경 이력

| 일자 | 변경 | 사유 |
|---|---|---|
| 2026-05-10 | 초안 작성 | phase-6 phase-review + 사용자 user story 명료화 + 벤치마킹 결과 반영 |

## 🔗 관련 문서

- 벤치마킹 상세: `docs/benchmark.md`
- phase-7 spec 구조: `backlog/phase-7.md`
- 거버넌스: `.harness-kit/agent/constitution.md` / `agent.md`
- 사용자 메모리: `~/.claude/projects/-Users-dennis-Project-Design/memory/`
