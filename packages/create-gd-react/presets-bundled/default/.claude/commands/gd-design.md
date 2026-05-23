---
name: gd-design
description: DESIGN.md 작성 가이드. Stitch 9 섹션 + gen-design 확장 2 (i18n / 컴포넌트 어휘 매핑). 빈 섹션 자동 감지 → 사용자에게 1-2 문장 채워달라 요청 (직접 짐작 금지).
---

# gd-design — 디자인 명세 작성 가이드

> 본 스킬은 *능동 도구* 입니다. DESIGN.md 의 빈 섹션을 자동 감지하고, 디자이너에게 *질문* 으로 채워나갑니다. *직접 짐작해서 채우지 않음*.

---

## §1 자동 로딩 컨텍스트

| 파일 | 역할 |
|---|---|
| `templates/DESIGN.md` (현재 상태) | 빈 섹션 / 채워진 섹션 판단 |
| `templates/FRONT.md` §8 Component Architecture | Tier 3 카탈로그 (DESIGN.md §8 의 매핑 기준) |
| `templates/TOKEN.md` | 토큰 이름 (DESIGN.md §3 Colors 의 참조) |
| `.gd/memory/project.md` | 브랜드 톤 (작성 시 reference) |
| `studio/src/lib/vocabulary/catalog/catalog.json` (있으면) | 자동 추출된 composite 어휘 |

---

## §2 본 스킬의 핵심 동작 — 빈 섹션 감지

호출 시 *DESIGN.md 의 각 섹션을 스캔* 하고 *빈 섹션 목록* 작성:

```
DESIGN.md 현재 상태:

✏️ 작성 필요 (빈 섹션):
  - §1 Overview
  - §2 Brand
  - §4 Typography
  - §확장 Components 어휘 매핑

✓ 작성됨:
  - §3 Colors (TOKEN.md 참조)
  - §5 Layout (Tailwind 표준 명시)
  - §6 Elevation (shadow-* 사용)
  - §7 Shapes (radius 토큰 사용)
  - §8 Components (Tier 3 카탈로그)
  - §9 Iconography (lucide-react)
  - §확장 i18n schema

먼저 §1 Overview 부터 시작할까요? (또는 다른 섹션 지정)
```

→ 디자이너가 *우선순위 결정*. 본 스킬은 *순서 강요 X*.

---

## §3 Stitch 9 섹션 walkthrough — 각 섹션 질문 1-2개

각 빈 섹션에 대해 *질문* 으로 채워나감. *직접 짐작 금지*.

### §1 Overview

```
이 프로젝트는 무엇인가요? (한 문장)
누구를 위한 것인가요? (타깃 사용자 한 줄)
```

→ memory/project.md 의 정보 활용 후 1차 작성 → 디자이너 확인.

### §2 Brand

```
브랜드 톤을 한 단어로 표현하면? (예: 친근 / 전문적 / 미니멀 / 활기)
경쟁 / 참고 브랜드는?
피하고 싶은 톤은? (예: 너무 캐주얼 / 너무 차가운)
```

### §3 Colors

이미 TOKEN.md 에 정의됨. DESIGN.md 에는 *의도* 만:

```
각 토큰의 *의도* 만 1줄씩 명시:
- primary: 행동을 부르는 색. CTA 만 사용.
- destructive: 되돌릴 수 없는 행동만 (삭제 / 구독 취소).
- ...
```

### §4 Typography

```
폰트 패밀리 결정사항이 있나요? (기본: Inter)
페이지 타이틀의 톤은? (큰 / 강한 / 부드러운)
본문 텍스트 line-height 선호?
```

### §5 Layout

대부분 Tailwind 표준. 의도만:

```
신 사이 vertical spacing 선호? (기본: gap-8)
Card 내부 padding? (기본: p-6)
모바일 vs 데스크탑 디자인 우선순위?
```

### §6 Elevation

shadow 사용 컨벤션:

```
shadow-sm / md / lg / xl 의 의도 분리 명시.
flat design 선호하면 shadow 사용 안 하는 게 좋음 — 알려주세요.
```

### §7 Shapes (Radius)

```
전체 톤 — 부드러움 (rounded-lg 이상) / 날카로움 (rounded-sm)?
컴포넌트별 다른 radius 적용 의도가 있나요? (예: Card 만 sharp, 나머지 soft)
```

### §8 Components (Tier 3 카탈로그)

**가장 중요한 섹션** — Tier 3 composite 어휘 정의:

