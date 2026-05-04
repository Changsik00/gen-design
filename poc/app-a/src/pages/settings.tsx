import { useState } from "react";
import { SettingsPage } from "studio/components/templates";
import type { SettingsNotifications } from "studio/components/templates";
import { getSettingsTexts, getNavItems } from "@/hooks/useTexts";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
];

const timezoneOptions = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Seoul", label: "Asia/Seoul (KST)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
];

export function SettingsRoute() {
  const [notifications, setNotifications] = useState<SettingsNotifications>({
    email: true,
    push: false,
    weeklyDigest: true,
    mentions: true,
  });
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

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
      accountEmailValue="alex@taskflow.com"
      onNotificationChange={(key, next) =>
        setNotifications((prev) => ({ ...prev, [key]: next }))
      }
      onThemeChange={setTheme}
      onFontSizeChange={setFontSize}
      onLanguageChange={setLanguage}
      onTimezoneChange={setTimezone}
    />
  );
}
