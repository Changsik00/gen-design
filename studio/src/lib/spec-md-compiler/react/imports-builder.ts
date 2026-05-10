import type { EmitContext } from "./jsx-emitter";

export function buildImports(ctx: EmitContext, usedComponents: string[]): string {
  const lines: string[] = [];

  if (ctx.usedI18nKeys.size > 0) {
    lines.push("// i18n: replace with your project's t() or useTranslation hook");
  }

  if (ctx.usedTokenKeys.size > 0) {
    lines.push("// tokens: values replaced with CSS variables (e.g. var(--primary))");
  }

  for (const name of [...usedComponents].sort()) {
    lines.push(`import { ${name} } from '@/components/ui/${name.toLowerCase()}';`);
  }

  return lines.join("\n");
}
