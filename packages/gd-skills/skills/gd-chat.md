---
name: gd-chat
description: chat.md v2 작성 가이드. 수직 단면 포맷(UI + Data + API + Scenarios + DB Hints) + 카탈로그 어휘 추천 + frontmatter 자동. 새 화면 / component chat 만들 때, 또는 기존 v1을 v2로 업그레이드할 때 호출.
---

# gd-chat — chat.md v2 작성 가이드

> 본 스킬은 *능동 도구*입니다. "로그인 화면 만들어줘" 하면 카탈로그 분석 → 파일 자동 생성 → 5개 레이어 walkthrough → LLM 생성 안내까지 자동 수행.

---

## §1 자동 로딩 컨텍스트

호출 즉시 모두 읽기:

| 파일 | 역할 |
|---|---|
| `templates/FRONT.md` (특히 §3 Tech Stack + §8 Component) | 사용 가능 어휘 (Tier 2/3 카탈로그) |
| `templates/DESIGN.md` §8 Components + §확장 어휘 매핑 | 도메인 어휘 + 컴파일 매핑 |
| `templates/TOKEN.md` | 색 / radius (토큰 이름 파악용) |
| `chats/_shell.chat.md` | 전역 외각 (헤더/풋터 자동 inherit) |
| 기존 `chats/scenes/*.chat.md` | 이미 작성된 화면의 패턴/톤 참조 |
| 기존 `chats/components/*.chat.md` | 재사용 컴포넌트 chat |
| `.gd/memory/{designer,project,decisions}.md` | 디자이너/프로젝트/결정 컨텍스트 |
| `docs/chatmd-v2-format.md` | v2 포맷 레이어 스펙 (있으면) |

---

## §2 "어떤 화면?" 질문

이미 화면 이름을 알면 → §3으로.
모르면:

```
어떤 화면을 만들고 싶으신가요?

예시:
- 로그인 / 회원가입 (auth)
- 대시보드 (dashboard)
- 설정 / 프로필 (settings)
- 빈 상태 (empty state)
- 결제 (checkout)

또는 "재사용 컴포넌트"라면 components/ 에 만듭니다.
```

---

## §3 파일 위치 자동 결정

```
chats/scenes/<kebab-name>.chat.md 작성하시려는 거 맞나요?
(필요한 경우 디렉토리 자동 생성합니다)
```

이미 있으면 → "이미 있어요. 수정 모드로 진행할까요?"
기존 파일이 v1 포맷이면 → **§3.1 v1 → v2 업그레이드 제안**.

### §3.1 v1 → v2 업그레이드 제안

기존 `*.chat.md`의 frontmatter에 `version`이 없거나 `version: 1`이면:

```
이 파일은 v1 포맷이에요. v2로 업그레이드하면:
  - Data / API / Scenarios 레이어 추가
  - MSW 핸들러 자동 생성 가능 (gd extract)
  - LLM이 더 정확하게 TSX 생성

업그레이드하시겠어요?
  Y) 네, v2로 업그레이드
  N) 아니요, v1 유지
```

---

## §4 frontmatter 자동 삽입

신 (scene) 기본:

```yaml
---
type: scene
name: DashboardScene
identity: chats/scenes/dashboard
version: 2
shell:
  inherit: true
created: YYYY-MM-DD
---
```

재사용 component 기본:

```yaml
---
type: component
name: BrandHeader
identity: chats/components/brand-header
version: 2
applies: scenes
created: YYYY-MM-DD
---
```

→ `name`은 PascalCase (TSX 함수명과 동일).
→ `version: 2` 명시 필수.

---

## §5 카탈로그에서 후보 컴포넌트 추천

"로그인 화면" 입력 받으면 카탈로그 기반 추천:

```
로그인 화면을 위한 표준 컴포넌트 조합 추천:

핵심 (필수):
- <Card>             — 폼 영역 wrap
- <Form>             — react-hook-form 통합
- <Input type="email">
- <Input type="password">
- <Label>
- <Button variant="default">  — 로그인 버튼

옵션:
- <Checkbox>         — Remember me
- <Separator>        — 구분선
- <Button variant="link">     — 비밀번호 찾기

이렇게 진행해도 될까요?
```

