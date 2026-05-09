export interface ColorEntry {
  name: string;
  hex: string;
  cssVar: string;
  usage: string;
}

export interface TypographyEntry {
  role: string;
  font: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  notes: string;
}

export interface ElevationEntry {
  level: string;
  treatment: string;
  use: string;
}

export interface DesignDocument {
  appName: string;
  // Section 1: Visual Theme & Atmosphere
  atmosphereDescription: string;
  keyCharacteristics: string[];
  // Section 2: Color Palette & Roles
  colors: ColorEntry[];
  // Section 3: Typography Rules
  fontPrimary: string;
  fontMono: string;
  typographyHierarchy: TypographyEntry[];
  // Section 4: Component Stylings
  componentStylings: string;
  // Section 5: Layout Principles
  spacingBase: string;
  gridMaxWidth: string;
  layoutPrinciples: string;
  // Section 6: Depth & Elevation
  elevations: ElevationEntry[];
  // Section 7: Do's and Don'ts
  dos: string[];
  donts: string[];
  // Section 8: Responsive Behavior
  responsiveBehavior: string;
  // Section 9: Agent Prompt Guide
  agentGuide: string;
}

export const EMPTY_DOCUMENT: DesignDocument = {
  appName: "",
  atmosphereDescription: "",
  keyCharacteristics: [],
  colors: [],
  fontPrimary: "",
  fontMono: "",
  typographyHierarchy: [],
  componentStylings: "",
  spacingBase: "4px",
  gridMaxWidth: "1280px",
  layoutPrinciples: "",
  elevations: [],
  dos: [],
  donts: [],
  responsiveBehavior: "",
  agentGuide: "",
};
