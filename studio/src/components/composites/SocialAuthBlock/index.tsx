import { Button } from "@/components/ui/button";

interface SocialAuthBlockProps {
  googleLabel?: string;
  githubLabel?: string;
  appleLabel?: string;
  kakaoLabel?: string;
}

export function SocialAuthBlock({
  googleLabel,
  githubLabel,
  appleLabel,
  kakaoLabel,
}: SocialAuthBlockProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {googleLabel ? (
        <Button variant="outline" className="flex-1">
          {googleLabel}
        </Button>
      ) : null}
      {githubLabel ? (
        <Button variant="outline" className="flex-1">
          {githubLabel}
        </Button>
      ) : null}
      {appleLabel ? (
        <Button variant="outline" className="flex-1">
          {appleLabel}
        </Button>
      ) : null}
      {kakaoLabel ? (
        <Button variant="outline" className="flex-1">
          {kakaoLabel}
        </Button>
      ) : null}
    </div>
  );
}
