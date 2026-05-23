# create-gd-react

> Scaffold a React project with gen-design (gd) integrated.

## Usage

```bash
npx create-gd-react my-app
```

Then open in Claude Code and run `/gd-start`.

See full docs: https://github.com/Changsik00/gen-design

## Options

- `--preset <name>` — preset name (default: `default`)
- `--offline` — use bundled fallback preset (no network)
- `--force` — overwrite existing directory
- `--no-install` — skip `pnpm install`

## What gets created

- Vite + React 19 + TypeScript strict
- shadcn/ui + Tailwind + cva
- TanStack Query + zustand + jotai
- ky (HTTP) + Sentry + consola (logger)
- react-i18next + react-hook-form + zod + date-fns
- eslint 9 + prettier 3 + vitest 4 + Playwright
- Claude Code skills (`gd-start`, `gd-chat`, `gd-token`, `gd-design`)
- chat.md → React TSX deterministic compilation via `gd react`
