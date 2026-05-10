/**
 * AUTO-GENERATED — do not edit.
 * Source: fixtures/chats/{scenes,components}/*.chat.md
 * Generator: studio/scripts/generate-fixtures-index.ts
 *
 * 본 파일을 갱신하려면: pnpm --filter studio fixtures:gen
 */

export interface FixtureEntry {
  name: string;
  text: string;
}

export const FIXTURES: FixtureEntry[] = [
  { name: "dashboard", text: "# DashboardPage\n\n대시보드 메인 페이지 — Sidebar + Header + 본문 카드.\n\n<DashboardPage>\n  <Sidebar />\n\n  <DashboardHeader />\n\n  <ActivitySummary />\n\n  <StatCard />\n  <StatCard />\n  <StatCard />\n\n  <ActivityTable />\n</DashboardPage>\n" },
  { name: "error", text: "# ErrorPage\n\n404 / 5xx 같은 에러 페이지.\n\n<ErrorPage>\n  <ErrorIcon />\n  <ErrorMessage>{{i18n.ko.error.not-found}}</ErrorMessage>\n  <HomeButton />\n</ErrorPage>\n" },
  { name: "login", text: "# LoginPage\n\n대표 page template — vision.md 의 LoginPage 예시.\n\n<LoginPage>\n  <BrandHeader />\n\n  <LoginForm>\n    {{i18n.ko.login.email-placeholder}}\n    {{i18n.ko.login.password-placeholder}}\n    <Button variant=\"default\" size=\"lg\">{{i18n.ko.action.login}}</Button>\n  </LoginForm>\n\n  <SocialAuthBlock />\n\n  <ErrorMessage />\n</LoginPage>\n" },
  { name: "my", text: "# MyPage\n\n내 정보 페이지 — Profile + Activity.\n\n<MyPage>\n  <ProfileHeader />\n\n  <ProfileInfoCard>\n    <AvatarUpload />\n    {{i18n.ko.my-page.bio-placeholder}}\n  </ProfileInfoCard>\n\n  <ActivitySummary />\n</MyPage>\n" },
  { name: "settings", text: "# SettingsPage\n\n설정 페이지 — Group + 각 row type 시연.\n\n<SettingsPage>\n  <SettingsHeader />\n\n  <SettingsGroup>\n    <SettingsToggleRow />\n    <SettingsToggleRow />\n    <SettingsSelectRow />\n    <SettingsSliderRow />\n  </SettingsGroup>\n\n  <SettingsGroup>\n    <SettingsToggleRow />\n    <HomeButton />\n  </SettingsGroup>\n</SettingsPage>\n" },
  { name: "signup", text: "# SignupPage\n\n회원가입 페이지 — LoginPage 와 대칭.\n\n<SignupPage>\n  <BrandHeader />\n\n  <SignupForm>\n    {{i18n.ko.signup.name-placeholder}}\n    {{i18n.ko.signup.email-placeholder}}\n    {{i18n.ko.signup.password-placeholder}}\n    <Button variant=\"default\" size=\"lg\">{{i18n.ko.action.signup}}</Button>\n  </SignupForm>\n\n  <SocialAuthBlock />\n</SignupPage>\n" },
  { name: "activity-summary", text: "# ActivitySummary\n\n최근 활동 요약 카드.\n\n<ActivitySummary />\n" },
  { name: "activity-table", text: "# ActivityTable\n\n활동 내역 테이블 — ARIA role: table.\n\n<ActivityTable />\n" },
  { name: "avatar-upload", text: "# AvatarUpload\n\n프로필 이미지 업로드 영역.\n\n<AvatarUpload />\n" },
  { name: "brand-header", text: "# BrandHeader\n\n로그인 / 회원가입 페이지 상단 브랜드 헤더 — ARIA role: banner.\n\n<BrandHeader />\n" },
  { name: "button", text: "# Button\n\nshadcn Button primitive — Tier 2 어휘.\n\n## 대표 variant\n\n<Button variant=\"default\" size=\"default\" />\n\n## 다른 variants\n\n<Button variant=\"outline\" size=\"sm\" />\n<Button variant=\"destructive\" size=\"lg\" />\n<Button variant=\"ghost\" size=\"icon\" />\n\n## i18n placeholder 자식\n\n<Button variant=\"default\">{{i18n.ko.action.confirm}}</Button>\n\n## L4 인라인 토큰 override\n\n<Button variant=\"default\" tokens={{ \"--primary\": \"{{token.semantic.brand-2}}\" }}>\n  {{i18n.ko.action.submit}}\n</Button>\n" },
  { name: "dashboard-header", text: "# DashboardHeader\n\n대시보드 상단 헤더 — ARIA role: banner.\n\n<DashboardHeader />\n" },
  { name: "error-icon", text: "# ErrorIcon\n\n에러 페이지의 시각 아이콘 — ARIA role: img.\n\n<ErrorIcon />\n" },
  { name: "error-message", text: "# ErrorMessage\n\n폼 / 페이지의 에러 메시지 — ARIA role: status.\n\n<ErrorMessage>{{i18n.ko.error.generic}}</ErrorMessage>\n" },
  { name: "home-button", text: "# HomeButton\n\n에러 페이지에서 홈으로 돌아가는 버튼 — ARIA role: button.\n\n<HomeButton />\n" },
  { name: "login-form", text: "# LoginForm\n\n로그인 입력 폼 — ARIA role: form.\n\n<LoginForm>\n  {{i18n.ko.login.email-placeholder}}\n  {{i18n.ko.login.password-placeholder}}\n  <Button variant=\"default\">{{i18n.ko.action.login}}</Button>\n</LoginForm>\n" },
  { name: "profile-header", text: "# ProfileHeader\n\n프로필 페이지 상단 헤더 — ARIA role: banner.\n\n<ProfileHeader />\n" },
  { name: "profile-info-card", text: "# ProfileInfoCard\n\n프로필 정보 카드 — ARIA role: group.\n\n<ProfileInfoCard>\n  <AvatarUpload />\n  {{i18n.ko.profile.bio}}\n</ProfileInfoCard>\n" },
  { name: "settings-group", text: "# SettingsGroup\n\n설정 화면의 row 그룹.\n\n<SettingsGroup>\n  <SettingsToggleRow />\n  <SettingsSelectRow />\n  <SettingsSliderRow />\n</SettingsGroup>\n" },
  { name: "settings-header", text: "# SettingsHeader\n\n설정 페이지 상단 헤더 — ARIA role: banner.\n\n<SettingsHeader />\n" },
  { name: "settings-select-row", text: "# SettingsSelectRow\n\n설정의 선택 row.\n\n<SettingsSelectRow />\n" },
  { name: "settings-slider-row", text: "# SettingsSliderRow\n\n설정의 슬라이더 row.\n\n<SettingsSliderRow />\n" },
  { name: "settings-toggle-row", text: "# SettingsToggleRow\n\n설정의 ON/OFF 토글 row.\n\n<SettingsToggleRow />\n" },
  { name: "sidebar", text: "# Sidebar\n\n대시보드 좌측 사이드바 — ARIA role: navigation.\n\n<Sidebar />\n" },
  { name: "signup-form", text: "# SignupForm\n\n회원가입 입력 폼 — ARIA role: form.\n\n<SignupForm>\n  {{i18n.ko.signup.name-placeholder}}\n  {{i18n.ko.signup.email-placeholder}}\n  {{i18n.ko.signup.password-placeholder}}\n  <Button variant=\"default\">{{i18n.ko.action.signup}}</Button>\n</SignupForm>\n" },
  { name: "social-auth-block", text: "# SocialAuthBlock\n\n소셜 로그인/가입 버튼 묶음.\n\n<SocialAuthBlock />\n" },
  { name: "stat-card", text: "# StatCard\n\n대시보드의 단일 지표 카드 — ARIA role: group.\n\n<StatCard />\n" },
  { name: "variant-wrapper", text: "# VariantWrapper\n\n테마 / variant 전환 컨테이너 — 디자이너가 paper 에서 한 컴포넌트의 모든 variant 비교 시 사용.\n\n<VariantWrapper theme=\"brand-a\">\n  <Button variant=\"default\" />\n  <Button variant=\"outline\" />\n  <Button variant=\"secondary\" />\n  <Button variant=\"ghost\" />\n  <Button variant=\"destructive\" />\n  <Button variant=\"link\" />\n</VariantWrapper>\n\n<VariantWrapper theme=\"brand-b\">\n  <Button variant=\"default\" />\n</VariantWrapper>\n" }
];
