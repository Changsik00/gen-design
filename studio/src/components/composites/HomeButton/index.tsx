import { Button } from "@/components/ui/button";

interface HomeButtonProps {
  label: string;
  onClick?: () => void;
}

export function HomeButton({ label, onClick }: HomeButtonProps) {
  return (
    <Button onClick={onClick} className="bg-primary text-primary-foreground">
      {label}
    </Button>
  );
}
