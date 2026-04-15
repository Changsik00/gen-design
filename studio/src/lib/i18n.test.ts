import { describe, it, expect } from "vitest";
import { getLoginPageTexts, getSignupPageTexts } from "./i18n";

describe("getLoginPageTexts", () => {
  it("returns Korean texts by default", () => {
    const texts = getLoginPageTexts();
    expect(texts.title).toBe("로그인");
    expect(texts.emailLabel).toBe("이메일");
    expect(texts.submitButton).toBe("로그인");
    expect(texts.forgotPassword).toBe("비밀번호를 잊으셨나요?");
    expect(texts.socialGoogle).toBe("Google로 계속하기");
  });

  it("returns English texts", () => {
    const texts = getLoginPageTexts("en");
    expect(texts.title).toBe("Sign in");
    expect(texts.emailLabel).toBe("Email");
    expect(texts.submitButton).toBe("Sign in");
    expect(texts.socialKakao).toBe("Continue with Kakao");
  });

  it("returns all required fields", () => {
    const texts = getLoginPageTexts();
    const keys = Object.keys(texts);
    expect(keys).toContain("title");
    expect(keys).toContain("description");
    expect(keys).toContain("emailLabel");
    expect(keys).toContain("emailPlaceholder");
    expect(keys).toContain("passwordLabel");
    expect(keys).toContain("passwordPlaceholder");
    expect(keys).toContain("submitButton");
    expect(keys).toContain("forgotPassword");
    expect(keys).toContain("signupPrompt");
    expect(keys).toContain("signupLink");
    expect(keys).toContain("socialGoogle");
    expect(keys).toContain("socialApple");
    expect(keys).toContain("socialKakao");
  });
});

describe("getSignupPageTexts", () => {
  it("returns Korean texts by default", () => {
    const texts = getSignupPageTexts();
    expect(texts.title).toBe("회원가입");
    expect(texts.nameLabel).toBe("이름");
    expect(texts.submitButton).toBe("가입하기");
    expect(texts.termsAgreement).toBe("이용약관 및 개인정보처리방침에 동의합니다");
  });

  it("returns English texts", () => {
    const texts = getSignupPageTexts("en");
    expect(texts.title).toBe("Sign up");
    expect(texts.submitButton).toBe("Create account");
    expect(texts.confirmPasswordLabel).toBe("Confirm password");
  });

  it("returns all required fields", () => {
    const texts = getSignupPageTexts();
    const keys = Object.keys(texts);
    expect(keys).toContain("title");
    expect(keys).toContain("nameLabel");
    expect(keys).toContain("confirmPasswordLabel");
    expect(keys).toContain("confirmPasswordPlaceholder");
    expect(keys).toContain("termsAgreement");
    expect(keys).toContain("loginPrompt");
    expect(keys).toContain("loginLink");
  });
});
