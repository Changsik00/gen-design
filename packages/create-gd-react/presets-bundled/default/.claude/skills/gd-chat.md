---
name: gd-chat
description: chat.md 작성 가이드. 3층 (Narrative + Structure + History) + 카탈로그 어휘 추천 + frontmatter 자동 + 디렉토리/파일 자동 생성. 새 신 / component chat 만들 때 호출.
---

# gd-chat — chat.md 작성 가이드

> 본 스킬은 *능동 도구* 입니다. 디자이너가 "로그인 화면 만들어줘" 하면 *카탈로그 분석 → 파일 자동 생성 → 3층 walkthrough → 컴파일 안내* 까지 자동 수행.

---

## §1 자동 로딩 컨텍스트

호출 즉시 *모두* 읽기:

| 파일 | 역할 |
|---|---|
| `templates/FRONT.md` (특히 §3 Tech Stack + §8 Component) | 사용 가능 어휘 (Tier 2/3 카탈로그) |
| `templates/DESIGN.md` §8 Components + §확장 어휘 매핑 | 도메인 어휘 + 컴파일 매핑 |
| `templates/TOKEN.md` | 색 / radius (Structure 안에 직접 안 쓰지만 의도 파악용) |
| `chats/_shell.chat.md` | 전역 외각 (헤더 / 풋터 자동 inherit) |
| 기존 `chats/scenes/*.chat.md` | 이미 작성된 신의 패턴 / 톤 참조 |
| 기존 `chats/components/*.chat.md` | 재사용 컴포넌트 chat |
| `.gd/memory/{designer,project,decisions}.md` | 디자이너 / 프로젝트 / 결정 컨텍스트 |
| `studio/src/lib/vocabulary/catalog/catalog.json` (있으면) | 28개 Tier 2/3 컴포넌트 + axes |

---

## §2 "어떤 화면?" 질문

이미 chat 이름을 알면 (예: 디자이너가 "로그인 화면" 명시) → §3 으로.
모르면:

```
어떤 화면을 만들고 싶으신가요?

예시:
- 로그인 / 회원가입 (auth)
- 대시보드 (dashboard)
- 빈 상태 (empty state)
- 설정 / 프로필 (settings)
- 결제 (checkout)
- 그 외 자유 입력

또는 "재사용 컴포넌트" 라면 components/ 에 만듭니다 (예: BrandHeader / EmptyState).
```

→ memory/project.md 의 *타깃 사용자 / 도메인* 을 보고 *맞춤 추천* 가능.

---

## §3 파일 위치 자동 결정

표준 위치:
- 신 (scene): `chats/scenes/<kebab-name>.chat.md`
- 재사용 component: `chats/components/<kebab-name>.chat.md`

자동 처리:

```
chats/scenes/login.chat.md 작성하시려는 거 맞나요?

(필요한 경우 디렉토리 자동 생성합니다)
```

→ 사용자 확인 후 *디렉토리 + 파일 자동 mkdir + 쓰기*. 이미 있으면 → "이미 있어요. 수정 모드로 진행할까요?" 질문.

---

## §4 frontmatter 자동 삽입

