import { http, HttpResponse, delay } from 'msw'

// Generated from chat.md v2 Scenarios layer
// Run 'gen-design extract' to regenerate
export const dashboardHandlers = {
  loaded: [
    http.get('/api/stats', () => HttpResponse.json({
      "total_sales": "number",
      "active_users": "number"
    })),
    http.get('/api/orders', () => HttpResponse.json({
      "items": "Order[]",
      "total": "number"
    })),
  ],
  loading: [
    http.get('/api/stats', async () => {
      await delay('infinite')
      return HttpResponse.json({})
    }),
    http.get('/api/orders', async () => {
      await delay('infinite')
      return HttpResponse.json({})
    }),
  ],
  error: [
    http.get('/api/stats', () => new HttpResponse(
      JSON.stringify({ message: "통계를 불러오지 못했어요. 잠시 후 다시 시도해주세요." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )),
    http.get('/api/orders', () => new HttpResponse(
      JSON.stringify({ message: "통계를 불러오지 못했어요. 잠시 후 다시 시도해주세요." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )),
  ],
  empty: [
    http.get('/api/stats', () => HttpResponse.json({
      "total_sales": "number",
      "active_users": "number"
    })),
    http.get('/api/orders', () => HttpResponse.json({
      "items": "Order[]",
      "total": "number"
    })),
  ]
}
