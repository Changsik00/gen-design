import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { compileScene } from "../compile-scene";

/**
 * Dogfood — playground/chats 의 실제 PoC 흐름을 compileScene 으로 통합.
 *
 * 검증:
 * - shell.exclude=[BrandHeader] 적용 (LoginScene 에 BrandHeader 미포함)
 * - shell inherit 의 AppFooter 포함 (자동 inject)
 * - scene 의 LoginForm 본문 inject
 * - 결정성 (2회 호출 동일 TSX)
 */

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..", "..");
const PROJECT_ROOT = join(STUDIO_ROOT, "..");
const CHAT_ROOT = join(PROJECT_ROOT, "playground", "chats");

describe("dogfood — playground/chats/scenes/login + _shell → 통합 TSX", () => {
  it("LoginScene 컴파일 성공", () => {
    const r = compileScene("login", { chatRoot: CHAT_ROOT });
    expect(r.ok).toBe(true);
    expect(r.tsx).toBeDefined();
  });

  it("shell.exclude=[BrandHeader] 적용 — BrandHeader 태그 X", () => {
    const r = compileScene("login", { chatRoot: CHAT_ROOT });
    expect(r.tsx).not.toMatch(/<BrandHeader/);
  });

  it("shell inherit 의 AppFooter 포함", () => {
    const r = compileScene("login", { chatRoot: CHAT_ROOT });
    expect(r.tsx).toMatch(/AppFooter/);
  });

  it("scene 의 LoginForm 본문 inject", () => {
    const r = compileScene("login", { chatRoot: CHAT_ROOT });
    expect(r.tsx).toMatch(/LoginForm/);
  });

  it("결정성 — 2회 호출 동일 TSX", () => {
    const a = compileScene("login", { chatRoot: CHAT_ROOT });
    const b = compileScene("login", { chatRoot: CHAT_ROOT });
    expect(a.tsx).toBe(b.tsx);
  });

  it("main scene 도 컴파일 가능 (EmptyState 본문)", () => {
    const r = compileScene("main", { chatRoot: CHAT_ROOT });
    expect(r.ok).toBe(true);
    expect(r.tsx).toMatch(/EmptyState|MainScene/);
  });
});
