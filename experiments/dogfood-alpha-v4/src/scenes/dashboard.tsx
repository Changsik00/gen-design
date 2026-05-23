// @gd: chats/scenes/dashboard.chat.md
import React from 'react';
// i18n: replace with your project's t() or useTranslation hook
import { Button } from '@/components/ui/button';

export function DashboardScene() {
  return (
    <>
      {/* 
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           */}
      <Card>
        {/* 
             */}
        <CardHeader>
          {/* 
               */}
          <CardDescription>
            {t("ko.dashboard.stats.total.label")}
          </CardDescription>
          {/* 
               */}
          <CardTitle>
            {t("ko.dashboard.stats.total.value")}
          </CardTitle>
          {/* 
             */}
        </CardHeader>
        {/* 
           */}
      </Card>
      <Card>
        {/* 
             */}
        <CardHeader>
          {/* 
               */}
          <CardDescription>
            {t("ko.dashboard.stats.inprogress.label")}
          </CardDescription>
          {/* 
               */}
          <CardTitle>
            {t("ko.dashboard.stats.inprogress.value")}
          </CardTitle>
          {/* 
             */}
        </CardHeader>
        {/* 
           */}
      </Card>
      <Card>
        {/* 
             */}
        <CardHeader>
          {/* 
               */}
          <CardDescription>
            {t("ko.dashboard.stats.done.label")}
          </CardDescription>
          {/* 
               */}
          <CardTitle>
            {t("ko.dashboard.stats.done.value")}
          </CardTitle>
          {/* 
             */}
        </CardHeader>
        {/* 
           */}
      </Card>
      {/* 
        </div>
         */}
      <Card>
        {/* 
           */}
        <CardHeader>
          {/* 
             */}
          <CardTitle>
            {t("ko.dashboard.recent.title")}
          </CardTitle>
          {/* 
           */}
        </CardHeader>
        {/* 
           */}
        <CardContent>
          {/* 
             */}
          <Button className="w-full" variant="link">
            {t("ko.dashboard.recent.viewall")}
          </Button>
          {/* 
           */}
        </CardContent>
        {/* 
         */}
      </Card>
      {/* 
      </div>
       */}
    </>
  );
}