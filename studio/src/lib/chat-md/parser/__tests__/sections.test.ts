import { describe, it, expect } from "vitest";
import { parse } from "../index";
import type { ComponentInstance } from "../ast-types";

/**
 * spec-08-04 Task 4 — 3-layer section 문법 (TDD Red 단계).
 *
 * `## 💬 Narrative` / `## 🧩 Structure` / `## 📜 History` 헤딩으로 body 분할.
 * - emoji 는 옵션 (`## Narrative` 도 OK)
 * - 영역 순서 자유
 * - Structure 안 ` ```jsx ... ``` ` fenced code block 의 ComponentTag 파싱
 */

const FM = `---
type: scene
name: Login
identity: chats/scenes/login
---
`;

describe("sections — 3-layer 분리", () => {
  it("Narrative / Structure / History 분리 인식", () => {
    const text = `${FM}
# Login

## 💬 Narrative

자연어 설계 의도.

## 🧩 Structure

\`\`\`jsx
<LoginForm />
\`\`\`

## 📜 History

- **2026-05-10** 초안
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.title).toBe("Login");
    expect(r.ast?.narrative?.markdown).toContain("자연어 설계 의도");
    expect(r.ast?.structure?.body.length).toBeGreaterThan(0);
    const c = r.ast?.structure?.body[0] as ComponentInstance;
    expect(c.name).toBe("LoginForm");
    expect(r.ast?.history?.markdown).toContain("2026-05-10");
  });

  it("emoji 없는 ## Narrative 도 인식", () => {
    const text = `${FM}
# X

## Narrative
abc

## Structure

\`\`\`jsx
<Y />
\`\`\`
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.narrative?.markdown).toContain("abc");
    expect((r.ast?.structure?.body[0] as ComponentInstance).name).toBe("Y");
  });

  it("순서 자유 — Structure → Narrative → History", () => {
    const text = `${FM}
# Z

## 🧩 Structure

\`\`\`jsx
<A />
\`\`\`

## 💬 Narrative
설계 의도

## 📜 History
- 2026-05-10
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.narrative?.markdown).toContain("설계 의도");
    expect((r.ast?.structure?.body[0] as ComponentInstance).name).toBe("A");
    expect(r.ast?.history?.markdown).toContain("2026-05-10");
  });

  it("부 헤딩 (### ) 영역 안 보존", () => {
    const text = `${FM}
# X

## 💬 Narrative

본문.

### 부 절

상세.
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.narrative?.markdown).toContain("### 부 절");
    expect(r.ast?.narrative?.markdown).toContain("상세.");
  });
});

describe("sections — 일부 영역 누락", () => {
  it("Narrative 만 있는 chat 도 OK", () => {
    const text = `${FM}
# X

## 💬 Narrative
abc
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.narrative?.markdown).toContain("abc");
    expect(r.ast?.structure).toBeNull();
    expect(r.ast?.history).toBeNull();
  });

  it("Structure 만 있는 chat 도 OK", () => {
    const text = `${FM}
## 🧩 Structure

\`\`\`jsx
<A />
\`\`\`
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.narrative).toBeNull();
    expect((r.ast?.structure?.body[0] as ComponentInstance).name).toBe("A");
    expect(r.ast?.history).toBeNull();
  });
});

describe("sections — backward-compat (legacy spec.md)", () => {
  it("frontmatter / 섹션 없으면 body 노출 (legacy)", () => {
    const r = parse("<Login />");
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter).toBeNull();
    expect(r.ast?.title).toBeNull();
    expect(r.ast?.narrative).toBeNull();
    expect(r.ast?.structure).toBeNull();
    expect(r.ast?.history).toBeNull();
    expect(r.ast?.body?.length).toBeGreaterThan(0);
    expect((r.ast?.body?.[0] as ComponentInstance).name).toBe("Login");
  });

  it("frontmatter 만 있고 섹션 없는 chat — body 채워짐", () => {
    const text = `${FM}
<Login />
`;
    const r = parse(text, { skipSchema: true });
    expect(r.ok).toBe(true);
    expect(r.ast?.frontmatter?.name).toBe("Login");
    expect(r.ast?.structure).toBeNull();
    expect(r.ast?.body?.some((b) => b.type === "ComponentInstance")).toBe(true);
  });
});
