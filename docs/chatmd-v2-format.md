# chat.md v2 — 수직 단면 스펙 포맷

> **버전**: v2 (2026-05-29, spec-13-01)
> **이전 버전**: v1 (3층 구조 — Narrative / Structure / History, gd react 컴파일 대상)

chat.md v2는 화면 하나에 대해 알아야 할 모든 것을 한 파일에 담는 **수직 단면 스펙**이다.
LLM이 이 파일과 DESIGN.md + TOKEN.md를 컨텍스트로 받아 TSX를 직접 생성한다. 별도 컴파일 단계 없음.

---

## 레이어 구조

```
chat.md v2
├── frontmatter           필수  메타데이터
├── ## 💬 Narrative       필수  화면 의도 (자유 텍스트)
├── ## 🧩 Structure       필수  UI 컴포넌트 (bare Markdown)
├── ## 📦 Data            권장  화면에 필요한 데이터 shape
├── ## 🔌 API             권장  필요한 API 엔드포인트
├── ## 🎬 Scenarios       권장  MSW 시나리오 (gd extract 소스)
├── ## 🗄️ DB Hints        선택  DB 스키마 초안 힌트
└── ## 📜 History         필수  변경 이력
```

> **필수**: 없으면 `gd lint`가 경고
> **권장**: 데이터를 다루는 화면에서는 작성 권장, 순수 정적 UI라면 생략 가능
> **선택**: 백엔드 설계 단계에서 유용할 때만 작성

---

## frontmatter

```yaml
---
type: scene | component
name: DashboardScene        # PascalCase — TSX 함수명과 동일
identity: chats/scenes/dashboard
version: 2                  # v2 포맷 명시 (gd 도구 분기용)
shell:
  inherit: true             # _shell.chat.md 전역 외각 포함 여부
created: YYYY-MM-DD
---
```

---

## 레이어 상세

### 💬 Narrative (필수)

화면의 **의도**. 누가, 왜, 무엇을 달성하기 위해 이 화면을 보는가.

```markdown
## 💬 Narrative

> *왜* 이 화면이 필요한가? — 사용자 관점의 의도와 가치.

관리자가 오늘의 매출 현황과 최근 주문을 한눈에 파악하는 화면이다.

- **타깃**: 관리자 (일 1회 이상 접속)
- **목적**: 매출 추세 파악 + 이상 주문 조기 발견
- **톤**: 간결, 데이터 중심
```

---

### 🧩 Structure (필수)

UI 컴포넌트 명세. **bare Markdown** 형식 — code fence 금지.
shadcn 컴포넌트 + 토큰 클래스만 사용. 임의 색/spacing 직접 작성 금지.

```markdown
## 🧩 Structure

<div className="space-y-6">
  <div className="grid grid-cols-2 gap-4">
    <StatCard title={{i18n.ko.dashboard.stats.total-sales}} value="{{data.total_sales}}" />
    <StatCard title={{i18n.ko.dashboard.stats.active-users}} value="{{data.active_users}}" />
  </div>
  <Card>
    <CardHeader>
      <CardTitle>{{i18n.ko.dashboard.orders.title}}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table data={{data.recent_orders}} />
    </CardContent>
  </Card>
</div>
```

**규칙**:
- 색: `bg-primary`, `text-muted-foreground` 등 **토큰 클래스만** (`bg-blue-500` 직접 금지)
- variant: `variant="default"` 등 **shadcn 표준 variant만** (임의 variant 금지)
- 텍스트: `{{i18n.ko.<도메인>.<키>}}` placeholder (하드코딩 금지)
- 데이터 바인딩: `{{data.<key>}}` (Scenarios의 loaded.data 키와 매칭)

---

### 📦 Data (권장)

화면에 보여야 하는 **데이터 shape**. 출처(API 경로)와 타입, 표시 형식 힌트 포함.

````markdown
## 📦 Data

```yaml
total_sales:
  type: number
  source: GET /api/stats      # API 레이어의 엔드포인트와 매칭
  label: "총 매출"
  format: currency             # LLM 힌트: $12,450 형태로 렌더링
active_users:
  type: number
  source: GET /api/stats
  label: "활성 사용자"
recent_orders:
  type: "Order[]"
  source: GET /api/orders?limit=10
  label: "최근 주문"
```
````

---

### 🔌 API (권장)

화면이 필요로 하는 **API 엔드포인트 목록**. `gd extract`가 API spec 문서를 생성하는 소스.

