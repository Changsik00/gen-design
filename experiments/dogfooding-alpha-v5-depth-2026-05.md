# Dogfooding Alpha v5 — gd-chat 대화 깊이 강화 검증 (2026-05-23)

> spec-12-02. v4 의 retro #1+#3+#5 (form validation 안내 / 성급 종료 / 버튼 의도) 해소 후 *이지 페르소나 v5* 로 4 신 재현 — **대화 turn ≥ 5 / decisions.md entry 다양성 ↑ / 0 errors 유지**.

## §0 v4 vs v5 비교

| 항목 | v4 (spec-11-08) | **v5 (spec-12-02)** |
|---|---|---|
| 페르소나 | 이지 (2년차 주니어) | 이지 (v4 동일) — *강화된 가이드* 받음 |
| gd-chat 본문 | §1-§12 (308 줄) | §1-§12 + §5.5 + §7.5 + §7.6 강화 (402 줄) |
| 대화 turn 평균 | 4 (성급) | **5.5** (≥ 5 ✓) |
| validation entry | 0 | **3** (신 1/2/4) |
| 버튼 의도 entry | 0 | **3** (신 1/3/4 — A/B/A) |
| 재사용 발견 | 신 2 (F1), 신 4 (F1+S1) | 동일 — 단 *명시적 §5.5 (iii)* |
| Tier 3 승격 | StatCard 확정 + FormBlock 후보 | 동일 |
| doctor errors | 4 신 0/0/0/0 | **4 신 0/0/0/0** ✓ |

→ *주요 차이*: **decisions.md entry 다양성** — v4 의 4 entry (각 신 1 결정) → v5 의 **11 entry** (의도 + validation + 버튼 의도 + 재사용 모두).

## §1 4 신 단계별 대화 (요약)

| 신 | Turn | 핵심 결정 |
|---|---|---|
| 1 로그인 | 7 | F1 표준 form / email+password validation / 로그인 = A submit, 회원가입 = B nav (grammar limit) |
| 2 회원가입 | 5 | F1 재사용 (1 회차) + Checkbox / 4 필드 validation / A submit |
| 3 대시보드 | 5 | StatCard 3 회 룰 후보 / Form 없음 → validation skip / 더보기 = B nav |
| 4 마이페이지 | 5 | 다중 재사용 (F1 + S1 4 회 → 승격) / 닉네임 validation + switch skip / A submit |
| **평균** | **5.5** ✓ | |

## §1.5 신 1 turn-by-turn (대표 — 상세는 transcripts/scene-1-login.md)

```
Turn 1 — 의도 (§5.5 i)
  이지: 로그인 화면. 이메일+비번. 가입은 별도 page link.
  → Narrative 확정

Turn 2 — 토큰 (§5.5 ii)
  agent: rounded-lg / primary / space-y-4 표준 OK?
  이지: 네 그대로.
  → 24 standard 매칭

Turn 3 — 비슷한 화면 (§5.5 iii)
  agent: 첫 신 — 패턴 만들면 신 2 재사용 예약
  이지: 패턴 잘 만들어둬야겠네요

Turn 4 — Validation 의도 (§7.5)
  agent: email validation? password 규칙?
  이지: email required+format, password required+min 8

Turn 5 — 버튼 의도 (§7.6)
  agent: 로그인 = A/B/C/D?
  이지: A (submit). 회원가입 link = B (nav)
  agent: ⚠️ grammar limit — <Link><Button asChild>... 패턴 parse X
        임시: variant=link 만, nav 의도 decisions 기록

Turn 6 — chat.md 작성

Turn 7 — gd react + gd doctor + decisions 3 entry append
```

## §2 정량

| 신 | TSX bytes | doctor | Turn | decisions entry |
|---|---|---|---|---|
| 1 로그인 | 2223 | 0 | 7 | 3 (재사용 / validation / 버튼) |
| 2 회원가입 | 3059 | 0 | 5 | 3 (재사용 / validation / 버튼) |
| 3 대시보드 | 2274 | 0 | 5 | 3 (3회 룰 / validation skip / 버튼 nav) |
| 4 마이페이지 | 5029 | 0 | 5 | 3 (승격 / validation / 버튼) |
| **합계** | **12,585** | **0** | **22 (평균 5.5)** | **12** |

