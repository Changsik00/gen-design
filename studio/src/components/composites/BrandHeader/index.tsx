import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BrandHeaderProps {
  title: string;
  description: string;
}

export function BrandHeader({ title, description }: BrandHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}
