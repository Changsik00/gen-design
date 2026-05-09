import { describe, it, expect } from "vitest";
import { generateRequirements } from "../generator";
import type { BlueprintSession } from "../types";

const saasSession: BlueprintSession = {
  appType: "saas",
  appName: "My SaaS",
  nfr: {
    auth: { method: "email-password", socialProviders: [], sessionStrategy: "jwt-refresh" },
    i18n: { defaultLocale: "ko", supportedLocales: ["ko"] },
    theme: { defaultTheme: "light", supportedThemes: ["light"] },
    performance: { targetLighthouseScore: 90, coreWebVitalsBudget: { lcp: "2.5s", cls: 0.1, inp: "200ms" } },
    security: { csp: "strict-default", authStorageMethod: "httpOnly-cookie" },
    compatibility: { targetBrowsers: "last-2 evergreen", a11yLevel: "WCAG 2.1 AA" },
  },
  selectedPages: [
    {
      id: "auth-login",
      name: "로그인",
      category: "auth",
      priority: "required",
      variant: "modal",
      route: "/auth/login",
      layout: "centered-card",
      requiredSections: ["BrandHeader", "LoginForm", "SocialAuthBlock"],
      optionalSections: [],
      templateMapping: { template: "LoginPage", status: "implemented" },
    },
    {
      id: "dash-overview",
      name: "대시보드",
      category: "dashboard",
      priority: "required",
      variant: "page",
      route: "/dashboard",
      layout: "default",
      requiredSections: ["DashboardHeader", "Sidebar", "StatCardGrid"],
      optionalSections: [],
      templateMapping: { template: "DashboardPage", status: "implemented" },
    },
  ],
};

describe("generateRequirements", () => {
  it("appName 이 헤더에 포함된다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("My SaaS");
  });

  it("appType 이 메타 표에 포함된다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("saas");
  });

  it("선택된 페이지가 각각 섹션으로 포함된다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("auth-login");
    expect(md).toContain("dash-overview");
  });

  it("Template 매핑 표가 포함된다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("Template 매핑");
    expect(md).toContain("LoginPage");
    expect(md).toContain("DashboardPage");
  });

  it("pageCount 가 selectedPages.length 와 일치한다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("2"); // pageCount = 2
  });

  it("NFR 인증 정보가 포함된다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toContain("email-password");
    expect(md).toContain("jwt-refresh");
  });

  it("implemented 페이지는 체크 표시가 붙는다", () => {
    const md = generateRequirements(saasSession);
    expect(md).toMatch(/LoginPage.*✅|✅.*LoginPage/);
  });
});
