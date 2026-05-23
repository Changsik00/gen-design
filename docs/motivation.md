# 프로젝트 동기

> 이 문서는 gen-design 프로젝트가 *왜* 만들어졌는지 배경과 핵심 아이디어를 담습니다.
> 실무 진입은 [`docs/handbook.md`](handbook.md) 참조.

## 해결하려는 문제

현재 디자인 도구(Paper, Stitch, Figma)와 프론트엔드(React) 사이에는 여전히 사람이 직접 번역해야 하는 큰 간극이 존재합니다. `DESIGN.md`라는 AI가 읽을 수 있는 명세를 중간 언어로 두면, AI가 이 갭을 메울 수 있습니다.

현재 생태계의 파편화된 한계:

- **비주얼 규칙**은 제공되지만, 정작 **"무엇을 만들지"**(페이지 구성, 기능 요구사항)에 대한 체계적인 명세가 없습니다.
- **Button, Card** 같은 작은 단위의 UI 라이브러리는 많지만, **`LoginScene`이나 `DashboardScene`같이 프론트엔드 단에서 통째로 재사용할 수 있는 페이지 수준의 템플릿**은 없습니다.
- 기획 요구사항에서부터 실제 코드까지 유기적으로 이어지는 **구조적 가이드와 자동화 체계**가 없습니다.
- **디자이너 ↔ 프론트엔드 간의 AI 기반 순환 협업 Flow**(디자인→코드→렌더링 리뷰→수정)가 없습니다.

## 영감

- [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) — 구조화된 디자인 명세 포맷
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — 66개 브랜드의 DESIGN.md 컬렉션
- [shadcn/ui](https://ui.shadcn.com/) — 코드 복사→소유 컴포넌트 배포 모델
- [W3C Design Tokens](https://www.designtokens.org/) — 디자인 토큰 표준 (DTCG)

## 핵심 아이디어

### 있는 건 쓰고, 없는 걸 만든다

기존 도구와 표준을 최대한 활용하고, 생태계에 없는 부분만 직접 만든다.

| 영역 | 채택 (이미 있는 것) | 직접 만드는 것 |
|------|---------------------|---------------|
| DESIGN.md 포맷 | Stitch/awesome-design-md 9섹션 | 확장 섹션 (중간 언어, 페이지 명세, 컴포넌트 매핑) |
| 디자인 토큰 | W3C DTCG + Style Dictionary | 토큰↔Tailwind 자동 파이프라인 |
| UI 컴포넌트 | shadcn/ui + Radix/React Aria | Page Template (페이지 단위 재사용) |
| 앱 기획 | — (공백) | App Blueprint (질의서 → 요구사항 → 컴포넌트 매핑) |
| 협업 Flow | — (공백) | 디자이너↔프론트 워크플로우 프로토콜 |

> 의사결정 근거: [ADR-001](decisions/ADR-001-phase-restructure.md)

### 중간 언어 (Intermediate Naming)

페이지 내부 구조를 도구 중립적으로 기술한다.

```
Page > Section > Block > Element
예) LoginScene > HeroSection > CredentialBlock > EmailInput
```

### Page Template — 3계층 컴포넌트

단순 Button이 아닌 LoginScene 통째를 프로젝트 간 재사용한다.

```
Primitive       Button, Input, Select, Modal (shadcn/ui 기반)
    ↓
Composite       LoginForm, SignupForm, StatCard (Primitive 조합)
    ↓
Page Template   LoginScene, SignupScene, DashboardScene (Composite 조합)
```

### 디자이너↔프론트 협업 Flow

```
디자이너                              프론트
   ├─ Paper/Figma에서 시안 ──────────→ DESIGN.md 자동 추출
   │                              Page Template 조합 + 코드 생성
   ├─ Paper에서 결과 리뷰 ←─────────── 코드를 Paper에 렌더링
   ├─ 수정사항 반영 ─────────────────→ DESIGN.md 업데이트 → 코드 재생성
   └─ 최종 승인 ─────────────────────→ 머지
```
