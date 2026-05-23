# Transcript — 신 1 (로그인) — 이지 v5

> spec-12-02 강화된 gd-chat (§5.5 + §7.5 + §7.6) — 대화 turn ≥ 5 강제.

## Turn 1 — 호출 + 의도 (§5.5 의 (i))

```
이지:  /gd-chat 로그인 화면 만들고 싶어요
agent: "[§1 자동 로딩 — designer.md + project.md + catalog 본 후]
        OK, taskboard 의 로그인 화면. §5.5 §1 의도부터 — 어떤 사용자가
        들어와서 어떤 식으로 로그인하면 좋을까요?"

이지:  "팀 멤버가 매일 아침 들어와서 *이메일+비번* 으로 빠르게 로그인.
        가입은 회원가입 페이지로 link."
```

→ **의도 ✓** — Narrative 의 *타깃/목적* 명확.

## Turn 2 — 카탈로그 추천 + 토큰 후보 (§5.5 의 (ii))

```
agent: "§5 카탈로그 추천:
        - Card + Form + Input x 2 + Button + Link (회원가입)
        §5.5 (ii) 토큰 — radius 는 표준 rounded-lg, color 는 primary,
        spacing space-y-4 OK 인가요?"

이지:  "네 다 표준 그대로 좋아요."
```

→ **토큰 ✓** — 24 standard 매칭. 신규 토큰 없음.

## Turn 3 — 비슷한 화면 발견 (§5.5 의 (iii))

```
agent: "§5.5 (iii) 비슷한 화면 — chats/scenes/ 보니 *첫 신* 이라 아직 비슷한 거 없음.
        다음 회원가입 만들 때 *이 form pattern 재사용* 예정."

이지:  "오 그러면 패턴 잘 만들어둬야겠네요."
```

→ **재사용 ✓** — 신규 패턴. signup 시 재사용 예약.

## Turn 4 — Validation 의도 (§5.5 의 (iv) → §7.5)

```
agent: "§7.5 — Input 2 개 있으니 validation 의도 묻기.
        preset 표준은 react-hook-form + zod.

        각 필드별로 (예시):
          email: required? format? min/max?
          password: required? min/max?"

이지:  "email 은 required + 이메일 format.
        password 는 required + 최소 8자."
```

→ **validation ✓** — decisions.md entry 예약 (email + password 규칙).

## Turn 5 — 버튼 의도 (§5.5 의 (v) → §7.6)

```
agent: "§7.6 — Button 2 개 보임. 각각의 의도 (A/B/C/D)?
        - 로그인 버튼: ?
        - 회원가입 link: ?"

이지:  "로그인 버튼 = A (form submit, validation 후 API 호출).
        회원가입 link = B (page navigation, /signup 으로 이동)."

agent: "✓ 정확. chat.md 표현:
        - 로그인: <Button type=\"submit\">...</Button>
        - 회원가입: <Link to=\"/signup\"><Button variant=\"link\" asChild>...</Button></Link>

        ⚠️ **grammar limit 발견**: 현재 chat.md grammar 가 <Link>...<Button asChild>...</Button></Link>
        같은 *router wrap + asChild* 패턴 parse 실패 (spec-12-05 order.md 에서 표준화 예정).
        임시: <Button variant=\"link\"> 만 두고 onClick navigation 은 decisions.md 에 기록.
        본 spec 의 *gd-chat 강화* 와 *grammar 한계* 는 분리 — spec-12-05 후속."
```

→ **버튼 의도 ✓** — A + B 조합.

## Turn 6 — chat.md 작성 (5 단계 모두 확인 후)

```
agent: "§12 종료 조건 5 단계 모두 ✓. chat.md 작성 시작."

[chats/scenes/login.chat.md 작성 — bare 형식, 카탈로그 어휘만]

agent: "completed. gd react / gd doctor 실행할까요?"

이지:  "네 부탁드려요."
```

→ **chat.md ✓** — 본문 컴파일 준비.

## Turn 7 — 컴파일 + decisions append

```
[gd react login → src/scenes/login.tsx]
[gd doctor → 0 errors]
[decisions.md append — validation entry + 버튼 의도 entry]

agent: "✓ login.tsx (N bytes) / doctor 0 errors / decisions.md 2 entry append."
이지:  "오 form validation + 버튼 의도까지 자동 기록되네요. 좋아요."
```

→ **종료 ✓** — 모든 단계 충족.

---

## Turn 수 검증

| 단계 | Turn |
|---|---|
| 의도 | 1 |
| 토큰 | 2 |
| 재사용 | 3 |
| validation | 4 |
| 버튼 의도 | 5 |
| chat.md | 6 |
| 컴파일 + decisions | 7 |
| **합계** | **7** |

→ **≥ 5 ✓** (성공 기준 #1 만족).

## 페르소나 strict 점수

- ✅ 학습형 질문 ("오 그러면 패턴 잘 만들어둬야겠네요" / "오 form validation + 버튼 의도까지 자동 기록되네요")
- ✅ agent 추천 받으면 즉시 결정 ("네 다 표준 그대로 좋아요")
- ✅ 망설임 표현 *적음* — v4 에선 자주 망설였는데 v5 에선 *agent 가 4 옵션 명시* 라 결정 빠름
- ⚠️ 0.5 깨짐: "패턴 잘 만들어둬야겠네요" 가 약간 *시스템 작성자 시선*. 진짜 2년차는 *"네 알겠어요"* 정도?

→ 페르소나 *대체로 유지*. v5 의 강화된 가이드 덕분에 *결정 빠름 + 망설임 ↓*.
