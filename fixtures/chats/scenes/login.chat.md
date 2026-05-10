# LoginPage

대표 page template — vision.md 의 LoginPage 예시.

<LoginPage>
  <BrandHeader />

  <LoginForm>
    {{i18n.ko.login.email-placeholder}}
    {{i18n.ko.login.password-placeholder}}
    <Button variant="default" size="lg">{{i18n.ko.action.login}}</Button>
  </LoginForm>

  <SocialAuthBlock />

  <ErrorMessage />
</LoginPage>
