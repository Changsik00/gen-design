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
});

describe("DashboardPageProps", () => {
  it("texts is DashboardPageTexts", () => {
    type TextsProp = DashboardPageProps["texts"];
    expectTypeOf<TextsProp>().toEqualTypeOf<DashboardPageTexts>();
  });
});
