// @gd: chats/scenes/welcome.chat.md
// 이 파일은 `pnpm gd react chats/scenes/welcome.chat.md` 가 생성합니다.
// chat.md 를 수정한 후 위 명령을 다시 실행하세요.
// 손으로 수정하면 다음 컴파일 때 덮어쓰여집니다.

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomeScene() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("welcome.title")}</CardTitle>
          <CardDescription>{t("welcome.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            이 화면은 <code className="font-mono">chats/scenes/welcome.chat.md</code> 에서 생성됐습니다.
          </p>
          <Button>{t("welcome.cta")}</Button>
        </CardContent>
      </Card>
    </main>
  );
}
