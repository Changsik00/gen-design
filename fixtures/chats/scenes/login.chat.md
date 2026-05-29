# LoginScene

대표 page template — vision.md 의 LoginScene 예시.

<LoginScene>
  <BrandHeader />

  <LoginForm>
    {{i18n.ko.login.email-placeholder}}
    {{i18n.ko.login.password-placeholder}}
    <Button variant="default" size="lg">{{i18n.ko.action.login}}</Button>
  </LoginForm>

  <SocialAuthBlock />

  <ErrorMessage />
</LoginScene>
