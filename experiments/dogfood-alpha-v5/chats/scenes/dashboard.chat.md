---
type: scene
name: DashboardScene
identity: chats/scenes/dashboard
shell:
  inherit: true
created: 2026-05-23
---

# 대시보드 화면

## 💬 Narrative

taskboard 의 *홈*. 작업 통계 (총/진행/완료) + 최근 활동. Card 3 회 반복 → Tier 3 `StatCard` composite 승격 *후보*.

## 🧩 Structure

<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader>
        <CardDescription>{{i18n.ko.dashboard.stats.total.label}}</CardDescription>
        <CardTitle>{{i18n.ko.dashboard.stats.total.value}}</CardTitle>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardDescription>{{i18n.ko.dashboard.stats.inprogress.label}}</CardDescription>
        <CardTitle>{{i18n.ko.dashboard.stats.inprogress.value}}</CardTitle>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardDescription>{{i18n.ko.dashboard.stats.done.label}}</CardDescription>
        <CardTitle>{{i18n.ko.dashboard.stats.done.value}}</CardTitle>
      </CardHeader>
    </Card>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>{{i18n.ko.dashboard.recent.title}}</CardTitle>
    </CardHeader>
    <CardContent>
      <Button variant="link" className="w-full">{{i18n.ko.dashboard.recent.viewall}}</Button>
    </CardContent>
  </Card>
</div>

## 📜 History

- 2026-05-23 v5 신 3: StatCard 3 회 룰 후보 등록 + 버튼 의도 B (page navigation → /activity). Form 없으므로 validation skip
