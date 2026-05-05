import { useState } from "react";
import { SettingsPage } from "studio/components/templates";
import type { SettingsNotifications } from "studio/components/templates";
import { getSettingsTexts, getNavItems } from "@/hooks/useTexts";

const themeOptions = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "시스템" },
];

const languageOptions = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

const timezoneOptions = [
  { value: "Asia/Seoul", label: "Asia/Seoul (KST)" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York (EST)" },
];

export function SettingsRoute() {
  const [notifications, setNotifications] = useState<SettingsNotifications>({
    email: true,
    push: true,
    weeklyDigest: false,
    mentions: true,
  });
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("ko");
  const [timezone, setTimezone] = useState("Asia/Seoul");

  return (
    <SettingsPage
      variant="page"
      texts={getSettingsTexts()}
      navItems={getNavItems()}
      notifications={notifications}
      theme={theme}
      fontSize={fontSize}
      language={language}
      timezone={timezone}
      themeOptions={themeOptions}
      languageOptions={languageOptions}
      timezoneOptions={timezoneOptions}
      accountEmailValue="junghyunwoo@flowdesk.kr"
      onNotificationChange={(key, next: boolean) =>
        setNotifications((prev) => ({ ...prev, [key]: next }))
      }
      onThemeChange={setTheme}
      onFontSizeChange={setFontSize}
      onLanguageChange={setLanguage}
      onTimezoneChange={setTimezone}
    />
  );
}