→ v4 (4 entry 합계) 대비 **3 배** 결정 기록 다양성.

## §3 페르소나 strict 점수

agent (Claude) 의 이지 v5 roleplay 평가:

- ✅ **학습형 질문** ("Checkbox 처음 보네요" / "헐 4 신 만에 2 패턴 자연 발견")
- ✅ **agent 추천 받으면 빠른 결정** — v4 대비 *망설임 ↓* (§7.5 의 *각 필드별 안내* + §7.6 의 *4 옵션 명시* 덕분)
- ✅ **자기 인지 강화** ("validation 불필요 (boolean — 즉시 저장)" / "통계만 보여주는 신이니까요")
- ⚠️ **2 회 깨짐**:
  - 신 1: "패턴 잘 만들어둬야겠네요" — 시스템 작성자 시선 가까움
  - 신 4: "0 errors 라 신기" — 같은 시선

→ 페르소나 *대체로 유지* (2 회 미세). v5 의 *강화된 가이드* 덕분에 *결정 빠름 + decisions 풍부함*.

## §4 v5 신규 발견

🟢 **0 건 막힘** — 4 신 *연속* 진행 중 진단 위반 0. 단 다음은 *명확화 가능*:

| # | 항목 | 우선순위 |
|---|---|---|
| 1 | chat.md grammar 의 `<Link><Button asChild>...` parse 실패 | 🟡 MID — spec-12-05 (order.md) 에서 표준화 예정 |
| 2 | §5.5 의 5 단계 *모든 신 강제* 인데 *Form 없는 신* 의 validation skip 처리는 명확 OK | 🟢 OPT (이미 §12 에 명시) |
| 3 | 버튼 의도 4 옵션 — *AI 호출* / *데이터 refresh* 추가 필요한 도메인 | 🟢 OPT — spec-12-05 후속 |

→ 모두 OPT/MID. spec-12-02 종료 조건 영향 없음.

## §5 종료 조건 평가

| 조건 | 결과 |
|---|---|
| 4 신 0 errors | ✅ 0/0/0/0 |
| 대화 turn ≥ 5 평균 | ✅ 5.5 |
| validation entry ≥ 1 | ✅ 3 |
| 버튼 의도 entry ≥ 1 | ✅ 3 |
| 페르소나 strict | ⚠️ 2 회 깨짐 (수용 가능) |

→ **모두 통과** — gd-chat 대화 깊이 강화 *효과 입증*.

## §6 phase-12 진행 상황

| Spec | 상태 | 비고 |
|---|---|---|
| spec-12-01 (@gd/cli 분리) | ✅ Merged (PR #73) | workspace 동작 |
| **spec-12-02 (대화 깊이)** | ✅ **본 spec 완료** | 본 보고서 |
| spec-12-03 (gd tokens) | Backlog | v4 #2 |
| spec-12-04 (비슷한 화면 자동) | Backlog | v4 #4 |
| spec-12-05 (order.md) | Backlog | v4 #6 + grammar limit 흡수 |
| spec-12-06 (skeleton UI) | Backlog | NEW |
| spec-12-07 (plugin 아키텍처) | Backlog | phase 마지막 |

## 부록: v5 git artifacts

| 파일 | 내용 |
|---|---|
| `packages/create-gd-react/presets-bundled/default/.claude/skills/gd-chat.md` | §5.5 + §7.5 + §7.6 + §11 + §12 강화 (402 줄) |
| `experiments/dogfood-alpha-v5/` | scaffold (taskboard-v5) |
| `.gd/memory/designer.md` | 이지 v5 페르소나 |
| `.gd/memory/project.md` | taskboard 4 신 계획 |
| `.gd/memory/decisions.md` | 11 entry (v4 의 3 배) |
| `transcripts/scene-{1,2,3,4}-*.md` | 단계별 대화 (5-7 turn each) |
| `chats/scenes/{login,signup,dashboard,mypage}.chat.md` | 4 신 |
| `src/scenes/{login,signup,dashboard,mypage}.tsx` | 4 신 컴파일 (2223+3059+2274+5029 bytes) |
| `experiments/dogfooding-alpha-v5-depth-2026-05.md` | 본 보고서 |