---

## §5.5 대화 깊이 checklist

`chat.md` 작성 전 다음 7단계를 모두 확인. **미확인이면 계속 대화**:

1. **의도** — Narrative 1층 작성 (왜/누가/목적)
2. **토큰 후보** — 사용할 색/radius가 TOKEN.md 토큰 이름과 매칭
3. **비슷한 화면** — §5.6 가이드 실행
4. **form validation 의도** — Input/Form 있으면 §7.5 묻기
5. **버튼 의도** — Button 있으면 §7.6 묻기 (4 옵션)
6. **서버 데이터 여부** — `{{data.X}}` 바인딩이 있으면 §5.8 Data 레이어 작성
7. **시나리오 여부** — 서버 데이터 있으면 §5.10 Scenarios 작성 (최소 3개)

---

## §5.6 비슷한 화면 발견 + 재사용 결정

기존 `chats/scenes/*.chat.md` 파일을 읽고 Structure 최상위 컴포넌트 + Form 필드 비교.

유사 판정 시 4-옵션 제시:

```
'<기존 화면>' 과 구조가 비슷해요. 어떻게 할까요?

(A) 어휘 재사용    — 기존 화면의 컴포넌트/어휘 그대로
(B) 기반 확장      — 기존 화면 기반 + 새 요소 추가
(C) 신규 패턴      — 독립적으로 작성
(D) composite 후보 — 두 화면의 공통 블록 추출 검토
```

---

## §5.7 토큰 재사용 vs 확장 결정

표준 토큰에 없는 색/반경 필요 시:

```
(A) 재사용    — 가장 가까운 기존 토큰 사용
(B) 확장      — tokens.json에 신규 토큰 추가
(C) 보류      — 일단 기존 토큰으로, decisions.md에 "나중에 검토" 기록
```

---

## §5.8 Data 레이어 작성

> §5.5 체크 6단계 — Structure에 `{{data.X}}` 바인딩이 있을 때 진입.

### 트리거

Structure 레이어에 `{{data.total_sales}}`, `{{data.recent_orders}}` 등 데이터 바인딩이 있을 때.

### 에이전트 응답

```
Structure에 데이터 바인딩이 있군요. Data 레이어를 채워볼게요.

각 데이터 필드에 대해:
  - 타입 (number, string, Object[], ...)
  - 어디서 오는지 (API 경로 또는 "로컬 상태")
  - 표시 형식 힌트 (currency, date, %, ...)

예시:
  total_sales:
    type: number
    source: GET /api/stats
    format: currency
```

### 생성 결과

chat.md의 `## 📦 Data` 섹션에 YAML fenced block 추가.

### decisions.md 기록

```markdown
## YYYY-MM-DD <SceneName> Data 레이어 결정

- **데이터 필드 수**: N개
- **API 의존**: yes/no
- **출처 스킬**: gd-chat (spec-13-03 §5.8)
```

---

## §5.9 API 레이어 작성

> §5.8에서 `source: GET /api/...` 가 나왔을 때 자동 진입.

### 트리거

Data 레이어의 하나 이상의 필드에 `source: <HTTP method> <path>` 형식이 있을 때.

### 에이전트 응답

```
API 엔드포인트를 정리해볼게요.

각 엔드포인트에 대해:
  - method + path
  - 쿼리 파라미터 (있으면)
  - response shape

예시:
  - method: GET
    path: /api/stats
    response:
      total_sales: number
      active_users: number
```

### 생성 결과

chat.md의 `## 🔌 API` 섹션에 YAML fenced block 추가.

---

## §5.10 Scenarios 레이어 작성

> §5.5 체크 7단계 — 서버 데이터 있는 화면에서 강제. **하나라도 미작성이면 계속 대화**.

### 최소 3개 시나리오 요구

