# Design

AI-친화적 디자인 시스템 명세(DESIGN.md)를 중심으로, 기획 → 디자인 → 프론트엔드를 하나의 파이프라인으로 연결하는 프로젝트.

## 동기

디자인 도구(Paper, Stitch, Figma)와 프론트엔드(React) 사이에는 여전히 사람이 번역해야 하는 간극이 있다. DESIGN.md라는 AI가 읽을 수 있는 명세를 중간 언어로 두면, AI가 이 간극을 메울 수 있다.

하지만 DESIGN.md만으로는 부족하다. 현재 생태계에는:
- **비주얼 규칙**은 있지만 **"뭘 만들지"**는 없다 (페이지 명세, 요구사항)
- **Button, Card** 수준의 컴포넌트는 있지만 **LoginPage 통째 재사용**은 없다
- **요구사항 → 코드** 사이의 구조적 가이드가 없다
- **디자이너↔프론트 AI 기반 협업 Flow**가 없다

이 프로젝트는 이 네 가지 갭을 메운다.

### 영감

- [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) — 구조화된 디자인 명세 포맷
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — 66개 브랜드의 DESIGN.md 컬렉션
- [shadcn/ui](https://ui.shadcn.com/) — 코드 복사→소유 컴포넌트 배포 모델
- [W3C Design Tokens](https://www.designtokens.org/) — 디자인 토큰 표준 (DTCG)

## 핵심 아이디어

### 1. 있는 건 쓰고, 없는 걸 만든다

기존 도구와 표준을 최대한 활용하고, 생태계에 없는 부분만 직접 만든다.

| 영역 | 채택 (이미 있는 것) | 직접 만드는 것 |
|------|---------------------|---------------|
| DESIGN.md 포맷 | Stitch/awesome-design-md 9섹션 | 확장 섹션 (중간 언어, 페이지 명세, 컴포넌트 매핑) |
| 디자인 토큰 | W3C DTCG + Style Dictionary | 토큰↔Tailwind 자동 파이프라인 |
| UI 컴포넌트 | shadcn/ui + Radix/React Aria | Page Template (페이지 단위 재사용) |
| 앱 기획 | — (공백) | App Blueprint (질의서 → 요구사항 → 컴포넌트 매핑) |
| 협업 Flow | — (공백) | 디자이너↔프론트 워크플로우 프로토콜 |

> 의사결정 근거: [ADR-001](docs/decisions/ADR-001-phase-restructure.md)

### 2. 중간 언어 (Intermediate Naming)

페이지 내부 구조를 도구 중립적으로 기술한다. 디자인 툴에서는 레이어명, React에서는 컴포넌트명, 요구사항에서는 참조명으로 동일하게 사용한다.

```
Page > Section > Block > Element

예) LoginPage > HeroSection > CredentialBlock > EmailInput
```

### 3. Page Template — 3계층 컴포넌트

단순 Button이 아닌 LoginPage 통째를 프로젝트 간 재사용한다.

```
Primitive          Button, Input, Select, Modal (shadcn/ui 기반)
    ↓
Composite          LoginForm, SignupForm, StatCard (Primitive 조합)
    ↓
Page Template      LoginPage, SignupPage, DashboardPage (Composite 조합)
                   ├── variant: page / modal / bottom-sheet
                   ├── 토큰 교체 → 브랜딩 변경
                   └── i18n 교체 → 언어 변경
```

```
LoginPage (Page Template)
├── BrandHeader         ← 로고, 앱 이름 (토큰 슬롯)
├── LoginForm           ← Composite (이메일, 비밀번호, 기억하기)
├── SocialAuthBlock     ← Composite (Google, Apple, Kakao — 슬롯)
├── ForgotPasswordLink  ← Primitive
├── SignupPrompt        ← i18n ("계정이 없으신가요?")
└── FooterLinks         ← Primitive (약관, 개인정보)
```

### 4. App Blueprint — 체계적 앱 기획

새 앱을 만들 때 구조화된 질의서로 페이지 구성을 가이드한다.

```
"나 SaaS 앱 만들래"
    → 어떤 페이지? (대시보드, 로그인, 회원가입, 마이페이지...)
    → 로그인은 모달? 페이지? OAuth 포함?
    → 대시보드에 어떤 섹션? (통계카드, 최근활동, 차트...)
    → 각 선택 → 기존 Page Template 자동 매핑
    → REQUIREMENTS.md + DESIGN.md + AGENT.md 생성
```

### 5. 디자이너↔프론트 협업 Flow

```
디자이너                              프론트
   │                                   │
   ├─ Paper/Figma에서 시안 ──────────→ DESIGN.md 자동 추출
   │                                   │
   │                              Blueprint 질의서 실행
   │                                   │
   │                              Page Template 조합 + 코드 생성
   │                                   │
   ├─ Paper에서 결과 리뷰 ←─────────── 코드를 Paper에 렌더링
   │                                   │
   ├─ 수정사항 반영 ─────────────────→ DESIGN.md 업데이트 → 코드 재생성
   │                                   │
   └─ 최종 승인 ─────────────────────→ 머지
```

## 프로젝트 구조

```
Design/
├── schema/                   ← DESIGN.md 포맷 정의 (Stitch 기반 + 자체 확장)
├── studio/                   ← React 웹앱 — 산출물 생성 가이드 (개밥먹기)
├── templates/                ← 프로젝트 생성 템플릿
│   ├── DESIGN.md.template
│   ├── REQUIREMENTS.md.template
│   ├── AGENT.md.template
│   └── assets/
│       ├── i18n/             ← 다국어 텍스트 리소스
│       └── tokens/           ← 디자인 토큰 JSON (W3C DTCG)
├── design-md-collection/     ← 66개 브랜드 DESIGN.md 레퍼런스
├── docs/
│   ├── decisions/            ← ADR (아키텍처 결정 기록)
│   ├── guides/               ← 매핑 규칙, 변환 가이드
│   └── integrations/         ← 디자인 도구 연동 가이드 (Paper, Stitch, Figma)
├── agent/                    ← 에이전트 거버넌스 (harness-kit)
├── backlog/                  ← Phase별 백로그
└── specs/                    ← Spec 산출물
```

## 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| DESIGN.md 포맷 | Stitch/awesome-design-md 기반 + 자체 확장 | 사실상 표준 채택, 확장만 추가 |
| 디자인 토큰 | W3C DTCG 포맷 + Style Dictionary | 2025.10 안정판 표준 |
| 디자인 도구 | Paper, Stitch, Figma | Paper MCP 우선, Figma 차후 연동 |
| UI 프리미티브 | Radix UI (기본) / React Aria (후보) | Phase 2에서 LoginPage 비교 후 최종 결정 |
| 컴포넌트 배포 | shadcn/ui registry 모델 참고 | 코드 복사→소유, 커스터마이즈 최적 |
| 스타일링 | Tailwind CSS | AI 친화적, 유틸리티 퍼스트 |
| 프레임워크 | React + Vite + TypeScript | studio 및 생성 대상 모두 React |
| 다국어 | i18n JSON | 텍스트 리소스 외부 관리 |

## 로드맵

> 원칙: "있는 건 쓰고, 없는 걸 만들자" (→ [ADR-001](docs/decisions/ADR-001-phase-restructure.md))

| Phase | 제목 | 핵심 산출물 |
|:-----:|------|------------|
| 1 | **Foundation** | DESIGN.md 확장 Schema, React+Tailwind+shadcn/ui 프로젝트, DTCG 토큰 파이프라인 |
| 2 | **Page Template 시스템** | 3계층 아키텍처, LoginPage (Radix vs Aria 비교 → ADR-002), Dashboard 템플릿 |
| 3 | **App Blueprint** | 페이지 카탈로그, 질의서, REQUIREMENTS.md 자동 생성 |
| 4 | **협업 Flow** | 디자이너↔프론트 프로토콜, Paper MCP PoC, Figma 토큰 동기화 PoC |
| 5 | **PoC 검증** | 앱 A→B 토큰/i18n 교체 재사용성 실증 |
| 6 | **Studio v1** | 산출물 생성 웹앱 (dogfooding) |
| 7 | **디자인 도구 연동 심화** | Paper/Stitch/Figma 양방향 파이프라인 안정화 |
