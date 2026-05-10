/**
 * Studio 앱 진입점.
 *
 * 6 route (5 main + 1 playground hidden):
 *   #/blueprint  — spec-6-05
 *   #/editor     — spec-6-06
 *   #/tokens     — spec-6-07
 *   #/export     — spec-6-08
 *   #/preview    — spec-7-03 (Paper-compiled HTML 미리보기)
 *   #/__playground — 컴포넌트 시각 확인 (개발 중)
 */

import { useCurrentRoute } from "@/lib/router";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { BlueprintPage } from "@/features/blueprint";
import { EditorPage } from "@/features/editor";
import { TokensPage } from "@/features/tokens";
import { ExportPage } from "@/features/export";
import { PreviewPage } from "@/features/preview";
import { Playground } from "@/features/playground";

function App() {
  const route = useCurrentRoute();

  if (route === "playground") {
    return <Playground />;
  }

  return (
    <StudioLayout>
      {route === "blueprint" && <BlueprintPage />}
      {route === "editor" && <EditorPage />}
      {route === "tokens" && <TokensPage />}
      {route === "export" && <ExportPage />}
      {route === "preview" && <PreviewPage />}
    </StudioLayout>
  );
}

export default App;
