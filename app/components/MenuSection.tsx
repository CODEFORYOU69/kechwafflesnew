import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link"; // Ajoutez cette ligne

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function MenuSection({
  title,
  description,
  imageUrl,
  href,
}: {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={href}>Découvrir</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
