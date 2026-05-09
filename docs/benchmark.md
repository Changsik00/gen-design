# 디자인-코드 통합 도구 벤치마킹

> **작성일**: 2026-05-09 / **갱신**: 2026-05-10
> **목적**: 본 프로젝트(designer-driven markdown SoT → Paper + React)와 직접 비교 가능한 외부 도구/접근의 시장 지형 정리. 향후 모든 spec 의 외부 참조 ground.
> **방법**: 독립 Opus 서브에이전트(WebSearch + WebFetch)가 60~90 분 분량으로 1차 조사. 본 문서는 그 결과를 정리한 것.

## 📋 Executive Summary

본 프로젝트가 시도하는 *디자이너-driven markdown SoT 기반 디자인-코드 통합* 은 **이미 늦지 않았지만 빠르게 좁아지는 window**. 시장은 세 갈래로 정리됨:

1. **블랙박스 vibe coding** — v0, Lovable, Bolt, Figma Make. 빠르나 production cliff + vendor lock-in.
2. **Figma 종속 design-to-code** — Figma Code Connect, Visual Copilot, Locofy, Anima. Figma 점유율 활용하나 binary SoT 함정.
3. **Markdown SoT 신생 진영** — Google Stitch DESIGN.md (2026-03 Apache 2.0 오픈), GitHub Spec Kit, Markdoc, MDX. 빠르게 부상하나 component 어휘 빈약.

**가장 위협적 시그널 3 가지**:
- **Google Labs DESIGN.md (2026-03 오픈)** — 같은 파일명, 같은 사상. Stitch 도구 + 권위 있는 distribution.
- **Figma 2026 Canvas Skills** — Figma 캔버스가 AI agents 에 markdown skills 로 개방. 디자이너 점유율 90%+ 위에서.
- **Anthropic Frontend Design plugin (2025-11)** — Claude Code 직접 통합. 본 프로젝트가 의존하는 LLM 회사가 영역 흡수 중.

**그래도 살아남는 차별화 4 가지** — 시장 누구도 안 하는 것:
1. 4중 어휘 정합 (spec.md = Paper = React = LLM 어휘)
2. 디자이너가 spec markdown 을 *직접 작성*
3. i18n placeholder 가 spec.md 1급 시민
4. 고정 어휘 → LLM hallucination 표면적 최소화

## 🗺 시장 지형도

| | **Text/Prompt 인풋** | **Figma 인풋** | **Markdown SoT** | **자체 캔버스** |
|---|---|---|---|---|
| **React only 출력** | v0, Lovable | Code Connect, Anima | Stitch DESIGN.md, Spec Kit | 본 프로젝트, Subframe |
| **다중 framework** | Bolt | Visual Copilot, Locofy, TeleportHQ | (드물다) | Plasmic, Webstudio, Framer |
| **디자인+코드 양방향** | Stitch, Figma Make | Builder.io | — | Plasmic, Penpot+MCP |

**축 1 (인풋)**: 디자이너가 *무엇으로* 의도를 표현하는가. text prompt(블랙박스) / Figma file(시각 SoT) / Markdown(텍스트 SoT) / 자체 캔버스.
**축 2 (출력)**: React 만 / 다중 framework / 디자인+코드 양방향.

본 프로젝트는 **"Markdown SoT × 자체 캔버스 × React only(shadcn) × 양방향 정합"** 사분면. 이 셀에 직접 경쟁자가 거의 없으나 **Stitch + DESIGN.md + Stitch canvas**가 빠르게 같은 셀로 진입 중.

## 🔬 도구별 심층 분석

### Google Stitch + DESIGN.md (가장 위협적 경쟁자)

