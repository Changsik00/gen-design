import { describe, it, expect } from "vitest";
import { mergeShellAndScene } from "../shell-merge";
import type {
  ChatFrontmatter,
  ComponentInstance,
  Document,
  Placeholder,
} from "../../../chat-md/parser/ast-types";

const NULL_LOC = { line: 0, col: 0, offset: 0, length: 0 };

const ci = (name: string, children: ComponentInstance["children"] = []): ComponentInstance => ({
  type: "ComponentInstance",
  name,
  props: {},
  children,
  location: NULL_LOC,
});

const sceneContentPlaceholder = (): Placeholder => ({
  type: "Placeholder",
  kind: "scene",
  path: "content",
  location: NULL_LOC,
});

const doc = (overrides: Partial<Document>): Document => ({
  type: "Document",
  body: [],
  frontmatter: null,
  title: null,
  narrative: null,
  structure: null,
  history: null,
  ...overrides,
});

const sceneDoc = (sceneFm: ChatFrontmatter, sceneBody: ComponentInstance["children"]): Document =>
  doc({
    frontmatter: sceneFm,
    title: "LoginScene",
    narrative: { type: "Narrative", markdown: "로그인 진입점.", location: NULL_LOC },
    structure: { type: "Structure", body: sceneBody, location: NULL_LOC },
    history: { type: "History", markdown: "- **2026-05-10** 초안", location: NULL_LOC },
  });

const shellDoc = (shellBody: ComponentInstance["children"]): Document =>
  doc({
    frontmatter: { type: "shell", name: "AppShell", applies: "scenes" } as ChatFrontmatter,
    title: "AppShell",
    structure: { type: "Structure", body: shellBody, location: NULL_LOC },
  });

describe("mergeShellAndScene — shell.exclude", () => {
  it("exclude 비어있음 → 모든 shell components 유지", () => {
    const scene = sceneDoc(
      { type: "scene", name: "LoginScene" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([ci("BrandHeader"), sceneContentPlaceholder(), ci("AppFooter")]);
    const merged = mergeShellAndScene({ sceneDoc: scene, shellDoc: shell, exclude: [] });
    const names = (merged.structure?.body ?? []).map((b) => (b as ComponentInstance).name);
    expect(names).toContain("BrandHeader");
    expect(names).toContain("AppFooter");
    expect(names).toContain("LoginForm");
  });

  it("exclude=[BrandHeader] → BrandHeader 제거", () => {
    const scene = sceneDoc(
      { type: "scene", name: "X" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([ci("BrandHeader"), sceneContentPlaceholder(), ci("AppFooter")]);
    const merged = mergeShellAndScene({
      sceneDoc: scene,
      shellDoc: shell,
      exclude: ["BrandHeader"],
    });
    const names = (merged.structure?.body ?? []).map((b) =>
      b.type === "ComponentInstance" ? b.name : "_other",
    );
    expect(names).not.toContain("BrandHeader");
    expect(names).toContain("AppFooter");
    expect(names).toContain("LoginForm");
  });

  it("중첩된 shell 안 component 도 재귀 제거", () => {
    const scene = sceneDoc(
      { type: "scene", name: "X" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([
      ci("Header", [ci("BrandHeader"), ci("Nav")]),
      sceneContentPlaceholder(),
    ]);
    const merged = mergeShellAndScene({
      sceneDoc: scene,
      shellDoc: shell,
      exclude: ["BrandHeader"],
    });
    const header = merged.structure!.body[0] as ComponentInstance;
    const childNames = header.children.map((c) =>
      c.type === "ComponentInstance" ? c.name : "_other",
    );
    expect(childNames).not.toContain("BrandHeader");
    expect(childNames).toContain("Nav");
  });
});

describe("mergeShellAndScene — scene.content placeholder", () => {
  it("{{scene.content}} 위치에 scene.structure.body inject", () => {
    const scene = sceneDoc(
      { type: "scene", name: "X" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([ci("BrandHeader"), sceneContentPlaceholder(), ci("AppFooter")]);
    const merged = mergeShellAndScene({ sceneDoc: scene, shellDoc: shell, exclude: [] });
    const body = merged.structure!.body;
    expect(body[0].type).toBe("ComponentInstance");
    expect((body[1] as ComponentInstance).name).toBe("LoginForm");
    expect((body[2] as ComponentInstance).name).toBe("AppFooter");
  });

  it("placeholder 없는 shell → scene body 누락 (경고 없이)", () => {
    const scene = sceneDoc(
      { type: "scene", name: "X" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([ci("BrandHeader"), ci("AppFooter")]);
    const merged = mergeShellAndScene({ sceneDoc: scene, shellDoc: shell, exclude: [] });
    const names = merged.structure!.body
      .filter((b): b is ComponentInstance => b.type === "ComponentInstance")
      .map((b) => b.name);
    expect(names).not.toContain("LoginForm");
  });

  it("다중 placeholder — 같은 body 복제", () => {
    const scene = sceneDoc(
      { type: "scene", name: "X" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([sceneContentPlaceholder(), ci("Spacer"), sceneContentPlaceholder()]);
    const merged = mergeShellAndScene({ sceneDoc: scene, shellDoc: shell, exclude: [] });
    const loginForms = merged.structure!.body.filter(
      (b) => b.type === "ComponentInstance" && b.name === "LoginForm",
    );
    expect(loginForms.length).toBe(2);
  });
});

describe("mergeShellAndScene — 메타 보존", () => {
  it("frontmatter / title / narrative / history = scene 의 것", () => {
    const scene = sceneDoc(
      { type: "scene", name: "LoginScene", identity: "chats/scenes/login" } as ChatFrontmatter,
      [ci("LoginForm")],
    );
    const shell = shellDoc([sceneContentPlaceholder()]);
    const merged = mergeShellAndScene({ sceneDoc: scene, shellDoc: shell, exclude: [] });
    expect(merged.frontmatter?.name).toBe("LoginScene");
    expect(merged.title).toBe("LoginScene");
    expect(merged.narrative?.markdown).toBe("로그인 진입점.");
    expect(merged.history?.markdown).toMatch(/2026-05-10/);
  });
});
