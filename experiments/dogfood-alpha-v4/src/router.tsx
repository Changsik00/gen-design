import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

const WelcomeScene = lazy(() => import("./scenes/welcome"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div className="p-8 text-muted-foreground">로딩 중...</div>}>
        <WelcomeScene />
      </Suspense>
    ),
  },
]);
