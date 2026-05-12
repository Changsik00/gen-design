import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { inferChatDiff } from "../diff";
import type { CatalogMap } from "../ast-builder";
import type { PaperTreeNode } from "../tree-types";

/**
 * Dogfood — playground/chats/scenes/login.chat.md 의 진화 시뮬레이션.
 *
 * 시나리오:
 * 1. 디자이너가 실제 PoC chat 작성 (playground/chats/scenes/login.chat.md)
 * 2. Paper artboard 에서 variant 수정 (md → lg) — fixtures/paper-trees/scenes/login.tree.json
 *    의 변형
 * 3. gen-design diff 실행 → Structure 만 갱신, Narrative / History 보존
 *
 * 핵심 검증: 디자이너의 자연어 의도 (Narrative) 가 *bit-for-bit* 보존되는지.
 */

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const LOGIN_CHAT = join(PROJECT_ROOT, "playground", "chats", "scenes", "login.chat.md");

const catalog: CatalogMap = new Map();
catalog.set("LoginForm", [
  { name: "variant", values: ["default", "filled"] },
  { name: "size", values: ["sm", "md", "lg"] },
]);

const NEW_TREE: PaperTreeNode = {
  id: "root",
  name: "[chat:scenes/login]",
  component: "Frame",
  children: [
    {
      id: "c1",
      name: "LoginForm.default.lg",
      component: "Frame",
    },
  ],
};

describe("dogfood — playground/chats/scenes/login.chat.md 진화", () => {
  it("Narrative 영역의 자연어 디자인 의도 bit-for-bit 보존", () => {
    const existing = readFileSync(LOGIN_CHAT, "utf-8");
    const r = inferChatDiff(existing, NEW_TREE, { catalog, date: "2026-05-12" });

    // 디자이너의 핵심 의도 — "헤더 부재 = *몰입*" 보존 확인
    expect(r.text).toContain("로그인 진입점");
    expect(r.text).toContain("집중");
    expect(r.text).toContain("몰입");
    expect(r.text).toContain("법적 의무");
    expect(r.preserved.narrative).toBe(true);
  });

  it("frontmatter 의 shell.exclude 등 메타 정보 보존", () => {
    const existing = readFileSync(LOGIN_CHAT, "utf-8");
    const r = inferChatDiff(existing, NEW_TREE, { catalog, date: "2026-05-12" });

    expect(r.text).toMatch(/identity: chats\/scenes\/login/);
    expect(r.text).toMatch(/exclude:/);
    expect(r.text).toMatch(/BrandHeader/);
    expect(r.preserved.frontmatter).toBe(true);
  });

  it("History 의 *기존* 디자인 합의 기록 보존 + Paper sync 라인 추가", () => {
    const existing = readFileSync(LOGIN_CHAT, "utf-8");
    const r = inferChatDiff(existing, NEW_TREE, { catalog, date: "2026-05-12" });

    // 기존 history 기록 — "디자이너 자연어" / "shell 제약 대화" 등 보존
    expect(r.text).toContain("초안");
    expect(r.text).toContain("디자이너");
    expect(r.preserved.history).toBe(true);

    // 자동 라인 추가 — variant 변경 1
    expect(r.historyLineAdded).toMatch(/2026-05-12.*Paper sync/);
    expect(r.text).toMatch(/Paper sync/);
  });

  it("결정성 — 같은 입력 → 같은 출력 (2회 비교)", () => {
    const existing = readFileSync(LOGIN_CHAT, "utf-8");
    const a = inferChatDiff(existing, NEW_TREE, { catalog, date: "2026-05-12" });
    const b = inferChatDiff(existing, NEW_TREE, { catalog, date: "2026-05-12" });
    expect(a.text).toBe(b.text);
    expect(a.stats).toEqual(b.stats);
  });
});
