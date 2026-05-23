// @gd: chats/scenes/login.chat.md
import React from 'react';
// i18n: replace with your project's t() or useTranslation hook
import { Button } from '@/components/ui/button';

export function LoginScene() {
  return (
    <>
      <Card className="w-full max-w-sm mx-auto">
        {/* 
         */}
        <CardHeader>
          {/* 
           */}
          <CardTitle>
            {t("ko.login.title")}
          </CardTitle>
          {/* 
           */}
          <CardDescription>
            {t("ko.login.subtitle")}
          </CardDescription>
          {/* 
         */}
        </CardHeader>
        {/* 
         */}
        <CardContent>
          {/* 
           */}
          <Form className="space-y-4">
            {/* 
             */}
            <FormField>
              {/* 
               */}
              <FormLabel>
                {t("ko.login.email.label")}
              </FormLabel>
              {/* 
               */}
              <FormControl>
                {/* 
                 */}
                <Input placeholder="{{i18n.ko.login.email.placeholder}}" type="email" />
                {/* 
               */}
              </FormControl>
              {/* 
             */}
            </FormField>
            {/* 
             */}
            <FormField>
              {/* 
               */}
              <FormLabel>
                {t("ko.login.password.label")}
              </FormLabel>
              {/* 
               */}
              <FormControl>
                {/* 
                 */}
                <Input placeholder="{{i18n.ko.login.password.placeholder}}" type="password" />
                {/* 
               */}
              </FormControl>
              {/* 
             */}
            </FormField>
            {/* 
             */}
            <Button className="w-full" type="submit">
              {t("ko.login.submit")}
            </Button>
            {/* 
             */}
            <Button className="w-full" variant="link">
              {t("ko.login.signup-link")}
            </Button>
            {/* 
           */}
          </Form>
          {/* 
         */}
        </CardContent>
        {/* 
       */}
      </Card>
    </>
  );
}