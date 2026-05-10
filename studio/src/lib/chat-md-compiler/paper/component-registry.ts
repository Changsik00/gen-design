/**
 * Component name → React.ComponentType 매핑.
 *
 * spec.md 의 ComponentInstance.name 을 실제 studio React 컴포넌트로 해소한다.
 * spec-7-04 (React compiler) 도 동일 레지스트리 사용 → DRY.
 *
 * 등록된 모든 이름은 catalog.json (spec-7-01) 의 Tier 2 + Tier 3 어휘와 1:1 일치해야 함.
 */

import type { ComponentType } from "react";

// Tier 2 (shadcn UI primitive)
import { Button } from "@/components/ui/button";

// Tier 3 — composites (20)
import { ActivitySummary } from "@/components/composites/ActivitySummary";
import { ActivityTable } from "@/components/composites/ActivityTable";
import { AvatarUpload } from "@/components/composites/AvatarUpload";
import { BrandHeader } from "@/components/composites/BrandHeader";
import { DashboardHeader } from "@/components/composites/DashboardHeader";
import { ErrorIcon } from "@/components/composites/ErrorIcon";
import { ErrorMessage } from "@/components/composites/ErrorMessage";
import { HomeButton } from "@/components/composites/HomeButton";
import { LoginForm } from "@/components/composites/LoginForm";
import { ProfileHeader } from "@/components/composites/ProfileHeader";
import { ProfileInfoCard } from "@/components/composites/ProfileInfoCard";
import { SettingsGroup } from "@/components/composites/SettingsGroup";
import { SettingsHeader } from "@/components/composites/SettingsHeader";
import { SettingsSelectRow } from "@/components/composites/SettingsSelectRow";
import { SettingsSliderRow } from "@/components/composites/SettingsSliderRow";
import { SettingsToggleRow } from "@/components/composites/SettingsToggleRow";
import { Sidebar } from "@/components/composites/Sidebar";
import { SignupForm } from "@/components/composites/SignupForm";
import { SocialAuthBlock } from "@/components/composites/SocialAuthBlock";
import { StatCard } from "@/components/composites/StatCard";

// Tier 3 — templates (7)
import { DashboardScene } from "@/components/templates/DashboardScene";
import { ErrorScene } from "@/components/templates/ErrorScene";
import { LoginScene } from "@/components/templates/LoginScene";
import { MyScene } from "@/components/templates/MyScene";
import { SettingsScene } from "@/components/templates/SettingsScene";
import { SignupScene } from "@/components/templates/SignupScene";
import { VariantWrapper } from "@/components/templates/VariantWrapper";

export const COMPONENT_REGISTRY: Record<string, ComponentType<Record<string, unknown>>> = {
  Button: Button as unknown as ComponentType<Record<string, unknown>>,

  ActivitySummary: ActivitySummary as unknown as ComponentType<Record<string, unknown>>,
  ActivityTable: ActivityTable as unknown as ComponentType<Record<string, unknown>>,
  AvatarUpload: AvatarUpload as unknown as ComponentType<Record<string, unknown>>,
  BrandHeader: BrandHeader as unknown as ComponentType<Record<string, unknown>>,
  DashboardHeader: DashboardHeader as unknown as ComponentType<Record<string, unknown>>,
  ErrorIcon: ErrorIcon as unknown as ComponentType<Record<string, unknown>>,
  ErrorMessage: ErrorMessage as unknown as ComponentType<Record<string, unknown>>,
  HomeButton: HomeButton as unknown as ComponentType<Record<string, unknown>>,
  LoginForm: LoginForm as unknown as ComponentType<Record<string, unknown>>,
  ProfileHeader: ProfileHeader as unknown as ComponentType<Record<string, unknown>>,
  ProfileInfoCard: ProfileInfoCard as unknown as ComponentType<Record<string, unknown>>,
  SettingsGroup: SettingsGroup as unknown as ComponentType<Record<string, unknown>>,
  SettingsHeader: SettingsHeader as unknown as ComponentType<Record<string, unknown>>,
  SettingsSelectRow: SettingsSelectRow as unknown as ComponentType<Record<string, unknown>>,
  SettingsSliderRow: SettingsSliderRow as unknown as ComponentType<Record<string, unknown>>,
  SettingsToggleRow: SettingsToggleRow as unknown as ComponentType<Record<string, unknown>>,
  Sidebar: Sidebar as unknown as ComponentType<Record<string, unknown>>,
  SignupForm: SignupForm as unknown as ComponentType<Record<string, unknown>>,
  SocialAuthBlock: SocialAuthBlock as unknown as ComponentType<Record<string, unknown>>,
  StatCard: StatCard as unknown as ComponentType<Record<string, unknown>>,

  DashboardScene: DashboardScene as unknown as ComponentType<Record<string, unknown>>,
  ErrorScene: ErrorScene as unknown as ComponentType<Record<string, unknown>>,
  LoginScene: LoginScene as unknown as ComponentType<Record<string, unknown>>,
  MyScene: MyScene as unknown as ComponentType<Record<string, unknown>>,
  SettingsScene: SettingsScene as unknown as ComponentType<Record<string, unknown>>,
  SignupScene: SignupScene as unknown as ComponentType<Record<string, unknown>>,
  VariantWrapper: VariantWrapper as unknown as ComponentType<Record<string, unknown>>,
};

