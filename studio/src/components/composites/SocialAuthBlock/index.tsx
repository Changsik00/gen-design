import { Button } from "@/components/ui/button";

interface SocialAuthBlockProps {
  googleLabel: string;
  appleLabel: string;
  kakaoLabel: string;
}

export function SocialAuthBlock({
  googleLabel,
  appleLabel,
  kakaoLabel,
}: SocialAuthBlockProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex-1">
        {googleLabel}
      </Button>
      <Button variant="outline" className="flex-1">
        {appleLabel}
      </Button>
      <Button variant="outline" className="flex-1">
        {kakaoLabel}
      </Button>
    </div>
  );
}
