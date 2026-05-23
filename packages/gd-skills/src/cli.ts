#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_SRC = join(__dirname, "..", "skills");
const SKILLS_DEST = join(process.cwd(), ".claude", "skills");

const force = process.argv.includes("--force");

function green(s: string) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s: string) { return `\x1b[33m${s}\x1b[0m`; }
function bold(s: string) { return `\x1b[1m${s}\x1b[0m`; }
function dim(s: string) { return `\x1b[2m${s}\x1b[0m`; }

console.log(`\n${bold("gd-skills")} — gen-design AI skills installer\n`);

if (!existsSync(SKILLS_SRC)) {
  console.error("❌ skills/ 디렉토리를 찾을 수 없습니다. 패키지가 올바르게 설치됐는지 확인하세요.");
  process.exit(1);
}

mkdirSync(SKILLS_DEST, { recursive: true });

const files = readdirSync(SKILLS_SRC).filter((f) => f.endsWith(".md"));
const installed: string[] = [];
const skipped: string[] = [];

for (const file of files) {
  const dest = join(SKILLS_DEST, file);
  if (existsSync(dest) && !force) {
    skipped.push(file);
    continue;
  }
  copyFileSync(join(SKILLS_SRC, file), dest);
  installed.push(file);
}

if (installed.length > 0) {
  console.log(green("✅ 설치 완료:"));
  for (const f of installed) {
    console.log(`   ${green("+")} .claude/skills/${f}`);
  }
}

if (skipped.length > 0) {
  console.log(yellow("\n⏭  이미 존재 (스킵):"));
  for (const f of skipped) {
    console.log(`   ${dim("·")} .claude/skills/${f}`);
  }
  console.log(dim(`   덮어쓰려면: npx @gen-design/skills --force`));
}

if (installed.length === 0 && skipped.length === 0) {
  console.log("설치할 스킬 파일이 없습니다.");
  process.exit(0);
}

console.log(`
${bold("🚀 다음 단계:")}
   Claude Code 에서 다음 스킬을 사용할 수 있습니다:

   ${green("/gd-start")}   — 첫 온보딩, 프로젝트 컨텍스트 수집
   ${green("/gd-chat")}    — AI와 대화로 화면(chat.md) 작성
   ${green("/gd-design")}  — DESIGN.md 토큰/컴포넌트 편집
   ${green("/gd-token")}   — 디자인 토큰 쿼리
`);
