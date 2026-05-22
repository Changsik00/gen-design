---
name: gd-token
description: TOKEN.md / tokens.json 작성 가이드. DTCG 1.0 형식 + 색 대비 즉시 검증 (WCAG AA) + 토큰 명명 컨벤션. 없으면 자동 생성.
---

# gd-token — TOKEN.md 작성 가이드

> 📌 본문은 spec-11-02 에서 작성됩니다. 현재 placeholder.

## 자동 로딩

- `templates/TOKEN.md` — 현재 토큰 의미 설명
- `templates/assets/tokens/tokens.json` — DTCG 1.0 값
- `.gd/memory/project.md` — 브랜드 톤 (색상 선택 기준)

## 동작 (예정)

1. "어떤 톤의 브랜드인가?" 질문 (없으면 `.gd/memory/` 에서 참조)
2. DTCG 형식 + 색 대비 즉시 검증 — primary on bg / mf 등
3. WCAG AA 미달 시 가장 가까운 합격 컬러 제안
4. `tokens.json` 편집 + `TOKEN.md` 의미 표 동기화
5. `pnpm gd build-tokens` 안내 (CSS vars 자동 생성)