- **무엇을 하는가**: 자연어/이미지 → high-fidelity UI 디자인 + frontend 코드. 2026-03 Stitch 2.0 + **DESIGN.md 를 Apache 2.0 오픈 스펙으로 공개**.
- **인풋**: 자연어 prompt, AI-native canvas, design agent.
- **중간 산출물**: **DESIGN.md** — 9 섹션(Overview, Colors, Typography, Layout, Elevation, Shapes, Components, Do's/Don'ts, Iconography) + YAML frontmatter (machine-readable tokens) + markdown 본문 (rationale).
- **출력**: HTML/React + design tokens. CLI: `lint`, `diff`, `export` (Tailwind v3/v4, DTCG).
- **최근**: 2025-05 출시 → 2026-03 Stitch 2.0 + DESIGN.md 오픈소스화. designmd.app, getdesign.md 커뮤니티. GitHub star 12.3k.
- **오픈성**: DESIGN.md spec **Apache 2.0** 완전 오픈. Stitch 도구 자체는 닫힘 (Google Labs 무료 베타).
- **본 프로젝트와의 유사점**: ***본 프로젝트의 핵심 가설(=DESIGN.md SoT)을 Google이 그대로 구현***. 같은 파일명, 같은 YAML+markdown, 같은 token+component 어휘, Tailwind/DTCG export.
- **본 프로젝트와의 차이점**:
  1. Stitch DESIGN.md 의 *컴포넌트 정의*는 token 수준 (backgroundColor, padding) — *컴포넌트 인스턴스* 나 *spec.md 에서의 placeholder 사용* 미정의
  2. Stitch 는 *자체 도구로 DESIGN.md 자동 생성* + *디자이너 직접 작성* 흐름 없음
  3. Stitch 에는 i18n 표준 없음
  4. Stitch 캔버스 ↔ 코드 정합은 있으나 *third-party 디자인 도구* 와의 정합 없음
- **함정 / 한계**: Stitch 자체 베타, 디자이너 채택 미미. "Galileo AI" rebrand 로 신뢰 약함.
- **본 프로젝트가 배울 점**:
  1. **즉시 DESIGN.md 0.1.0 alpha 와 호환성 평가** — 같은 이름의 다른 형식이면 충돌. 본 프로젝트가 *Stitch DESIGN.md superset* 으로 자리매김할 수 있는지 결정
  2. Stitch DESIGN.md 9 섹션이 *권위 있는 업계 표준* 으로 굳어질 가능성 60%+ — 무시하면 NIH 비판
  3. spec 만으로 가치 없음 — *spec + canvas + agent + export* 묶음이 가치

### Figma Code Connect + Dev Mode MCP (가장 큰 시장 위협)

- **무엇을 하는가**: Figma 디자인 컴포넌트 ↔ 사용자 codebase 컴포넌트 1:1 매핑. 매핑 후 Dev Mode 와 Figma MCP server 가 LLM 에 *코드 컨텍스트* 까지 전달.
- **인풋**: Figma .fig + Code Connect 정의 파일 (`*.figma.tsx`).
- **출력**: get_design_context tool 이 React+Tailwind 표현 반환.
- **최근**: 2025 Figma MCP server 베타 → 2025 후반 Remote MCP. Cursor/VS Code/Claude Code/Copilot/Windsurf 모두 지원. **2026 Canvas open to AI agents**.
- **오픈성**: Code Connect CLI/SDK 오픈. MCP 프로토콜 오픈. **Figma file 자체는 closed binary, cloud-only** — vendor lock-in 본체.
- **본 프로젝트와의 차이점**:
  1. **SoT 가 .fig binary** vs 본 프로젝트는 markdown
  2. Figma 는 *기존 디자이너 90%+* distribution
  3. 매핑이 *별도 파일* vs 본 프로젝트는 *컴포넌트 이름 자체가 어휘*
- **함정 / 한계**: 수동 매핑 비용 폭증, .fig diff 불가, MCP 정확도 들쭉날쭉.
- **본 프로젝트가 배울 점**:
  1. *컴포넌트 이름 = 매핑* 사상이 *맞다면* 강력 차별화
  2. **Figma MCP 가 사실상 codegen 표준** — 본 프로젝트 Paper MCP 가 Figma MCP 형상 닮을수록 LLM 친화도 ↑

### v0 by Vercel

- **무엇을 하는가**: Text + image → React/Next + shadcn + Tailwind, sandboxed Next.js runtime. shadcn 생태계의 *de facto* AI 진입점.
- **출력**: shadcn registry 호환. `npx shadcn@latest add "https://v0.dev/chat/b/..."` 한 줄로 install.
- **최근**: 2025-05 metered pricing 전환 → backlash. shadcn registry index 통합 강화.
- **오픈성**: 출력 *완전 오픈*. 입력 chat 세션 닫힘.
- **본 프로젝트와의 차이점**: chat-only — 디자이너가 spec 못 씀. component 어휘가 *생성된 코드*에서만 존재. i18n/multi-page 약함.
- **함정**: HN/Reddit "예쁘지만 코드 동작 안 함", migration 실패, credit burn.
- **본 프로젝트가 배울 점**:
  1. **shadcn registry 형식 그대로 채택** — `npx shadcn add` 로 외부 codebase 에 install 가능
  2. **Open in v0 버튼** 류로 디자이너 → AI 편집 entry

