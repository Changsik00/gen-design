/**
 * Studio 앱 진입점.
 *
 * 5 route (4 main + 1 playground hidden):
 *   #/blueprint  — spec-6-05 에서 구현
 *   #/editor     — spec-6-06
 *   #/tokens     — spec-6-07
 *   #/export     — spec-6-08
 *   #/__playground — 컴포넌트 시각 확인 (개발 중)
 */

import { useCurrentRoute } from "@/lib/router";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { BlueprintPage } from "@/features/blueprint";
import { EditorPage } from "@/features/editor";
import { TokensPage } from "@/features/tokens";
import { ExportPage } from "@/features/export";
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
    </StudioLayout>
  );
}

export default App;
