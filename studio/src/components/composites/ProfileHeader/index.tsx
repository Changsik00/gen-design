interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl: string | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileHeader({ name, role, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-semibold text-primary shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_rgba(67,56,202,0.18)]"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold leading-tight">{name}</span>
        <span className="text-sm text-muted-foreground">{role}</span>
      </div>
    </div>
  );
}
