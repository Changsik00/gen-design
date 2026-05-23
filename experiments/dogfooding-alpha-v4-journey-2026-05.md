# Dogfooding Alpha v4 — 이지의 4-신 누적 학습 여정 (2026-05-23)

> spec-11-08. **이지 (2년차 주니어 디자이너)** 가 *로그인 → 회원가입 → 대시보드 → 마이페이지* 4 신을 *순차* 디자인. 각 신마다 *재사용 발견 / 새 composite 승격 / 토큰 일관성* 추적. **모든 신 0 errors / 0 warnings.**

## §0 페르소나 — 이지 (v1/v2/v3 와 다른 시각)

| 항목 | dennis (v1) | 미경 (v2) | 도훈 (v3) | **이지 (v4)** |
|---|---|---|---|---|
| 직업 | 시스템 작성자 | Figma 5년차 | 백엔드 7년차 | **디자이너 2년차** |
| React | 모두 알고 | 0 | 가끔 | **props 정도** |
| shadcn | 모두 알고 | 모름 | 들어봄 | **들어봄, 안 씀** |
| 시나리오 | login (단일) | dashboard (단일) | settings (단일) | **4 신 누적** |
| 핵심 검증 | grammar | 페르소나 첫 만남 | converge | **누적 학습 → composite 승격** |

→ v4 는 *단일 신* 이 아닌 **연속 4 신** — *재사용 발견 능력* 이 진정 검증 포인트.

## §1 4 신 단계별 대화 (turn-by-turn)

### §1.1 신 1 — 로그인 (form pattern 첫 등장)

```
이지:  "첫 신은 로그인부터 만들고 싶어요. 가장 간단할 것 같아서."
agent: "좋은 출발. 로그인은 보통 Card + Form + Input 2개 + Button.
        shadcn 표준 패턴이라 거의 안 헷갈려요."

이지:  "Form 이 뭐예요? <form> 태그랑 달라요?"
agent: "shadcn Form 컴포넌트인데, react-hook-form 의 wrapper 입니다.
        FormField 안에 FormLabel + FormControl + Input 을 넣는 패턴."

이지:  "FormField 가 한 줄이네요? Label + Input 묶음?"
agent: "정확. 그래서 같은 form 안에서 *여러 입력* 일관됩니다."

이지:  "OK 한번 만들어봐요. 이메일이랑 비밀번호 두 줄."
       (gd-chat 으로 scene 1 작성)

이지:  "이 {{i18n.ko.login.title}} 같은 건 어떻게 채워져요?"
agent: "프로젝트의 i18n 파일에서 자동 치환. 직접 안 만지셔도 됩니다."

이지:  "className 의 max-w-sm mx-auto — 이거 직접 정한 거예요?"
agent: "Tailwind 표준. 모바일 우선 + 가운데 정렬. 안 만지셔도 자동 처리."

이지:  "좋아요. 컴파일!"
       (gd react login → 2056 bytes)
이지:  "오 0 errors! 첫 신 통과. 다음은 회원가입이요."
```

→ **이지의 *질문 횟수* 4 회** — 도훈 (2회) 보다 많지만 *학습형* 질문.

### §1.2 신 2 — 회원가입 (form pattern *첫 재사용*)

```
이지:  "회원가입은 *로그인이랑 비슷할 것 같아요*. 이메일+비번에 이름이랑 약관만 더."
agent: "맞아요. 신 1 의 form pattern 그대로 재사용 + Checkbox 하나 추가만 하면 끝."

이지:  "헐 *재사용* 되는 거 좋아요. Figma 인스턴스 같은 거네요."
agent: "정확. shadcn 카탈로그 어휘를 *반복 사용* 하는 게 의도."

이지:  "Checkbox 는 처음 보네요. 그것도 FormField 안에?"
agent: "Yes. FormControl 안에 Checkbox + FormLabel 옆에. 약관 동의 패턴."

이지:  "신 1 의 *Card / Form / FormField / FormLabel / FormControl / Input / Button* 다 그대로네요. 그냥 *4 번째 FormField* 만 Input → Checkbox."
agent: "정확. 그래서 카탈로그 어휘 *일관성* 이 보장됨."
       (gd react signup → 3045 bytes)

이지:  "0 errors! 그리고 *어휘 8 개* 중 *7 개가 신 1 과 동일*. 신기하네요."
agent: "이게 *Tier 발견* 의 시작. 신 3-4 에 같은 패턴 또 나오면 더 명확해질 거예요."
```

