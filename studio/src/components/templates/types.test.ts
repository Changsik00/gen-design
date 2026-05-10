import { describe, it, expectTypeOf } from "vitest";
import type {
  SceneTemplateVariant,
  BaseTemplateProps,
  LoginSceneTexts,
  LoginSceneProps,
  SignupSceneTexts,
  SignupSceneProps,
  DashboardSceneTexts,
  DashboardSceneProps,
  MySceneTexts,
  MySceneProps,
  SettingsSceneTexts,
  SettingsSceneProps,
  ErrorSceneTexts,
  ErrorSceneProps,
} from "./types";

describe("SceneTemplateVariant", () => {
  it("accepts valid variants", () => {
    expectTypeOf<"page">().toMatchTypeOf<SceneTemplateVariant>();
    expectTypeOf<"modal">().toMatchTypeOf<SceneTemplateVariant>();
    expectTypeOf<"bottom-sheet">().toMatchTypeOf<SceneTemplateVariant>();
  });

  it("rejects invalid variants", () => {
    expectTypeOf<"drawer">().not.toMatchTypeOf<SceneTemplateVariant>();
  });
});

describe("BaseTemplateProps", () => {
  it("requires variant and texts", () => {
    expectTypeOf<BaseTemplateProps<LoginSceneTexts>>().toHaveProperty("variant");
    expectTypeOf<BaseTemplateProps<LoginSceneTexts>>().toHaveProperty("texts");
    expectTypeOf<BaseTemplateProps<LoginSceneTexts>>().toHaveProperty("className");
  });

  it("variant is SceneTemplateVariant", () => {
    type VariantProp = BaseTemplateProps<LoginSceneTexts>["variant"];
    expectTypeOf<VariantProp>().toEqualTypeOf<SceneTemplateVariant>();
  });
});

describe("LoginSceneProps", () => {
  it("texts is LoginSceneTexts", () => {
    type TextsProp = LoginSceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<LoginSceneTexts>();
  });

  it("has all required text fields", () => {
    expectTypeOf<LoginSceneTexts>().toHaveProperty("title");
    expectTypeOf<LoginSceneTexts>().toHaveProperty("emailLabel");
    expectTypeOf<LoginSceneTexts>().toHaveProperty("submitButton");
    expectTypeOf<LoginSceneTexts>().toHaveProperty("forgotPassword");
    expectTypeOf<LoginSceneTexts>().toHaveProperty("socialGoogle");
  });

  it("supports DESIGN.md social providers (google + github)", () => {
    expectTypeOf<LoginSceneTexts>().toHaveProperty("socialGoogle");
    expectTypeOf<LoginSceneTexts>().toHaveProperty("socialGithub");
  });
});

describe("SignupSceneProps", () => {
  it("texts is SignupSceneTexts", () => {
    type TextsProp = SignupSceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<SignupSceneTexts>();
  });

  it("has signup-specific fields", () => {
    expectTypeOf<SignupSceneTexts>().toHaveProperty("confirmPasswordLabel");
    expectTypeOf<SignupSceneTexts>().toHaveProperty("termsAgreement");
  });

  it("supports social auth fields (DESIGN.md §11 auth-signup)", () => {
    expectTypeOf<SignupSceneTexts>().toHaveProperty("socialGoogle");
    expectTypeOf<SignupSceneTexts>().toHaveProperty("socialGithub");
  });
});

describe("DashboardSceneProps", () => {
  it("texts is DashboardSceneTexts", () => {
    type TextsProp = DashboardSceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<DashboardSceneTexts>();
  });

  it("has dashboard-specific fields", () => {
    expectTypeOf<DashboardSceneTexts>().toHaveProperty("title");
    expectTypeOf<DashboardSceneTexts>().toHaveProperty("searchPlaceholder");
    expectTypeOf<DashboardSceneTexts>().toHaveProperty("navItems");
    expectTypeOf<DashboardSceneTexts>().toHaveProperty("activityTitle");
    expectTypeOf<DashboardSceneTexts>().toHaveProperty("activityColumns");
  });
});

describe("MySceneProps (DESIGN.md §11 profile-mypage)", () => {
  it("texts is MySceneTexts", () => {
    type TextsProp = MySceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<MySceneTexts>();
  });

  it("has profile, info, summary, avatar fields", () => {
    expectTypeOf<MySceneTexts>().toHaveProperty("title");
    expectTypeOf<MySceneTexts>().toHaveProperty("infoEmail");
    expectTypeOf<MySceneTexts>().toHaveProperty("infoJoinedAt");
    expectTypeOf<MySceneTexts>().toHaveProperty("infoTeam");
    expectTypeOf<MySceneTexts>().toHaveProperty("summaryTasks");
    expectTypeOf<MySceneTexts>().toHaveProperty("summaryComments");
    expectTypeOf<MySceneTexts>().toHaveProperty("summaryCompletion");
    expectTypeOf<MySceneTexts>().toHaveProperty("avatarUpload");
  });
});

describe("SettingsSceneProps (DESIGN.md §11 settings-overview)", () => {
  it("texts is SettingsSceneTexts", () => {
    type TextsProp = SettingsSceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<SettingsSceneTexts>();
  });

  it("has 4 group titles", () => {
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("title");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("notificationsTitle");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("appearanceTitle");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("languageTitle");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("accountTitle");
  });

  it("has notification toggles (4 종)", () => {
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("notificationsEmail");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("notificationsPush");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("notificationsWeeklyDigest");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("notificationsMentions");
  });

  it("has appearance, language, account fields", () => {
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("appearanceTheme");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("appearanceFontSize");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("languageLanguage");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("languageTimezone");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("accountEmail");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("accountChangePassword");
    expectTypeOf<SettingsSceneTexts>().toHaveProperty("accountDeleteAccount");
  });
});

describe("ErrorSceneProps (DESIGN.md §11 common-error)", () => {
  it("texts is ErrorSceneTexts", () => {
    type TextsProp = ErrorSceneProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<ErrorSceneTexts>();
  });

  it("has 404/500 title + message + home", () => {
    expectTypeOf<ErrorSceneTexts>().toHaveProperty("title404");
    expectTypeOf<ErrorSceneTexts>().toHaveProperty("message404");
    expectTypeOf<ErrorSceneTexts>().toHaveProperty("title500");
    expectTypeOf<ErrorSceneTexts>().toHaveProperty("message500");
    expectTypeOf<ErrorSceneTexts>().toHaveProperty("home");
  });
});
