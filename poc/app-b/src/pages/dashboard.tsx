import { DashboardPage } from "studio/components/templates";
import { getDashboardTexts } from "@/hooks/useTexts";

const stats = [
  { label: "진행 중 작업", value: "32", change: "이번 주 +5", trend: "up" as const },
  { label: "이번 주 완료", value: "21", change: "지난주 대비 +18%", trend: "up" as const },
  { label: "기한 초과", value: "2", change: "어제 대비 -1", trend: "down" as const },
  { label: "팀 멤버", value: "9", change: "변동 없음", trend: "stable" as const },
];

const activities = [
  {
    userName: "온보딩 플로우 개선",
    initials: "JH",
    action: "정현우",
    status: "검토 중",
    statusColor: "blue" as const,
    time: "1시간 전",
  },
  {
    userName: "결제 모듈 보안 검토",
    initials: "SY",
    action: "신유진",
    status: "완료",
    statusColor: "green" as const,
    time: "4시간 전",
  },
  {
    userName: "푸시 알림 마이그레이션",
    initials: "MJ",
    action: "민준호",
    status: "기한 초과",
    statusColor: "red" as const,
    time: "2일 전",
  },
  {
    userName: "분석 리포트 자동화",
    initials: "HK",
    action: "한경아",
    status: "백로그",
    statusColor: "gray" as const,
    time: "3일 전",
  },
];

export function DashboardRoute() {
  return (
    <DashboardPage
      variant="page"
      texts={getDashboardTexts()}
      appName="플로우데스크"
      stats={stats}
      activities={activities}
    />
  );
}