```
이 화면의 MSW 시나리오를 정의해볼게요. 최소 3개가 필요합니다:

1. loaded — 데이터 정상 로드 시 표시할 mock 값
2. loading — API 응답 대기 중 (Skeleton UI)
3. error — API 오류 시 에러 메시지

추가 시나리오 (선택):
4. empty — 데이터가 비어있을 때 (신규 계정 등)
5. partial — 일부 데이터만 있을 때

loaded 시나리오의 mock 데이터부터 입력해주세요.
예: total_sales: 12450000, active_users: 234
```

### 생성 결과

chat.md의 `## 🎬 Scenarios` 섹션에 YAML fenced block 추가.

예시:

```yaml
- name: loaded
  description: "데이터 정상 로드"
  data:
    total_sales: 12450000
    active_users: 234
    recent_orders:
      - { id: 1, amount: 120000, status: completed }

- name: loading
  description: "API 응답 대기"
  state: pending

- name: error
  description: "서버 오류"
  state: error
  message: "데이터를 불러오지 못했어요."
```

### decisions.md 기록

```markdown
## YYYY-MM-DD <SceneName> Scenarios 레이어 결정

- **시나리오 수**: N개 (loaded / loading / error + ...)
- **gd extract 대상**: yes
- **출처 스킬**: gd-chat (spec-13-03 §5.10)
```

---

## §5.11 DB Hints 레이어 (선택)

> 서버 데이터가 있고 백엔드 설계가 아직 없을 때 선택적으로 제안.

### 트리거

API 레이어가 작성되고, 사용자가 "DB 스키마도 잡아두고 싶다"고 하거나, 에이전트 판단으로 도움이 될 때.

### 에이전트 응답

```
DB 스키마 초안도 잡아두시겠어요?
API response shape을 보면 다음 테이블이 필요해 보여요:

- orders(id, amount, status, user_id, created_at)
- users(id, email, last_login_at)

맞나요? 추가/수정할 컬럼이 있으면 알려주세요.
```

### 생성 결과

chat.md의 `## 🗄️ DB Hints` 섹션에 YAML fenced block 추가 (선택).

---

## §6 Narrative (의도) walkthrough

3층 중 1층:

```markdown
## 💬 Narrative

> *왜* 이 화면이 필요한가? — 사용자 관점의 의도와 가치.

- **타깃**: <누가>
- **목적**: <무엇을 달성>
- **톤**: <친근 / 전문적 / 안정감 등>
```

---

## §7 Structure (구조) walkthrough

**bare Markdown 형식** — code fence 금지.
shadcn 컴포넌트 + 토큰 클래스만 사용.

✅ 올바른 형식:

<Card>
  <CardHeader>
    <CardTitle>{{i18n.ko.dashboard.title}}</CardTitle>
  </CardHeader>
  <CardContent>
    <StatCard value={{data.total_sales}} />
  </CardContent>
</Card>

❌ 잘못된 형식 (code fence 안에 작성):

```markdown
```chat
<Card>...</Card>
```
```

**규칙**:
- 색: `bg-primary`, `text-muted-foreground` 등 토큰 클래스만
- variant: `variant="default"` 등 shadcn 표준만
- 텍스트: `{{i18n.ko.<도메인>.<키>}}` placeholder
- 데이터 바인딩: `{{data.<key>}}` (Data 레이어 키와 매칭)

---

## §7.5 Input/Form 만나면 — validation 의도 묻기

Structure에 `<Input>` 또는 `<Form>`이 있으면 반드시:

```
이 form의 validation은 어떻게 할까요?

각 필드별로:
  - required?
  - format (email/url/number 등)?
  - min/max 길이?
```

→ decisions.md에 기록. v2에서는 Scenarios의 loaded.data에 유효한 값 예시로 반영.

---

## §7.6 Button 만나면 — 버튼 의도 묻기

Structure에 `<Button>`이 있으면 반드시 (4 옵션):

```
이 버튼의 의도는?

  A) form submit       — 폼 제출
  B) page navigation   — 다른 페이지 이동
  C) external link     — 외부 URL
  D) modal/dialog open — 모달 열기
```

