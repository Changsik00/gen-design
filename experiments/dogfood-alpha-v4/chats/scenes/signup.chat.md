---
type: scene
name: SignupScene
identity: chats/scenes/signup
shell:
  inherit: true
created: 2026-05-23
---

# 회원가입 화면

## 💬 Narrative

신규 사용자가 *3 단계 이내* 가입 완료. 신 1 (로그인) 의 표준 form pattern 을 *재사용* — 이지의 첫 *Tier 발견* 순간.

## 🧩 Structure

<Card className="w-full max-w-sm mx-auto">
  <CardHeader>
    <CardTitle>{{i18n.ko.signup.title}}</CardTitle>
    <CardDescription>{{i18n.ko.signup.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent>
    <Form className="space-y-4">
      <FormField>
        <FormLabel>{{i18n.ko.signup.name.label}}</FormLabel>
        <FormControl>
          <Input type="text" placeholder="{{i18n.ko.signup.name.placeholder}}" />
        </FormControl>
      </FormField>
      <FormField>
        <FormLabel>{{i18n.ko.signup.email.label}}</FormLabel>
        <FormControl>
          <Input type="email" placeholder="{{i18n.ko.signup.email.placeholder}}" />
        </FormControl>
      </FormField>
      <FormField>
        <FormLabel>{{i18n.ko.signup.password.label}}</FormLabel>
        <FormControl>
          <Input type="password" placeholder="{{i18n.ko.signup.password.placeholder}}" />
        </FormControl>
      </FormField>
      <FormField>
        <FormControl>
          <Checkbox />
        </FormControl>
        <FormLabel>{{i18n.ko.signup.terms.label}}</FormLabel>
      </FormField>
      <Button className="w-full">{{i18n.ko.signup.submit}}</Button>
    </Form>
  </CardContent>
</Card>

## 📜 History

- 2026-05-23 이지 신 2: 신 1 form pattern 재사용 (Card + Form + FormField + Input + Button) + Checkbox 신규 어휘
