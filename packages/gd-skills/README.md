# @gen-design/skills

> Claude Code 에서 AI 와 대화로 React 화면을 설계하는 [gen-design](https://github.com/Changsik00/gen-design) 스킬 인스톨러.

```bash
npx @gen-design/skills          # 설치
npx @gen-design/skills --force  # 덮어쓰기
```

`.claude/skills/` 에 스킬 4종 복사 → Claude Code 에서 `/gd-chat` 으로 호출.

---

## 스킬 4종

| 스킬 | 역할 |
|---|---|
| `/gd-start` | 첫 온보딩 — DESIGN.md + 프로젝트 컨텍스트 수집 |
| `/gd-chat` | 화면 설계 대화 — chat.md + .order.md 작성 |
| `/gd-design` | DESIGN.md 토큰/컴포넌트 편집 |
| `/gd-token` | 디자인 토큰 조회 (list / find / show) |

---

## 사용 예시

```
> /gd-chat
AI: 어떤 화면을 만들까요?
> 대시보드. 통계 카드 4개

AI: 비슷한 화면을 찾았어요 — mypage.tsx 의 StatCard 패턴.
    A) ♻️  재사용 (권장) — 토큰 동일
    B) 새 컴포넌트
> A. 단 "마감 임박"은 빨강 강조
AI: ✓ destructive 토큰 활용. 새 토큰 추가 없이 처리

→ chat.md + dashboard.order.md 생성
→ pnpm gd react dashboard  (React TSX 자동 생성)
```

> AI 가 *비슷한 패턴을 먼저 제안*. 재사용 / 확장만 결정하면 일관성 자동 유지.

---

## 요구사항

- [Claude Code](https://claude.ai/code)
- Node.js >= 20

## 관련

- [`create-gd-react`](https://www.npmjs.com/package/create-gd-react) — 신규 프로젝트 (스킬 자동 포함)
- [gen-design repo](https://github.com/Changsik00/gen-design) — 전체 문서

MIT Licensed
