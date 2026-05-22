// @gd: chats/scenes/login.chat.md
import React from 'react';
// i18n: replace with your project's t() or useTranslation hook
import { Button } from '@/components/ui/button';

export function LoginScene() {
  return (
    <>
      <Card className="w-full max-w-md">
        {/* 
         */}
        <CardHeader>
          {/* 
           */}
          <CardTitle>
            {t("ko.auth.login.title")}
          </CardTitle>
          {/* 
           */}
          <CardDescription>
            {t("ko.auth.login.subtitle")}
          </CardDescription>
          {/* 
         */}
        </CardHeader>
        {/* 
         */}
        <CardContent className="space-y-4">
          {/* 
           */}
          <Field name="email">
            {/* 
             */}
            <Label>
              {t("ko.auth.login.email-label")}
            </Label>
            {/* 
             */}
            <Input placeholder={t("ko.auth.login.email-placeholder")} type="email" />
            {/* 
           */}
          </Field>
          {/* 
           */}
          <Field name="password">
            {/* 
             */}
            <Label>
              {t("ko.auth.login.password-label")}
            </Label>
            {/* 
             */}
            <Input type="password" />
            {/* 
           */}
          </Field>
          {/* 
           */}
          <Button className="w-full" type="submit" variant="default">
            {/* 
             */}
            {t("ko.auth.login.submit")}
            {/* 
           */}
          </Button>
          {/* 
           */}
          <Separator />
          {/* 
           */}
          <Button className="w-full" variant="link">
            {/* 
             */}
            {t("ko.auth.login.forgot-password")}
            {/* 
           */}
          </Button>
          {/* 
         */}
        </CardContent>
        {/* 
       */}
      </Card>
    </>
  );
}