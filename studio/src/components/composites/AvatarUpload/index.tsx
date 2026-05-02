import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AvatarUploadProps {
  label: string;
  avatarUrl: string | null;
  initials: string;
  onUpload?: () => void;
}

export function AvatarUpload({ label, avatarUrl, initials, onUpload }: AvatarUploadProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold text-muted-foreground">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <Button variant="outline" onClick={onUpload}>
          {label}
        </Button>
      </CardContent>
    </Card>
  );
}
