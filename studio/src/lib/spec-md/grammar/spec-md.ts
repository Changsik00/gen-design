/**
 * spec.md grammar — peggy 문법 소스 (string).
 *
 * 점진적 작성:
 * - Task 3: Placeholder + MarkdownText + Comment
 * - Task 4: ComponentTag (self-closing + paired)
 * - Task 5: Attributes (string + JSON + placeholder)
 *
 * 채택된 도구: peggy (Task 2 비교 결과 — plan.md 참조).
 *
 * 본 string 은 grammar/index.ts 가 런타임 컴파일하여 parser 생성.
 */

export const SPEC_MD_GRAMMAR = String.raw`
{
  function loc(location) {
    return {
      line: location.start.line,
      col: location.start.column,
      offset: location.start.offset,
      length: location.end.offset - location.start.offset,
    };
  }
}

Document
  = body:Block* {
      return { type: "Document", body };
    }

Block
  = Comment
  / Placeholder
  / MarkdownText

// ─── Comment ──────────────────────────────────────────────────────────────
Comment
  = "<!--" text:CommentBody "-->" {
      return { type: "Comment", text, location: loc(location()) };
    }

CommentBody
  = chars:(!"-->" .)* { return chars.map(c => c[1]).join(""); }

// ─── Placeholder ──────────────────────────────────────────────────────────
Placeholder
  = "{{" kind:PlaceholderKind "." path:PathSegments "}}" {
      return {
        type: "Placeholder",
        kind,
        path: path.join("."),
        location: loc(location()),
      };
    }

PlaceholderKind
  = "i18n" / "token"

PathSegments
  = head:Identifier tail:("." Identifier)* {
      return [head, ...tail.map(t => t[1])];
    }

Identifier
  = chars:[a-zA-Z0-9_-]+ { return chars.join(""); }

// ─── MarkdownText ─────────────────────────────────────────────────────────
// 컴포넌트 태그 외 영역. parser 가 가공하지 않고 raw text 보존.
// Task 4 에서 ComponentTag 추가 시 boundary 에 "<" + Identifier 도 포함됨.
MarkdownText
  = chars:MarkdownChar+ {
      return {
        type: "MarkdownText",
        text: chars.join(""),
        location: loc(location()),
      };
    }

MarkdownChar
  = !"<!--" !"{{" !"-->" c:. { return c; }
`;
