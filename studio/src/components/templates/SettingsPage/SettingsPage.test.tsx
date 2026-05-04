import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SettingsPage } from ".";
import type { SettingsPageProps, SettingsPageTexts } from "../types";

afterEach(cleanup);

const texts: SettingsPageTexts = {
  title: "Settings",
  notificationsTitle: "Notifications",
  notificationsEmail: "Email notifications",
  notificationsPush: "Push notifications",
  notificationsWeeklyDigest: "Weekly digest",
  notificationsMentions: "Mention alerts",
  appearanceTitle: "Appearance",
  appearanceTheme: "Theme",
  appearanceFontSize: "Font size",
  languageTitle: "Language & Region",
  languageLanguage: "Language",
  languageTimezone: "Time zone",
  accountTitle: "Account",
  accountEmail: "Email address",
  accountChangePassword: "Change password",
  accountDeleteAccount: "Delete account",
};

const baseProps: SettingsPageProps = {
  variant: "page",
  texts,
  navItems: ["Home", "Tasks", "Settings"],
  notifications: { email: true, push: false, weeklyDigest: true, mentions: true },
  theme: "light",
  fontSize: 14,
  language: "en",
  timezone: "UTC",
  accountEmailValue: "alex@example.com",
  themeOptions: [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ],
  languageOptions: [{ value: "en", label: "English" }],
  timezoneOptions: [{ value: "UTC", label: "UTC" }],
};

describe("SettingsPage", () => {
  it("renders 4 group titles", () => {
    render(<SettingsPage {...baseProps} />);
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Appearance" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Language & Region" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Account" })).toBeInTheDocument();
  });

  it("renders 4 notification toggle labels", () => {
    render(<SettingsPage {...baseProps} />);
    expect(screen.getByText("Email notifications")).toBeInTheDocument();
    expect(screen.getByText("Push notifications")).toBeInTheDocument();
    expect(screen.getByText("Weekly digest")).toBeInTheDocument();
    expect(screen.getByText("Mention alerts")).toBeInTheDocument();
  });

  it("renders 4 switches with reflective checked state", () => {
    render(<SettingsPage {...baseProps} />);
    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(4);
    expect(switches[0]).toHaveAttribute("aria-checked", "true"); // email
    expect(switches[1]).toHaveAttribute("aria-checked", "false"); // push
  });

  it("renders Change password and Delete account buttons", () => {
    render(<SettingsPage {...baseProps} />);
    expect(
      screen.getByRole("button", { name: "Change password" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete account" })
    ).toBeInTheDocument();
  });

  it("displays account email value", () => {
    render(<SettingsPage {...baseProps} />);
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
  });
});