### Lovable.dev / Bolt.new

- **Lovable**: 자연어 → full-stack (React + Supabase). 2025-04 *VibeScamming* 보안 취약 (Score 1.8/10). credit-based pricing 비판.
- **Bolt v2 (2025-10)**: WebContainer in-browser. autonomous debugging error loop 98% 감소 주장. Cloud (DB/auth/storage).
- **공통 함정**: 15~20 컴포넌트 이상 context 붕괴. *프롬프트만으로 production* 거짓말. token cost $1,000+ 사례.
- **본 프로젝트가 배울 점**:
  1. **markdown SoT 의 *압축* 전략 필요** (섹션 분리, 참조 그래프) — 같은 함정 회피
  2. *production-ready* 약속 금지 — *publisher-ready ceiling* 명시
  3. 보안 가드레일 별도 phase 필요

### Cursor / Claude Code + shadcn workflow

- **무엇을 하는가**: IDE 기반 LLM agent + shadcn MCP server (2025-10 official CLI 3.0). `add a login form` 자연어로 registry 검색/install.
- **최근**: Anthropic 2025-11-12 *Frontend Design* plugin 공식 출시 — "deliberate aesthetic choices before writing code".
- **본 프로젝트와의 유사점**: 가장 가깝다. Claude Code + Paper MCP + shadcn 조합이 본 프로젝트 골격.
- **본 프로젝트와의 차이점**: 개발자 페르소나 vs 디자이너 페르소나.
- **본 프로젝트가 배울 점**:
  1. **`.cursor/rules/registry.mdc` 형식**을 본 프로젝트의 spec.md ↔ React 컴파일러 룰에 차용
  2. **shadcn MCP + Paper MCP 복합 구성** 가이드 필요
  3. Anthropic Frontend Design plugin = **이 영역 직접 흡수 중인 시그널** (위협)

### Builder.io Visual Copilot + Mitosis IR

- **무엇을 하는가**: Figma → 다중 framework (React, Vue, Angular, Svelte, Qwik). 200만+ 데이터 학습 모델 + Mitosis 컴파일러 + fine-tuned LLM 3-stage pipeline.
- **중간 산출물**: **Mitosis IR**(JSX-like AST) — *진짜 IR 가진 거의 유일한 도구*.
- **오픈성**: Mitosis 오픈소스 (BuilderIO/builder).
- **본 프로젝트가 배울 점**:
  1. **Mitosis IR**을 본 프로젝트 markdown → React 컴파일 중간 단계 *intermediate AST*로 차용 가능
  2. *AI 가 매핑*은 매혹적이나 통제 상실 — 본 프로젝트는 *명시적 어휘*가 통제
  3. 다중 framework 욕심 ❌ — 깊이 우선

### Anima / Locofy / TeleportHQ

- **Anima**: Figma → React. "모바일 반응형 망함" 사용자 비판. zero-prompt magic 거짓말.
- **Locofy**: Figma + AI + *Locofy plugin tagging* (interactive vs static). pixel-perfect 주장. 20~40% 수동 보정.
- **TeleportHQ**: Visual builder + 자체 **UIDL** (Universal Internal DSL, JSON IR). teleport-code-generators 오픈소스.
- **본 프로젝트가 배울 점**:
  1. *반응형/breakpoint*가 design-to-code 의 약점 — 본 프로젝트 spec.md 에 *명시적 breakpoint 어휘* 필요
  2. **Locofy tagging 어휘** 카탈로그를 본 프로젝트 어휘 풍부도 평가 ground 로
  3. **UIDL JSON IR** 사례 — markdown SoT + JSON IR 중간 단계 활용 가능

### Plasmic / Webstudio / Framer / Penpot / Subframe