````markdown
## 🔌 API

```yaml
- method: GET
  path: /api/stats
  description: "대시보드 통계 요약"
  response:
    total_sales: number
    active_users: number

- method: GET
  path: /api/orders
  description: "최근 주문 목록"
  params:
    limit: number
  response:
    items: "Order[]"
    total: number
```
````

---

### 🎬 Scenarios (권장)

**MSW 핸들러 생성 소스**. `gd extract`가 이 섹션을 파싱하여 `.msw.ts` 파일을 생성한다.
최소 3개 시나리오 권장: `loaded` / `loading` / `error`.

````markdown
## 🎬 Scenarios

```yaml
- name: loaded
  description: "데이터 정상 로드"
  data:
    total_sales: 12450
    active_users: 234
    recent_orders:
      - { id: 1, amount: 120000, status: completed, created_at: "2026-05-29" }
      - { id: 2, amount: 85000, status: pending, created_at: "2026-05-28" }

- name: loading
  description: "API 응답 대기 중"
  state: pending

- name: error
  description: "API 오류 (서버 장애)"
  state: error
  message: "통계를 불러오지 못했어요. 잠시 후 다시 시도해주세요."

- name: empty
  description: "주문 없음 (신규 계정)"
  data:
    total_sales: 0
    active_users: 0
    recent_orders: []
```
````

**Scenario 스키마**:

| 필드 | 타입 | 필수 | 설명 |
|---|---|:---:|---|
| `name` | string | ✓ | 시나리오 식별자 (snake_case) |
| `description` | string | | 사람용 설명 |
| `state` | `pending` \| `error` | | 생략 시 loaded 상태로 간주 |
| `data` | object | | loaded/empty 시 mock data |
| `message` | string | | error 시 에러 메시지 |

---

### 🗄️ DB Hints (선택)

DB 스키마 초안을 위한 **힌트**. 공식 스키마 정의가 아님 — 아이디어 수준.

````markdown
## 🗄️ DB Hints

```yaml
- table: orders
  columns:
    - { name: id, type: "int PK" }
    - { name: amount, type: "int", note: "원 단위" }
    - { name: status, type: "enum(pending, completed, cancelled)" }
    - { name: user_id, type: "int FK → users.id" }
    - { name: created_at, type: timestamp }

- table: users
  columns:
    - { name: id, type: "int PK" }
    - { name: email, type: varchar }
    - { name: last_login_at, type: timestamp }
```
````

---

### 📜 History (필수)

변경 이력. 최신이 위 (역시간순).

```markdown
## 📜 History

- 2026-05-29: v2 포맷으로 첫 작성. 대시보드 초기 구조.
```

---

## 토큰-variant 컨텍스트 주입 전략

LLM이 TSX를 생성할 때 반드시 지켜야 할 규칙. **AGENT.md 또는 gd-start 스킬에 주입**.

```
[LLM에게 주입하는 규칙]

1. 색은 반드시 TOKEN.md의 토큰 이름 클래스로만 사용
   ✓ bg-primary, text-muted-foreground, border-input
   ✗ bg-blue-500, text-gray-400, #4F46E5

2. shadcn 컴포넌트는 반드시 표준 variant를 사용
   ✓ <Button variant="default">, <Button variant="destructive">
   ✗ <Button className="bg-indigo-600">, 임의 variant 이름

3. variant가 token에 매핑되는 방식 (shadcn cva 표준)
   variant="default" → bg-primary text-primary-foreground
   variant="destructive" → bg-destructive text-destructive-foreground
   variant="outline" → border border-input bg-background

4. 새로운 컴포넌트가 필요하면 shadcn 조합으로 구성
   임의 컴포넌트 이름 생성 금지
```

이 규칙이 주입되면 LLM은 어느 화면을 만들든 프로젝트의 토큰 체계를 일관되게 사용한다.

---

## v1 → v2 마이그레이션 방향

기존 v1 chat.md는 즉시 변환 불필요. 다음 기준으로 점진 교체:

1. **새로 작성하는 chat.md는 모두 v2** (frontmatter `version: 2` 명시)
2. **기존 v1은 수정 시 v2로 업그레이드** (Data / API / Scenarios 추가)
3. **gd react 명령 제거(spec-13-06) 이후** v1은 LLM 컨텍스트로만 사용 가능 (컴파일 불가)

일괄 자동 변환 도구는 scope-out (spec-13-01).
