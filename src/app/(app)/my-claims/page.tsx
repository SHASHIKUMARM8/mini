import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { claims, foundItems, lostItems } from "@/lib/data";
  import { format, parseISO } from "date-fns";
  
  export default function MyClaimsPage() {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Claims</h1>
          <p className="text-muted-foreground">
            A history of all the items you have claimed.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Claim History</CardTitle>
            <CardDescription>
              Here are all the claims you've submitted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claimed Item</TableHead>
                  <TableHead>Your Lost Item</TableHead>
                  <TableHead>Date Claimed</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => {
                  const foundItem = foundItems.find((i) => i.id === claim.foundItemId);
                  const lostItem = lostItems.find((i) => i.id === claim.lostItemId);
                  return (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{foundItem?.name || "N/A"}</TableCell>
                      <TableCell>{lostItem?.name || "N/A"}</TableCell>
                      <TableCell>
                        {format(parseISO(claim.claimDate), "PPP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            claim.status === "Approved"
                              ? "default"
                              : claim.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={claim.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {claim.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
  