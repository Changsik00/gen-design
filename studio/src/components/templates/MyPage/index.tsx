import { Sidebar } from "@/components/composites/Sidebar";
import { ProfileHeader } from "@/components/composites/ProfileHeader";
import { ProfileInfoCard } from "@/components/composites/ProfileInfoCard";
import { ActivitySummary } from "@/components/composites/ActivitySummary";
import { AvatarUpload } from "@/components/composites/AvatarUpload";
import type { MyPageProps } from "../types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface MyPageFullProps extends MyPageProps {
  appName?: string;
}

export function MyPage({
  texts,
  profile,
  summary,
  navItems,
  appName = "TaskFlow",
  className,
}: MyPageFullProps) {
  return (
    <div className={`flex h-screen bg-background ${className ?? ""}`}>
      <Sidebar appName={appName} navItems={navItems} activeIndex={3} />
      <main className="flex flex-1 flex-col overflow-auto p-6">
        <h1 className="mb-6 text-2xl font-semibold">{texts.title}</h1>
        <div className="space-y-6">
          <ProfileHeader
            name={profile.name}
            role={profile.role}
            avatarUrl={profile.avatarUrl}
          />
          <ProfileInfoCard
            labels={{
              email: texts.infoEmail,
              joinedAt: texts.infoJoinedAt,
              team: texts.infoTeam,
            }}
            values={{
              email: profile.email,
              joinedAt: profile.joinedAt,
              team: profile.team,
            }}
          />
          <ActivitySummary
            labels={{
              tasks: texts.summaryTasks,
              comments: texts.summaryComments,
              completion: texts.summaryCompletion,
            }}
            values={{
              tasks: summary.tasks,
              comments: summary.comments,
              completion: summary.completion,
            }}
          />
          <AvatarUpload
            label={texts.avatarUpload}
            avatarUrl={profile.avatarUrl}
            initials={getInitials(profile.name)}
          />
        </div>
      </main>
    </div>
  );
}
