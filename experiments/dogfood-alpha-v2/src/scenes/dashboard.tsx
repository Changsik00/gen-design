// @gd: chats/scenes/dashboard.chat.md
import React from 'react';
// i18n: replace with your project's t() or useTranslation hook
import { Button } from '@/components/ui/button';

export function DashboardScene() {
  return (
    <>
      <Card className="w-full">
        {/* 
         */}
        <CardHeader>
          {/* 
           */}
          <CardTitle>
            {t("ko.dashboard.title")}
          </CardTitle>
          {/* 
           */}
          <CardDescription>
            {t("ko.dashboard.subtitle")}
          </CardDescription>
          {/* 
         */}
        </CardHeader>
        {/* 
         */}
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 
           */}
          <Card>
            {/* 
             */}
            <CardContent className="pt-6">
              {/* 
              <p className="text-xs uppercase tracking-wider text-muted-foreground"> */}
              {t("ko.dashboard.stats.total-users")}
              {/* </p>
              <p className="mt-2 text-3xl font-bold">12,847</p>
              <p className="mt-1 text-xs text-muted-foreground">+12.5%  */}
              {t("ko.dashboard.stats.from-last-month")}
              {/* </p>
             */}
            </CardContent>
            {/* 
           */}
          </Card>
          {/* 
           */}
          <Card>
            {/* 
             */}
            <CardContent className="pt-6">
              {/* 
              <p className="text-xs uppercase tracking-wider text-muted-foreground"> */}
              {t("ko.dashboard.stats.active")}
              {/* </p>
              <p className="mt-2 text-3xl font-bold">3,251</p>
              <p className="mt-1 text-xs text-muted-foreground">+8.2%  */}
              {t("ko.dashboard.stats.from-last-month")}
              {/* </p>
             */}
            </CardContent>
            {/* 
           */}
          </Card>
          {/* 
           */}
          <Card>
            {/* 
             */}
            <CardContent className="pt-6">
              {/* 
              <p className="text-xs uppercase tracking-wider text-muted-foreground"> */}
              {t("ko.dashboard.stats.revenue")}
              {/* </p>
              <p className="mt-2 text-3xl font-bold">$48,392</p>
              <p className="mt-1 text-xs text-muted-foreground">+15.3%  */}
              {t("ko.dashboard.stats.from-last-month")}
              {/* </p>
             */}
            </CardContent>
            {/* 
           */}
          </Card>
          {/* 
           */}
          <Card>
            {/* 
             */}
            <CardContent className="pt-6">
              {/* 
              <p className="text-xs uppercase tracking-wider text-muted-foreground"> */}
              {t("ko.dashboard.stats.conversion")}
              {/* </p>
              <p className="mt-2 text-3xl font-bold">3.8%</p>
              <p className="mt-1 text-xs text-muted-foreground">-0.4%  */}
              {t("ko.dashboard.stats.from-last-month")}
              {/* </p>
             */}
            </CardContent>
            {/* 
           */}
          </Card>
          {/* 
         */}
        </CardContent>
        {/* 
         */}
        <Separator />
        {/* 
         */}
        <CardContent className="space-y-4">
          {/* 
          <h3 className="text-lg font-semibold"> */}
          {t("ko.dashboard.recent.title")}
          {/* </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between border border-border rounded-md p-3">
              <span className="text-sm"> */}
          {t("ko.dashboard.recent.item-1")}
          {/* </span>
              <span className="text-xs text-muted-foreground">2  */}
          {t("ko.dashboard.recent.minutes-ago")}
          {/* </span>
            </div>
            <div className="flex items-center justify-between border border-border rounded-md p-3">
              <span className="text-sm"> */}
          {t("ko.dashboard.recent.item-2")}
          {/* </span>
              <span className="text-xs text-muted-foreground">15  */}
          {t("ko.dashboard.recent.minutes-ago")}
          {/* </span>
            </div>
            <div className="flex items-center justify-between border border-border rounded-md p-3">
              <span className="text-sm"> */}
          {t("ko.dashboard.recent.item-3")}
          {/* </span>
              <span className="text-xs text-muted-foreground">1  */}
          {t("ko.dashboard.recent.hour-ago")}
          {/* </span>
            </div>
          </div>
           */}
          <Button className="w-full" variant="link">
            {t("ko.dashboard.recent.view-all")}
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