> 💡 **디자이너 안내** (spec-11-07 fix #v2-7): 아래 frontmatter (`type` / `name` / `identity` / `shell.inherit` 등) 는 *agent 가 자동으로 채워주는 메타데이터* 입니다. **미경님 / 디자이너는 안 만지셔도 OK** — 그냥 *어떤 신을 만들지* 만 알려주시면 됩니다.

신 (scene) 기본:

```yaml
---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true            # _shell.chat.md 의 외각 자동 포함
  # exclude: [BrandHeader] # 특정 컴포넌트 제외 시 (옵션)
created: YYYY-MM-DD
---
```

재사용 component 기본:

```yaml
---
type: component
name: BrandHeader
identity: chats/components/brand-header
applies: scenes           # 어디서 쓰이는지
created: YYYY-MM-DD
---
```

→ frontmatter 의 `name` 은 *PascalCase* (TSX 출력의 함수명과 동일).
→ `identity` 는 *디렉토리 경로 + 파일명* (확장자 제외).

---

## §5 카탈로그에서 후보 컴포넌트 추천

본 스킬의 *가장 중요한 능동 동작*. "로그인 화면" 입력 받으면:

```
로그인 화면을 위한 표준 컴포넌트 조합 추천:

핵심 (필수):
- <Card>             — 폼 영역 wrap
- <Form>             — react-hook-form 통합
- <Input type="email">  — 이메일
- <Input type="password"> — 비밀번호
- <Label>            — 각 필드 라벨
- <Button variant="default">  — 로그인 버튼

옵션 (도메인에 따라):
- <Checkbox>         — Remember me
- <Separator>        — 구분선
- <Button variant="link">     — 비밀번호 찾기 / 회원가입 링크

소셜 로그인 추가하시려면:
- <Button variant="outline"> + Lucide icon (Google / GitHub / Apple)

이렇게 진행해도 될까요? 또는 다른 구성 원하시면 말씀해주세요.
```

→ 카탈로그 외 어휘 *임의 생성 금지*. 디자이너가 "새 컴포넌트 X 가 필요해" 하면:

```
X 는 현재 카탈로그에 없습니다. 두 가지 옵션:

A. 기존 어휘 조합으로 표현 (예: <Card> + <Button> + <Input>)
B. Tier 3 composite 으로 등재 — 3회 룰 적용
   (3개 이상의 신에서 같은 패턴 반복 시 자동 승격, 또는 명시 요청)

어떻게 가실래요?
```

---

## §5.5 대화 깊이 checklist (spec-12-02)

`chat.md` 컴파일 *전* 다음 5 단계를 *모두* 확인하세요. **하나라도 미확인이면 계속 대화** — 성급히 컴파일하지 않습니다.

1. **의도** — Narrative 1층 작성 (왜 / 누가 / 목적). 비어 있으면 안 됨.
2. **토큰 후보** — 사용할 radius / color / spacing 이 *현 24 standard 토큰* 과 매칭 (예: `bg-primary` / `rounded-lg`). 새 토큰 필요 시 *decisions.md 에 등록 의도* 명시.
3. **비슷한 화면 발견** — **§5.6 가이드 실행** (탐지 → 4-옵션 결정 → decisions.md 기록).
4. **form validation 의도** — Structure 에 `<Input>` 또는 `<Form>` 이 있으면 **§7.5 묻기 강제**.
5. **버튼 의도** — Structure 에 `<Button>` 이 있으면 **§7.6 묻기 강제** (CTA / navigation / submit / external).

각 단계의 결과는 *대화 turn* 으로 남고, 주요 결정은 `.gd/memory/decisions.md` 에 append.

> 💡 디자이너가 "그냥 컴파일해주세요" 라고 해도 *위 5 단계 빠진 게 있으면* 짧게 한 번 더 확인. 페르소나에 따라 (i) 초보 = 모두 묻기 / (ii) 숙련 = 빠르게 확인 + 짧은 한 줄 답.

---

## §5.6 비슷한 화면 발견 + 재사용 결정 (spec-12-04)

> §5.5 checklist 3단계 실행 절차. 새 신 작성 시 *항상* 수행.

### 탐지 절차

기존 `chats/scenes/*.chat.md` 파일을 읽고 *Structure 최상위 컴포넌트* + *주요 Form 필드* 를 비교합니다.

**유사 판정 기준** (둘 다 해당 시 "유사"):
- 최상위 컴포넌트 동일 (예: 새 신도 `<Card>` / 기존도 `<Card>`)
- Form 필드 ≥ 50% 겹침 (예: 새 신에 `email` + `password` / `login.chat.md` 에도 동일)

유사 신이 없으면 → "신규 패턴으로 진행합니다." 라고 한 줄 안내 후 계속.

### 4-옵션 결정 가이드 (유사 신 발견 시)

디자이너에게 다음을 제시합니다:

```
'<기존 신 이름>' 과 구조가 비슷해요. 어떻게 할까요?

(A) 어휘 재사용    — 기존 씬의 컴포넌트 / 어휘 그대로 (중복 최소화)
(B) 기반 확장      — 기존 씬 기반 + 새 요소 추가 (부분 신규)
(C) 신규 패턴      — 독립적으로 작성 (완전히 다른 의도)
(D) composite 후보 — 두 씬에서 공통 블록 추출 검토 (decisions.md 에 후보 등록)
```

### 결정 후 decisions.md 기록

**A/B 선택 시**:
```markdown
## YYYY-MM-DD <SceneName> 유사 신 재사용 결정

- **유사 신**: `<기존 씬 경로>` (구조: <최상위 컴포넌트>)
- **결정**: (A) 어휘 재사용 / (B) 기반 확장
- **이유**: <한 줄>
- **출처 스킬**: gd-chat (spec-12-04 §5.6)
```

**D 선택 시**:
```markdown
## YYYY-MM-DD <ComponentName> composite 승격 후보 등록

- **등장 씬**: `<씬1>`, `<씬2>` (N회 등장)
- **결정**: composite 후보 — <N+1>회 등장 시 승격 확정
- **출처 스킬**: gd-chat (spec-12-04 §5.6)
```

---

## §5.7 토큰 재사용 vs 확장 결정 (spec-12-04)

> Structure 작성 중 `tokens.json` 에 없는 색 / 반경 / 폰트 필요 시 진입.

### 트리거

디자이너가 표준 토큰에 없는 값을 요청할 때 (예: "브랜드 오렌지 컬러", "더 큰 radius"):

```
먼저 기존 토큰에서 찾아볼게요:
  gd tokens find <keyword>
```

### 3-옵션 결정 가이드

```
'<keyword>' 관련 기존 토큰:
  <gd tokens find 결과>

어떻게 할까요?

(A) 재사용    — 가장 가까운 기존 토큰 사용 (<token-name>)
(B) 확장      — tokens.json 에 신규 토큰 추가 결정 (이번 신에서 정의)
(C) 보류      — 일단 기존 토큰으로 진행, decisions.md 에 "나중에 검토" 기록
```

### 결정 후 decisions.md 기록

```markdown
## YYYY-MM-DD <SceneName> 토큰 재사용/확장 결정

- **필요 토큰**: <설명> (예: "brand accent color")
- **gd tokens find 결과**: <가장 가까운 기존 토큰> / 없음
- **결정**: (A) <token-name> 재사용 / (B) <new-token-name> 확장 / (C) 보류
- **이유**: <한 줄>
- **출처 스킬**: gd-chat (spec-12-04 §5.7)
```

---

## §6 Narrative (의도) walkthrough

3층 중 1층 — *왜* 이 신이 필요한가, *누가* 보는가.

```markdown
## 💬 Narrative

> *왜* 이 신이 필요한가? — 사용자 관점의 의도와 가치.

이 신은 *처음 방문한 사용자* 를 환영하고, ...

- **타깃**: <누가>
- **목적**: <무엇을 달성>
- **톤**: <친근 / 전문적 / 안정감 등>
```

→ memory/project.md 의 톤 / 타깃 가져와서 1차 작성 후 디자이너 확인.

---

## §7 Structure (구조) walkthrough

3층 중 2층 — *어떻게* 그릴 것인가. **카탈로그 어휘만** 사용.

> ⚠️ **중요**: Structure 본문의 `<Component>` 태그는 *bare* 형식으로 작성합니다. ` ```chat ` 같은 *코드 펜스 안에 넣으면* chat.md grammar 가 *예시 코드 블록* 으로 처리하여 컴파일러가 무시합니다. 결과는 *빈 화면*.

### ✅ 올바른 형식 (bare — markdown 본문에 직접 작성)

다음을 chat.md 의 `## 🧩 Structure` 섹션 *직후 본문* 에 그대로 적습니다:

<Card>
  <CardHeader>
    <CardTitle>{{i18n.ko.auth.login.title}}</CardTitle>
    <CardDescription>{{i18n.ko.auth.login.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Field name="email">
      <Label>{{i18n.ko.auth.login.email-label}}</Label>
      <Input type="email" placeholder={{i18n.ko.auth.login.email-placeholder}} />
    </Field>
    <Field name="password">
      <Label>{{i18n.ko.auth.login.password-label}}</Label>
      <Input type="password" />
    </Field>
    <Button type="submit" variant="default">{{i18n.ko.auth.login.submit}}</Button>
  </CardContent>
</Card>

### ❌ 잘못된 형식 (펜스 안 — 컴파일 무시됨)

다음과 같이 ` ```chat ` 또는 ` ``` ` 안에 넣지 *마세요*:

~~~markdown
```chat
<Card>...</Card>
```
~~~

이 경우 `gd react` 가 *빈 외각만* 출력하고 본문은 사라집니다 (spec-11-05 fix #1 의 원인).

### 디자이너 안내 (spec-11-07 fix #v2-5, #v2-6)

본 §7 Structure 안의 두 종류 *영어* 는 *agent / 도구가 자동 처리* — 디자이너가 *이해할 필요 없음*:

| 영어 표기 | 의미 | 디자이너 행동 |
|---|---|---|
| `{{i18n.ko.<도메인>.<액션>.<속성>}}` | *다국어 텍스트 자리* — 나중에 *실제 한국어* 로 바뀝니다 (`src/i18n/locales/ko.json`) | "여기에 무슨 글자가 들어갈지" 만 agent 에게 말씀. agent 가 i18n 키로 변환. |
| `className="space-y-4 grid-cols-4 ..."` 같은 *Tailwind 클래스* | *레이아웃 명령* (간격 / 그리드 / 색) — *자동 처리* | "이렇게 배치해주세요" 만 알려주면 agent 가 클래스 작성. *직접 수정 X.* |

→ 둘 다 *결과는 브라우저에서 확인* — `pnpm dev` (Vite 서버) 후 시각 검토.

### 규칙

- 모든 텍스트는 `{{i18n.ko.<도메인>.<액션>.<속성>}}` placeholder — 하드코딩 금지
- variant 는 카탈로그 axes 안의 값만 (`variant="default"` OK, `variant="awesome"` X)
- spacing 은 Tailwind 표준 (`space-y-4`, `gap-2`) — 임의 px 금지
- 색은 토큰 클래스 (`bg-primary`, `text-muted-foreground`) — 임의 hex 금지
- **bare 형식 강제** — chat.md grammar 가 ComponentTag 를 *최상위 블록* 으로만 인식

---

## §7.5 Input/Form 만나면 — validation 의도 묻기 (spec-12-02)

Structure 에 `<Input>` 또는 `<Form>` 이 있으면 **반드시** 묻습니다:

```
이 form 의 validation 어떻게 할까요? preset 의 표준은 react-hook-form + zod 입니다.

각 필드별로:
  - <field>: required? format (email/url/number 등)? min/max 길이? 기타?

예시 답:
  - email: required + email format
  - password: required + min 8자
  - terms: required (checkbox)
```

→ 디자이너 답 받고 `.gd/memory/decisions.md` 에 entry append:

```markdown
## YYYY-MM-DD <SceneName> form validation 결정

- **필드별 규칙**:
  - email: required + z.string().email()
  - password: required + z.string().min(8)
- **이유**: <사용자 답 — 예: "8자 정도면 충분, MVP">
- **출처 스킬**: gd-chat (spec-12-02)
```

> 💡 코드 직접 작성 안 함 — 디자이너는 *규칙만* 결정. 실 zod schema 생성은 향후 spec-12-05 (order.md) 또는 수동.

---

## §7.6 Button 만나면 — 버튼 의도 묻기 (spec-12-02)

Structure 에 `<Button>` 이 있으면 **반드시** 묻습니다 (4 옵션):

```
이 버튼의 의도는?

  A) form submit       — 폼 제출 (validation 후 API)
  B) page navigation   — 다른 페이지로 이동 (앱 내 라우터)
  C) external link     — 외부 URL (새 탭)
  D) modal/dialog open — 모달 열기

각각의 chat.md 표현 안내:
  A: <Button type="submit">{{i18n.ko.<scene>.submit}}</Button>
  B: <Link to="/path"><Button asChild>{{i18n.ko.<scene>.go}}</Button></Link>
  C: <a href="..." target="_blank"><Button asChild>{{i18n.ko.<scene>.external}}</Button></a>
  D: <Dialog>
       <DialogTrigger asChild><Button>{{i18n.ko.<scene>.open}}</Button></DialogTrigger>
       ...
     </Dialog>
```

→ 디자이너 답 받고 *해당 표현* 으로 chat.md 작성. decisions.md entry:

```markdown
## YYYY-MM-DD <SceneName> 버튼 의도

- **<버튼이름>**: (A/B/C/D) — <간단 설명>
- **이유**: <사용자 답>
- **출처 스킬**: gd-chat (spec-12-02)
```

> 💡 추가 의도 (AI 호출 / 데이터 refresh) 는 *spec-12-05 design-order-spec* 에서 표준화 예정.

---

## §8 History (이력) walkthrough

3층 중 3층 — *언제 무엇이 결정* 됐는가.

첫 작성:

```markdown
## 📜 History

- YYYY-MM-DD: 첫 작성. <한 줄 의도>
```

이후 변경 시:

```markdown
## 📜 History

- 2026-06-15: Remember me 추가 — 자주 로그인하는 사용자 피드백 반영
- 2026-05-22: 첫 작성. 이메일+비밀번호 기본 로그인.
```

→ 최신이 위 (역시간순).

---

## §9 컴파일 명령 안내

3층 작성 완료 후:

```
chat.md 작성 완료. 다음 명령으로 React TSX 생성:

  pnpm gd react chats/scenes/login.chat.md

생성 후 확인:
  pnpm dev          # Vite dev server 기동
  pnpm gd doctor    # 정합 검증 (drift / 어휘 / 대비)
```

→ 옵션으로 *직접 실행* 도 가능 (사용자가 "실행해줘" 하면 Bash 호출).

---

## §10 결정 기록 (memory/decisions.md append)

chat 작성 중 *주요 결정* 이 있었으면 `.gd/memory/decisions.md` 에 append:

```markdown
## YYYY-MM-DD LoginScene 첫 작성

- **결정**: 소셜 로그인 *제외* — MVP 단계, 이메일만 시작
- **이유**: 백엔드 OAuth 셋업 비용 회피, 추후 추가 예정
- **영향**: chats/scenes/login.chat.md, 추후 social-auth-block.chat.md 추가 시 합류
- **출처 스킬**: gd-chat
```

→ 사소한 결정 (variant 선택 등) 은 *기록 안 함* — *방향성 / scope* 결정만.

---

## §11 안티 패턴 (스킬 본인 행동)

- ❌ 카탈로그 외 어휘 *임의 생성* (예: `<LoginPanel>` 같은 임의 작명) — *Tier 3 승격 절차* 거치게 안내
- ❌ chat.md 본문에 한국어 / 영어 *하드코딩* — 모두 `{{i18n.ko.X}}` placeholder
- ❌ 임의 색 / spacing (예: `style={{padding: 17}}`) — Tailwind 표준 / 토큰 클래스
- ❌ 컴파일 명령 안내 *생략* — 디자이너가 결과를 볼 수 있게 항상 안내
- ❌ frontmatter `name` 을 *snake_case* / *kebab-case* — TSX 함수명과 일치하려면 PascalCase
- ❌ `chats/scenes/` 외 위치에 신 작성 — 표준 경로 강제
- ❌ Narrative / History 없이 Structure 만 작성 — 3층 모두 채움
- ❌ **Structure 본문을 ` ```chat ` 펜스 안에 작성** (spec-11-05 fix #1) — 컴파일러가 *예시 코드* 로 처리해 본문 누락. *bare* 형식 사용.
- ❌ **Input/Form 만났는데 validation 안 묻고 컴파일** (spec-12-02) — §7.5 의 질문 *강제*. 디자이너가 "필요 없어요" 라고 명시할 때만 skip + decisions.md 기록.
- ❌ **Button 만났는데 의도 안 묻고 컴파일** (spec-12-02) — §7.6 의 4 옵션 (A/B/C/D) *반드시* 확인. 의도 모르면 form submit 도 nav 도 잘못된 코드 생성.

---

## §12 종료 조건 (spec-12-02 — 5 단계 강제)

본 스킬 호출이 *완료* 되는 시점. **모든 항목 충족 필수** — 미충족 시 *계속 대화*:

- [ ] `chats/scenes/<name>.chat.md` (또는 `components/`) 파일 존재 + frontmatter + 3층 채움
- [ ] 카탈로그 어휘로만 작성 (검증: `pnpm gd lint` 통과 가능)
- [ ] §5.5 의 5 단계 모두 확인:
  - [ ] (i) 의도 (Narrative 비어 있지 않음)
  - [ ] (ii) 토큰 후보 매칭 (24 standard 또는 신규 등록 의도 명시)
  - [ ] (iii) 비슷한 화면 발견 검토 (재사용 vs 신규 결정)
  - [ ] (iv) Input/Form 있으면 validation 의도 결정 (§7.5)
  - [ ] (v) Button 있으면 버튼 의도 결정 (§7.6)
- [ ] `pnpm gd react ...` 명령 안내 (또는 실행)
- [ ] (해당 시) `.gd/memory/decisions.md` 에 주요 결정 append — validation / 버튼 의도 / 토큰 / 재사용 모두

→ 사용자가 *시각 확인* 후 수정 필요하면 다시 chat.md 만 편집 → `gd react` 재실행.

> 💡 디자이너가 "빨리 끝내고 싶어요" 라고 해도 위 5 단계 중 *결정 안 된 것* 은 한 번씩 짧게 확인 (페르소나 fit). 진정 *불필요한 단계* (예: form 없는 신에서 validation) 는 자동 skip OK.
