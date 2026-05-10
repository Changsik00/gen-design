/**
 * chat.md frontmatter schema 검증 — spec-08-04 F-4.
 *
 * type 별 필수 필드:
 * - shell:     name, applies   (shell.* 사용 X)
 * - scene:     name, identity  (identity prefix = chats/scenes/)
 * - component: name, identity, catalog.tier, catalog.family
 *               (identity prefix = chats/components/)
 *
 * 반환: ParseError[] (stage: "schema"). 빈 배열이면 통과.
 */

import type { ChatFrontmatter, Document, ParseError, SourceLocation } from "./ast-types";

const ZERO_LOC: SourceLocation = { line: 0, col: 0, offset: 0, length: 0 };

export function validateChatSchema(ast: Document): ParseError[] {
  const fm = ast.frontmatter;
  if (!fm) return []; // legacy spec.md → skip
  const errors: ParseError[] = [];

  if (!fm.type) {
    errors.push(err(`frontmatter "type" is required (shell | scene | component)`));
    return errors;
  }
  if (!fm.name) {
    errors.push(err(`frontmatter "name" is required`));
  }

  switch (fm.type) {
    case "shell":
      validateShell(fm, errors);
      break;
    case "scene":
      validateScene(fm, errors);
      break;
    case "component":
      validateComponent(fm, errors);
      break;
    default:
      errors.push(
        err(
          `unknown frontmatter "type": "${fm.type}"`,
          `expected one of: shell, scene, component`,
        ),
      );
  }

  return errors;
}

function validateShell(fm: ChatFrontmatter, errors: ParseError[]): void {
  if (!fm.applies) {
    errors.push(
      err(`shell type 은 "applies" 필드 필수`, `applies: scenes 또는 applies: components`),
    );
  }
  if (fm.shell) {
    errors.push(
      err(
        `shell type 은 자기 자신에게 shell.inherit/exclude 사용 X`,
        `shell.* 는 scene/component 의 frontmatter 에서만 사용`,
      ),
    );
  }
}

function validateScene(fm: ChatFrontmatter, errors: ParseError[]): void {
  if (!fm.identity) {
    errors.push(err(`scene type 은 "identity" 필수`, `예: identity: chats/scenes/login`));
    return;
  }
  if (!fm.identity.startsWith("chats/scenes/")) {
    errors.push(
      err(
        `scene identity prefix 는 "chats/scenes/" — 현재 "${fm.identity}"`,
        `identity: chats/scenes/${slug(fm.identity)}`,
      ),
    );
  }
}

function validateComponent(fm: ChatFrontmatter, errors: ParseError[]): void {
  if (!fm.identity) {
    errors.push(err(`component type 은 "identity" 필수`, `예: identity: chats/components/btn`));
  } else if (!fm.identity.startsWith("chats/components/")) {
    errors.push(
      err(
        `component identity prefix 는 "chats/components/" — 현재 "${fm.identity}"`,
        `identity: chats/components/${slug(fm.identity)}`,
      ),
    );
  }
  if (!fm.catalog?.tier) {
    errors.push(err(`component 은 "catalog.tier" 필수`, `tier: 0~4 (catalog 의 어휘 등급)`));
  }
  if (!fm.catalog?.family) {
    errors.push(err(`component 은 "catalog.family" 필수`, `family: button / form / ...`));
  }
}

function slug(s: string): string {
  const last = s.split("/").pop() ?? s;
  return last.toLowerCase();
}

function err(message: string, suggestion?: string): ParseError {
  const e: ParseError = { message, location: ZERO_LOC, stage: "schema" };
  if (suggestion) e.suggestion = suggestion;
  return e;
}
