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
  / ComponentTag
  / Placeholder
  / MarkdownText

// ─── ComponentTag ─────────────────────────────────────────────────────────
ComponentTag
  = SelfClosingTag
  / PairedTag

SelfClosingTag
  = "<" name:ComponentName _ "/>" {
      return {
        type: "ComponentInstance",
        name,
        props: {},
        children: [],
        location: loc(location()),
      };
    }

PairedTag
  = "<" openName:ComponentName _ ">" body:Block* "</" closeName:ComponentName _ ">" {
      if (openName !== closeName) {
        error("Mismatched closing tag: expected </" + openName + "> but got </" + closeName + ">");
      }
      return {
        type: "ComponentInstance",
        name: openName,
        props: {},
        children: body,
        location: loc(location()),
      };
    }

ComponentName
  = first:[A-Z] rest:[a-zA-Z0-9_]* { return first + rest.join(""); }

_ "whitespace"
  = [ \t\n\r]*

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
// boundary: Comment 시작/끝, Placeholder 시작, ComponentTag 열기/닫기.
// 단 lowercase HTML (e.g. <div>) 는 markdown 의 일부로 취급.
MarkdownText
  = chars:MarkdownChar+ {
      return {
        type: "MarkdownText",
        text: chars.join(""),
        location: loc(location()),
      };
    }

MarkdownChar
  = !"<!--" !"-->" !"{{" !ClosingComponentTag !OpeningComponentTag c:. { return c; }

OpeningComponentTag
  = "<" [A-Z]

ClosingComponentTag
  = "</" [A-Z]
`;
