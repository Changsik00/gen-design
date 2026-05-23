---
type: scene
name: MypageScene
identity: chats/scenes/mypage
shell:
  inherit: true
created: 2026-05-23
---

# 마이페이지 화면

## 💬 Narrative

본인 프로필 + 내 작업 통계 + 알림 설정. Tabs 로 *통계 / 설정* 분리. 신 1/2 form + 신 3 stat card 모두 *재사용* (다중 신 재사용).

## 🧩 Structure

<div className="max-w-2xl mx-auto space-y-6">
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar />
      <div>
        <CardTitle>{{i18n.ko.mypage.profile.name}}</CardTitle>
        <CardDescription>{{i18n.ko.mypage.profile.email}}</CardDescription>
      </div>
    </CardHeader>
  </Card>
  <Tabs defaultValue="stats">
    <TabsList>
      <TabsTrigger value="stats">{{i18n.ko.mypage.tabs.stats}}</TabsTrigger>
      <TabsTrigger value="settings">{{i18n.ko.mypage.tabs.settings}}</TabsTrigger>
    </TabsList>
    <TabsContent value="stats">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>{{i18n.ko.mypage.stats.mine.label}}</CardDescription>
            <CardTitle>{{i18n.ko.mypage.stats.mine.value}}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{{i18n.ko.mypage.stats.done.label}}</CardDescription>
            <CardTitle>{{i18n.ko.mypage.stats.done.value}}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{{i18n.ko.mypage.stats.weekly.label}}</CardDescription>
            <CardTitle>{{i18n.ko.mypage.stats.weekly.value}}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </TabsContent>
    <TabsContent value="settings">
      <Card>
        <CardContent>
          <Form className="space-y-4">
            <FormField>
              <FormLabel>{{i18n.ko.mypage.settings.nickname.label}}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="{{i18n.ko.mypage.settings.nickname.placeholder}}" />
              </FormControl>
            </FormField>
            <FormField>
              <FormControl>
                <Switch />
              </FormControl>
              <FormLabel>{{i18n.ko.mypage.settings.notify.label}}</FormLabel>
            </FormField>
            <Button type="submit" className="w-full">{{i18n.ko.mypage.settings.save}}</Button>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

## 📜 History

- 2026-05-23 v5 신 4: 다중 신 재사용 (신 1/2 form + 신 3 stat card) + Tabs/Avatar/Switch 신규. StatCard 4 회 등장 → Tier 3 승격 확정. validation (닉네임 min 2) + 버튼 의도 A submit
