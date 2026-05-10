import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compileToPaper } from "../compile";

const FIXTURES_ROOT = join(__dirname, "..", "..", "..", "..", "..", "..", "fixtures", "chats");
const SCENES_DIR = join(FIXTURES_ROOT, "scenes");
const COMPONENTS_DIR = join(FIXTURES_ROOT, "components");

interface Fix { dir: string; name: string }

const fixtures: Fix[] = [
  ...readdirSync(SCENES_DIR).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: SCENES_DIR, name })),
  ...readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".chat.md")).map((name) => ({ dir: COMPONENTS_DIR, name })),
];

describe("compile-fixtures — 28 fixture 컴파일 회귀", () => {
  it("28 개 모두 에러 없이 컴파일", () => {
    const failures: string[] = [];
    for (const f of fixtures) {
      const text = readFileSync(join(f.dir, f.name), "utf-8");
      const r = compileToPaper(text);
      if (r.errors && r.errors.length > 0) {
        failures.push(
          `${f.name}: ${r.errors.map((e) => `[${e.stage}] ${e.message}`).join(", ")}`,
        );
      }
      if (!r.payload || r.payload.length < 50) {
        failures.push(`${f.name}: empty or near-empty payload`);
      }
    }
    if (failures.length > 0) {
      throw new Error(`Fixture compile failures:\n${failures.join("\n")}`);
    }
  });

  it("결정성: 같은 fixture 두 번 → identical HTML", () => {
    const text = readFileSync(join(SCENES_DIR, "login.chat.md"), "utf-8");
    const a = compileToPaper(text);
    const b = compileToPaper(text);
    expect(a.html).toBe(b.html);
    expect(a.payload).toBe(b.payload);
  });
});

describe("compile-fixtures — DOM 등가 스냅샷 (회고 C1 회귀 추적)", () => {
  function snapshotFor(sceneName: string): { payload: string } {
    const text = readFileSync(join(SCENES_DIR, `${sceneName}.chat.md`), "utf-8");
    const r = compileToPaper(text);
    return { payload: r.payload };
  }

  it("LoginScene payload 스냅샷", () => {
    expect(snapshotFor("login").payload).toMatchSnapshot();
  });

  it("DashboardScene payload 스냅샷", () => {
    expect(snapshotFor("dashboard").payload).toMatchSnapshot();
  });

  it("ErrorScene payload 스냅샷", () => {
    expect(snapshotFor("error").payload).toMatchSnapshot();
  });
});
