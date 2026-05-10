import type { EmitContext } from "./jsx-emitter";
import { lookupImportPath } from "../paper/component-registry";

export interface BuildImportsOptions {
  /**
   * 일치 시 해당 컴포넌트 import 를 생략. 함수명-import 충돌 회피용 (C9).
   * 예: componentName="LoginScene" + body 의 root 가 <LoginScene /> 인 경우.
   */
  excludeName?: string;
}

export function buildImports(
  ctx: EmitContext,
  usedComponents: string[],
  options: BuildImportsOptions = {},
): string {
  const lines: string[] = [];

  if (ctx.usedI18nKeys.size > 0) {
    lines.push("// i18n: replace with your project's t() or useTranslation hook");
  }

  if (ctx.usedTokenKeys.size > 0) {
    lines.push("// tokens: values replaced with CSS variables (e.g. var(--primary))");
  }

  for (const name of [...usedComponents].sort()) {
    if (options.excludeName && name === options.excludeName) continue;
    const path = lookupImportPath(name) ?? `@/components/ui/${name.toLowerCase()}`;
    lines.push(`import { ${name} } from '${path}';`);
  }

  return lines.join("\n");
}
