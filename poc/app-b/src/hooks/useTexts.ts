import koJson from "../../i18n/ko.json";
import type {
  LoginPageTexts,
  SignupPageTexts,
  DashboardPageTexts,
  MyPageTexts,
  SettingsPageTexts,
  ErrorPageTexts,
} from "studio/components/templates";

const t = koJson;

export function getLoginTexts(): LoginPageTexts {
  return {
    title: t.login.title,
    description: t.login.description,
    emailLabel: t.login.form.email.label,
    emailPlaceholder: t.login.form.email.placeholder,
    passwordLabel: t.login.form.password.label,
    passwordPlaceholder: t.login.form.password.placeholder,
    submitButton: t.login.form.submit,
    forgotPassword: t.login.forgot,
    signupPrompt: t.login.signupPrompt.split("?")[0] + "?",
    signupLink: t.login.signupPrompt.split("?")[1]?.trim() ?? "회원가입",
    socialGoogle: t.login.social.google,
    socialGithub: t.login.social.github,
    // 미사용 — DESIGN.md 앱 B 도 google/github 만. 호환 위해 빈 문자열.
    socialApple: "",
    socialKakao: "",
  };
}

export function getSignupTexts(): SignupPageTexts {
  return {
    title: t.signup.title,
    description: t.signup.description,
    nameLabel: t.signup.form.name.label,
    namePlaceholder: t.signup.form.name.placeholder,
    emailLabel: t.signup.form.email.label,
    emailPlaceholder: t.signup.form.email.placeholder,
    passwordLabel: t.signup.form.password.label,
    passwordPlaceholder: t.signup.form.password.placeholder,
    confirmPasswordLabel: t.signup.form.passwordConfirm.label,
    confirmPasswordPlaceholder: t.signup.form.passwordConfirm.placeholder,
    submitButton: t.signup.form.submit,
    loginPrompt: t.signup.loginPrompt.split("?")[0] + "?",
    loginLink: t.signup.loginPrompt.split("?")[1]?.trim() ?? "로그인",
    termsAgreement: t.signup.terms,
    socialGoogle: t.signup.social.google,
    socialGithub: t.signup.social.github,
  };
}

export function getDashboardTexts(): DashboardPageTexts {
  return {
    title: t.dashboard.title,
    searchPlaceholder: t.dashboard.search.placeholder,
    navItems: [t.nav.home, t.nav.tasks, t.nav.settings],
    activityTitle: t.dashboard.activity.title,
    activityViewAll: t.dashboard.activity.viewAll,
    activityColumns: {
      // app-a 와 동일 — studio ActivityRowData 의미 모델 차이 (drift) 는
      // app-a 에서 이미 기록됨. 여기서는 라벨만 ko.json 과 일치시킴.
      user: t.dashboard.activity.column.task,
      action: t.dashboard.activity.column.assignee,
      status: t.dashboard.activity.column.status,
      time: t.dashboard.activity.column.updated,
    },
  };
}

export function getMyPageTexts(): MyPageTexts {
  return {
    title: t.mypage.title,
    infoEmail: t.mypage.info.email,
    infoJoinedAt: t.mypage.info.joinedAt,
    infoTeam: t.mypage.info.team,
    summaryTasks: t.mypage.summary.tasks,
    summaryComments: t.mypage.summary.comments,
    summaryCompletion: t.mypage.summary.completion,
    avatarUpload: t.mypage.avatar.upload,
  };
}

export function getSettingsTexts(): SettingsPageTexts {
  return {
    title: t.settings.title,
    notificationsTitle: t.settings.notifications.title,
    notificationsEmail: t.settings.notifications.email,
    notificationsPush: t.settings.notifications.push,
    notificationsWeeklyDigest: t.settings.notifications.weeklyDigest,
    notificationsMentions: t.settings.notifications.mentions,
    appearanceTitle: t.settings.appearance.title,
    appearanceTheme: t.settings.appearance.theme,
    appearanceFontSize: t.settings.appearance.fontSize,
    languageTitle: t.settings.language.title,
    languageLanguage: t.settings.language.language,
    languageTimezone: t.settings.language.timezone,
    accountTitle: t.settings.account.title,
    accountEmail: t.settings.account.email,
    accountChangePassword: t.settings.account.changePassword,
    accountDeleteAccount: t.settings.account.deleteAccount,
  };
}

export function getErrorTexts(): ErrorPageTexts {
  return {
    title404: t.error["404"].title,
    message404: t.error["404"].message,
    title500: t.error["500"].title,
    message500: t.error["500"].message,
    home: t.error.home,
  };
}

export function getNavItems(): string[] {
  return [t.nav.home, t.nav.tasks, t.nav.settings];
}