/**
 * 각 컴포넌트의 실제 import 경로 — 위 import 문과 1:1 일치.
 * imports-builder (spec-7-10) 가 정확한 디렉토리 + 파일 casing 으로 import 문을 생성하기 위해 사용.
 *
 * 컨벤션:
 * - Tier 2 (shadcn ui primitive): @/components/ui/{lowercase}
 * - Tier 3 composites: @/components/composites/{PascalCase}
 * - Tier 3 templates: @/components/templates/{PascalCase}
 */
export const COMPONENT_IMPORT_PATHS: Record<string, string> = {
  Button: "@/components/ui/button",

  ActivitySummary: "@/components/composites/ActivitySummary",
  ActivityTable: "@/components/composites/ActivityTable",
  AvatarUpload: "@/components/composites/AvatarUpload",
  BrandHeader: "@/components/composites/BrandHeader",
  DashboardHeader: "@/components/composites/DashboardHeader",
  ErrorIcon: "@/components/composites/ErrorIcon",
  ErrorMessage: "@/components/composites/ErrorMessage",
  HomeButton: "@/components/composites/HomeButton",
  LoginForm: "@/components/composites/LoginForm",
  ProfileHeader: "@/components/composites/ProfileHeader",
  ProfileInfoCard: "@/components/composites/ProfileInfoCard",
  SettingsGroup: "@/components/composites/SettingsGroup",
  SettingsHeader: "@/components/composites/SettingsHeader",
  SettingsSelectRow: "@/components/composites/SettingsSelectRow",
  SettingsSliderRow: "@/components/composites/SettingsSliderRow",
  SettingsToggleRow: "@/components/composites/SettingsToggleRow",
  Sidebar: "@/components/composites/Sidebar",
  SignupForm: "@/components/composites/SignupForm",
  SocialAuthBlock: "@/components/composites/SocialAuthBlock",
  StatCard: "@/components/composites/StatCard",

  DashboardScene: "@/components/templates/DashboardScene",
  ErrorScene: "@/components/templates/ErrorScene",
  LoginScene: "@/components/templates/LoginScene",
  MyScene: "@/components/templates/MyScene",
  SettingsScene: "@/components/templates/SettingsScene",
  SignupScene: "@/components/templates/SignupScene",
  VariantWrapper: "@/components/templates/VariantWrapper",
};

export function lookupComponent(
  name: string,
): ComponentType<Record<string, unknown>> | undefined {
  return COMPONENT_REGISTRY[name];
}

export function lookupImportPath(name: string): string | undefined {
  return COMPONENT_IMPORT_PATHS[name];
}

export function registeredNames(): string[] {
  return Object.keys(COMPONENT_REGISTRY).sort();
}
