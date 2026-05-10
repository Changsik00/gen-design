import type { EmitContext } from "./jsx-emitter";

export function buildImports(ctx: EmitContext, usedComponents: string[]): string {
  const lines: string[] = [];

  if (ctx.usedI18nKeys.size > 0) {
    lines.push("import { useTranslation } from 'react-i18next';");
  }

  if (ctx.usedTokenKeys.size > 0) {
    lines.push("import { tokens } from '@/lib/tokens';");
  }

  for (const name of [...usedComponents].sort()) {
    lines.push(`import { ${name} } from '@/components/ui/${name.toLowerCase()}';`);
  }

  return lines.join("\n");
}
