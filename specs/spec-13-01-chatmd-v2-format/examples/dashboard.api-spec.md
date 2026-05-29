# API Spec: dashboard

> Generated from `chats/scenes/dashboard.chat.md` — do not edit manually.
> Run `gen-design extract` to regenerate.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stats` | 대시보드 통계 요약 |
| `GET` | `/api/orders` | 최근 주문 목록 |

### GET /api/stats

대시보드 통계 요약

**Response:**

```json
{
  "total_sales": "number",
  "active_users": "number"
}
```

### GET /api/orders

최근 주문 목록

**Params:**

- `limit`: number

**Response:**

```json
{
  "items": "Order[]",
  "total": "number"
}
```
