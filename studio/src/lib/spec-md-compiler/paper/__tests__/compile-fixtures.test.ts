import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compileToPaper } from "../compile";

const SPEC_DIR = join(__dirname, "..", "..", "..", "..", "..", "..", "spec");
const fixtures = readdirSync(SPEC_DIR).filter((f) => f.endsWith(".spec.md"));

describe("compile-fixtures — 28 fixture 컴파일 회귀", () => {
  it("28 개 모두 에러 없이 컴파일", () => {
    const failures: string[] = [];
    for (const file of fixtures) {
      const text = readFileSync(join(SPEC_DIR, file), "utf-8");
      const r = compileToPaper(text);
      if (r.errors && r.errors.length > 0) {
        failures.push(
          `${file}: ${r.errors.map((e) => `[${e.stage}] ${e.message}`).join(", ")}`,
        );
      }
      if (!r.payload || r.payload.length < 50) {
        failures.push(`${file}: empty or near-empty payload`);
      }
    }
    if (failures.length > 0) {
      throw new Error(`Fixture compile failures:\n${failures.join("\n")}`);
    }
  });

  it("결정성: 같은 fixture 두 번 → identical HTML", () => {
    const text = readFileSync(join(SPEC_DIR, "login-page.spec.md"), "utf-8");
    const a = compileToPaper(text);
    const b = compileToPaper(text);
    expect(a.html).toBe(b.html);
    expect(a.payload).toBe(b.payload);
  });
});

describe("compile-fixtures — DOM 등가 스냅샷 (회고 C1 회귀 추적)", () => {
  function snapshotFor(name: string): { payload: string } {
    const text = readFileSync(join(SPEC_DIR, `${name}.spec.md`), "utf-8");
    const r = compileToPaper(text);
    return { payload: r.payload };
  }

  it("LoginPage payload 스냅샷", () => {
    expect(snapshotFor("login-page").payload).toMatchSnapshot();
  });

  it("DashboardPage payload 스냅샷", () => {
    expect(snapshotFor("dashboard-page").payload).toMatchSnapshot();
  });

  it("ErrorPage payload 스냅샷", () => {
    expect(snapshotFor("error-page").payload).toMatchSnapshot();
  });
});
