import type { EditableTokens } from "./types";

export function toCssVars(tokens: EditableTokens): Record<string, string> {
  return {
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--background": tokens.background,
    "--card": tokens.card,
    "--foreground": tokens.foreground,
    "--muted-foreground": tokens.mutedForeground,
    "--muted": tokens.muted,
    "--border": tokens.border,
    "--ring": tokens.ring,
    "--destructive": tokens.destructive,
    "--destructive-foreground": tokens.destructiveForeground,
    "--radius": tokens.radiusBase,
    "--font-sans": tokens.fontSans,
    "--font-heading": tokens.fontHeading,
  };
}

export function generateCssOutput(tokens: EditableTokens): string {
  const vars = toCssVars(tokens);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n${lines.join("\n")}\n}\n`;
}
