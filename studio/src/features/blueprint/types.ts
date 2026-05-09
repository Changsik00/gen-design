export type AppType = "saas" | "ecommerce" | "social" | "content" | "utility" | "custom";

export type PagePriority = "required" | "recommended" | "optional";
export type PageVariant = "page" | "modal" | "bottom-sheet";
export type TemplateStatus = "implemented" | "not-implemented";

export interface TemplateMapping {
  template: string;
  status: TemplateStatus;
  derivedFrom?: string;
}

export interface PageSelection {
  id: string;
  name: string;
  category: string;
  priority: PagePriority;
  variant: PageVariant;
  route: string;
  layout: string;
  requiredSections: string[];
  optionalSections: string[];
  templateMapping: TemplateMapping;
}

export interface NfrConfig {
  auth: {
    method: "email-password" | "social-only" | "passwordless" | "enterprise";
    socialProviders: string[];
    sessionStrategy: "jwt-refresh" | "cookie-session" | "none";
  };
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
  };
  theme: {
    defaultTheme: "light" | "dark" | "auto";
    supportedThemes: Array<"light" | "dark" | "auto">;
  };
  performance: {
    targetLighthouseScore: number;
    coreWebVitalsBudget: { lcp: string; cls: number; inp: string };
  };
  security: {
    csp: "strict-default" | "relaxed";
    authStorageMethod: "httpOnly-cookie" | "localStorage" | "memory";
  };
  compatibility: {
    targetBrowsers: string;
    a11yLevel: "WCAG 2.1 AA" | "WCAG 2.1 AAA" | "AA-best-effort";
  };
}

export const NFR_DEFAULTS: NfrConfig = {
  auth: { method: "email-password", socialProviders: [], sessionStrategy: "jwt-refresh" },
  i18n: { defaultLocale: "ko", supportedLocales: ["ko"] },
  theme: { defaultTheme: "light", supportedThemes: ["light"] },
  performance: {
    targetLighthouseScore: 90,
    coreWebVitalsBudget: { lcp: "2.5s", cls: 0.1, inp: "200ms" },
  },
  security: { csp: "strict-default", authStorageMethod: "httpOnly-cookie" },
  compatibility: { targetBrowsers: "last-2 evergreen", a11yLevel: "WCAG 2.1 AA" },
};

export interface BlueprintSession {
  appType: AppType;
  appName: string;
  nfr: NfrConfig;
  selectedPages: PageSelection[];
}
