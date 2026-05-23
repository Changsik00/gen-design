# Scene 5 — SettingsScene 시뮬레이션 (spec-12-04 §5.6·§5.7 검증)

> v5 alpha 시뮬레이션 — 새 씬 작성 시 §5.6 비슷한 화면 발견 + §5.7 토큰 재사용 결정 flow 검증.

## 시뮬레이션 결과

| 단계 | 결과 |
|---|---|
| 씬 이름 | `settings.chat.md` (계정 설정) |
| doctor | 0 errors |
| §5.5 turn 수 | 6 |
| §5.6 유사 신 발견 | ✅ `login.chat.md` (Card + Form + password 50% 겹침) |
| §5.6 결정 | (B) 기반 확장 |
| §5.7 토큰 검색 | `gd tokens find green` → 없음 |
| §5.7 결정 | (C) 보류 + decisions.md 기록 |
| decisions.md entry | ✅ 2개 자동 기록 (§5.6 재사용 + §5.7 토큰) |

## 대화 흐름 요약

**Turn 1** — 의도 확인
> 디자이너: "계정 설정 화면 만들어줘. 비밀번호 바꾸고 알림 설정하는 거."
> 에이전트: Narrative 작성 (타깃: 기존 사용자 / 목적: 보안 + 알림)

**Turn 2** — 토큰 후보 (§5.5 ii)
> 에이전트: `gd tokens list --category color` → 35 토큰 확인. Card/Form 어휘는 기존 토큰 커버.
> 디자이너: "성공 메시지 초록색으로 하고 싶어요."

**Turn 3** — §5.7 토큰 재사용 vs 확장 (트리거됨)
> 에이전트: `gd tokens find green` → 없음. `gd tokens find success` → 없음.
> ```
> 'green' 관련 기존 토큰: 없음
>
> (A) 재사용 — 가장 가까운 기존 토큰: primary (oklch(0.205 0 0) light)
> (B) 확장   — tokens.json 에 `color.success` 신규 추가
> (C) 보류   — 일단 primary 로 진행, decisions.md 에 "나중에 검토" 기록
> ```
> 디자이너: "일단 보류하고 나중에 정해요."
> → decisions.md append ✅

**Turn 4** — §5.6 비슷한 화면 발견 (트리거됨)
> 에이전트: 기존 5 씬 구조 비교:
> - `login.chat.md`: Card + Form (email + password) — **password 필드 겹침 (50%) → 유사**
> - `signup.chat.md`: Card + Form (name + email + password) — password 1/3 = 33% → 경계
> - `mypage.chat.md`: div + Tabs → 최상위 다름 → 유사 아님
> ```
> 'login' 과 구조가 비슷해요:
>
> (A) 어휘 재사용    — login 씬 그대로
> (B) 기반 확장      — Card + Form 기반 + 비밀번호 3-필드 + Switch 추가
> (C) 신규 패턴      — 완전 독립 작성
> (D) composite 후보 — Form 블록 composite 검토
> ```
> 디자이너: "B로 할게요. login 기반으로 확장."
> → decisions.md append ✅

**Turn 5** — Form validation (§7.5)
> 에이전트: Input(password) 3개 → validation 의도 확인.
> 결정: currentPassword(required) + newPassword(min 8) + confirmPassword(oneOf ref)

**Turn 6** — Button 의도 (§7.6)
> 에이전트: `<Button type="submit">` → 의도 확인.
> 결정: (A) form submit — PATCH /me/password 호출

## 검증 결과

- ✅ §5.6 유사 신 탐지 정상 동작 (login 씬 50% 기준 매칭)
- ✅ §5.7 `gd tokens find` 연동 + 3-옵션 제시 정상 동작
- ✅ decisions.md entry 2개 자동 기록 (§5.6 재사용 결정 + §5.7 토큰 보류)
- ✅ phase-12 성공 기준 `decisions.md 재사용 vs 확장 entry ≥ 1` 달성
- ✅ §5.5 checklist 5 단계 모두 충족 (turn 6회)