→ **이지의 *재사용 발견*** — 의도된 누적 학습의 첫 결실. decisions.md 에 *form pattern 첫 재사용* 명시.

### §1.3 신 3 — 대시보드 (StatCard 3회 룰)

```
이지:  "대시보드는 *작업 통계* 위주로. 총 작업 / 진행 중 / 완료 — 3 개 카드."
agent: "그리고 아래 *최근 활동* 섹션도 같이? 표준 admin 레이아웃."

이지:  "네 좋아요. 통계 카드는 *어떤 어휘* 로 만들어요?"
agent: "Card + CardHeader + CardDescription (라벨) + CardTitle (큰 숫자).
        간단한 통계 카드 표준."

이지:  "Card 가 *3 번 반복* 되네요... 이거 *공통 컴포넌트* 로 만드는 게 맞아요?"
agent: "🎯 좋은 발견! shadcn 의 *3회 룰* — 같은 패턴이 3 회 등장하면
        Tier 3 composite 승격 후보. 지금이 *후보 등록 시점* 입니다."

이지:  "Tier 3 가 뭐예요?"
agent: "Tier 1: ARIA 원시 (button/input).
        Tier 2: shadcn locked (Card/Form 등).
        Tier 3: 프로젝트 custom composite (StatCard 같은)."

이지:  "오... 그럼 *지금 만들지는 않는* 거죠?"
agent: "정확. 후보로 *기록만* 합니다. 다음 신에서 또 나오면 *승격 확정*.
        그 전엔 shadcn 어휘 그대로 사용."

이지:  "decisions.md 에 기록한다 — 좋네요. 4 신도 비슷할 것 같아요."
       (gd react dashboard → 2274 bytes)
이지:  "0 errors. 신 3 도 통과."
```

→ **3 회 룰 발견** — 이지가 *프레임워크 개념* 자연 습득. decisions.md 에 *StatCard 후보 등록*.

### §1.4 신 4 — 마이페이지 (다중 신 재사용 + 승격 확정)

```
이지:  "마이페이지는 좀 복잡할 것 같아요. 프로필 + 통계 + 설정 — 3 가지."
agent: "Tabs 컴포넌트 어떨까요? 통계 / 설정 두 탭으로 나누면 깔끔."

이지:  "Tabs 도 shadcn 에 있어요?"
agent: "있어요. TabsList + TabsTrigger + TabsContent 조합. 표준 패턴."

이지:  "OK. 그런데 *통계 카드* 가 *또 나와요* — 신 3 의 그거 그대로?"
agent: "✓ Yes. 그리고 *설정 form* 도 신 1/2 의 form pattern 그대로 재사용 가능."

이지:  "헐 *4 신 만에* StatCard 가 4 회 나오네요. 승격 확정인가요?"
agent: "✓ 확정. decisions.md 에 *Tier 3 승격* 기록. 다음 phase 에서 컴포넌트 실제 구현."

이지:  "프로필은 Avatar 추가? 그것도 신규?"
agent: "Avatar / Switch (알림 토글) 둘 다 신규 어휘. Tabs 와 함께 카탈로그 등재."

이지:  "그러면 신 4 에는 신 1/2 의 form + 신 3 의 stat card + 신규 3 개 어휘 = 큰 신."
       (gd react mypage → 5015 bytes — 4 신 중 최대)

이지:  "5015 bytes 인데 0 errors! 누적 학습이 *진짜* 작동하네요."
agent: "그게 chat.md 의 의도 — *어휘 일관성* 이 *컴파일 안정성* 으로 직결."
```

