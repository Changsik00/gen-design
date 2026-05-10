import type { VariantSpec } from "./section-parser";

export function emitVariants(
  variants: VariantSpec[] | null,
  componentName: string
): string {
  if (!variants || variants.length === 0) return "";

  const funcName = `${componentName}Variants`;

  const cases = variants
    .map((v) => {
      const attrs = Object.keys(v.props)
        .sort()
        .map((k) => `${k}="${v.props[k]}"`)
        .join(" ");
      return `    case "${v.name}":\n      return <${componentName} ${attrs} />;`;
    })
    .join("\n");

  return [
    `export function ${funcName}({ variant }: { variant: string }) {`,
    `  switch (variant) {`,
    cases,
    `    default:`,
    `      return null;`,
    `  }`,
    `}`,
  ].join("\n");
}