→ Scenarios의 submit 액션에 반영.

---

## §8 History (이력) walkthrough

```markdown
## 📜 History

- YYYY-MM-DD: 첫 작성. <한 줄 의도>
```

---

## §9 LLM 생성 안내

chat.md v2 작성 완료 후:

```
chat.md v2 작성 완료. 이제 React 코드를 만들어봅시다.

방법 1 — LLM에게 직접 요청:
  "chats/scenes/dashboard.chat.md를 보고 TSX를 만들어주세요.
   DESIGN.md + TOKEN.md의 토큰/variant 규칙을 따라주세요."

방법 2 — MSW 핸들러 스텁 자동 생성:
  gd extract chats/scenes/dashboard.chat.md
  → dashboard.msw.ts + dashboard.api-spec.md 생성

방법 3 — 시각 확인:
  pnpm dev  (생성된 TSX 브라우저에서 확인)
```

→ 사용자가 "실행해줘" 하면 LLM이 직접 TSX 생성.

---

## §10 결정 기록

주요 결정은 `.gd/memory/decisions.md`에 append:

```markdown
## YYYY-MM-DD <SceneName> 첫 작성

- **결정**: <주요 결정>
- **이유**: <이유>
- **영향**: <영향 범위>
- **출처 스킬**: gd-chat
```

---

## §11 안티 패턴 (스킬 본인 행동)

- ❌ 카탈로그 외 어휘 임의 생성 — Tier 3 승격 절차 안내
- ❌ 하드코딩 텍스트 — `{{i18n.ko.X}}` placeholder 사용
- ❌ 임의 색/spacing — Tailwind 표준/토큰 클래스
- ❌ Structure를 code fence 안에 작성 (spec-11-05 fix)
- ❌ Input/Form 만났는데 validation 안 묻기 (§7.5)
- ❌ Button 만났는데 의도 안 묻기 (§7.6)
- ❌ 유사 화면 확인 없이 바로 신규 패턴 작성 (§5.6)
- ❌ **서버 데이터 있는데 Scenarios 레이어 건너뛰기** — gd extract가 작동하지 않음
- ❌ **Data 레이어 없이 Scenarios 작성** — mock data의 키가 Structure와 불일치 발생
- ❌ `pnpm gd react` 명령 안내 — 컴파일러 폐기 예정, LLM 직접 요청으로 대체
- ❌ `version: 2` frontmatter 누락 — gd 도구 분기에 필요

---

## §12 종료 조건 (7단계 강제)

모든 항목 충족 필수 — 미충족 시 계속 대화:

- [ ] `chats/scenes/<name>.chat.md` (또는 `components/`) 파일 존재 + frontmatter(`version: 2`) + 레이어
- [ ] 카탈로그 어휘로만 Structure 작성
- [ ] §5.5 7단계 모두 확인:
  - [ ] (i) 의도 (Narrative 비어있지 않음)
  - [ ] (ii) 토큰 후보 매칭 (없는 토큰은 §5.7 결정 완료)
  - [ ] (iii) 비슷한 화면 발견 — §5.6 4-옵션 결정 완료
  - [ ] (iv) Input/Form 있으면 validation 의도 결정 (§7.5)
  - [ ] (v) Button 있으면 버튼 의도 결정 (§7.6)
  - [ ] (vi) 서버 데이터 있으면 Data 레이어 완성 (§5.8)
  - [ ] (vii) 서버 데이터 있으면 Scenarios 3개 이상 완성 (§5.10)
- [ ] (해당 시) API 레이어 완성 (§5.9)
- [ ] (해당 시) DB Hints 레이어 작성 또는 skip 결정 (§5.11)
- [ ] `.gd/memory/decisions.md` 주요 결정 append
- [ ] LLM 생성 안내 전달 (§9)

→ 서버 데이터 없는 순수 정적 화면은 (vi)(vii) skip 가능 — decisions.md에 "정적 화면, Scenarios 없음" 기록.
