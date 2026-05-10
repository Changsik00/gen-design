import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { lintText } from "../index";
import type { VocabularyCatalog } from "../../../vocabulary/catalog";

const STUDIO_ROOT = join(__dirname, "..", "..", "..", "..", "..");
const CATALOG_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "catalog.json");
const SCHEMA_PATH = join(STUDIO_ROOT, "src", "lib", "vocabulary", "catalog", "spec-schema.json");

let catalog: VocabularyCatalog;
let schema: object;

beforeAll(() => {
  catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as VocabularyCatalog;
  schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8")) as object;
});

describe("lint — 유효한 spec.md", () => {
  it("self-closing 등록 컴포넌트 → 0 errors", () => {
    const r = lintText("<Button />", { catalog, schema });
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });

  it("paired tag with valid axis value", () => {
    // catalog 의 Button.variant 는 default/outline/secondary/ghost/destructive/link
    const r = lintText('<Button variant="default" />', { catalog, schema });
    expect(r.errors.filter((e) => e.stage === "axis" || e.stage === "catalog")).toEqual([]);
  });

  it("nested 등록 컴포넌트", () => {
    const r = lintText("<LoginForm><Button /></LoginForm>", { catalog, schema });
    expect(r.errors.filter((e) => e.stage === "catalog" || e.stage === "axis")).toEqual([]);
  });
});

describe("lint — 미등록 컴포넌트", () => {
  it("`<Buttn />` 오타 → catalog stage error", () => {
    const r = lintText("<Buttn />", { catalog, schema });
    expect(r.ok).toBe(false);
    const catErrs = r.errors.filter((e) => e.stage === "catalog");
    expect(catErrs.length).toBeGreaterThan(0);
    expect(catErrs[0].message).toContain("Unknown component");
    expect(catErrs[0].message).toContain("<Buttn>");
    expect(catErrs[0].suggestion).toContain("Button");
  });

  it("완전히 다른 이름 → suggestion 없음", () => {
    const r = lintText("<XyzZyx />", { catalog, schema });
    const catErrs = r.errors.filter((e) => e.stage === "catalog");
    expect(catErrs.length).toBeGreaterThan(0);
    expect(catErrs[0].suggestion).toBeUndefined();
  });
});

describe("lint — 미등록 axis value", () => {
  it("`<Button variant=\"bogus\" />` → axis stage error", () => {
    const r = lintText('<Button variant="bogus" />', { catalog, schema });
    expect(r.ok).toBe(false);
    const axisErrs = r.errors.filter((e) => e.stage === "axis");
    expect(axisErrs.length).toBe(1);
    expect(axisErrs[0].message).toContain("variant");
    expect(axisErrs[0].message).toContain("bogus");
    expect(axisErrs[0].message).toMatch(/allowed:/);
  });

  it("placeholder 값은 axis 검증 skip", () => {
    const r = lintText("<Button variant={{i18n.x}} />", { catalog, schema });
    const axisErrs = r.errors.filter((e) => e.stage === "axis");
    expect(axisErrs).toEqual([]);
  });
});

describe("lint — tokens 의 raw 값 거부", () => {
  it('tokens={{ "--primary": "#ff0000" }} → catalog stage error', () => {
    const r = lintText(
      '<Button tokens={{ "--primary": "#ff0000" }} />',
      { catalog, schema },
    );
    expect(r.ok).toBe(false);
    const tokenErrs = r.errors.filter((e) =>
      e.message.includes("token reference"),
    );
    expect(tokenErrs.length).toBeGreaterThan(0);
  });

  it('tokens={{ "--primary": "{{token.x}}" }} → 통과', () => {
    const r = lintText(
      '<Button tokens={{ "--primary": "{{token.x}}" }} />',
      { catalog, schema },
    );
    const tokenErrs = r.errors.filter((e) =>
      e.message.includes("token reference"),
    );
    expect(tokenErrs).toEqual([]);
  });
});

describe("lint — parse 실패 시 즉시 종료", () => {
  it("`<A>...</B>` mismatched → parse stage 만 보고", () => {
    const r = lintText("<A>foo</B>", { catalog, schema });
    expect(r.ok).toBe(false);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].stage).toBe("parse");
  });
});
