export interface RegistryEntry {
  name: string;
  type: "registry:block";
  registryDependencies: string[];
  files: {
    path: string;
    content: string;
    type: "registry:component";
  }[];
}

export interface RegistryValidationResult {
  ok: boolean;
  errors: string[];
}

export function toKebabCase(name: string): string {
  return name
    .replace(/([A-Z])/g, (_, c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`));
}

function isUrl(s: string): boolean {
  return /^https?:\/\//.test(s);
}

function normalizeDep(dep: string): string {
  return isUrl(dep) ? dep : toKebabCase(dep);
}

const KEBAB_RE = /^[a-z][a-z0-9-]*$/;

export function toRegistryEntry(
  componentName: string,
  tsxContent: string,
  deps: string[]
): RegistryEntry {
  const kebab = toKebabCase(componentName);
  return {
    name: kebab,
    type: "registry:block",
    registryDependencies: deps.map(normalizeDep).sort(),
    files: [
      {
        path: `registry/${kebab}/${kebab}.tsx`,
        content: tsxContent,
        type: "registry:component",
      },
    ],
  };
}

/**
 * shadcn registry item 형식 검증.
 * - name: kebab-case 필수
 * - registryDependencies 항목: kebab-case 또는 https URL
 * - file path: registry/{name}/{name}.tsx 권장 (warn only — 미시행)
 */
export function validateShadcnRegistryItem(item: RegistryEntry): RegistryValidationResult {
  const errors: string[] = [];

  if (!KEBAB_RE.test(item.name)) {
    errors.push(`name '${item.name}' must be kebab-case (a-z, 0-9, hyphen)`);
  }

  for (const dep of item.registryDependencies) {
    if (!isUrl(dep) && !KEBAB_RE.test(dep)) {
      errors.push(`dependency '${dep}' must be kebab-case or a URL`);
    }
  }

  return { ok: errors.length === 0, errors };
}
