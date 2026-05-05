import { Routes, Route } from "react-router-dom";
import { LoginRoute } from "./pages/login";
import { SignupRoute } from "./pages/signup";
import { DashboardRoute } from "./pages/dashboard";
import { MyPageRoute } from "./pages/mypage";
import { SettingsRoute } from "./pages/settings";
import { ErrorRoute } from "./pages/error";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/signup" element={<SignupRoute />} />
      <Route path="/me" element={<MyPageRoute />} />
      <Route path="/settings" element={<SettingsRoute />} />
      <Route path="*" element={<ErrorRoute errorVariant="404" />} />
    </Routes>
  );
}
