import { Sidebar } from "@/components/composites/Sidebar";
import { SettingsHeader } from "@/components/composites/SettingsHeader";
import { SettingsGroup } from "@/components/composites/SettingsGroup";
import { SettingsToggleRow } from "@/components/composites/SettingsToggleRow";
import { SettingsSelectRow } from "@/components/composites/SettingsSelectRow";
import { SettingsSliderRow } from "@/components/composites/SettingsSliderRow";
import { Button } from "@/components/ui/button";
import type { SettingsPageProps, SettingsNotifications } from "../types";

interface SettingsPageFullProps extends SettingsPageProps {
  appName?: string;
  onNotificationChange?: (key: keyof SettingsNotifications, next: boolean) => void;
  onThemeChange?: (next: string) => void;
  onFontSizeChange?: (next: number) => void;
  onLanguageChange?: (next: string) => void;
  onTimezoneChange?: (next: string) => void;
  onChangePassword?: () => void;
  onDeleteAccount?: () => void;
  searchPlaceholder?: string;
}

export function SettingsPage({
  texts,
  notifications,
  theme,
  fontSize,
  language,
  timezone,
  themeOptions,
  languageOptions,
  timezoneOptions,
  accountEmailValue,
  navItems,
  appName = "TaskFlow",
  className,
  onNotificationChange,
  onThemeChange,
  onFontSizeChange,
  onLanguageChange,
  onTimezoneChange,
  onChangePassword,
  onDeleteAccount,
  searchPlaceholder,
}: SettingsPageFullProps) {
  return (
    <div className={`flex h-screen bg-background ${className ?? ""}`}>
      <Sidebar appName={appName} navItems={navItems} activeIndex={3} />
      <main className="flex flex-1 flex-col overflow-auto p-6">
        <SettingsHeader title={texts.title} searchPlaceholder={searchPlaceholder} />

        <div className="space-y-8">
          {/* Notifications */}
          <SettingsGroup title={texts.notificationsTitle}>
            <SettingsToggleRow
              label={texts.notificationsEmail}
              checked={notifications.email}
              onCheckedChange={(next: boolean) => onNotificationChange?.("email", next)}
            />
            <SettingsToggleRow
              label={texts.notificationsPush}
              checked={notifications.push}
              onCheckedChange={(next: boolean) => onNotificationChange?.("push", next)}
            />
            <SettingsToggleRow
              label={texts.notificationsWeeklyDigest}
              checked={notifications.weeklyDigest}
              onCheckedChange={(next: boolean) =>
                onNotificationChange?.("weeklyDigest", next)
              }
            />
            <SettingsToggleRow
              label={texts.notificationsMentions}
              checked={notifications.mentions}
              onCheckedChange={(next: boolean) => onNotificationChange?.("mentions", next)}
            />
          </SettingsGroup>

          {/* Appearance */}
          <SettingsGroup title={texts.appearanceTitle}>
            <SettingsSelectRow
              label={texts.appearanceTheme}
              value={theme}
              options={themeOptions}
              onValueChange={onThemeChange}
            />
            <SettingsSliderRow
              label={texts.appearanceFontSize}
              value={fontSize}
              min={12}
              max={20}
              displayValue={`${fontSize} px`}
              onValueChange={onFontSizeChange}
            />
          </SettingsGroup>

          {/* Language & Region */}
          <SettingsGroup title={texts.languageTitle}>
            <SettingsSelectRow
              label={texts.languageLanguage}
              value={language}
              options={languageOptions}
              onValueChange={onLanguageChange}
            />
            <SettingsSelectRow
              label={texts.languageTimezone}
              value={timezone}
              options={timezoneOptions}
              onValueChange={onTimezoneChange}
            />
          </SettingsGroup>

          {/* Account */}
          <SettingsGroup title={texts.accountTitle}>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm font-medium">{texts.accountEmail}</span>
              <span className="text-sm text-muted-foreground">{accountEmailValue}</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm font-medium">{texts.accountChangePassword}</span>
              <Button variant="outline" size="sm" onClick={onChangePassword}>
                {texts.accountChangePassword}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-b-lg bg-[#FEF2F2] px-4 py-3 ring-1 ring-inset ring-[#FECACA]">
              <span className="text-sm font-medium text-[#B91C1C]">
                {texts.accountDeleteAccount}
              </span>
              <Button variant="destructive" size="sm" onClick={onDeleteAccount}>
                {texts.accountDeleteAccount}
              </Button>
            </div>
          </SettingsGroup>
        </div>
      </main>
    </div>
  );
}
