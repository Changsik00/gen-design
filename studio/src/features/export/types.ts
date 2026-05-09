export const APP_TYPES = [
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "social", label: "Social" },
  { value: "content", label: "Content" },
  { value: "utility", label: "Utility" },
  { value: "custom", label: "Custom" },
] as const;

export type AppType = (typeof APP_TYPES)[number]["value"];

export const PACKAGE_MANAGERS = [
  { value: "pnpm", label: "pnpm" },
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]["value"];

export interface ExportConfig {
  appName: string;
  appType: AppType;
  techStack: string;
  packageManager: PackageManager;
}

export const DEFAULT_CONFIG: ExportConfig = {
  appName: "MyApp",
  appType: "saas",
  techStack: "React + TypeScript + Tailwind CSS",
  packageManager: "pnpm",
};

export type FileType = "design" | "requirements" | "agent" | "tokens";

export const FILE_TABS: { id: FileType; label: string; filename: string }[] = [
  { id: "design", label: "DESIGN.md", filename: "DESIGN.md" },
  { id: "requirements", label: "REQUIREMENTS.md", filename: "REQUIREMENTS.md" },
  { id: "agent", label: "AGENT.md", filename: "AGENT.md" },
  { id: "tokens", label: "tokens.json", filename: "tokens.json" },
];