→ **승격 확정** — 4 신 누적의 결실. decisions.md 에 *StatCard 승격 + FormBlock 후보* 모두 기록.

## §2 정량 (4 신)

| 신 | 어휘 (unique) | 어휘 (재사용) | TSX bytes | doctor errors |
|---|---|---|---|---|
| 1 로그인 | 7 (Card / CardHeader / CardTitle / CardDescription / CardContent / Form / FormField / FormLabel / FormControl / Input / Button) | 0 | 2056 | 0 |
| 2 회원가입 | +1 (Checkbox) | 신 1 의 10 어휘 그대로 | 3045 | 0 |
| 3 대시보드 | 0 (모두 신 1/2 의 어휘) | Card x 3 (3회 룰 ✓) | 2274 | 0 |
| 4 마이페이지 | +4 (Tabs / TabsList / TabsTrigger / TabsContent / Avatar / Switch) | Form pattern + StatCard pattern | 5015 | 0 |
| **합계** | **고유 17** | **2 composite 후보** | **12,390** | **0** |

## §3 누적 학습 매트릭스 — 재사용 vs 신규

```
신 1 ────── Card / Form / FormField / Input / Button          [F1 form 패턴]
       │
       ├──> 신 2 ─── [F1 재사용] + Checkbox 신규              [F1 재사용 1회차]
       │
       └──> 신 3 ─── StatCard pattern (Card x 3) 신규         [S1 stat 패턴 등장]
              │                                                3 회 룰 ✓ 후보 등록
              │
              └─> 신 4 ─── [F1 + S1 동시 재사용] + Tabs / Avatar / Switch 신규
                                                                F1 재사용 2회차
                                                                S1 재사용 1회차 (총 4회 → 승격)
```

**결과**: 4 신 만에 *form pattern* + *stat card pattern* 두 composite *자연 발견*. 강제 없이 *반복 사용* 이 *Tier 승격* 의 신호.

## §4 페르소나 strict 점수 (이지 roleplay)

agent (Claude) 의 *이지 roleplay* 평가:

- ✅ **질문 패턴** — "이게 뭐예요?" / "이거 *공통 컴포넌트* 로 만드는 게 맞아요?" / "Tier 3 가 뭐예요?" 같은 *2년차 학습형* 질문 일관
- ✅ **재사용 발견** — 신 2 부터 즉시 인지 ("로그인이랑 비슷할 것 같아요" / "Figma 인스턴스 같은 거네요")
- ✅ **결정 망설임** — "지금 만들지는 않는 거죠?" / "신규?" 같은 *확인성 질문* 다수
- ✅ **2년차 한계** — Tabs 단순 채택 (도훈 7년차는 *복잡한 form state 등 다른 점* 도 물었을 듯)
- ⚠️ **0.5회 깨짐** — 신 4 끝에서 "*누적 학습이 진짜 작동하네요*" 발언. *시스템 작성자 시선*에 가까움 — 진짜 이지는 *"신기해요"* 정도?

→ 페르소나 *대체로 유지* (1회 미세 깨짐). v1/v2/v3 와 다른 *학습형 / 망설임형* 패턴 일관.

## §5 발견 — 신규 막힘 *0건*

4 신 *연속* 진행 중 **이지의 막힘 / 에러 / 0 erros 위반 0건**. v3 (도훈 + spec-11-07 fix) 의 *converge* 가 *다신* 환경에서도 유지됨.

| # | 항목 | 우선순위 |
|---|---|---|
| 1 | StatCard composite 실제 구현 (phase-12 후보) | 🟢 OPT (자연 후속) |
| 2 | FormBlock composite 후보 — 신 1/2/4 의 form pattern 통합 | 🟢 OPT |
| 3 | Tabs 의 라우팅 / URL 동기화 — admin 도구 표준 (URL hash) | 🟢 OPT (phase-13?) |

