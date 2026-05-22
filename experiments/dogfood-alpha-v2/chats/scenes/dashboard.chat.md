---
type: scene
name: DashboardScene
identity: chats/scenes/dashboard
shell:
  inherit: true
created: 2026-05-23
---

# DashboardScene — 대시보드

## 💬 Narrative

> *왜* 이 신이 필요한가? — 사용자 관점의 의도와 가치.

사용자가 로그인 후 *첫 번째로* 보는 화면입니다. 자기 SaaS 의 *상태* 를 한눈에 파악하고, *최근 활동* 을 확인할 수 있어야 합니다.

- **타깃**: TaskFlow 를 사용 중인 스타트업 초기 개발자 (로그인 후)
- **목적**: 통계 + 최근 활동을 *3초 안에* 파악
- **톤**: formal-friendly — 신뢰감 우선. 데이터가 *명확히* 보이게.
- **레이아웃**: 페이지 상단 4개 통계 카드 (Total Users / Active / Revenue / Conversion) + 그 아래 최근 활동 리스트

## 🧩 Structure

<Card className="w-full">
  <CardHeader>
    <CardTitle>{{i18n.ko.dashboard.title}}</CardTitle>
    <CardDescription>{{i18n.ko.dashboard.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{{i18n.ko.dashboard.stats.total-users}}</p>
        <p className="mt-2 text-3xl font-bold">12,847</p>
        <p className="mt-1 text-xs text-muted-foreground">+12.5% {{i18n.ko.dashboard.stats.from-last-month}}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{{i18n.ko.dashboard.stats.active}}</p>
        <p className="mt-2 text-3xl font-bold">3,251</p>
        <p className="mt-1 text-xs text-muted-foreground">+8.2% {{i18n.ko.dashboard.stats.from-last-month}}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{{i18n.ko.dashboard.stats.revenue}}</p>
        <p className="mt-2 text-3xl font-bold">$48,392</p>
        <p className="mt-1 text-xs text-muted-foreground">+15.3% {{i18n.ko.dashboard.stats.from-last-month}}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{{i18n.ko.dashboard.stats.conversion}}</p>
        <p className="mt-2 text-3xl font-bold">3.8%</p>
        <p className="mt-1 text-xs text-muted-foreground">-0.4% {{i18n.ko.dashboard.stats.from-last-month}}</p>
      </CardContent>
    </Card>
  </CardContent>
  <Separator />
  <CardContent className="space-y-4">
    <h3 className="text-lg font-semibold">{{i18n.ko.dashboard.recent.title}}</h3>
    <div className="space-y-2">
      <div className="flex items-center justify-between border border-border rounded-md p-3">
        <span className="text-sm">{{i18n.ko.dashboard.recent.item-1}}</span>
        <span className="text-xs text-muted-foreground">2 {{i18n.ko.dashboard.recent.minutes-ago}}</span>
      </div>
      <div className="flex items-center justify-between border border-border rounded-md p-3">
        <span className="text-sm">{{i18n.ko.dashboard.recent.item-2}}</span>
        <span className="text-xs text-muted-foreground">15 {{i18n.ko.dashboard.recent.minutes-ago}}</span>
      </div>
      <div className="flex items-center justify-between border border-border rounded-md p-3">
        <span className="text-sm">{{i18n.ko.dashboard.recent.item-3}}</span>
        <span className="text-xs text-muted-foreground">1 {{i18n.ko.dashboard.recent.hour-ago}}</span>
      </div>
    </div>
    <Button variant="link" className="w-full">{{i18n.ko.dashboard.recent.view-all}}</Button>
  </CardContent>
</Card>

## 📜 History

- 2026-05-23: 첫 작성 (spec-11-06 미경 페르소나 simulation). 4개 통계 카드 + 최근 활동 3건 + 전체 보기 링크. 활동 *세부 아이콘* 은 후속.

---

> 💡 컴파일: `pnpm gd react chats/scenes/dashboard.chat.md`
> 💡 정합 검증: `pnpm gd doctor`
