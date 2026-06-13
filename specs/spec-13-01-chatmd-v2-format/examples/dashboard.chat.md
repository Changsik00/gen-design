---
type: scene
name: DashboardScene
identity: chats/scenes/dashboard
version: 2
shell:
  inherit: true
created: 2026-05-29
---

## 💬 Narrative

> 관리자가 오늘의 비즈니스 현황을 한눈에 파악하는 화면이다.

매일 첫 접속 시 오늘의 매출, 활성 사용자 수, 최근 주문 목록을 확인한다. 이상 주문(취소·반환)을 조기에 발견하고, 빠르게 상세 페이지로 이동할 수 있어야 한다.

- **타깃**: 서비스 운영 관리자 (일 1회 이상 접속)
- **목적**: 매출 추세 파악 + 이상 주문 조기 발견
- **톤**: 간결, 데이터 중심, 불필요한 장식 없음

## 🧩 Structure

<div className="space-y-6 p-6">
  <div className="grid grid-cols-2 gap-4">
    <StatCard
      title={{i18n.ko.dashboard.stats.total-sales}}
      value={{data.total_sales}}
      format="currency"
    />
    <StatCard
      title={{i18n.ko.dashboard.stats.active-users}}
      value={{data.active_users}}
    />
  </div>

  <Card>
    <CardHeader>
      <CardTitle>{{i18n.ko.dashboard.orders.title}}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{i18n.ko.dashboard.orders.col-id}}</TableHead>
            <TableHead>{{i18n.ko.dashboard.orders.col-amount}}</TableHead>
            <TableHead>{{i18n.ko.dashboard.orders.col-status}}</TableHead>
            <TableHead>{{i18n.ko.dashboard.orders.col-date}}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data={{data.recent_orders}} />
      </Table>
    </CardContent>
  </Card>
</div>

## 📦 Data

```yaml
total_sales:
  type: number
  source: GET /api/stats
  label: "총 매출"
  format: currency        # 렌더 힌트: ₩12,450 형태

active_users:
  type: number
  source: GET /api/stats
  label: "활성 사용자"

recent_orders:
  type: "Order[]"
  source: GET /api/orders?limit=10
  label: "최근 주문"
  schema:
    id: number
    amount: number
    status: "pending | completed | cancelled"
    created_at: string    # ISO 8601
```

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
    limit:
      type: number
      default: 10
  response:
    items: "Order[]"
    total: number
```

## ⚡ Actions

```yaml
queries:
  stats:
    source: GET /api/stats
    staleTime: 30000
  orders.recent:
    source: GET /api/orders?limit=10

navigation:
  - { trigger: "row[order] click", to: /orders/:id }
```

## 🎬 Scenarios

```yaml
- name: loaded
  description: "데이터 정상 로드"
  data:
    total_sales: 12450000
    active_users: 234
    recent_orders:
      - { id: 1001, amount: 120000, status: completed, created_at: "2026-05-29T10:00:00Z" }
      - { id: 1002, amount: 85000, status: pending, created_at: "2026-05-29T09:30:00Z" }
      - { id: 1003, amount: 210000, status: completed, created_at: "2026-05-29T08:15:00Z" }

- name: loading
  description: "API 응답 대기 중 — Skeleton UI 표시"
  state: pending

- name: error
  description: "서버 장애로 통계 불러오기 실패"
  state: error
  message: "통계를 불러오지 못했어요. 잠시 후 다시 시도해주세요."

- name: empty
  description: "신규 계정 — 아직 데이터 없음"
  data:
    total_sales: 0
    active_users: 0
    recent_orders: []
```

## 🗄️ DB Hints

```yaml
- table: orders
  columns:
    - { name: id, type: "BIGINT PK AUTO_INCREMENT" }
    - { name: amount, type: "INT NOT NULL", note: "원 단위" }
    - { name: status, type: "ENUM('pending','completed','cancelled')" }
    - { name: user_id, type: "BIGINT FK → users.id" }
    - { name: created_at, type: "TIMESTAMP DEFAULT NOW()" }

- table: users
  columns:
    - { name: id, type: "BIGINT PK AUTO_INCREMENT" }
    - { name: email, type: "VARCHAR(255) UNIQUE NOT NULL" }
    - { name: last_login_at, type: "TIMESTAMP" }
```

## 📜 History

- 2026-05-29: v2 포맷 예시 파일로 최초 작성. spec-13-01 레퍼런스 파일.
