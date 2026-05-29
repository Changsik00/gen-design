import { describe, it, expect } from "vitest";
import {
  parseExtractArgs,
  parseSectionYaml,
  getFrontmatterVersion,
  generateMswHandlers,
  generateApiSpec,
  runExtract,
  type Scenario,
  type ApiEndpoint,
} from "../extract";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const V2_CHAT_FULL = `---
type: scene
name: DashboardScene
identity: chats/scenes/dashboard
version: 2
---

## 💬 Narrative

대시보드 화면

## 🧩 Structure

<div>hello</div>

## 🔌 API

\`\`\`yaml
- method: GET
  path: /api/stats
  description: "통계 요약"
  response:
    total_sales: number
    active_users: number
- method: GET
  path: /api/orders
  description: "주문 목록"
  response:
    items: "Order[]"
\`\`\`

## 🎬 Scenarios

\`\`\`yaml
- name: loaded
  description: "정상 로드"
  data:
    total_sales: 12450000
    active_users: 234
- name: loading
  description: "대기 중"
  state: pending
- name: error
  description: "오류"
  state: error
  message: "데이터를 불러오지 못했어요."
\`\`\`

## 📜 History

- 2026-05-29: 첫 작성
`;

const V1_CHAT = `---
type: scene
name: LoginScene
identity: chats/scenes/login
---

## 💬 Narrative

로그인 화면
`;

const CHAT_NO_SCENARIOS = `---
type: scene
name: StaticScene
version: 2
---

## 🔌 API

\`\`\`yaml
- method: GET
  path: /api/data
\`\`\`
`;

const CHAT_INVALID_YAML = `---
type: scene
version: 2
---

## 🎬 Scenarios

\`\`\`yaml
- name: loaded
  data: {invalid: [yaml: here
\`\`\`
`;

// ---------------------------------------------------------------------------
// parseExtractArgs
// ---------------------------------------------------------------------------

describe("parseExtractArgs", () => {
  it("파일 경로 파싱", () => {
    const result = parseExtractArgs(["chats/scenes/dashboard.chat.md"]);
    expect(result).toMatchObject({ chatFile: "chats/scenes/dashboard.chat.md" });
  });

  it("--all 플래그", () => {
    const result = parseExtractArgs(["--all"]);
    expect(result).toMatchObject({ all: true });
  });

  it("--dry-run 플래그", () => {
    const result = parseExtractArgs(["foo.chat.md", "--dry-run"]);
    expect(result).toMatchObject({ chatFile: "foo.chat.md", dryRun: true });
  });

  it("--chat-root 옵션", () => {
    const result = parseExtractArgs(["--all", "--chat-root", "playground/chats"]);
    expect(result).toMatchObject({ all: true, chatRoot: "playground/chats" });
  });

  it("--help", () => {
    const result = parseExtractArgs(["--help"]);
    expect(result).toMatchObject({ help: true });
  });

  it("파일과 --all 없으면 에러", () => {
    const result = parseExtractArgs([]);
    expect(result).toHaveProperty("error");
  });

  it("알 수 없는 옵션 에러", () => {
    const result = parseExtractArgs(["--unknown"]);
    expect(result).toHaveProperty("error");
  });
});

// ---------------------------------------------------------------------------
// getFrontmatterVersion
// ---------------------------------------------------------------------------

