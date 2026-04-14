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
  socialApple: string;
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
}

/** DashboardPage에 필요한 텍스트 리소스 */
export interface DashboardPageTexts {
  title: string;
  welcomeMessage: string;
  overviewSection: string;
  recentActivitySection: string;
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
export type DashboardPageProps = BaseTemplateProps<DashboardPageTexts>;
