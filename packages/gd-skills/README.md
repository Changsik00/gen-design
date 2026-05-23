# @gen-design/skills

Install [gen-design](https://github.com/Changsik00/gen-design) AI skills into your Claude Code project.

## Usage

```bash
npx @gen-design/skills
```

Copies 4 skill files into `.claude/skills/` in your current directory:

| Skill | Description |
|---|---|
| `/gd-start` | First onboarding — collect project context + set up DESIGN.md |
| `/gd-chat` | Design a screen by chatting with AI → writes `chat.md` |
| `/gd-design` | Edit design tokens and components in DESIGN.md |
| `/gd-token` | Query design tokens (list / find / show) |

## Options

```bash
npx @gen-design/skills           # install (skip existing)
npx @gen-design/skills --force   # overwrite existing files
```

## What are gen-design skills?

Skills are Markdown files that Claude Code loads as slash commands. Once installed, you can type `/gd-chat` in Claude Code to start a guided design conversation that writes a `chat.md` spec — which then compiles to React TSX via `pnpm gd react <scene>`.

## Requirements

- [Claude Code](https://claude.ai/code)
- Node.js >= 20

## Related

- [`npm create gd-react`](https://www.npmjs.com/package/create-gd-react) — scaffold a new project with skills pre-installed
- [gen-design repo](https://github.com/Changsik00/gen-design) — full documentation
