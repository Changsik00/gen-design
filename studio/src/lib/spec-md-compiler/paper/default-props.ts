/**
 * 컴포넌트별 default props.
 *
 * spec.md 는 *시각 구조* 만 선언 — texts/data 같은 복잡한 prop 은 명시 X.
 * 컴파일 시 본 defaults 가 자동 주입되어 React 컴포넌트가 정상 렌더된다.
 *
 * 우선순위 (높은 게 이김):
 *   spec.md 의 명시 props > 본 defaults
 *
 * MVP 의 단순화: 모든 fixture 가 *시각적으로* 렌더되도록 minimal mock data.
 * 향후 spec.md 의 attribute 문법으로 데이터를 declarative 하게 넘기는 확장 가능.
 */

import {
  getDashboardPageTexts,
  getLoginPageTexts,
  getSignupPageTexts,
} from "../../i18n";

const LOGIN_TEXTS = getLoginPageTexts("ko");
const SIGNUP_TEXTS = getSignupPageTexts("ko");
const DASHBOARD_TEXTS = getDashboardPageTexts("ko");

const NAV_ITEMS = ["Dashboard", "Activity", "Reports", "Settings"];

const STAT_DATA = [
  { label: "Active users", value: "12,840", change: "+5.2%", trend: "up" as const },
  { label: "Tasks done", value: "3,210", change: "+1.4%", trend: "up" as const },
  { label: "Errors", value: "12", change: "-22%", trend: "down" as const },
];

const ACTIVITY_ROWS = [
  {
    userName: "Alex Park",
    initials: "AP",
    action: "Updated profile",
    status: "Completed",
    statusColor: "green" as const,
    time: "2m ago",
  },
  {
    userName: "Bo Lee",
    initials: "BL",
    action: "Created report",
    status: "In progress",
    statusColor: "blue" as const,
    time: "10m ago",
  },
];

const PROFILE_DATA = {
  name: "Dennis",
  role: "Designer",
  email: "dennis@example.com",
  joinedAt: "2025-09-01",
  team: "Design",
  avatarUrl: null,
};

const SUMMARY_DATA = {
  tasks: 24,
  comments: 18,
  completion: 72,
};

const NOTIFICATIONS = {
  email: true,
  push: false,
  weeklyDigest: true,
  mentions: true,
};

const ERROR_TEXTS = {
  title404: "페이지를 찾을 수 없습니다",
  message404: "URL 을 확인해 주세요",
  title500: "서버 오류",
  message500: "잠시 후 다시 시도해 주세요",
  home: "홈으로",
};

const MY_PAGE_TEXTS = {
  title: "마이페이지",
  infoEmail: "이메일",
  infoJoinedAt: "가입일",
  infoTeam: "팀",
  summaryTasks: "할 일",
  summaryComments: "댓글",
  summaryCompletion: "완료율",
  avatarUpload: "이미지 업로드",
};

const SETTINGS_TEXTS = {
  title: "설정",
  notificationsTitle: "알림",
  notificationsEmail: "이메일 알림",
  notificationsPush: "푸시 알림",
  notificationsWeeklyDigest: "주간 다이제스트",
  notificationsMentions: "멘션 알림",
  appearanceTitle: "외관",
  appearanceTheme: "테마",
  appearanceFontSize: "글자 크기",
  languageTitle: "언어 / 지역",
  languageLanguage: "언어",
  languageTimezone: "시간대",
  accountTitle: "계정",
  accountEmail: "이메일",
  accountChangePassword: "비밀번호 변경",
  accountDeleteAccount: "계정 삭제",
};

/**
 * Component name → default props.
 *
 * 등록 안 된 이름은 빈 객체로 처리 (defaults 없음).
 */
