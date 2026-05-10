/**
 * Paper Preview — fixture 선택 후 좌(React) / 우(Paper-compiled HTML iframe) split.
 *
 * 회고 phase-6 C1 (Paper ↔ React 정합 미검증) 의 *상시 비교 도구*.
 * 디자이너가 spec.md 작성 → 즉시 양쪽이 같은지 *시각으로* 확인.
 *
 * "Send to Paper" 는 Claude Code 세션의 paper.write_html 호출을 안내 (clipboard 복사).
 */

import { useMemo, useState, useEffect } from "react";
import { compileToPaper } from "@/lib/chat-md-compiler/paper/compile";
import { buildReactTree } from "@/lib/chat-md-compiler/paper/react-builder";
import { COMPONENT_REGISTRY } from "@/lib/chat-md-compiler/paper/component-registry";
import { parse } from "@/lib/chat-md/parser";
import koBundle from "@/i18n/ko.json";
import { FIXTURES } from "./fixtures.generated";

export function PreviewPage() {
  const [selectedName, setSelectedName] = useState<string>(
    FIXTURES.find((f) => f.name === "login-page")?.name ?? FIXTURES[0]?.name ?? "",
  );
  const [copyMessage, setCopyMessage] = useState<string>("");

  const fixture = FIXTURES.find((f) => f.name === selectedName);
  const text = fixture?.text ?? "";

  const reactTree = useMemo(() => {
    if (!text) return [];
    const r = parse(text);
    if (!r.ok || !r.ast) return [];
    return buildReactTree(r.ast, { registry: COMPONENT_REGISTRY, bundle: koBundle });
  }, [text]);

  const compiled = useMemo(() => {
    if (!text) return null;
    return compileToPaper(text);
  }, [text]);

  useEffect(() => {
    if (!copyMessage) return;
    const id = window.setTimeout(() => setCopyMessage(""), 2000);
    return () => window.clearTimeout(id);
  }, [copyMessage]);

  const onCopyPayload = async () => {
    if (!compiled) return;
    try {
      await navigator.clipboard.writeText(compiled.payload);
      setCopyMessage("Paper payload copied to clipboard");
    } catch {
      setCopyMessage("Copy failed — clipboard permission?");
    }
  };

  const onSendToPaper = async () => {
    if (!compiled) return;
    try {
      await navigator.clipboard.writeText(compiled.payload);
      setCopyMessage(
        "Payload copied. Paste in Claude Code → ask agent to call paper.write_html",
      );
    } catch {
      setCopyMessage("Copy failed — try the Copy button");
    }
  };

  return (
    <div className="flex h-full flex-col p-6 gap-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Paper Preview</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Fixture:</label>
          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            {FIXTURES.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden">
        <section className="flex-1 flex flex-col rounded-xl border bg-card overflow-hidden">
          <header className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">
            React (studio component)
          </header>
          <div className="flex-1 overflow-auto p-4">
            {reactTree.length === 0 ? (
              <div className="text-muted-foreground text-sm">no fixture</div>
            ) : (
              <>{reactTree}</>
            )}
          </div>
        </section>

        <section className="flex-1 flex flex-col rounded-xl border bg-card overflow-hidden">
          <header className="px-4 py-2 border-b text-sm font-medium text-muted-foreground">
            Paper (compiled HTML preview)
          </header>
          <iframe
            title="Paper preview"
            srcDoc={compiled?.html ?? ""}
            className="flex-1 w-full"
            sandbox="allow-scripts"
          />
        </section>
      </div>

      <footer className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCopyPayload}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
        >
          📋 Copy Paper HTML
        </button>
        <button
          type="button"
          onClick={onSendToPaper}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          📤 Send to Paper
        </button>
        {copyMessage ? (
          <span className="text-sm text-muted-foreground">{copyMessage}</span>
        ) : null}
      </footer>
    </div>
  );
}
