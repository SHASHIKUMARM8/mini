"use client";

import { useState } from 'react';
import Image from "next/image";
import { format, parseISO } from "date-fns";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { foundItems, claims } from "@/lib/data";
import { MoreHorizontal, ShieldAlert } from "lucide-react";
import { detectSuspiciousClaims } from '@/ai/flows/detect-suspicious-claims';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FoundItem } from '@/lib/types';


type FraudCheckResult = {
  isSuspicious: boolean;
  fraudScore: number;
  reason: string;
};

export default function AdminReviewPage() {
    const { toast } = useToast();
    const [fraudResult, setFraudResult] = useState<FraudCheckResult | null>(null);
    const [isCheckingFraud, setIsCheckingFraud] = useState(false);
    const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);

    const pendingItems = foundItems.filter(item => item.status === 'Pending' || item.status === 'Approved');

    const handleFraudCheck = async (item: FoundItem) => {
        setSelectedItem(item);
        setIsCheckingFraud(true);
        const relatedClaim = claims.find(c => c.foundItemId === item.id);
        
        // Mocking user behavior and claim details for AI flow
        const claimDetails = `Claim for item "${item.name}" (ID: ${item.id}). Claimer provided description: "${relatedClaim?.proof || 'No proof description'}"`;
        const userBehavior = "User has claimed 3 items in the last 24 hours. Login history shows multiple IPs.";
        
        try {
            const result = await detectSuspiciousClaims({
                claimDetails,
                userBehavior
            });
            setFraudResult(result);
        } catch (error) {
            console.error("Fraud detection failed:", error);
            toast({
                variant: 'destructive',
                title: "AI Error",
                description: "Could not perform fraud check."
            });
            setIsCheckingFraud(false);
        }
    };

    const closeFraudDialog = () => {
      setIsCheckingFraud(false);
      setFraudResult(null);
      setSelectedItem(null);
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Review Submissions</h1>
        <p className="text-muted-foreground">
          Approve, reject, and manage all item submissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Submissions</CardTitle>
          <CardDescription>
            A list of all recently submitted found items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Found</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={item.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {format(parseISO(item.date), "PPP")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Claimed' ? 'destructive' : 'outline'}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>Reject</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleFraudCheck(item)}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Check for Fraud
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        
      <AlertDialog open={isCheckingFraud} onOpenChange={closeFraudDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fraud Detection Analysis for "{selectedItem?.name}"</AlertDialogTitle>
            <AlertDialogDescription>
                {fraudResult ? "Here is the result from our AI-powered fraud detection system." : "Analyzing claim for suspicious patterns..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {fraudResult ? (
            <div className={fraudResult.isSuspicious ? 'text-destructive' : 'text-green-600'}>
              <p className="font-bold text-lg">
                {fraudResult.isSuspicious ? "This claim is likely SUSPICIOUS." : "This claim seems legitimate."}
              </p>
              <p>
                <span className="font-semibold">Fraud Score:</span> {Math.round(fraudResult.fraudScore * 100)}%
              </p>
              <p>
                <span className="font-semibold">Reason:</span> {fraudResult.reason}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
                <ShieldAlert className="h-8 w-8 animate-pulse" />
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeFraudDialog}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
