# spec-1-002: React 프로젝트 셋업

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-1-002` |
| **Phase** | `phase-1` |
| **Branch** | `spec-1-002-react-project-setup` |
| **상태** | Planning |
| **타입** | Feature |
| **Integration Test Required** | no |
| **작성일** | 2026-04-12 |
| **소유자** | Dennis |

## 📋 배경 및 문제 정의

### 현재 상황

spec-1-001에서 DESIGN.md 확장 Schema가 정의되었다. 이제 이 Schema를 실제로 활용할 React 프로젝트가 필요하다. `studio/` 디렉토리에 Vite + React + TypeScript + Tailwind + shadcn/ui 기반 프로젝트를 셋업한다.

### 문제점

- React 프로젝트가 아직 없어서 컴포넌트 구현이나 토큰 파이프라인 검증이 불가
- Phase 2 (Page Template), Phase 3 (Blueprint), Phase 6 (Studio v1)의 기반이 없음

### 해결 방안 (요약)

Vite + React + TypeScript + Tailwind CSS + shadcn/ui로 `studio/` 프로젝트를 초기화하고, 기본 컴포넌트 몇 개를 설치하여 빌드/실행이 가능한 상태를 만든다.

## 🎯 요구사항

### Functional Requirements

1. `studio/` 디렉토리에 Vite + React + TypeScript 프로젝트 생성
2. Tailwind CSS v4 설치 및 설정
3. shadcn/ui 초기화 + 기본 컴포넌트 설치 (Button, Input, Card, Dialog)
4. `npm run dev`로 개발 서버 정상 구동 확인
5. `npm run build`로 프로덕션 빌드 성공 확인

### Non-Functional Requirements

1. Node.js 20+ / npm 기준
2. TypeScript strict mode
3. ESLint + Prettier 기본 설정

## 🚫 Out of Scope

- 디자인 토큰 파이프라인 (spec-1-003)
- Page Template 컴포넌트 구현 (Phase 2)
- 라우팅, 상태 관리 (Phase 6 Studio에서 다룸)
- Radix vs React Aria 비교 (Phase 2에서 다룸)

## ✅ Definition of Done

- [ ] `studio/` 프로젝트 빌드 성공 (`npm run build`)
- [ ] 개발 서버 정상 구동 (`npm run dev`)
- [ ] shadcn/ui Button, Input, Card, Dialog 렌더링 확인
- [ ] `walkthrough.md`와 `pr_description.md` 작성 및 archive commit
- [ ] `spec-1-002-react-project-setup` 브랜치 push 완료
- [ ] 사용자 검토 요청 알림 완료
