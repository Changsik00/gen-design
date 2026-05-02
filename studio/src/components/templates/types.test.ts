import { describe, it, expectTypeOf } from "vitest";
import type {
  PageTemplateVariant,
  BaseTemplateProps,
  LoginPageTexts,
  LoginPageProps,
  SignupPageTexts,
  SignupPageProps,
  DashboardPageTexts,
  DashboardPageProps,
  MyPageTexts,
  MyPageProps,
  SettingsPageTexts,
  SettingsPageProps,
  ErrorPageTexts,
  ErrorPageProps,
} from "./types";

describe("PageTemplateVariant", () => {
  it("accepts valid variants", () => {
    expectTypeOf<"page">().toMatchTypeOf<PageTemplateVariant>();
    expectTypeOf<"modal">().toMatchTypeOf<PageTemplateVariant>();
    expectTypeOf<"bottom-sheet">().toMatchTypeOf<PageTemplateVariant>();
  });

  it("rejects invalid variants", () => {
    expectTypeOf<"drawer">().not.toMatchTypeOf<PageTemplateVariant>();
  });
});

describe("BaseTemplateProps", () => {
  it("requires variant and texts", () => {
    expectTypeOf<BaseTemplateProps<LoginPageTexts>>().toHaveProperty("variant");
    expectTypeOf<BaseTemplateProps<LoginPageTexts>>().toHaveProperty("texts");
    expectTypeOf<BaseTemplateProps<LoginPageTexts>>().toHaveProperty("className");
  });

  it("variant is PageTemplateVariant", () => {
    type VariantProp = BaseTemplateProps<LoginPageTexts>["variant"];
    expectTypeOf<VariantProp>().toEqualTypeOf<PageTemplateVariant>();
  });
});

describe("LoginPageProps", () => {
  it("texts is LoginPageTexts", () => {
    type TextsProp = LoginPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<LoginPageTexts>();
  });

  it("has all required text fields", () => {
    expectTypeOf<LoginPageTexts>().toHaveProperty("title");
    expectTypeOf<LoginPageTexts>().toHaveProperty("emailLabel");
    expectTypeOf<LoginPageTexts>().toHaveProperty("submitButton");
    expectTypeOf<LoginPageTexts>().toHaveProperty("forgotPassword");
    expectTypeOf<LoginPageTexts>().toHaveProperty("socialGoogle");
  });

  it("supports DESIGN.md social providers (google + github)", () => {
    expectTypeOf<LoginPageTexts>().toHaveProperty("socialGoogle");
    expectTypeOf<LoginPageTexts>().toHaveProperty("socialGithub");
  });
});

describe("SignupPageProps", () => {
  it("texts is SignupPageTexts", () => {
    type TextsProp = SignupPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<SignupPageTexts>();
  });

  it("has signup-specific fields", () => {
    expectTypeOf<SignupPageTexts>().toHaveProperty("confirmPasswordLabel");
    expectTypeOf<SignupPageTexts>().toHaveProperty("termsAgreement");
  });

  it("supports social auth fields (DESIGN.md §11 auth-signup)", () => {
    expectTypeOf<SignupPageTexts>().toHaveProperty("socialGoogle");
    expectTypeOf<SignupPageTexts>().toHaveProperty("socialGithub");
  });
});

describe("DashboardPageProps", () => {
  it("texts is DashboardPageTexts", () => {
    type TextsProp = DashboardPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<DashboardPageTexts>();
  });

  it("has dashboard-specific fields", () => {
    expectTypeOf<DashboardPageTexts>().toHaveProperty("title");
    expectTypeOf<DashboardPageTexts>().toHaveProperty("searchPlaceholder");
    expectTypeOf<DashboardPageTexts>().toHaveProperty("navItems");
    expectTypeOf<DashboardPageTexts>().toHaveProperty("activityTitle");
    expectTypeOf<DashboardPageTexts>().toHaveProperty("activityColumns");
  });
});

describe("MyPageProps (DESIGN.md §11 profile-mypage)", () => {
  it("texts is MyPageTexts", () => {
    type TextsProp = MyPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<MyPageTexts>();
  });

  it("has profile, info, summary, avatar fields", () => {
    expectTypeOf<MyPageTexts>().toHaveProperty("title");
    expectTypeOf<MyPageTexts>().toHaveProperty("infoEmail");
    expectTypeOf<MyPageTexts>().toHaveProperty("infoJoinedAt");
    expectTypeOf<MyPageTexts>().toHaveProperty("infoTeam");
    expectTypeOf<MyPageTexts>().toHaveProperty("summaryTasks");
    expectTypeOf<MyPageTexts>().toHaveProperty("summaryComments");
    expectTypeOf<MyPageTexts>().toHaveProperty("summaryCompletion");
    expectTypeOf<MyPageTexts>().toHaveProperty("avatarUpload");
  });
});

describe("SettingsPageProps (DESIGN.md §11 settings-overview)", () => {
  it("texts is SettingsPageTexts", () => {
    type TextsProp = SettingsPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<SettingsPageTexts>();
  });

  it("has 4 group titles", () => {
    expectTypeOf<SettingsPageTexts>().toHaveProperty("title");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("notificationsTitle");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("appearanceTitle");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("languageTitle");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("accountTitle");
  });

  it("has notification toggles (4 종)", () => {
    expectTypeOf<SettingsPageTexts>().toHaveProperty("notificationsEmail");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("notificationsPush");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("notificationsWeeklyDigest");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("notificationsMentions");
  });

  it("has appearance, language, account fields", () => {
    expectTypeOf<SettingsPageTexts>().toHaveProperty("appearanceTheme");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("appearanceFontSize");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("languageLanguage");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("languageTimezone");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("accountEmail");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("accountChangePassword");
    expectTypeOf<SettingsPageTexts>().toHaveProperty("accountDeleteAccount");
  });
});

describe("ErrorPageProps (DESIGN.md §11 common-error)", () => {
  it("texts is ErrorPageTexts", () => {
    type TextsProp = ErrorPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<ErrorPageTexts>();
  });

  it("has 404/500 title + message + home", () => {
    expectTypeOf<ErrorPageTexts>().toHaveProperty("title404");
    expectTypeOf<ErrorPageTexts>().toHaveProperty("message404");
    expectTypeOf<ErrorPageTexts>().toHaveProperty("title500");
    expectTypeOf<ErrorPageTexts>().toHaveProperty("message500");
    expectTypeOf<ErrorPageTexts>().toHaveProperty("home");
  });
});
