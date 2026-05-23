// @gd: chats/scenes/signup.chat.md
import React from 'react';
// i18n: replace with your project's t() or useTranslation hook
import { Button } from '@/components/ui/button';

export function SignupScene() {
  return (
    <>
      <Card className="w-full max-w-sm mx-auto">
        {/* 
         */}
        <CardHeader>
          {/* 
           */}
          <CardTitle>
            {t("ko.signup.title")}
          </CardTitle>
          {/* 
           */}
          <CardDescription>
            {t("ko.signup.subtitle")}
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
                {t("ko.signup.name.label")}
              </FormLabel>
              {/* 
               */}
              <FormControl>
                {/* 
                 */}
                <Input placeholder="{{i18n.ko.signup.name.placeholder}}" type="text" />
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
                {t("ko.signup.email.label")}
              </FormLabel>
              {/* 
               */}
              <FormControl>
                {/* 
                 */}
                <Input placeholder="{{i18n.ko.signup.email.placeholder}}" type="email" />
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
                {t("ko.signup.password.label")}
              </FormLabel>
              {/* 
               */}
              <FormControl>
                {/* 
                 */}
                <Input placeholder="{{i18n.ko.signup.password.placeholder}}" type="password" />
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
              <FormControl>
                {/* 
                 */}
                <Checkbox />
                {/* 
               */}
              </FormControl>
              {/* 
               */}
              <FormLabel>
                {t("ko.signup.terms.label")}
              </FormLabel>
              {/* 
             */}
            </FormField>
            {/* 
             */}
            <Button className="w-full" type="submit">
              {t("ko.signup.submit")}
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