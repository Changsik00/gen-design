export interface EditableTokens {
  // Brand
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  // Surface
  background: string;
  card: string;
  // Text
  foreground: string;
  mutedForeground: string;
  // UI
  muted: string;
  border: string;
  ring: string;
  // Status
  destructive: string;
  destructiveForeground: string;
  // Radius
  radiusBase: string;
  // Typography
  fontSans: string;
  fontHeading: string;
}

export const DEFAULT_TOKENS: EditableTokens = {
  primary: "#4F46E5",
  primaryForeground: "#FFFFFF",
  accent: "#EEF2FF",
  accentForeground: "#4338CA",
  background: "#F8FAFC",
  card: "#FFFFFF",
  foreground: "#0F172A",
  mutedForeground: "#475569",
  muted: "#F1F5F9",
  border: "#E2E8F0",
  ring: "#818CF8",
  destructive: "#B91C1C",
  destructiveForeground: "#FFFFFF",
  radiusBase: "0.5rem",
  fontSans: "'Inter', system-ui, sans-serif",
  fontHeading: "'Inter', system-ui, sans-serif",
};
