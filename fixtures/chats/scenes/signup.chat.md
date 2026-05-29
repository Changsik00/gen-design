# SignupScene

회원가입 페이지 — LoginScene 와 대칭.

<SignupScene>
  <BrandHeader />

  <SignupForm>
    {{i18n.ko.signup.name-placeholder}}
    {{i18n.ko.signup.email-placeholder}}
    {{i18n.ko.signup.password-placeholder}}
    <Button variant="default" size="lg">{{i18n.ko.action.signup}}</Button>
  </SignupForm>

  <SocialAuthBlock />
</SignupScene>
