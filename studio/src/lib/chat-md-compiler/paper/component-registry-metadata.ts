/**
 * Component metadata — name → import path (string only).
 *
 * CLI (gen-design react) 는 *문자열 metadata* 만 필요 — emitted TSX 의 import 구문에 사용.
 * studio frontend (paper preview) 는 별도 `component-registry.ts` 에서 *실제 React 컴포넌트 인스턴스* 도 가져감.
 *
 * 분리 이유 (spec-12-01):
 * - CLI 가 studio frontend (`@/components/*`) 에 의존하지 않도록 paper 결합 차단
 * - 외부 (workspace 외) 동작 가능성 확보 — 단 외부 publish 는 spec-12-07 (plugin 아키텍처) 로 후속
 */

export const COMPONENT_IMPORT_PATHS: Record<string, string> = {
  // Tier 2 (shadcn UI primitive)
  Button: "@/components/ui/button",

  // Tier 3 — composites (20)
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

  // Tier 3 — templates (7)
  DashboardScene: "@/components/templates/DashboardScene",
  ErrorScene: "@/components/templates/ErrorScene",
  LoginScene: "@/components/templates/LoginScene",
  MyScene: "@/components/templates/MyScene",
  SettingsScene: "@/components/templates/SettingsScene",
  SignupScene: "@/components/templates/SignupScene",
  VariantWrapper: "@/components/templates/VariantWrapper",
};

export function lookupImportPath(name: string): string | undefined {
  return COMPONENT_IMPORT_PATHS[name];
}

export function registeredNames(): string[] {
  return Object.keys(COMPONENT_IMPORT_PATHS).sort();
}
