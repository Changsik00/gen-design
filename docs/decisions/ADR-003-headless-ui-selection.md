# ADR-003: Headless UI 라이브러리 선택 — shadcn/ui (Radix) 확정

> **상태**: 승인 (Accepted)
> **날짜**: 2026-04-14
> **의사결정자**: Dennis

## 컨텍스트

phase-1에서 shadcn/ui + Radix UI로 프로젝트를 셋업했으나, Headless UI 라이브러리 최종 선택은 유보 상태였다 (ADR-001 참조). 원래 phase-2에서 Radix와 React Aria를 LoginPage로 비교 구현할 계획이었다.

후보:
- **shadcn/ui (Radix UI 기반)** — 현재 셋업
- **React Aria (Adobe)** — 대안 후보

## 결정

**shadcn/ui (Radix UI)를 확정한다.** 비교 구현 없이 결정한다.

## 근거

### 1. AI 코드 생성 품질 (최우선 기준)

이 프로젝트의 핵심 소비자는 AI다. DESIGN.md를 읽고 UI 코드를 생성하는 것이 목적이므로, AI가 가장 잘 생성하는 코드 기반이어야 한다.

- shadcn/ui는 GitHub, 블로그, 튜토리얼에서 압도적으로 많은 학습 데이터를 보유
- Claude/GPT 모두 shadcn/ui 코드를 높은 품질로 생성
- React Aria는 상대적으로 학습 데이터가 적어 생성 품질이 불안정

### 2. 토큰 파이프라인 호환성

phase-1에서 구축한 토큰 파이프라인(`tokens.json → Style Dictionary → _tokens-*.css`)이 shadcn/ui의 CSS 변수 컨벤션(`--primary`, `--foreground` 등)과 이미 일치한다.

- React Aria로 전환하면 스타일링 레이어를 별도로 구축해야 함
- 토큰 ↔ 컴포넌트 연결에 추가 작업 발생

### 3. Tailwind 네이티브 통합

shadcn/ui는 Tailwind을 기본 스타일링으로 사용한다 (`cn()` 유틸리티 포함). React Aria는 자체 스타일링 시스템을 가지고 있어 Tailwind 통합에 추가 레이어가 필요하다.

### 4. 생태계 및 모멘텀

shadcn/ui는 2023년 이후 React UI 생태계에서 사실상 표준으로 자리잡았다. 커뮤니티, 플러그인, 레퍼런스가 풍부하다.

### 5. 접근성 충분성

Radix UI가 제공하는 접근성 수준은 이 프로젝트에 충분하다. React Aria의 더 세밀한 ARIA 패턴은 이 프로젝트에서 과잉이다.

## 비교를 생략한 이유

- 이미 phase-1에서 shadcn/ui를 선택하고 전체 파이프라인을 구축 완료
- 비교 구현은 결국 버릴 코드에 Spec 하나를 소비하는 것
- 5가지 근거 모두 shadcn/ui를 가리키므로 실증 비교의 기대 가치가 낮음

## 영향

- phase-2의 모든 Page Template은 shadcn/ui 기반으로 구현
- React Aria 비교 Spec (원래 spec-2-002) 삭제, Auth 템플릿 구현으로 대체
- 향후 Radix가 제공하지 않는 컴포넌트가 필요하면 Radix 직접 사용으로 보완
