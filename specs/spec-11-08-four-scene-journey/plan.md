# Plan: spec-11-08 — 4-Scene Journey (이지 페르소나)

## 📋 Branch Strategy
- `spec-11-08-four-scene-journey` (phase-11 base, spec-11-07 commits 포함)

## 🎯 핵심 전략

### 이지 페르소나 *알고 / 모름*

| 알고 | 모름 |
|---|---|
| Figma 기본 (auto-layout) | shadcn 의 *cn / cva / variant* 원리 |
| React props 패턴 | useState / useEffect / hook |
| HTML/CSS 기본 | Tailwind utility class system |
| ChatGPT / Claude 사용 | Claude Code 스킬 / MCP |
| `<Button onClick>` 같은 prop | 화면별 form / list / detail 패턴 차이 |

### 이지 작업 패턴 (2년차 ↔ 미경 5년차 / 도훈 백엔드)

- 질문 *많음* — 학습 욕구 ↑
- 결정 *망설임* — "이렇게 해도 되나요?"
- 명령 *두 번 실행* 가능 (학습 의지)
- 신 사이 *재사용 발견* 능력 ↑ (Figma 컴포넌트 인스턴스 경험)
- 시각 + 코드 *둘 다 확인* 시도

### 4 신 순서 — 누적 학습 디자인

```
신 1: 로그인 (가장 단순)
  └─ Card + Form + Input x 2 + Button → 표준 form 패턴 결정
   ↓ decisions.md: "표준 form = Card + Form + FormField + Input + Button"

신 2: 회원가입 (form 패턴 재사용 첫 경험)
  └─ 신 1 form + 약관 동의 Checkbox + 비밀번호 확인 Input 추가
   ↓ decisions.md: "회원가입은 로그인 + Checkbox/추가 Input — 같은 패턴 응용"

신 3: 대시보드 (StatCard *3회 룰* 발견)
  └─ Card x 4 (Stats) — 같은 마크업 3회 반복 ⇒ Tier 3 composite 승격 후보
   ↓ decisions.md: "StatCard composite 승격 검토" — agent 가 추천

신 4: 마이페이지 (대시보드 재사용 + 신규)
  └─ 대시보드 Card 1개 (프로필 요약) + Avatar + Tabs (Profile/Security/Activity) + 신 1 form (수정)
   ↓ decisions.md: "다중 신 재사용 패턴 확립 — Avatar/Tabs 신규 어휘"
```

### 주요 결정

| 항목 | 결정 |
|---|---|
| 신 4개 모두 *bare 형식* | spec-11-05 fix #1 적용 |
| Avatar/Tabs 가 shadcn 화이트리스트 안 | ✓ (spec-11-07 fix #v2-2 의 90+ 목록에 포함) |
| StatCard *실 승격* X | 본 spec 은 *기록만*. 실 carcomposite 생성은 phase-12 |
| `pnpm dev` skip | 시간 — 컴파일 + doctor 로 충분 |

## 📂 Proposed Changes

### 1. `experiments/dogfood-alpha-v4/` scaffold (taskboard)
2. memory entries (이지 + 프로젝트)
3. `chats/scenes/{login,signup,dashboard,mypage}.chat.md` 4 신
4. `src/scenes/{login,signup,dashboard,mypage}.tsx` 4 컴파일
5. `.gd/memory/decisions.md` 4 entry 누적
6. 보고서 `experiments/dogfooding-alpha-v4-journey-2026-05.md`

## 🧪 검증 — 종합 doctor

```
pnpm gd doctor --chat-root .../v4/chats --templates-root .../v4/templates
→ 4 chat.md 동시 검증, 일관성 확인
```

## 🔁 Rollback
- `experiments/dogfood-alpha-v4/` 삭제
- 보고서 삭제

## 📦 Deliverables 체크
- [x] task.md 작성
- [ ] Plan Accept
- [ ] 4 신 + 보고서 + ship