- **Plasmic**: Visual builder + 사용자 codebase 양방향. 일부 OSS. 디자이너 학습 곡선 높음.
- **Webstudio**: 오픈소스 Webflow 대안. AGPL-3.0 + 출력물 비상속. Remix/React. CLI `wstd sync`.
- **Framer**: 디자인 도구 + Code Components (React 18 in-canvas). SaaS.
- **Penpot**: 오픈소스 Figma 대안. 2025-12 공식 MCP server. AGPL.
- **Subframe**: code-first 디자인 도구 — drag-drop + React+Tailwind 코드. shadcn 친화.
- **본 프로젝트가 배울 점**:
  1. *진짜 양방향*은 매우 어려움 — 본 프로젝트가 *markdown 단방향 SoT*는 정확한 판단
  2. **AGPL + 출력물 비상속** 라이선스 모델 (Webstudio) — enterprise distribution 효과적
  3. **Penpot MCP read+write 도구 형상** = Paper MCP reference
  4. *code-first 디자인 도구* (Subframe) 포지션이 작동 — 본 프로젝트 timing window 검증

### Style Dictionary + W3C DTCG

- **무엇을 하는가**: Amazon token build pipeline → DTCG 표준. **DTCG 1.0 stable 2025-10-28 릴리스**.
- **인풋**: tokens.json (Style Dictionary) 또는 DTCG (`$value`/`$type`/`$description`).
- **출력**: CSS/SCSS/JS/iOS/Android.
- **본 프로젝트가 배울 점**:
  1. ***본 프로젝트의 TOKEN.md = DTCG 1.0 stable 호환 필수*** — Stitch 도 DTCG export. 표준이다.
  2. `$value` / `$type` / `$description` 형식 채택 = *공짜* 호환성

### Markdoc (Stripe) — spec.md 문법의 가장 가까운 선례

- **무엇을 하는가**: Markdown + 구문 확장 — `{% callout %}` 같은 typed component tags + schema 검증. peg.js grammar 기반.
- **출력**: 검증된 token tree → 사용자가 React 등으로 렌더.
- **본 프로젝트와의 유사점**: ***본 프로젝트의 spec.md `<Login>{{i18n.ko.xxx}}</Login>` 문법의 가장 가까운 선례***.
- **본 프로젝트와의 차이점**: Markdoc 은 *문서용* — runtime React 렌더. 본 프로젝트는 *디자인+빌드 타임 컴파일*.
- **본 프로젝트가 배울 점**:
  1. **Markdoc tag syntax (`{% Component prop="value" %}`) PEG grammar** 채택 검토 — LLM 친화
  2. **Schema 검증** — 본 프로젝트도 컴포넌트 어휘 schema → spec.md lint 가능
  3. *content와 code 분리*는 Markdoc 핵심 가치 — i18n placeholder 와 정합

### GitHub Spec Kit / OpenSpec — SDD 메인스트림

- **무엇을 하는가**: 2025 등장. Specify CLI 가 .specify/ 폴더에 spec/plan/tasks markdown 생성. *AI agent 가 markdown spec 컴파일해 코드 생성*.
- **본 프로젝트와의 유사점**: ***본 프로젝트의 SDD/harness-kit 방식과 거의 동일***.
- **본 프로젝트와의 차이점**: Spec Kit 은 *general programming* — UI/디자인 어휘 없음.
- **본 프로젝트가 배울 점**:
  1. **Spec Kit 은 본 프로젝트가 따를 수 있는 prior art** — .specify/ 디렉토리 구조
  2. spec-driven development 는 *이미 메인스트림 narrative*. 본 프로젝트는 SDD ∩ design system 교차점

### shadcn registry (CLI 3.0 / MCP) — 무조건 채택해야 할 표준

- **무엇을 하는가**: 컴포넌트 배포 표준. registry.json + namespaced (`@registry/name`) + MCP server (2025-08 official).
- **본 프로젝트가 배울 점**:
  1. ***본 프로젝트 컴파일 출력은 무조건 shadcn registry 형식*** — v0/Cursor/Claude Code/21st.dev 모두에 흘려보냄
  2. registry 의 markdown rules 파일에 본 프로젝트 컴포넌트 어휘 *명세* 담기 가능
  3. namespaced registry 로 *분산 협업* 가능

### 21st.dev / tweakcn

- **21st.dev**: shadcn 마켓플레이스. 730+ 컴포넌트, AI 도구 통합, 자체 MCP.
- **tweakcn**: shadcn theme 비주얼 편집기. AI 테마 생성.
- **본 프로젝트가 배울 점**:
  1. *컴포넌트 카탈로그*는 가치 있는 비즈니스 — 21st.dev 는 *730+ 컴포넌트 + 70일* 으로 viable
  2. *디자이너는 token JSON 직접 안 씀* — visual theme editor 필수 (tweakcn 류 + AI 생성)

