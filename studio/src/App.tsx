import { LoginPage } from "@/components/templates";
import { getLoginPageTexts } from "@/lib/i18n";

const texts = getLoginPageTexts("ko");

function App() {
  return <LoginPage variant="page" texts={texts} />;
}

export default App;
