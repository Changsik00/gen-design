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

```chat
<Card>
  <CardHeader>
    <CardTitle>{{i18n.ko.auth.login.title}}</CardTitle>
    <CardDescription>{{i18n.ko.auth.login.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Form>
      <Field name="email">
        <Label>{{i18n.ko.auth.login.email-label}}</Label>
        <Input type="email" placeholder={{i18n.ko.auth.login.email-placeholder}} />
      </Field>
      <Field name="password">
        <Label>{{i18n.ko.auth.login.password-label}}</Label>
        <Input type="password" />
      </Field>
      <Button type="submit" variant="default">{{i18n.ko.auth.login.submit}}</Button>
    </Form>
  </CardContent>
</Card>
```

**규칙:**
- 모든 텍스트는 `{{i18n.ko.<도메인>.<액션>.<속성>}}` placeholder — 하드코딩 금지
- variant 는 카탈로그 axes 안의 값만 (`variant="default"` OK, `variant="awesome"` X)
- spacing 은 Tailwind 표준 (`space-y-4`, `gap-2`) — 임의 px 금지
- 색은 토큰 클래스 (`bg-primary`, `text-muted-foreground`) — 임의 hex 금지

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

---

## §12 종료 조건

본 스킬 호출이 *완료* 되는 시점:

- [ ] `chats/scenes/<name>.chat.md` (또는 `components/`) 파일 존재 + frontmatter + 3층 채움
- [ ] 카탈로그 어휘로만 작성 (검증: `pnpm gd lint` 통과 가능)
- [ ] `pnpm gd react ...` 명령 안내 (또는 실행)
- [ ] (해당 시) `.gd/memory/decisions.md` 에 주요 결정 append

→ 사용자가 *시각 확인* 후 수정 필요하면 다시 chat.md 만 편집 → `gd react` 재실행.
