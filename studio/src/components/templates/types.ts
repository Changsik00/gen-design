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
export type SceneTemplateVariant = "page" | "modal" | "bottom-sheet";

// ---------------------------------------------------------------------------
// i18n Slot — Template별 텍스트 타입
// ---------------------------------------------------------------------------

/** LoginScene에 필요한 텍스트 리소스 */
export interface LoginSceneTexts {
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

/** SignupScene에 필요한 텍스트 리소스 */
export interface SignupSceneTexts {
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
  variant?: "default" | "compact" | "highlighted";
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

/** DashboardScene에 필요한 텍스트 리소스 */
export interface DashboardSceneTexts {
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
  variant: SceneTemplateVariant;
  /** i18n 텍스트 리소스 */
  texts: TTexts;
  /** 추가 CSS 클래스 */
  className?: string;
}

/** LoginScene props */
export type LoginSceneProps = BaseTemplateProps<LoginSceneTexts>;

/** SignupScene props */
export type SignupSceneProps = BaseTemplateProps<SignupSceneTexts>;

/** DashboardScene props */
export interface DashboardSceneProps extends BaseTemplateProps<DashboardSceneTexts> {
  appName: string;
}

// ---------------------------------------------------------------------------
// MyScene (DESIGN.md §11 profile-mypage)
// ---------------------------------------------------------------------------

/** MyScene 에 필요한 텍스트 리소스 */
export interface MySceneTexts {
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

/** MyScene 에 표시되는 사용자 프로필 데이터 */
export interface MySceneProfileData {
  name: string;
  role: string;
  email: string;
  joinedAt: string;
  team: string;
  /** Avatar 이미지 경로 / null */
  avatarUrl: string | null;
}

/** MyScene 활동 요약 데이터 */
export interface MySceneSummaryData {
  tasks: number;
  comments: number;
  /** 0 ~ 100 (%) */
  completion: number;
}

/** MyScene props */
export interface MySceneProps extends BaseTemplateProps<MySceneTexts> {
  appName: string;
  profile: MySceneProfileData;
  summary: MySceneSummaryData;
  /** Sidebar nav items (DashboardScene 와 동일 컨셉) */
  navItems: string[];
}

// ---------------------------------------------------------------------------
// SettingsScene (DESIGN.md §11 settings-overview)
// ---------------------------------------------------------------------------

/** SettingsScene 에 필요한 텍스트 리소스 */
export interface SettingsSceneTexts {
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

/** SettingsScene 에서 사용하는 알림 토글 상태 */
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

/** SettingsScene props */
export interface SettingsSceneProps extends BaseTemplateProps<SettingsSceneTexts> {
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
// ErrorScene (DESIGN.md §11 common-error)
// ---------------------------------------------------------------------------

/** ErrorScene 에 필요한 텍스트 리소스 */
export interface ErrorSceneTexts {
  title404: string;
  message404: string;
  title500: string;
  message500: string;
  home: string;
}

/** ErrorScene 에러 변형 */
export type ErrorVariant = "404" | "500";

/** ErrorScene props */
export interface ErrorSceneProps extends BaseTemplateProps<ErrorSceneTexts> {
  errorVariant: ErrorVariant;
}
