import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { parseOrderFile, validateOrderSpec } from "../order";

let tmp: string;

beforeEach(() => {
  tmp = join(tmpdir(), `order-test-${Date.now()}`);
  mkdirSync(tmp, { recursive: true });
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

function write(name: string, content: string) {
  writeFileSync(join(tmp, name), content, "utf-8");
  return join(tmp, name);
}

// ─── parseOrderFile ──────────────────────────────────────────────────────────

describe("parseOrderFile", () => {
  it("파일 없음 → null", () => {
    expect(parseOrderFile(join(tmp, "nonexistent.order.md"))).toBeNull();
  });

  it("scene 필드 파싱", () => {
    const p = write(
      "login.order.md",
      `---
scene: login
---
`,
    );
    const spec = parseOrderFile(p);
    expect(spec).not.toBeNull();
    expect(spec!.scene).toBe("login");
  });

  it("validation required + email 규칙", () => {
    const p = write(
      "login.order.md",
      `---
scene: login
validation:
  email:
    - required
    - email
---
`,
    );
    const spec = parseOrderFile(p);
    expect(spec!.validation).toBeDefined();
    const emailRules = spec!.validation!["email"];
    expect(emailRules).toHaveLength(2);
    expect(emailRules[0]).toEqual({ kind: "required" });
    expect(emailRules[1]).toEqual({ kind: "email" });
  });

  it("validation min(8) 규칙", () => {
    const p = write(
      "login.order.md",
      `---
scene: login
validation:
  password:
    - required
    - min(8)
---
`,
    );
    const spec = parseOrderFile(p);
    const pwRules = spec!.validation!["password"];
    expect(pwRules).toHaveLength(2);
    expect(pwRules[1]).toEqual({ kind: "min", arg: 8 });
  });

  it("validation max(100) 규칙", () => {
    const p = write(
      "v.order.md",
      `---
scene: v
validation:
  name:
    - max(100)
---
`,
    );
    const spec = parseOrderFile(p);
    const rules = spec!.validation!["name"];
    expect(rules[0]).toEqual({ kind: "max", arg: 100 });
  });

  it("actions form-submit 파싱", () => {
    const p = write(
      "login.order.md",
      `---
scene: login
actions:
  submit:
    type: form-submit
    target: POST /auth/login
---
`,
    );
    const spec = parseOrderFile(p);
    expect(spec!.actions).toBeDefined();
    const submit = spec!.actions!["submit"];
    expect(submit.type).toBe("form-submit");
    expect(submit.target).toBe("POST /auth/login");
  });

  it("actions nav 파싱", () => {
    const p = write(
      "login.order.md",
      `---
scene: login
actions:
  signup-link:
    type: nav
    target: /signup
---
`,
    );
    const spec = parseOrderFile(p);
    const link = spec!.actions!["signup-link"];
    expect(link.type).toBe("nav");
    expect(link.target).toBe("/signup");
  });

  it("validation + actions 동시 파싱", () => {
    const p = write(
      "full.order.md",
      `---
scene: login
validation:
  email:
    - required
    - email
  password:
    - required
    - min(8)
actions:
  submit:
    type: form-submit
    target: POST /auth/login
  signup-link:
    type: nav
    target: /signup
---
`,
    );
    const spec = parseOrderFile(p);
    expect(spec!.scene).toBe("login");
    expect(Object.keys(spec!.validation!)).toHaveLength(2);
    expect(Object.keys(spec!.actions!)).toHaveLength(2);
  });

  it("data fetch 파싱", () => {
    const p = write(
      "dashboard.order.md",
      `---
scene: dashboard
data:
  - queryKey: tasks.list
    endpoint: GET /tasks
---
`,
    );
    const spec = parseOrderFile(p);
    expect(spec!.data).toHaveLength(1);
    expect(spec!.data![0].queryKey).toBe("tasks.list");
    expect(spec!.data![0].endpoint).toBe("GET /tasks");
  });
});

// ─── validateOrderSpec ───────────────────────────────────────────────────────

describe("validateOrderSpec", () => {
  it("유효한 spec → 오류 없음", () => {
    const errors = validateOrderSpec({
      scene: "login",
      validation: { email: [{ kind: "required" }, { kind: "email" }] },
      actions: { submit: { type: "form-submit", target: "POST /auth/login" } },
    });
    expect(errors).toHaveLength(0);
  });

  it("scene 없으면 오류", () => {
    const errors = validateOrderSpec({ scene: "" });
    expect(errors.some((e) => e.includes("scene"))).toBe(true);
  });

  it("알 수 없는 ZodRule kind → 오류", () => {
    const errors = validateOrderSpec({
      scene: "test",
      // @ts-expect-error intentional bad input
      validation: { field: [{ kind: "unknown-rule" }] },
    });
    expect(errors.some((e) => e.includes("unknown-rule"))).toBe(true);
  });
});
