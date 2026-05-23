---
name: project
description: 프로젝트 정보 (브랜드 / 타깃 유저 / 도메인 / 비전)
type: project
---

## 프로젝트 정의

- **한 줄**: 1인 개발자를 위한 SaaS 시작 도구. 결제 / 인증 / 대시보드를 30초 안에 셋업.
- **타깃 사용자**: 백엔드 개발자가 프론트엔드까지 빠르게 (풀스택 전환 단계)
- **핵심 가치**: chat.md 한 번 작성 → React TSX 결정적 컴파일. 디자이너 / 프론트 작업 시간 ↓ 90%.
- **도메인**: SaaS (B2B / B2C 모두)
- **브랜드 톤**: formal-friendly (전문적이면서 친근). 신뢰감 + 빠른 실행. 차가운 미니멀 X.
- **시작일**: 2026-05-22

## 결정 사항

- 결제 = Stripe (백엔드 의존도 ↓)
- 인증 = Clerk 또는 Supabase Auth (서버 부담 ↓)
- 대시보드 = 첫 화면은 *간단한 stat 카드 + 리스트*
- 디자인 톤 = primary = indigo, destructive = red, 모서리 = rounded-lg (soft)

<!-- gd-start 스킬 simulation 입력 — Task 3 (spec-11-04) -->
