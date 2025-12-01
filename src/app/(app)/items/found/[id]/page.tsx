import { notFound } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { foundItems } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ClaimItemDialog } from "@/components/claim-item-dialog";

export default function FoundItemDetailPage({ params }: { params: { id: string } }) {
  const item = foundItems.find((i) => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={item.imageHint}
              />
            </div>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.category}</p>
                    <CardTitle className="text-2xl font-headline mt-1">{item.name}</CardTitle>
                  </div>
                  <Badge variant={item.status === 'Claimed' ? 'destructive' : 'secondary'}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground">Case ID</TableCell>
                    <TableCell>{item.caseId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground">Description</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground">Color</TableCell>
                    <TableCell>{item.color}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground">Found At</TableCell>
                    <TableCell>{item.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground">Date Found</TableCell>
                    <TableCell>{format(parseISO(item.date), "PPP")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <ClaimItemDialog item={item} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
