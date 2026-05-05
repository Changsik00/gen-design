import { ErrorPage } from "studio/components/templates";
import { getErrorTexts } from "@/hooks/useTexts";
import { useNavigate } from "react-router-dom";

interface ErrorRouteProps {
  errorVariant?: "404" | "500";
}

export function ErrorRoute({ errorVariant = "404" }: ErrorRouteProps) {
  const navigate = useNavigate();
  return (
    <ErrorPage
      variant="page"
      texts={getErrorTexts()}
      errorVariant={errorVariant}
      onHomeClick={() => navigate("/")}
    />
  );
}
