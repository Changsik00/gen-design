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

export function toKebabCase(name: string): string {
  return name
    .replace(/([A-Z])/g, (_, c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`));
}

export function toRegistryEntry(
  componentName: string,
  tsxContent: string,
  deps: string[]
): RegistryEntry {
  const kebab = toKebabCase(componentName);
  return {
    name: kebab,
    type: "registry:block",
    registryDependencies: [...deps].sort(),
    files: [
      {
        path: `registry/${kebab}/${kebab}.tsx`,
        content: tsxContent,
        type: "registry:component",
      },
    ],
  };
}
