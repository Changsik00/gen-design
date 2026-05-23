import { parseArgs } from "node:util";
import type { ParsedArgs } from "./types.js";

const DEFAULT_REPO = "https://github.com/Changsik00/gen-design-presets/archive/main.tar.gz";

export function parseCliArgs(argv: string[]): ParsedArgs {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      preset: { type: "string", default: "default" },
      "preset-repo": { type: "string", default: DEFAULT_REPO },
      offline: { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      "no-install": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  return {
    projectName: positionals[0],
    preset: values.preset ?? "default",
    presetRepo: values["preset-repo"] ?? DEFAULT_REPO,
    offline: values.offline ?? false,
    force: values.force ?? false,
    noInstall: values["no-install"] ?? false,
    help: values.help ?? false,
    version: values.version ?? false,
  };
}

const VALID_NAME_RE = /^[a-z0-9][a-z0-9-_]*$/i;

export function validateProjectName(name: string | undefined): name is string {
  if (!name) return false;
  if (name.length === 0 || name.length > 64) return false;
  return VALID_NAME_RE.test(name);
}