### 학술 — Design2Code, FrontendBench, Sketch2Code

- **Design2Code (NAACL 2025)**: 웹 페이지 reconstruction benchmark, HTML/CSS visual consistency 평가.
- **Sketch2Code (arXiv 2024-10)**: VLM 기반 interactive web design.
- **FrontendBench (arXiv 2506)**: 1,572 requirements + checklists.
- **본 프로젝트가 배울 점**:
  1. **FrontendBench 1,572 requirements + checklist** 데이터셋을 컴파일러 회귀 테스트에 차용
  2. *visual consistency metric*이 design-to-code 정확도 표준 — 본 프로젝트도 Paper ↔ React render 픽셀 차이 metric 가능
  3. *디자이너 페르소나 + spec markdown* 조합 학술 publish 가능성

### Open UI / WAI-ARIA — 컴포넌트 어휘 최저층

- **WAI-ARIA 1.3 editor's draft (W3C 2025-08)**. Open UI 는 *컴포넌트 ontology* 시도.
- **본 프로젝트가 배울 점**:
  1. **ARIA role 이름** (button, dialog, listbox, navigation) 을 본 프로젝트 어휘 *최저층* 으로 — accessibility 자동 정합
  2. shadcn 의 *Login*, *Card*, *Page*, *Layout* + ARIA role 매핑이 본 프로젝트 차별화 portion

## 📊 비교 표 — 전체 도구 × 핵심 차원

