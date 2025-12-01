import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { lostItems, claims, foundItems } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import ItemCard from "@/components/item-card";

export default function DashboardPage() {
  const userLostItems = lostItems.slice(0, 3);
  const userClaims = claims.slice(0, 3);
  const recentFoundItems = foundItems.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your lost and found activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Recently Reported Items</CardTitle>
            <CardDescription>
              A list of items you've recently reported as lost.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Date Lost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userLostItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {format(parseISO(item.date), "PPP")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Active Claims</CardTitle>
            <CardDescription>
              Track the status of your item claims.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {foundItems.find((i) => i.id === claim.foundItemId)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Claimed: {format(parseISO(claim.claimDate), "PP")}
                  </p>
                </div>
                <Badge>{claim.status}</Badge>
              </div>
            ))}
             <Button variant="outline" className="w-full" asChild>
                <Link href="/my-claims">View All Claims <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-headline">Recently Found Items</h2>
          <Button variant="outline" asChild>
            <Link href="/items/found">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentFoundItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
