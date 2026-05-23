---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
created: 2026-05-23
---

# 로그인 화면

## 💬 Narrative

taskboard 의 *진입* 화면. 팀원이 매일 처음 만나는 곳.

목표: *3 초 안에* 이메일/비밀번호 입력 가능. 시각적 부담 X.

## 🧩 Structure

<Card className="w-full max-w-sm mx-auto">
  <CardHeader>
    <CardTitle>{{i18n.ko.login.title}}</CardTitle>
    <CardDescription>{{i18n.ko.login.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent>
    <Form className="space-y-4">
      <FormField>
        <FormLabel>{{i18n.ko.login.email.label}}</FormLabel>
        <FormControl>
          <Input type="email" placeholder="{{i18n.ko.login.email.placeholder}}" />
        </FormControl>
      </FormField>
      <FormField>
        <FormLabel>{{i18n.ko.login.password.label}}</FormLabel>
        <FormControl>
          <Input type="password" placeholder="{{i18n.ko.login.password.placeholder}}" />
        </FormControl>
      </FormField>
      <Button className="w-full">{{i18n.ko.login.submit}}</Button>
    </Form>
  </CardContent>
</Card>

## 📜 History

- 2026-05-23 이지 신 1: 표준 *form pattern* (Card + Form + FormField x 2 + Button) 첫 등장
