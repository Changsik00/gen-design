---
type: scene
name: LoginScene
identity: chats/scenes/login
shell:
  inherit: true
created: 2026-05-22
---

# LoginScene — 로그인 신

## 💬 Narrative

> *왜* 이 신이 필요한가? — 사용자 관점의 의도와 가치.

이 신은 *재방문 사용자* 가 *즉시* SaaS 서비스에 진입할 수 있게 한다.

- **타깃**: 백엔드 개발자 (이미 가입 완료, 이제 로그인)
- **목적**: 이메일/비밀번호 또는 소셜 로그인으로 *3초 안에* 대시보드 도달
- **톤**: formal-friendly — 깔끔한 카드 + 명확한 라벨 + 강한 CTA
- **신뢰감**: 보안 / 인증 컨텍스트 — 시각적 안정감 우선 (애니메이션 ↓)
- **첫 진입**: 비밀번호 찾기 / 회원가입 링크 *옵션* 노출

## 🧩 Structure

```chat
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>{{i18n.ko.auth.login.title}}</CardTitle>
    <CardDescription>{{i18n.ko.auth.login.subtitle}}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Field name="email">
      <Label>{{i18n.ko.auth.login.email-label}}</Label>
      <Input type="email" placeholder={{i18n.ko.auth.login.email-placeholder}} />
    </Field>
    <Field name="password">
      <Label>{{i18n.ko.auth.login.password-label}}</Label>
      <Input type="password" />
    </Field>
    <Button type="submit" variant="default" className="w-full">
      {{i18n.ko.auth.login.submit}}
    </Button>
    <Separator />
    <Button variant="link" className="w-full">
      {{i18n.ko.auth.login.forgot-password}}
    </Button>
  </CardContent>
</Card>
```

## 📜 History

- 2026-05-22: 첫 작성 (dogfooding alpha simulation). 이메일/비밀번호 + 비밀번호 찾기. 소셜 로그인은 *후속* (MVP scope 제외).

---

> 💡 컴파일: `pnpm gd react chats/scenes/login.chat.md`
> 💡 정합 검증: `pnpm gd doctor`
