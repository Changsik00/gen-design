import type { BehaviorSpec } from "./section-parser";

export function emitHooks(spec: BehaviorSpec): string {
  const lines: string[] = [];

  for (const s of spec.states) {
    const capitalized = s.name.charAt(0).toUpperCase() + s.name.slice(1);
    lines.push(`const [${s.name}, set${capitalized}] = useState<${s.type}>(${s.defaultValue});`);
  }

  for (const h of spec.handlers) {
    lines.push(`const ${h} = () => { /* TODO */ };`);
  }

  for (const u of spec.rawUnknown) {
    lines.push(`// TODO: ${u}`);
  }

  return lines.join("\n");
}