| 도구 | 디자인 SoT | 코드 출력 | 토큰 | 컴포넌트 어휘 | Iteration | 오픈성 | Lock-in | 디자이너 자유도 |
|---|---|---|---|---|---|---|---|---|
| **본 프로젝트** | DESIGN.md+TOKEN.md+FRONT.md (md) | React+shadcn+Tailwind | DTCG 호환(예정) | 자체 (3-tier 예정) | spec.md ↔ Paper render | (예정) | 낮음 | Paper 자체 캔버스 |
| **Stitch + DESIGN.md** | DESIGN.md (Apache 2.0) | HTML/React | DTCG | 9 sections | canvas | spec 오픈 | 낮음 | Stitch 캔버스 |
| **Figma Code Connect** | .fig (binary) | 임의 React | Variables→DTCG | Code Connect 매핑 | Figma direct | spec 오픈/SoT 닫힘 | 매우 높음 | Figma 90% |
| **v0** | v0 chat URL | shadcn registry | Tailwind v4 | shadcn 이름 | chat | 출력 오픈 | 중간 | 없음 |
| **Lovable** | chat + GitHub | React+Supabase | 없음 | 없음 | chat | GitHub sync | 중간 | 없음 |
| **Bolt v2** | WebContainer | React/Vite | 없음 | 없음 | chat | export | 중간 | 없음 |
| **Cursor + shadcn MCP** | codebase 자체 | shadcn | shadcn token | shadcn 이름 | IDE chat | 매우 오픈 | 매우 낮음 | 없음 |
| **Builder.io VC** | .fig | 다중 framework | 자체 | Mitosis IR | plugin | Mitosis 오픈 | 중간 | Figma |
| **Locofy** | .fig + tags | React/Next/RN | 자체 | tag 어휘 | plugin | 닫힘 | 중간 | Figma + tagging |
| **TeleportHQ** | 자체 캔버스 | UIDL → 7+ FW | 자체 | UIDL JSON | builder | UIDL OSS | 중간 | 자체 |
| **Plasmic** | 자체 visual | React in repo | 자체 | 자체 | builder + sync | 일부 OSS | 낮음 | 자체 |
| **Webstudio** | 자체 visual | Remix/React | 자체 | 자체 | builder + CLI | AGPL | 매우 낮음 | 자체 |
| **Penpot + MCP** | .penpot (open SVG/CSS) | inspect HTML/CSS | open standards | 없음 | canvas + MCP | AGPL | 매우 낮음 | Figma 대체 시도 |
| **Subframe** | 자체 visual | React+Tailwind | 자체 | shadcn 친화 | builder | 닫힘 | 중간 | 자체 |
| **Markdoc** | markdown | 사용자 React | 없음 | tag schema | doc edit | MIT | 매우 낮음 | N/A (docs) |
| **Spec Kit** | .specify/*.md | 임의 코드 | 없음 | 없음 | spec edit | MIT | 매우 낮음 | N/A |
| **Style Dictionary** | tokens.json/DTCG | CSS/JS/iOS/Android | 표준 빌더 | 없음 | tokens edit | OSS | 없음 | N/A |
| **shadcn registry** | registry.json | shadcn install | 컴포넌트 단위 | shadcn 이름 | CLI install | 매우 오픈 | 없음 | N/A |

## ⚠️ 반복되는 함정 (피해야 할)

1. **"AI 매직 한 번에 production" 거짓말** — Lovable/v0/Bolt 모두 *프로토타입 cliff*. 같은 약속하면 같은 backlash.
2. **Iteration breakage** — small change breaks elsewhere. *markdown SoT 의 결정성*이 본 프로젝트 핵심 가치인데, 실제로 결정적이지 않으면 같은 함정.
3. **15~20 컴포넌트 이상 context 붕괴** — Bolt/Lovable 사용자 보고 일관. *spec 분할 + 참조 그래프* 필요.
4. **반응형/breakpoint 무시** — Anima/Locofy 가장 큰 비판. *명시적* breakpoint 어휘 필요.
5. **Vendor lock-in** — Figma Make one-way push, Lovable credit, v0 chat 종속. *markdown export* 만 약속해도 신뢰 확보.
6. **수동 매핑 비용 폭증** — Figma Code Connect 만성. 본 프로젝트 *컴포넌트 이름 = 매핑* 사상이 *맞다면* 회피.
7. **디자이너 자유도와 코드 정합성 trade-off** — Figma 자유도, Plasmic 정합성. 본 프로젝트는 *어휘 제약* — 디자이너 답답해할 위험.
8. **다중 framework 너비 추구** — Builder/TeleportHQ 너비 추구하다 깊이 잃음. 본 프로젝트는 *React+shadcn 깊이* 답.
9. **NIH(Not Invented Here)** — Stitch DESIGN.md / DTCG / shadcn registry 표준. *호환성 없이* 자체 형식 강행 = ecosystem 외부.
10. **보안/접근성 부채** — Lovable VibeScamming. spec.md 가 *임의 콘텐츠* 허용 = 같은 표면. 컴포넌트 어휘 + ARIA role 매핑으로 *기본 a11y* 자동.
11. **디자이너 점유율 0** — Penpot 5년+ 분투 — 새 디자인 도구는 *극도로 어려운 시장*.

## 🎯 본 프로젝트의 진짜 차별화 가능 지점

1. **단일 컴포넌트 어휘 = spec.md 작성 어휘 = Paper 디자인 = React 출력 = LLM 어휘** — 시장에 *4축 모두 같은 어휘*는 없음. v0(1,4축), Code Connect(3,4축), Markdoc(1축+docs). 이 4중 정합이 *진짜 작동* 시 강력.
2. **디자이너가 spec markdown 을 직접 쓴다는 페르소나** — Stitch/Figma Make/Lovable=chat, Code Connect=개발자가 매핑, Markdoc=docs. 본 프로젝트만 *디자이너 텍스트 직접 편집*.
3. **i18n placeholder 가 spec.md 1급 시민** (`{{i18n.ko.login-input}}`) — 어디에도 없음.
4. **자체 캔버스(Paper) + markdown SoT** — Penpot/Webstudio/Plasmic/Subframe markdown SoT 아님. Stitch markdown SoT 지만 *Stitch 캔버스 closed* + 디자이너 직접 못 씀. *markdown 인간-편집 + 캔버스 visual 검증* 빈 자리.
5. **shadcn 그대로 + 테마만 변경 + 검증된 어휘 = LLM hallucination 표면적 최소화** — 가설: LLM 이 *알려진 컴포넌트 이름*에서 가장 정확. 어휘 *고정*하면 환각 *컴파일러*에서 차단.

## 💡 직접 차용 가능한 패턴

1. **Markdoc tag syntax + schema** — `{% Component prop="value" %}` PEG grammar + 검증
2. **DTCG 1.0 stable token format** — `$value`/`$type`/`$description` — TOKEN.md 즉시 호환
3. **shadcn registry 출력 + MCP** — 외부 ecosystem 진입 채널
4. **Stitch DESIGN.md 9 섹션 superset** — 호환성 + 차별화 둘 다 (사용자 결정 = 명칭 유지)
5. **Code Connect `*.figma.tsx` 형식** — 본 프로젝트 컴포넌트-명세 파일 형식 reference
6. **GitHub Spec Kit `.specify/` 디렉토리 구조** — 본 프로젝트 specs/ 와 거의 동일
7. **Mitosis IR (Builder OSS)** — markdown → React 컴파일 중간 단계 IR
8. **`.cursor/rules/registry.mdc`** — 본 프로젝트 규칙을 LLM 에 전달하는 reference
9. **tweakcn 류 visual theme editor** — 디자이너가 token JSON 안 쓰게
10. **Locofy tag 카탈로그** — 본 프로젝트 컴포넌트 어휘 풍부도 평가 ground
11. **ARIA 1.3 role 어휘** — 본 프로젝트 어휘 최저층 + a11y 자동 정합
12. **Penpot MCP read+write 도구 형상** — Paper MCP reference
13. **Webstudio AGPL + 출력물 비상속** — enterprise distribution 라이선스
14. **FrontendBench 1,572 requirements + checklist** — 컴파일러 회귀 테스트

## 🚨 빨간 깃발

1. **Google이 DESIGN.md 이름 *먼저* 가져갔다** — 사용자 결정: *명칭 유지 + Stitch superset* 으로 가닥 (인지도 가치 ↑)
2. **Anthropic *Frontend Design plugin* 직접 출시** — 의존 LLM 회사가 영역 흡수 중. 차별화 portion 좁아짐
3. **Figma 2026 Canvas Skills** — *agent on canvas* 가설을 Figma 점유율로 흡수. 디자이너 reach 0 인 본 프로젝트 *유일한 advantage*는 markdown SoT 가치 — *디자이너가 그 가치를 알아채는가* 미지수
4. **DTCG 1.0 stable + Style Dictionary v4 + Tokens Studio** — 토큰 표준 *완전 정착*. 본 프로젝트 TOKEN.md 별도 형식 = 가치 없음. *즉시 DTCG 호환 필수*
5. **Penpot 5년+ 디자이너 점유율 0** — 디자이너 reach 0 시장에서 분투 중. 본 프로젝트는 *디자이너 도구가 아니라 디자이너+AI 페어 도구* 포지션 현명
6. **Subframe / shadcn/designer 등장** — *code-first 디자인 도구* 카테고리 빠르게 채워지는 중. timing window *지금~2027*
7. **Paper 가 .fig 대비 매력?** — 디자이너가 Figma 떠날 *유인*이 markdown SoT 하나로 충분한가? "아니다" 면 *Figma 위에 계층* 으로 재포지셔닝 (Figma plugin + markdown export 어댑터)
8. **shadcn 종속** — shadcn v4 token system, MCP, registry 빠르게 변경 — maintenance 부담
9. **컴포넌트 어휘 통제 가능성** — Page/Layer/Section/Card 단어는 *디자이너에 따라 다르게 해석*. 너무 좁으면 답답, 너무 넓으면 환각. *어휘 sweet spot* 찾기가 가장 어려운 product 결정
10. **production-ready 약속의 함정** — Lovable/v0/Bolt 모두 이 약속 backlash. 본 프로젝트 *publisher-ready ceiling* 명시 — 마케팅에서 *일관 유지* 필수

## 🔮 Timing 진단

- **현재 (2026-05)**: window *열려 있지만 좁아지는 중*. Stitch DESIGN.md alpha + Figma Canvas Skills 결정적 신호.
- **6 개월 후 (2026-11)**: Stitch DESIGN.md 1.0 stable + 채택 도구 윤곽 가능성. *호환 superset* 자리잡지 못하면 *fork branch* 흡수.
- **18 개월 후 (2027-11)**: 시장 정착. winner 1~3 개 결정. *그 안에 들거나 niche 후퇴*.

## 📚 참고 자료

### Stitch / Google Labs DESIGN.md
- [Stitch — Design with AI](https://stitch.withgoogle.com/)
- [Stitch's DESIGN.md format is now open-source — Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
- [google-labs-code/design.md GitHub](https://github.com/google-labs-code/design.md)
- [DESIGN.md spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md)
- [What is DESIGN.md? — designmd.app](https://designmd.app/what-is-design-md)
- [Awesome DESIGN.md — VoltAgent](https://github.com/VoltAgent/awesome-design-md)

### Figma 생태계
- [Code Connect — Figma Help](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)
- [Code Connect Developer Docs](https://developers.figma.com/docs/code-connect/)
- [figma/code-connect GitHub](https://github.com/figma/code-connect)
- [Figma Dev Mode MCP server](https://www.figma.com/blog/introducing-figma-mcp-server/)
- [Design Context Everywhere You Build](https://www.figma.com/blog/design-context-everywhere-you-build/)
- [Figma Canvas Open to Agents](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/)

### v0 / Lovable / Bolt
- [v0 Docs](https://v0.app/docs)
- [v0 Design Systems](https://v0.app/docs/design-systems)
- [Open in v0 — shadcn/ui](https://ui.shadcn.com/docs/registry/open-in-v0)
- [Vercel v0 Review 2025](https://trickle.so/blog/vercel-v0-review)
- [Lovable AI Most Vulnerable to VibeScamming — Hacker News](https://thehackernews.com/2025/04/lovable-ai-found-most-vulnerable-to.html)
- [Lovable security crisis — TNW](https://thenextweb.com/news/lovable-vibe-coding-security-crisis-exposed)
- [bolt.new GitHub](https://github.com/stackblitz/bolt.new)
- [Lovable vs Builder.io vs Figma Make — DEV.to](https://dev.to/codelink/lovable-vs-builderio-vs-figma-make-whats-the-vibe-code-tool-for-you-174l)

### shadcn / 21st.dev / tweakcn
- [shadcn Registry Docs](https://ui.shadcn.com/docs/registry)
- [shadcn MCP Server Docs](https://ui.shadcn.com/docs/mcp)
- [shadcn CLI 3.0 + MCP — 2025-08](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp)
- [21st.dev GitHub](https://github.com/serafimcloud/21st)
- [tweakcn](https://tweakcn.com/)
- [shadcn/designer](https://ds.shadcn.com/)

### Token 표준
- [Style Dictionary](https://styledictionary.com/info/tokens/)
- [Design Tokens Spec Stable — W3C DTCG](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)
- [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)
- [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978/tokens-studio-for-figma)

### Markdown / SDD / Builder
- [Markdoc Overview](https://markdoc.dev/docs/overview)
- [Markdoc Spec](https://markdoc.dev/spec)
- [Stripe Markdoc Blog](https://stripe.dev/blog/markdoc)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Spec-Driven Development — GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-using-markdown-as-a-programming-language-when-building-with-ai/)
- [Builder.io Visual Copilot](https://www.builder.io/blog/figma-to-code-visual-copilot)

### 디자인 도구 (Figma 외)
- [Penpot GitHub](https://github.com/penpot/penpot)
- [Penpot MCP server](https://penpot.app/penpot-mcp-server)
- [Penpot AI whitepaper](https://penpot.app/blog/penpot-ai-whitepaper/)
- [Plasmic GitHub](https://github.com/plasmicapp/plasmic)
- [Webstudio GitHub](https://github.com/webstudio-is/webstudio)
- [TeleportHQ](https://teleporthq.io/professional-website-builder)
- [Framer Code Components](https://www.framer.com/developers/components-introduction)

### Anima / Locofy / Subframe
- [Anima Figma to Code](https://www.figma.com/community/plugin/857346721138427857/anima-figma-to-code-react-html-css-tailwind-mui)
- [Locofy — Figma to React](https://www.locofy.ai/convert/figma-to-react)
- [Subframe alternative analysis](https://www.subframe.com/tips/shadcn-alternatives)

### 학술 / 표준
- [Design2Code Paper — NAACL 2025](https://aclanthology.org/2025.naacl-long.199.pdf)
- [FrontendBench arXiv](https://arxiv.org/html/2506.13832v2)
- [WAI-ARIA Overview — W3C](https://www.w3.org/WAI/standards-guidelines/aria/)
- [ARIA 1.3 Editor's Draft](https://w3c.github.io/aria/)

### 기타
- [Cursor + Claude Code shadcn workflow — UX Collective](https://uxdesign.cc/designing-with-claude-code-and-codex-cli-building-ai-driven-workflows-powered-by-code-connect-ui-f10c136ec11f)
- [Anthropic Frontend Design plugin — aidesigner](https://www.aidesigner.ai/blog/claude-code-frontend-design)
- [AI Figma-to-Code 2026 — sixtythirtyten](https://www.sixtythirtyten.co/blog/from-figma-to-code-ai-design-to-dev-workflows-in-2026)
- [Expose your design system to LLMs — hvpandya](https://hvpandya.com/llm-design-systems)
