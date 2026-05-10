import type { AppType, PagePriority, PageVariant, PageSelection } from "./types";

export interface CatalogEntry {
  id: string;
  name: string;
  category: string;
  variants: PageVariant[];
  templateName: string;
  implemented: boolean;
  requiredSections: string[];
  optionalSections: string[];
}

export const PAGE_CATALOG: CatalogEntry[] = [
  {
    id: "auth-login", name: "로그인", category: "auth",
    variants: ["page", "modal", "bottom-sheet"], templateName: "LoginScene", implemented: true,
    requiredSections: ["BrandHeader", "LoginForm", "SocialAuthBlock"],
    optionalSections: ["ForgotPasswordLink", "SignupPrompt", "FooterLinks"],
  },
  {
    id: "auth-signup", name: "회원가입", category: "auth",
    variants: ["page", "modal", "bottom-sheet"], templateName: "SignupScene", implemented: true,
    requiredSections: ["BrandHeader", "SignupForm"],
    optionalSections: ["SocialAuthBlock", "TermsAgreement", "LoginPrompt"],
  },
  {
    id: "auth-forgot-pw", name: "비밀번호 찾기", category: "auth",
    variants: ["page", "modal"], templateName: "ForgotPwPage", implemented: false,
    requiredSections: ["BrandHeader", "ForgotPasswordForm"],
    optionalSections: ["LoginPrompt"],
  },
  {
    id: "auth-verify", name: "인증 코드 확인", category: "auth",
    variants: ["page", "modal"], templateName: "VerifyPage", implemented: false,
    requiredSections: ["BrandHeader", "VerifyForm"],
    optionalSections: [],
  },
  {
    id: "dash-overview", name: "대시보드 개요", category: "dashboard",
    variants: ["page"], templateName: "DashboardScene", implemented: true,
    requiredSections: ["DashboardHeader", "Sidebar", "StatCardGrid", "ActivityTable"],
    optionalSections: ["ChartArea", "QuickActions"],
  },
  {
    id: "dash-analytics", name: "분석", category: "dashboard",
    variants: ["page"], templateName: "DashboardAnalyticsPage", implemented: false,
    requiredSections: ["DashboardHeader", "Sidebar", "ChartArea"],
    optionalSections: ["FilterBar", "DataTable"],
  },
  {
    id: "profile-mypage", name: "마이페이지", category: "profile",
    variants: ["page"], templateName: "MyScene", implemented: false,
    requiredSections: ["ProfileHeader", "ProfileInfoCard"],
    optionalSections: ["AvatarUpload", "ActivitySummary"],
  },
  {
    id: "profile-settings", name: "설정", category: "profile",
    variants: ["page"], templateName: "SettingsScene", implemented: false,
    requiredSections: ["SettingsHeader", "SettingsGroup"],
    optionalSections: ["SettingsToggleRow", "SettingsSelectRow"],
  },
  {
    id: "content-list", name: "콘텐츠 목록", category: "content",
    variants: ["page"], templateName: "ContentListPage", implemented: false,
    requiredSections: ["ContentHeader", "ContentGrid"],
    optionalSections: ["FilterBar", "SearchBar"],
  },
  {
    id: "content-detail", name: "콘텐츠 상세", category: "content",
    variants: ["page", "modal"], templateName: "ContentDetailPage", implemented: false,
    requiredSections: ["ContentHeader", "ContentBody"],
    optionalSections: ["RelatedContent", "ActionBar"],
  },
  {
    id: "content-search", name: "콘텐츠 검색", category: "content",
    variants: ["page", "modal"], templateName: "ContentSearchPage", implemented: false,
    requiredSections: ["SearchBar", "SearchResults"],
    optionalSections: ["FilterPanel"],
  },
  {
    id: "commerce-cart", name: "장바구니", category: "commerce",
    variants: ["page", "bottom-sheet"], templateName: "CommerceCartPage", implemented: false,
    requiredSections: ["CartHeader", "CartItemList", "CartSummary"],
    optionalSections: ["RecommendedItems"],
  },
  {
    id: "commerce-checkout", name: "결제", category: "commerce",
    variants: ["page"], templateName: "CommerceCheckoutPage", implemented: false,
    requiredSections: ["CheckoutHeader", "ShippingForm", "PaymentForm", "OrderSummary"],
    optionalSections: [],
  },
  {
    id: "commerce-orders", name: "주문 내역", category: "commerce",
    variants: ["page"], templateName: "CommerceOrdersPage", implemented: false,
    requiredSections: ["OrdersHeader", "OrderList"],
    optionalSections: ["OrderFilter"],
  },
  {
    id: "common-landing", name: "랜딩", category: "common",
    variants: ["page"], templateName: "CommonLandingPage", implemented: false,
    requiredSections: ["HeroSection", "FeatureList"],
    optionalSections: ["Testimonials", "CTASection"],
  },
  {
    id: "common-onboarding", name: "온보딩", category: "common",
    variants: ["page", "modal"], templateName: "CommonOnboardingPage", implemented: false,
    requiredSections: ["OnboardingStep"],
    optionalSections: ["ProgressBar", "SkipButton"],
  },
  {
    id: "common-error", name: "에러", category: "common",
    variants: ["page"], templateName: "CommonErrorScene", implemented: false,
    requiredSections: ["ErrorIcon", "ErrorMessage", "HomeButton"],
    optionalSections: [],
  },
  {
    id: "common-notifications", name: "알림", category: "common",
    variants: ["page", "bottom-sheet"], templateName: "CommonNotificationsPage", implemented: false,
    requiredSections: ["NotificationsHeader", "NotificationList"],
    optionalSections: ["NotificationFilter"],
  },
];

