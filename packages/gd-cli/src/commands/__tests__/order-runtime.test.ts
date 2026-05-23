import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { generateOrderTsx } from "../order";
import { runReact } from "../react";

let workDir: string;
let chatRoot: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "order-runtime-"));
  chatRoot = join(workDir, "chats");
  mkdirSync(join(chatRoot, "scenes"), { recursive: true });
});

afterEach(() => {
  rmSync(workDir, { recursive: true });
});

const MINIMAL_SCENE = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

# LoginScene

## 🧩 Structure

\`\`\`jsx
<Card>
  <Form />
</Card>
\`\`\`
`;

function writeScene(name: string, content: string) {
  writeFileSync(join(chatRoot, "scenes", `${name}.chat.md`), content, "utf-8");
}

function writeOrder(name: string, content: string) {
  writeFileSync(join(chatRoot, "scenes", `${name}.order.md`), content, "utf-8");
}

// ─── generateOrderTsx ────────────────────────────────────────────────────────

describe("generateOrderTsx", () => {
  it("validation 없으면 빈 chunks", () => {
    const chunks = generateOrderTsx({ scene: "login" });
    expect(chunks.imports).toBe("");
    expect(chunks.schemaDecl).toBe("");
    expect(chunks.formInit).toBe("");
    expect(chunks.onSubmit).toBe("");
  });

  it("email + required → z.string().min(1).email()", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      validation: {
        email: [{ kind: "required" }, { kind: "email" }],
      },
    });
    expect(chunks.schemaDecl).toContain("z.string()");
    expect(chunks.schemaDecl).toContain(".email()");
    expect(chunks.schemaDecl).toContain(".min(1)");
  });

  it("min(8) → .min(8)", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      validation: {
        password: [{ kind: "required" }, { kind: "min", arg: 8 }],
      },
    });
    expect(chunks.schemaDecl).toContain(".min(8)");
  });

  it("useForm binding 생성", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      validation: { email: [{ kind: "email" }] },
    });
    expect(chunks.formInit).toContain("useForm");
    expect(chunks.formInit).toContain("zodResolver(schema)");
  });

  it("zod + react-hook-form import 생성", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      validation: { email: [{ kind: "required" }] },
    });
    expect(chunks.imports).toContain("from 'zod'");
    expect(chunks.imports).toContain("from 'react-hook-form'");
    expect(chunks.imports).toContain("from '@hookform/resolvers/zod'");
  });

  it("form-submit → onSubmit fetch 생성", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      validation: { email: [{ kind: "required" }] },
      actions: { submit: { type: "form-submit", target: "POST /auth/login" } },
    });
    expect(chunks.onSubmit).toContain("fetch");
    expect(chunks.onSubmit).toContain("/auth/login");
    expect(chunks.onSubmit).toContain("POST");
  });

  it("nav action → onSubmit 비생성", () => {
    const chunks = generateOrderTsx({
      scene: "login",
      actions: { link: { type: "nav", target: "/signup" } },
    });
    expect(chunks.onSubmit).toBe("");
  });
});

// ─── runReact + .order.md 통합 ────────────────────────────────────────────────

describe("runReact with .order.md", () => {
  it(".order.md 없으면 기존 TSX 동일 (하위 호환)", async () => {
    writeScene("login", MINIMAL_SCENE);
    const r = await runReact(["login", "--chat-root", chatRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).not.toContain("from 'zod'");
  });

  it(".order.md 있으면 zod import 주입", async () => {
    writeScene("login", MINIMAL_SCENE);
    writeOrder(
      "login",
      `---
scene: login
validation:
  email:
    - required
    - email
actions:
  submit:
    type: form-submit
    target: POST /auth/login
---
`,
    );
    const r = await runReact(["login", "--chat-root", chatRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("from 'zod'");
    expect(r.stdout).toContain("z.object");
  });

  it(".order.md 있으면 useForm 주입", async () => {
    writeScene("login", MINIMAL_SCENE);
    writeOrder(
      "login",
      `---
scene: login
validation:
  password:
    - required
    - min(8)
---
`,
    );
    const r = await runReact(["login", "--chat-root", chatRoot]);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("useForm");
  });
});

// ─── generateOrderTsx — data (useQuery + Skeleton) ───────────────────────────

describe("generateOrderTsx — data fetch", () => {
  it("data 항목 없으면 useQuery import 미생성", () => {
    const chunks = generateOrderTsx({ scene: "dashboard" });
    expect(chunks.imports).not.toContain("react-query");
    expect(chunks.imports).not.toContain("Skeleton");
  });

  it("data 1개 → useQuery + Skeleton import 생성", () => {
    const chunks = generateOrderTsx({
      scene: "dashboard",
      data: [{ queryKey: "tasks.list", endpoint: "GET /tasks" }],
    });
    expect(chunks.imports).toContain("@tanstack/react-query");
    expect(chunks.imports).toContain("@/components/ui/skeleton");
  });

  it("queryKey camelCase 변환 — tasks.list → tasks_list", () => {
    const chunks = generateOrderTsx({
      scene: "dashboard",
      data: [{ queryKey: "tasks.list", endpoint: "GET /tasks" }],
    });
    expect(chunks.formInit).toContain("tasks_listData");
    expect(chunks.formInit).toContain("tasks_listPending");
  });

  it("isPending → <Skeleton /> early return 생성", () => {
    const chunks = generateOrderTsx({
      scene: "dashboard",
      data: [{ queryKey: "tasks.list", endpoint: "GET /tasks" }],
    });
    expect(chunks.onSubmit).toContain("tasks_listPending");
    expect(chunks.onSubmit).toContain("<Skeleton />");
  });

  it("복수 data (2개) → useQuery 2개 생성", () => {
    const chunks = generateOrderTsx({
      scene: "dashboard",
      data: [
        { queryKey: "tasks.list", endpoint: "GET /tasks" },
        { queryKey: "stats.summary", endpoint: "GET /stats" },
      ],
    });
    expect(chunks.formInit).toContain("tasks_listData");
    expect(chunks.formInit).toContain("stats_summaryData");
  });
});
