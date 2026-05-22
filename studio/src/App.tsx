/**
 * Studio 앱 진입점.
 *
 * spec-7-06 라우트 재구성:
 *   #/spec      — Spec Editor (메인)
 *   #/new       — 신규 Spec 마법사 (기존 Blueprint 재배치)
 *   #/design    — Design MD 편집기 (기존 Editor 재명명)
 *   #/tokens    — Token 뷰어
 *   #/export    — Export
 *   #/__playground — 개발 전용 (숨김)
 *
 * backward-compat: #/blueprint→#/new, #/editor→#/design, #/preview→#/spec (router.ts redirect)
 */

import { useCurrentRoute } from "@/lib/router";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { SpecEditorPage } from "@/features/spec-editor";
import { BlueprintPage } from "@/features/blueprint";
import { EditorPage } from "@/features/editor";
import { TokensPage } from "@/features/tokens";
import { ExportPage } from "@/features/export";
import { Playground } from "@/features/playground";
import { ChatViewerPage } from "@/features/chat-viewer/ChatViewerPage";

function App() {
  const route = useCurrentRoute();

  if (route === "playground") {
    return <Playground />;
  }

  return (
    <StudioLayout>
      {route === "spec" && <SpecEditorPage />}
      {route === "new" && <BlueprintPage />}
      {route === "design" && <EditorPage />}
      {route === "tokens" && <TokensPage />}
      {route === "export" && <ExportPage />}
      {route === "chats" && <ChatViewerPage />}
    </StudioLayout>
  );
}

export default App;
