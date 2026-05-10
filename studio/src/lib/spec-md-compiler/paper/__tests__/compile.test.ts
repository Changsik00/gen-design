import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compileToPaper } from "../compile";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");

describe("compileToPaper — string 입력", () => {
  it("`<Button />` → button 태그 포함 HTML + payload", () => {
    const r = compileToPaper("<Button />");
    expect(r.html).toContain("<!DOCTYPE html>");
    expect(r.html).toContain("<button");
    expect(r.payload).toContain("<style>");
    expect(r.payload).toContain("<button");
    expect(r.errors).toBeUndefined();
  });

  it("Tailwind play CDN 포함 (기본)", () => {
    const r = compileToPaper("<Button />");
    expect(r.html).toContain("cdn.tailwindcss.com");
  });

  it("withTailwind:false 시 CDN 제외", () => {
    const r = compileToPaper("<Button />", { withTailwind: false });
    expect(r.html).not.toContain("cdn.tailwindcss.com");
  });

  it("CSS vars (e.g. --primary) 가 :root 에 주입됨", () => {
    const r = compileToPaper("<Button />");
    expect(r.payload).toContain(":root");
    expect(r.payload).toContain("--primary");
  });
});

describe("compileToPaper — file 입력", () => {
  it("LoginPage fixture 파일 → 컴파일", () => {
    const text = readFileSync(join(SPEC_DIR, "login-page.spec.md"), "utf-8");
    const r = compileToPaper(text);
    expect(r.errors).toBeUndefined();
    expect(r.ast).toBeDefined();
    expect(r.payload).toBeTruthy();
    // i18n placeholder 가 한국어로 해소됨
    expect(r.payload).toContain("로그인");
    // BrandHeader / LoginForm 등 컴포넌트 자식 출력 (특정 클래스 또는 button)
    expect(r.payload).toContain("<button");
  });

  it("DashboardPage fixture", () => {
    const text = readFileSync(join(SPEC_DIR, "dashboard-page.spec.md"), "utf-8");
    const r = compileToPaper(text);
    expect(r.errors).toBeUndefined();
    expect(r.payload).toBeTruthy();
  });
});

describe("compileToPaper — parse 실패", () => {
  it("`<A>...</B>` 미스매치 → errors + 빈 body fallback", () => {
    const r = compileToPaper("<A>foo</B>");
    expect(r.errors).toBeDefined();
    expect(r.errors!.length).toBeGreaterThan(0);
    expect(r.errors![0].stage).toBe("parse");
    expect(r.html).toContain("parse failed");
  });
});
