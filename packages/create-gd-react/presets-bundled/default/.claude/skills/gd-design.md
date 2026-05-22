---
name: gd-design
description: DESIGN.md 작성 가이드. Stitch DESIGN.md 0.1 superset 9 섹션 + 본 프로젝트 확장 (i18n / 컴포넌트 어휘 매핑). 빈 섹션 자동 안내.
---

# gd-design — DESIGN.md 작성 가이드

> 📌 본문은 spec-11-02 에서 작성됩니다. 현재 placeholder.

## 자동 로딩

- `templates/DESIGN.md` — 현재 상태
- `templates/FRONT.md` — Tier 3 composite 어휘 (Components 섹션 후보)
- `.gd/memory/project.md` — 브랜드 / 톤 / 도메인

## 동작 (예정)

1. 빈 섹션 감지 → 디자이너에게 1-2 문장으로 채워달라 요청
2. Stitch 9 섹션 순서대로 walkthrough:
   - Overview / Brand / Colors / Typography / Layout / Elevation / Shapes / Components / Iconography
3. 확장 섹션: i18n schema + Tier 3 composite 어휘 매핑
4. 작성 후 `pnpm gd doctor` 로 DESIGN.md ↔ TOKEN.md ↔ chat.md 정합 검증