```
이미 카탈로그에 있는 composite:
- LoginForm (chats/scenes/login 에서 사용 예정 시)
- BrandHeader
- StatCard
- EmptyState
- ...

새로 추가할 composite 있나요? (3회 룰 — 3개 신에서 반복 사용 예정)
```

→ 디자이너가 추가하려는 composite 은 *FRONT.md 의 3회 룰 통과* 후 등재.

### §9 Iconography

```
아이콘 set: lucide-react (700+ 아이콘) — 기본 사용 확정?
icon 크기 컨벤션: 16 / 20 / 24 (현재 기본)?
상태 의미 매핑 (성공=Check / 경고=AlertTriangle / 실패=X) 동의?
```

---

## §4 gen-design 확장 — i18n schema

```
i18n 키 명명: <도메인>.<액션>.<속성> (기본 표준)

예시:
- auth.login.email-label
- dashboard.stats.total-users
- error.network

지원할 locale: ko / en (기본) + 추가?
```

→ ko 가 기준 locale 인지 en 가 기준인지 명시.

---

## §5 gen-design 확장 — Components 어휘 매핑

본 섹션이 *가장 중요*. Tier 3 composite 이 *어떤 shadcn 조합* 으로 컴파일되는지 명시:

```
| 어휘 (chat.md)    | 컴파일 결과 (TSX)                                    |
|---|---|
| <LoginForm>      | Card + Form + Input + Label + Button (variant=default) |
| <DashboardStats> | grid grid-cols-3 + StatCard repeat                  |
| <BrandHeader>    | header + img + h1 + p (Card 아님)                   |
| <EmptyState>     | div text-center + Lucide icon + p + Button          |
```

→ 디자이너가 *내가 어떤 어휘를 새로 정의했고, 어떻게 컴파일될지* 명시.
→ 매핑 누락 시 `gd react` 가 fallback 패턴 사용 — 결과 제한적.

---

## §6 작성 후 안내

DESIGN.md 의 빈 섹션이 *모두 채워졌으면*:

```
✓ DESIGN.md 작성 완료. 채워진 섹션:
  §1 Overview / §2 Brand / §3 Colors / §4 Typography
  §5 Layout / §6 Elevation / §7 Shapes / §8 Components
  §9 Iconography / §확장 i18n / §확장 어휘 매핑

다음 단계:
  pnpm gd doctor    # DESIGN.md ↔ TOKEN.md ↔ chat.md 정합 검증

이제 첫 신을 만들어보시겠어요? /gd-chat 호출
```

---

## §7 결정 기록 (memory/decisions.md append)

DESIGN.md 의 *주요 결정* 은 decisions.md 에 append:

```markdown
## YYYY-MM-DD 브랜드 톤 결정 (DESIGN.md §2)

- **결정**: 톤 = "친근하지만 전문적 (formal-friendly)"
- **이유**: 타깃 = 1인 개발자 → SaaS 빠른 셋업, 신뢰감 필요
- **영향**: copy 톤 / 색 선택 (primary 의 채도) / icon 라운드 정도
- **출처 스킬**: gd-design
```

→ 사소한 결정 (text-base 사용 등) 은 *기록 안 함* — *방향성* 결정만.

---

## §8 안티 패턴 (스킬 본인 행동)

- ❌ 빈 섹션을 *agent 가 임의로 채움* — 항상 디자이너에게 질문
- ❌ DESIGN.md 에 *픽셀값 / 색값 직접* 작성 — 항상 *토큰 이름* (`{primary}`) 참조
- ❌ Tier 2 (shadcn) 컴포넌트를 §8 에 재정의 — Tier 2 는 자동, 적지 않음
- ❌ §확장 Components 어휘 매핑 *생략* — 카탈로그 외 어휘는 *반드시* 매핑 명시
- ❌ Stitch 9 섹션 *순서 강요* — 디자이너 우선순위 따름
- ❌ 한 번에 9 섹션 모두 작성 강요 — 1-2 섹션씩 점진적
- ❌ 결정 기록 생략 — 주요 결정은 decisions.md append

---

## §9 종료 조건

- [ ] 디자이너가 *우선순위* 섹션 1-2 개 채움 (모두 채울 필요는 없음)
- [ ] §확장 Components 어휘 매핑 명시 (새 composite 정의 시)
- [ ] 주요 결정 → decisions.md append
- [ ] `pnpm gd doctor` 안내

→ DESIGN.md 는 *살아있는 문서* — 신 추가하면서 점진적 채워나감.