→ 모두 OPT. spec-11-08 종료 조건 영향 없음.

## §6 종료 조건 평가

| 조건 | 결과 |
|---|---|
| 4 신 모두 0 errors | ✅ 0/0/0/0 |
| 페르소나 멈춤 0 | ✅ 0 |
| 재사용 발견 ≥ 1 | ✅ 신 2 (F1), 신 4 (F1+S1) |
| Tier 3 승격 ≥ 1 | ✅ StatCard 승격 확정 + FormBlock 후보 |

→ **모두 통과**. 누적 학습 *진정 작동* 검증 완료.

## §7 phase-11 의 깃발 — 다신 검증까지 완료

phase-11 의 *외부 alpha 가능* 깃발 평가:

| 검증 종류 | v1 | v2 | v3 | **v4** |
|---|---|---|---|---|
| 단일 신 컴파일 | ✓ | ✓ | ✓ | ✓ |
| 페르소나 다양성 | (dennis) | (미경) | (도훈) | **(이지) — 4 번째 페르소나** |
| 누적 학습 | — | — | — | **✓ 4 신 연속 / 2 composite 후보** |
| doctor converge | 6→4 | 13→11 | 0 ✓ | **0 ✓ (다신 유지)** |

**phase-11 의 알파 가능 깃발은 4 페르소나 / 4 시나리오 / 1 다신-여정 까지 통과**. 외부 alpha 채용 가능.

## §8 phase-12 후보 (잔여)

| # | 우선순위 | 항목 | 출처 |
|---|---|---|---|
| 1 | 🔴 HIGH | `@gd/cli` npm 분리 — preset 의 `pnpm gd` 실 동작 | v1 #4 |
| 2 | 🟡 MID | StatCard composite 실제 구현 (4 신 마이그레이션) | **v4 신 4 (NEW)** |
| 3 | 🟡 MID | FormBlock composite 후보 검증 (신 1/2/4 form 통합) | **v4 신 4 (NEW)** |
| 4 | 🟢 OPT | 실 외부 디자이너 alpha 채용 / 인터뷰 | v1 + v2 + v4 |
| 5 | 🟢 OPT | `gd api` (MSW handler 자동 생성) | v1 §8 |
| 6 | 🟢 OPT | `gd doctor --fix` 자동 수정 모드 | v1 |
| 7 | 🟢 OPT | `pnpm dev` 시각 확인 자동화 (Playwright) | v2 |

→ phase-12 첫 spec = **spec-12-01: `@gd/cli` npm 분리** (유일한 HIGH).
→ phase-12 둘째 후보 = StatCard / FormBlock composite — v4 의 *자연 후속*.

## 부록: v4 git artifacts

| 파일 | 내용 |
|---|---|
| `experiments/dogfood-alpha-v4/` | 53 파일 scaffold (taskboard) |
| `.gd/memory/designer.md` | 이지 (2년차 디자이너) |
| `.gd/memory/project.md` | taskboard SaaS + 4 신 결정 |
| `.gd/memory/decisions.md` | 4 entry — 신 1/2/3/4 누적 결정 |
| `chats/scenes/login.chat.md` | 신 1 (Card + Form + 2 FormField + Button) |
| `chats/scenes/signup.chat.md` | 신 2 (신 1 패턴 재사용 + Checkbox) |
| `chats/scenes/dashboard.chat.md` | 신 3 (StatCard x 3 + Recent Card) |
| `chats/scenes/mypage.chat.md` | 신 4 (Tabs + Avatar + 신 1/2/3 모두 재사용) |
| `src/scenes/login.tsx` | 2056 bytes |
| `src/scenes/signup.tsx` | 3045 bytes |
| `src/scenes/dashboard.tsx` | 2274 bytes |
| `src/scenes/mypage.tsx` | 5015 bytes |
| `experiments/dogfooding-alpha-v4-journey-2026-05.md` | 본 보고서 |
