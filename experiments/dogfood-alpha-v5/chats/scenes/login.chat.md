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

taskboard-v5 의 *진입 화면*. 팀 멤버가 매일 아침 *이메일 + 비밀번호* 로 빠르게 로그인. 회원가입은 별도 페이지 link.

목표: *3 초 안에* 입력 가능. 시각적 부담 X.

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
      <Button type="submit" className="w-full">{{i18n.ko.login.submit}}</Button>
      <Button variant="link" className="w-full">{{i18n.ko.login.signup-link}}</Button>
    </Form>
  </CardContent>
</Card>

## 📜 History

- 2026-05-23 v5 신 1: 강화된 §5.5 (5 단계 확인) + §7.5 validation (email required + format, password required + min 8) + §7.6 버튼 의도 (로그인 = A submit, 회원가입 = B nav)
