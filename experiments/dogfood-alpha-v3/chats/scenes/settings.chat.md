---
type: scene
name: SettingsScene
identity: chats/scenes/settings
shell:
  inherit: true
created: 2026-05-23
---

# SettingsScene — 설정 페이지

## 💬 Narrative

> *왜* 이 신이 필요한가? — 사용자 관점의 의도와 가치.

내부 직원이 *자기 설정* 을 변경하는 페이지. 사용자 정보 / 알림 / API 키 / 권한을 *한 화면* 에서 본다.

- **타깃**: 내부 직원 (개발자 / 운영팀)
- **목적**: 자기 설정 *수정* + 저장. 외부 시선 X — minimal.
- **톤**: minimal, 정보 밀도 ↑
- **레이아웃**: 좌측 탭 (Profile / Notifications / API / Permissions) + 우측 form
- **본 예시 범위**: Profile 탭 1개만 (form 패턴 검증)

## 🧩 Structure

<Card className="w-full max-w-2xl">
  <CardHeader>
    <CardTitle>{{i18n.ko.settings.profile.title}}</CardTitle>
    <CardDescription>{{i18n.ko.settings.profile.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    <Form>
      <FormField name="displayName">
        <FormLabel>{{i18n.ko.settings.profile.display-name}}</FormLabel>
        <FormControl>
          <Input type="text" placeholder={{i18n.ko.settings.profile.display-name-ph}} />
        </FormControl>
        <FormDescription>{{i18n.ko.settings.profile.display-name-help}}</FormDescription>
      </FormField>
      <FormField name="email">
        <FormLabel>{{i18n.ko.settings.profile.email}}</FormLabel>
        <FormControl>
          <Input type="email" placeholder={{i18n.ko.settings.profile.email-ph}} />
        </FormControl>
      </FormField>
      <FormField name="role">
        <FormLabel>{{i18n.ko.settings.profile.role}}</FormLabel>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={{i18n.ko.settings.profile.role-ph}} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="developer">{{i18n.ko.settings.profile.role-developer}}</SelectItem>
            <SelectItem value="ops">{{i18n.ko.settings.profile.role-ops}}</SelectItem>
            <SelectItem value="admin">{{i18n.ko.settings.profile.role-admin}}</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField name="notifications">
        <FormLabel>{{i18n.ko.settings.profile.notifications}}</FormLabel>
        <div className="flex items-center gap-3">
          <Switch />
          <span className="text-sm text-muted-foreground">{{i18n.ko.settings.profile.notifications-help}}</span>
        </div>
      </FormField>
    </Form>
    <Separator />
    <div className="flex gap-3 justify-end">
      <Button variant="outline">{{i18n.ko.settings.profile.cancel}}</Button>
      <Button variant="default">{{i18n.ko.settings.profile.save}}</Button>
    </div>
  </CardContent>
</Card>

## 📜 History

- 2026-05-23: 첫 작성 (spec-11-07 도훈 페르소나). Profile 탭 form 5 필드 + 저장/취소. Notifications/API/Permissions 탭은 *후속*.
