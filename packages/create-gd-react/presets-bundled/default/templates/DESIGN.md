# {{project-name}} — DESIGN.md

> Stitch DESIGN.md 0.1 superset 형식입니다. 본 파일은 *디자이너 surface* — 편집 환영.
> Claude Code 에서 `/gd-design` 호출하면 각 섹션 작성을 가이드받습니다.

## 1. Overview

<!-- 프로젝트 한 줄 정의 + 비전 -->

## 2. Brand

<!-- 브랜드 톤 / 가치 / 목소리 (3-5 문장) -->

## 3. Colors

<!-- 주요 색상 (token 참조) — `{primary}`, `{background}` 등.
     실제 값은 templates/TOKEN.md 에 정의. 본 섹션은 *의미와 사용처* 설명. -->

## 4. Typography

<!-- 폰트 패밀리 / 스케일 / weight. 토큰 참조. -->

## 5. Layout

<!-- 그리드 / spacing / breakpoint 컨벤션. -->

## 6. Elevation

<!-- shadow 레벨과 의미. -->

## 7. Shapes

<!-- border-radius 컨벤션. -->

## 8. Components

<!-- 도메인 composite 컴포넌트 어휘.
     Tier 1 (ARIA) + Tier 2 (shadcn) 은 자동.
     Tier 3 (이 프로젝트 composites) 만 여기 기록.
     예: `LoginForm`, `DashboardStats`, `BrandHeader` -->

## 9. Iconography

<!-- 아이콘 set (기본: lucide-react). 사용 규칙. -->

## 확장: i18n

<!-- 지원 locale + 키 네이밍 컨벤션.
     chat.md 에서 `{{i18n.ko.foo}}` placeholder 로 참조. -->

## 확장: Components 어휘 매핑 (Tier 3 → React)

<!-- Tier 3 composite 가 어떤 shadcn 컴포넌트 조합으로 생성되는지.
     예: LoginForm = Card + Form (react-hook-form) + Input + Label + Button -->
