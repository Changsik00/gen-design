import type { LoginPageTexts, SignupPageTexts, DashboardPageTexts } from "@/components/templates/types";
import koJson from "@/i18n/ko.json";
import enJson from "@/i18n/en.json";

type Locale = "ko" | "en";

const localeMap: Record<Locale, typeof koJson> = {
  ko: koJson,
  en: enJson,
};

export function getLoginPageTexts(locale: Locale = "ko"): LoginPageTexts {
  const t = localeMap[locale];
  return {
    title: t.login.title,
    description: t.login.description,
    emailLabel: t.login.form.email.label,
    emailPlaceholder: t.login.form.email.placeholder,
    passwordLabel: t.login.form.password.label,
    passwordPlaceholder: t.login.form.password.placeholder,
    submitButton: t.login.form.submit.label,
    forgotPassword: t.login.footer.forgot,
    signupPrompt: t.login.footer.signup.prompt,
    signupLink: t.login.footer.signup.link,
    socialGoogle: t.login.social.google.label,
    socialApple: t.login.social.apple.label,
    socialKakao: t.login.social.kakao.label,
  };
}

export function getSignupPageTexts(locale: Locale = "ko"): SignupPageTexts {
  const t = localeMap[locale];
  return {
    title: t.signup.title,
    description: t.signup.description,
    nameLabel: t.signup.form.name.label,
    namePlaceholder: t.signup.form.name.placeholder,
    emailLabel: t.signup.form.email.label,
    emailPlaceholder: t.signup.form.email.placeholder,
    passwordLabel: t.signup.form.password.label,
    passwordPlaceholder: t.signup.form.password.placeholder,
    confirmPasswordLabel: t.signup.form.confirm.label,
    confirmPasswordPlaceholder: t.signup.form.confirm.placeholder,
    submitButton: t.signup.form.submit.label,
    loginPrompt: t.signup.footer.login.prompt,
    loginLink: t.signup.footer.login.link,
    termsAgreement: t.signup.form.terms.label,
  };
}

export function getDashboardPageTexts(locale: Locale = "ko"): DashboardPageTexts {
  const t = localeMap[locale];
  return {
    title: t.dashboard.title,
    searchPlaceholder: t.dashboard.searchPlaceholder,
    navItems: t.dashboard.nav,
    activityTitle: t.dashboard.activity.title,
    activityViewAll: t.dashboard.activity.viewAll,
    activityColumns: {
      user: t.dashboard.activity.columns.user,
      action: t.dashboard.activity.columns.action,
      status: t.dashboard.activity.columns.status,
      time: t.dashboard.activity.columns.time,
    },
  };
}
