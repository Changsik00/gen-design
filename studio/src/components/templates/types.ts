/**
 * Page Template Slot Interfaces
 *
 * 모든 Page Template이 공유하는 슬롯 타입 정의.
 * - Token Slot: CSS 변수 기반 (타입 불필요, Tailwind 유틸리티로 소비)
 * - i18n Slot: texts prop (Template별 전용 타입)
 * - Variant Slot: variant prop (discriminated union)
 */

// ---------------------------------------------------------------------------
// Variant Slot
// ---------------------------------------------------------------------------

/** Page Template의 레이아웃 변형 */
export type PageTemplateVariant = "page" | "modal" | "bottom-sheet";

// ---------------------------------------------------------------------------
// i18n Slot — Template별 텍스트 타입
// ---------------------------------------------------------------------------

/** LoginPage에 필요한 텍스트 리소스 */
export interface LoginPageTexts {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitButton: string;
  forgotPassword: string;
  signupPrompt: string;
  signupLink: string;
  socialGoogle: string;
  /** DESIGN.md §11 auth-login (앱 A): GitHub provider */
  socialGithub: string;
  /** Phase 2 호환 — 앱 B 등에서 Apple provider 필요 시 */
  socialApple: string;
  /** Phase 2 호환 — 앱 B 등에서 Kakao provider 필요 시 */
  socialKakao: string;
}

/** SignupPage에 필요한 텍스트 리소스 */
export interface SignupPageTexts {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  submitButton: string;
  loginPrompt: string;
  loginLink: string;
  termsAgreement: string;
  /** DESIGN.md §11 auth-signup: Google provider (선택 ON SocialAuthBlock) */
  socialGoogle: string;
  /** DESIGN.md §11 auth-signup: GitHub provider */
  socialGithub: string;
}

/** StatCard 한 장에 필요한 데이터 */
export interface StatCardData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

/** Activity 한 행에 필요한 데이터 */
export interface ActivityRowData {
  userName: string;
  initials: string;
  action: string;
  status: string;
  statusColor: "green" | "blue" | "red" | "gray";
  time: string;
}

/** DashboardPage에 필요한 텍스트 리소스 */
export interface DashboardPageTexts {
  title: string;
  searchPlaceholder: string;
  navItems: string[];
  activityTitle: string;
  activityViewAll: string;
  activityColumns: {
    user: string;
    action: string;
    status: string;
    time: string;
  };
}

// ---------------------------------------------------------------------------
// Base Template Props
// ---------------------------------------------------------------------------

/** 모든 Page Template이 받는 공통 props */
export interface BaseTemplateProps<TTexts> {
  /** 레이아웃 변형 */
  variant: PageTemplateVariant;
  /** i18n 텍스트 리소스 */
  texts: TTexts;
  /** 추가 CSS 클래스 */
  className?: string;
}

/** LoginPage props */
export type LoginPageProps = BaseTemplateProps<LoginPageTexts>;

/** SignupPage props */
export type SignupPageProps = BaseTemplateProps<SignupPageTexts>;

/** DashboardPage props */
export interface DashboardPageProps extends BaseTemplateProps<DashboardPageTexts> {
  appName: string;
}

// ---------------------------------------------------------------------------
// MyPage (DESIGN.md §11 profile-mypage)
// ---------------------------------------------------------------------------

/** MyPage 에 필요한 텍스트 리소스 */
export interface MyPageTexts {
  title: string;
  /** ProfileInfoCard */
  infoEmail: string;
  infoJoinedAt: string;
  infoTeam: string;
  /** ActivitySummary */
  summaryTasks: string;
  summaryComments: string;
  summaryCompletion: string;
  /** AvatarUpload */
  avatarUpload: string;
}

/** MyPage 에 표시되는 사용자 프로필 데이터 */
export interface MyPageProfileData {
  name: string;
  role: string;
  email: string;
  joinedAt: string;
  team: string;
  /** Avatar 이미지 경로 / null */
  avatarUrl: string | null;
}

/** MyPage 활동 요약 데이터 */
export interface MyPageSummaryData {
  tasks: number;
  comments: number;
  /** 0 ~ 100 (%) */
  completion: number;
}

/** MyPage props */
export interface MyPageProps extends BaseTemplateProps<MyPageTexts> {
  appName: string;
  profile: MyPageProfileData;
  summary: MyPageSummaryData;
  /** Sidebar nav items (DashboardPage 와 동일 컨셉) */
  navItems: string[];
}

// ---------------------------------------------------------------------------
// SettingsPage (DESIGN.md §11 settings-overview)
// ---------------------------------------------------------------------------

/** SettingsPage 에 필요한 텍스트 리소스 */
export interface SettingsPageTexts {
  title: string;
  /** Notification 그룹 */
  notificationsTitle: string;
  notificationsEmail: string;
  notificationsPush: string;
  notificationsWeeklyDigest: string;
  notificationsMentions: string;
  /** Appearance 그룹 */
  appearanceTitle: string;
  appearanceTheme: string;
  appearanceFontSize: string;
  /** Language & Region 그룹 */
  languageTitle: string;
  languageLanguage: string;
  languageTimezone: string;
  /** Account 그룹 */
  accountTitle: string;
  accountEmail: string;
  accountChangePassword: string;
  accountDeleteAccount: string;
}

/** SettingsPage 에서 사용하는 알림 토글 상태 */
export interface SettingsNotifications {
  email: boolean;
  push: boolean;
  weeklyDigest: boolean;
  mentions: boolean;
}

/** Select 옵션 */
export interface SettingsOption {
  value: string;
  label: string;
}

/** SettingsPage props */
export interface SettingsPageProps extends BaseTemplateProps<SettingsPageTexts> {
  appName: string;
  notifications: SettingsNotifications;
  /** 외관 */
  theme: string;
  fontSize: number;
  /** 언어 / 시간대 */
  language: string;
  timezone: string;
  themeOptions: SettingsOption[];
  languageOptions: SettingsOption[];
  timezoneOptions: SettingsOption[];
  /** 계정 표시 이메일 */
  accountEmailValue: string;
  /** Sidebar nav items */
  navItems: string[];
}

// ---------------------------------------------------------------------------
// ErrorPage (DESIGN.md §11 common-error)
// ---------------------------------------------------------------------------

/** ErrorPage 에 필요한 텍스트 리소스 */
export interface ErrorPageTexts {
  title404: string;
  message404: string;
  title500: string;
  message500: string;
  home: string;
}

/** ErrorPage 에러 변형 */
export type ErrorVariant = "404" | "500";

/** ErrorPage props */
export interface ErrorPageProps extends BaseTemplateProps<ErrorPageTexts> {
  errorVariant: ErrorVariant;
}