export const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  LoginPage: {
    variant: "page",
    texts: LOGIN_TEXTS,
  },
  SignupPage: {
    variant: "page",
    texts: SIGNUP_TEXTS,
  },
  DashboardPage: {
    variant: "page",
    texts: DASHBOARD_TEXTS,
    appName: "Studio",
    stats: STAT_DATA,
    activities: ACTIVITY_ROWS,
  },
  ErrorPage: {
    variant: "page",
    errorVariant: "404",
    texts: ERROR_TEXTS,
  },
  MyPage: {
    variant: "page",
    texts: MY_PAGE_TEXTS,
    appName: "Studio",
    profile: PROFILE_DATA,
    summary: SUMMARY_DATA,
    navItems: NAV_ITEMS,
  },
  SettingsPage: {
    variant: "page",
    texts: SETTINGS_TEXTS,
    appName: "Studio",
    notifications: NOTIFICATIONS,
    theme: "light",
    fontSize: 14,
    language: "ko",
    timezone: "Asia/Seoul",
    themeOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
    languageOptions: [
      { label: "한국어", value: "ko" },
      { label: "English", value: "en" },
    ],
    timezoneOptions: [
      { label: "Seoul (UTC+9)", value: "Asia/Seoul" },
      { label: "UTC", value: "UTC" },
    ],
    accountEmailValue: "dennis@example.com",
    navItems: NAV_ITEMS,
  },
  VariantWrapper: {
    variant: "page",
    triggerLabel: "Open",
  },
  // ── Composites — fixture 가 직접 사용 시 필요 (template 안에서는 template 이 props 전달)

  Sidebar: {
    appName: "Studio",
    navItems: NAV_ITEMS,
    activeIndex: 0,
  },
  ActivityTable: {
    title: "Activity",
    viewAllLabel: "View all",
    columns: { user: "User", action: "Action", status: "Status", time: "Time" },
    rows: ACTIVITY_ROWS,
  },
  ActivitySummary: {
    labels: { tasks: "할 일", comments: "댓글", completion: "완료율" },
    values: SUMMARY_DATA,
  },
  StatCard: STAT_DATA[0],
  BrandHeader: {
    title: "Studio",
    description: "spec.md 기반 디자인 시스템",
  },
  DashboardHeader: {
    title: "Dashboard",
    searchPlaceholder: "검색…",
  },
  ProfileHeader: {
    name: "Dennis",
    role: "Designer",
    avatarUrl: null,
  },
  SettingsHeader: {
    title: "설정",
    searchPlaceholder: "설정 검색",
  },
  ProfileInfoCard: {
    labels: { email: "이메일", joinedAt: "가입일", team: "팀" },
    values: { email: "dennis@example.com", joinedAt: "2025-09-01", team: "Design" },
  },
  AvatarUpload: {
    label: "이미지 업로드",
    avatarUrl: null,
    initials: "D",
  },
  LoginForm: {
    emailLabel: "이메일",
    emailPlaceholder: "이메일을 입력하세요",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    submitButton: "로그인",
  },
  SignupForm: {
    nameLabel: "이름",
    namePlaceholder: "이름을 입력하세요",
    emailLabel: "이메일",
    emailPlaceholder: "이메일을 입력하세요",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    confirmPasswordLabel: "비밀번호 확인",
    confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
    termsAgreement: "약관에 동의합니다",
    submitButton: "회원가입",
  },
  SocialAuthBlock: {
    googleLabel: "Google",
    githubLabel: "GitHub",
  },
  ErrorIcon: { variant: "404" as const },
  ErrorMessage: {
    title: "페이지를 찾을 수 없습니다",
    message: "URL 을 확인해 주세요",
  },
  HomeButton: { label: "홈으로" },
  SettingsGroup: { title: "그룹", description: "설명" },
  SettingsToggleRow: { label: "옵션", helperText: "도움말", checked: false },
  SettingsSelectRow: {
    label: "선택",
    value: "a",
    options: [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ],
  },
  SettingsSliderRow: {
    label: "슬라이더",
    value: 50,
    min: 0,
    max: 100,
  },
};

export function defaultPropsFor(name: string): Record<string, unknown> {
  return DEFAULT_PROPS[name] ?? {};
}
