import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { FoundItem } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";

interface ItemCardProps {
  item: FoundItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/found/${item.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all group-hover:shadow-md group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint={item.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <CardTitle className="text-lg font-semibold leading-tight mt-1">
            {item.name}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between items-center">
            <span>Found: {format(parseISO(item.date), "PP")}</span>
            <Badge variant="secondary">{item.status}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
