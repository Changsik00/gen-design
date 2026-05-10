import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import draft7Meta from "ajv/dist/refs/json-schema-draft-07.json";
import { buildCatalog } from "../index";
import { generateSpecSchema } from "../spec-schema";

const SRC_ROOT = "src";

function makeAjv(): Ajv {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  if (!ajv.getSchema("http://json-schema.org/draft-07/schema#")) {
    ajv.addMetaSchema(draft7Meta);
  }
  return ajv;
}

describe("generateSpecSchema — 컴포넌트 인스턴스 검증", () => {
  const catalog = buildCatalog({ studioSrcRoot: SRC_ROOT });
  const schema = generateSpecSchema(catalog);
  const ajv = makeAjv();
  const validate = ajv.compile(schema);

  it("Button + valid variant → PASS", () => {
    const ok = validate({
      name: "Button",
      props: { variant: "default", size: "sm" },
    });
    expect(ok).toBe(true);
  });

  it("Button + 등록 외 variant → FAIL", () => {
    const ok = validate({
      name: "Button",
      props: { variant: "bogus", size: "sm" },
    });
    expect(ok).toBe(false);
  });

  it("미등록 컴포넌트 → FAIL", () => {
    const ok = validate({ name: "Madeup", props: {} });
    expect(ok).toBe(false);
  });

  it("LoginScene (template, manual) + theme → PASS", () => {
    const ok = validate({
      name: "LoginScene",
      props: {},
      theme: "brand-a",
      children: [],
    });
    expect(ok).toBe(true);
  });

  it("tokens override 가 token 참조 → PASS", () => {
    const ok = validate({
      name: "Button",
      tokens: { "--primary": "{{token.semantic.brand-2}}" },
    });
    expect(ok).toBe(true);
  });

  it("tokens override 가 raw hex → FAIL (token reference 패턴 위반)", () => {
    const ok = validate({
      name: "Button",
      tokens: { "--primary": "#FF0000" },
    });
    expect(ok).toBe(false);
  });

  it("tokens override 가 i18n 참조 → PASS", () => {
    const ok = validate({
      name: "Button",
      tokens: { "--primary": "{{i18n.color.brand}}" },
    });
    expect(ok).toBe(true);
  });

  it("name 누락 → FAIL", () => {
    const ok = validate({ props: { variant: "default" } });
    expect(ok).toBe(false);
  });

  it("children 재귀 검증 — 자식이 미등록 컴포넌트 → FAIL", () => {
    const ok = validate({
      name: "LoginScene",
      children: [{ name: "NotARealComponent" }],
    });
    expect(ok).toBe(false);
  });

  it("children 재귀 검증 — 자식이 정상 → PASS", () => {
    const ok = validate({
      name: "LoginScene",
      children: [
        { name: "Button", props: { variant: "default" } },
        { name: "BrandHeader" },
      ],
    });
    expect(ok).toBe(true);
  });

  it("Button 의 props 에 raw rgb 값이 axis 외 prop 으로 들어감 → FAIL (raw 거부)", () => {
    const ok = validate({
      name: "Button",
      props: { customColor: "rgb(255,0,0)" },
    });
    expect(ok).toBe(false);
  });
});
