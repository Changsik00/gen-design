---
type: scene
name: SettingsScene
identity: chats/scenes/settings
shell:
  inherit: true
created: 2026-05-23
---

# 계정 설정 화면

## 💬 Narrative

taskboard-v5 의 *계정 설정* 페이지. 비밀번호 변경 + 알림 수신 토글. 사용자가 직접 접근 (마이페이지 → 설정 탭 아님 — 독립 라우트).

- **타깃**: 기존 로그인 사용자
- **목적**: 보안 정보 변경 + 알림 설정
- **결정**: login 씬 기반 (Card + Form 어휘) *확장* — 현재 비밀번호 + 새 비밀번호 + Switch 추가 (§5.6 결정: B)

## 🧩 Structure

<Card className="w-full max-w-sm mx-auto">
  <CardHeader>
    <CardTitle>{{i18n.ko.settings.title}}</CardTitle>
    <CardDescription>{{i18n.ko.settings.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent>
    <Form className="space-y-6">
      <div className="space-y-4">
        <CardTitle className="text-sm">{{i18n.ko.settings.password.section}}</CardTitle>
        <FormField>
          <FormLabel>{{i18n.ko.settings.password.current}}</FormLabel>
          <FormControl>
            <Input type="password" placeholder="{{i18n.ko.settings.password.current-placeholder}}" />
          </FormControl>
        </FormField>
        <FormField>
          <FormLabel>{{i18n.ko.settings.password.new}}</FormLabel>
          <FormControl>
            <Input type="password" placeholder="{{i18n.ko.settings.password.new-placeholder}}" />
          </FormControl>
        </FormField>
        <FormField>
          <FormLabel>{{i18n.ko.settings.password.confirm}}</FormLabel>
          <FormControl>
            <Input type="password" placeholder="{{i18n.ko.settings.password.confirm-placeholder}}" />
          </FormControl>
        </FormField>
        <Button type="submit">{{i18n.ko.settings.password.submit}}</Button>
      </div>
      <Separator />
      <div className="space-y-4">
        <CardTitle className="text-sm">{{i18n.ko.settings.notifications.section}}</CardTitle>
        <div className="flex items-center justify-between">
          <FormLabel>{{i18n.ko.settings.notifications.email}}</FormLabel>
          <Switch />
        </div>
      </div>
    </Form>
  </CardContent>
</Card>

## 📝 History

- 2026-05-23: 첫 작성 — §5.6 login 씬 유사 발견 → (B) 기반 확장 결정. §5.7 green 토큰 없음 → 보류 (decisions.md 기록).