describe("getFrontmatterVersion", () => {
  it("v2 반환", () => {
    expect(getFrontmatterVersion(V2_CHAT_FULL)).toBe(2);
  });

  it("version 없으면 1 반환 (v1 기본)", () => {
    expect(getFrontmatterVersion(V1_CHAT)).toBe(1);
  });

  it("frontmatter 없으면 null", () => {
    expect(getFrontmatterVersion("hello world")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// parseSectionYaml
// ---------------------------------------------------------------------------

describe("parseSectionYaml", () => {
  it("Scenarios 섹션 파싱", () => {
    const result = parseSectionYaml(V2_CHAT_FULL, "Scenarios");
    expect(Array.isArray(result)).toBe(true);
    const scenarios = result as Scenario[];
    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].name).toBe("loaded");
    expect(scenarios[1].state).toBe("pending");
    expect(scenarios[2].state).toBe("error");
  });

  it("API 섹션 파싱", () => {
    const result = parseSectionYaml(V2_CHAT_FULL, "API");
    expect(Array.isArray(result)).toBe(true);
    const apis = result as ApiEndpoint[];
    expect(apis).toHaveLength(2);
    expect(apis[0].method).toBe("GET");
    expect(apis[0].path).toBe("/api/stats");
  });

  it("섹션 없으면 null", () => {
    expect(parseSectionYaml(V1_CHAT, "Scenarios")).toBeNull();
  });

  it("YAML fenced block 없으면 null", () => {
    const chatNoFence = "---\nversion: 2\n---\n## 🎬 Scenarios\n\n텍스트만 있음\n";
    expect(parseSectionYaml(chatNoFence, "Scenarios")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// generateMswHandlers
// ---------------------------------------------------------------------------

describe("generateMswHandlers", () => {
  const scenarios: Scenario[] = [
    { name: "loaded", data: { total_sales: 12450000, active_users: 234 } },
    { name: "loading", state: "pending" },
    { name: "error", state: "error", message: "오류가 발생했어요." },
  ];

  const apis: ApiEndpoint[] = [
    { method: "GET", path: "/api/stats", response: { total_sales: "number", active_users: "number" } },
  ];

  it("MSW import 포함", () => {
    const result = generateMswHandlers("dashboard", scenarios, apis);
    expect(result).toContain("import { http, HttpResponse, delay } from 'msw'");
  });

  it("핸들러 이름 camelCase", () => {
    const result = generateMswHandlers("my-dashboard", scenarios, apis);
    expect(result).toContain("myDashboardHandlers");
  });

  it("loaded 시나리오 → HttpResponse.json", () => {
    const result = generateMswHandlers("dashboard", scenarios, apis);
    expect(result).toContain("loaded");
    expect(result).toContain("HttpResponse.json");
    expect(result).toContain("/api/stats");
  });

  it("loading 시나리오 → delay('infinite')", () => {
    const result = generateMswHandlers("dashboard", scenarios, apis);
    expect(result).toContain("loading");
    expect(result).toContain("delay('infinite')");
  });

  it("error 시나리오 → status 500 + message", () => {
    const result = generateMswHandlers("dashboard", scenarios, apis);
    expect(result).toContain("error");
    expect(result).toContain("status: 500");
    expect(result).toContain("오류가 발생했어요.");
  });

  it("API 없을 때 placeholder 생성", () => {
    const result = generateMswHandlers("dashboard", scenarios, []);
    expect(result).toContain("TODO");
  });
});

// ---------------------------------------------------------------------------
// generateApiSpec
// ---------------------------------------------------------------------------

describe("generateApiSpec", () => {
  const apis: ApiEndpoint[] = [
    { method: "GET", path: "/api/stats", description: "통계 요약", response: { total_sales: "number" } },
    { method: "POST", path: "/api/orders", description: "주문 생성" },
  ];

  it("타이틀 포함", () => {
    const result = generateApiSpec("dashboard", apis);
    expect(result).toContain("# API Spec: dashboard");
  });

  it("엔드포인트 표 생성", () => {
    const result = generateApiSpec("dashboard", apis);
    expect(result).toContain("GET");
    expect(result).toContain("/api/stats");
    expect(result).toContain("통계 요약");
  });

  it("response JSON 블록", () => {
    const result = generateApiSpec("dashboard", apis);
    expect(result).toContain("```json");
    expect(result).toContain("total_sales");
  });

  it("API 없으면 빈 메시지", () => {
    const result = generateApiSpec("empty", []);
    expect(result).toContain("No API endpoints");
  });
});

// ---------------------------------------------------------------------------
// runExtract (통합)
// ---------------------------------------------------------------------------

describe("runExtract", () => {
  it("v1 파일 → skip 메시지", async () => {
    const written: Record<string, string> = {};
    const result = await runExtract(
      ["/tmp/login.chat.md"],
      {
        readFile: () => V1_CHAT,
        captureWrite: (p, c) => { written[p] = c; },
      }
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("[skip]");
    expect(Object.keys(written)).toHaveLength(0);
  });

  it("Scenarios 없는 파일 → skip 메시지", async () => {
    const written: Record<string, string> = {};
    const result = await runExtract(
      ["/tmp/static.chat.md"],
      {
        readFile: () => CHAT_NO_SCENARIOS,
        captureWrite: (p, c) => { written[p] = c; },
      }
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("[skip]");
  });

  it("정상 파일 → .msw.ts + .api-spec.md 생성", async () => {
    const written: Record<string, string> = {};
    const result = await runExtract(
      ["/chats/scenes/dashboard.chat.md"],
      {
        readFile: () => V2_CHAT_FULL,
        captureWrite: (p, c) => { written[p] = c; },
      }
    );
    expect(result.exitCode).toBe(0);
    expect(Object.keys(written)).toContain("/chats/scenes/dashboard.msw.ts");
    expect(Object.keys(written)).toContain("/chats/scenes/dashboard.api-spec.md");
    expect(written["/chats/scenes/dashboard.msw.ts"]).toContain("dashboardHandlers");
    expect(written["/chats/scenes/dashboard.api-spec.md"]).toContain("/api/stats");
  });

  it("잘못된 YAML → exit 1 + stderr", async () => {
    const result = await runExtract(
      ["/tmp/bad.chat.md"],
      { readFile: () => CHAT_INVALID_YAML }
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("[error]");
  });

  it("--dry-run → 파일 미생성", async () => {
    const written: Record<string, string> = {};
    const result = await runExtract(
      ["--dry-run", "/chats/scenes/dashboard.chat.md"],
      {
        readFile: () => V2_CHAT_FULL,
        captureWrite: (p, c) => { written[p] = c; },
      }
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("[dry-run]");
    expect(Object.keys(written)).toHaveLength(0);
  });

  it("--help → exitCode 0", async () => {
    const result = await runExtract(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage:");
  });
});