type RecommendedSet = { id: string; priority: PagePriority }[];

const RECOMMENDED_SETS: Record<AppType, RecommendedSet> = {
  saas: [
    { id: "auth-login", priority: "required" },
    { id: "auth-signup", priority: "required" },
    { id: "dash-overview", priority: "required" },
    { id: "profile-settings", priority: "required" },
    { id: "common-error", priority: "required" },
    { id: "auth-forgot-pw", priority: "recommended" },
    { id: "dash-analytics", priority: "recommended" },
    { id: "common-onboarding", priority: "recommended" },
  ],
  ecommerce: [
    { id: "auth-login", priority: "required" },
    { id: "auth-signup", priority: "required" },
    { id: "commerce-cart", priority: "required" },
    { id: "commerce-checkout", priority: "required" },
    { id: "commerce-orders", priority: "required" },
    { id: "common-error", priority: "required" },
    { id: "auth-forgot-pw", priority: "recommended" },
    { id: "profile-mypage", priority: "recommended" },
  ],
  social: [
    { id: "auth-login", priority: "required" },
    { id: "auth-signup", priority: "required" },
    { id: "profile-mypage", priority: "required" },
    { id: "content-list", priority: "required" },
    { id: "content-detail", priority: "required" },
    { id: "common-error", priority: "required" },
    { id: "common-notifications", priority: "recommended" },
    { id: "content-search", priority: "recommended" },
  ],
  content: [
    { id: "content-list", priority: "required" },
    { id: "content-detail", priority: "required" },
    { id: "content-search", priority: "required" },
    { id: "common-error", priority: "required" },
    { id: "auth-login", priority: "recommended" },
    { id: "common-landing", priority: "recommended" },
  ],
  utility: [
    { id: "auth-login", priority: "required" },
    { id: "common-error", priority: "required" },
    { id: "profile-settings", priority: "recommended" },
  ],
  custom: [],
};

function deriveRoute(id: string): string {
  const parts = id.split("-");
  const prefix = parts[0];
  const rest = parts.slice(1).join("/");
  if (["auth", "dash", "profile", "content", "commerce", "common"].includes(prefix)) {
    return `/${prefix}/${rest}`;
  }
  return `/${id}`;
}

function deriveLayout(variant: PageVariant): string {
  if (variant === "modal") return "centered-card";
  if (variant === "bottom-sheet") return "sheet";
  return "default";
}

export function getRecommendedPages(appType: AppType): PageSelection[] {
  const set = RECOMMENDED_SETS[appType] ?? [];
  return set.map(({ id, priority }) => {
    const entry = PAGE_CATALOG.find((p) => p.id === id)!;
    const variant: PageVariant = entry.variants[0];
    return {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      priority,
      variant,
      route: deriveRoute(id),
      layout: deriveLayout(variant),
      requiredSections: [...entry.requiredSections],
      optionalSections: [...entry.optionalSections],
      templateMapping: {
        template: entry.templateName,
        status: entry.implemented ? "implemented" : "not-implemented",
      },
    };
  });
}
