/**
 * Paper layer name 의 `[chat:type/slug]` 마커 → IdentityRef.
 *
 * 컨벤션 (handbook R7):
 * - `[chat:scenes/<slug>]`     — scene
 * - `[chat:components/<slug>]` — component
 * - `[chat:_shell]`            — shell (글로벌 외각)
 *
 * slug = kebab-case (소문자 / 숫자 / 하이픈만). CamelCase / snake_case 거부.
 */

export interface IdentityRef {
  kind: "scene" | "component" | "shell";
  slug: string;
  /** 원본 layer name 안 마커 substring. */
  raw: string;
  /** 예상 chat.md 경로 (chats/scenes/<slug>.chat.md 등). */
  expectedPath: string;
}

const SHELL_RE = /\[chat:_shell\]/;
const IDENTITY_RE = /\[chat:(scenes|components)\/([a-z0-9]+(?:-[a-z0-9]+)*)\]/;

export function parseIdentity(layerName: string): IdentityRef | null {
  if (!layerName) return null;

  const shell = SHELL_RE.exec(layerName);
  if (shell) {
    return {
      kind: "shell",
      slug: "_shell",
      raw: shell[0],
      expectedPath: "chats/_shell.chat.md",
    };
  }

  const m = IDENTITY_RE.exec(layerName);
  if (!m) return null;

  const kindRaw = m[1];
  const slug = m[2];
  const kind: IdentityRef["kind"] = kindRaw === "scenes" ? "scene" : "component";
  return {
    kind,
    slug,
    raw: m[0],
    expectedPath: `chats/${kindRaw}/${slug}.chat.md`,
  };
}
