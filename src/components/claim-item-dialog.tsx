"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lostItems } from "@/lib/data";
import { FoundItem, LostItem } from "@/lib/types";
import { verifyItemMatch } from "@/ai/flows/verify-item-match";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, Sparkles, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { Progress } from "./ui/progress";

const claimSchema = z.object({
  lostItemId: z.string().min(1, "Please select your lost item report."),
  proofDescription: z.string().min(10, "Please describe your proof of ownership."),
  proofPhoto: z.any().optional(),
});

type VerificationResult = {
  score: number;
  reason: string;
}

export function ClaimItemDialog({ item }: { item: FoundItem }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [proofPhotoPreview, setProofPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof claimSchema>>({
    resolver: zodResolver(claimSchema),
    defaultValues: { lostItemId: "", proofDescription: "" },
  });
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClaimSubmit = async (values: z.infer<typeof claimSchema>) => {
    setIsVerifying(true);
    setStep(2);

    const selectedLostItem = lostItems.find(li => li.id === values.lostItemId);

    if (!selectedLostItem) {
        toast({ variant: "destructive", title: "Error", description: "Selected lost item not found." });
        setIsVerifying(false);
        setStep(1);
        return;
    }
    
    // Helper to fetch and convert image to data URI. In a real app, this would be more robust.
    const toDataUri = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch {
             // Fallback for picsum not supporting cors for fetch
             return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
    };
    
    try {
        const [foundItemPhotoDataUri, lostItemPhotoDataUri] = await Promise.all([
            toDataUri(item.imageUrl),
            toDataUri(selectedLostItem.imageUrl)
        ]);

        const res = await verifyItemMatch({
            lostItemDescription: `${selectedLostItem.description}. My proof is: ${values.proofDescription}`,
            foundItemDescription: item.description,
            foundItemPhotoDataUri,
            lostItemPhotoDataUri
        });

        setVerificationResult({ score: res.matchScore, reason: res.reason });
    } catch (error) {
        console.error("AI verification failed:", error);
        toast({ variant: "destructive", title: "AI Error", description: "Could not perform AI verification." });
        // Set a default error result to show user
        setVerificationResult({ score: 0, reason: "An error occurred during verification." });
    } finally {
        setIsVerifying(false);
    }
  };

  const resetAndClose = () => {
    form.reset();
    setStep(1);
    setIsVerifying(false);
    setVerificationResult(null);
    setProofPhotoPreview(null);
    setOpen(false);
  }
  
  const handleFinalSubmit = () => {
    toast({
      title: "Claim Submitted!",
      description: "Your claim has been submitted for final review by an admin.",
    });
    resetAndClose();
  }

  const renderStep1 = () => (
    <>
      <DialogHeader>
        <DialogTitle>Claim Item: {item.name}</DialogTitle>
        <DialogDescription>
          To claim this item, please provide proof of ownership.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleClaimSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="lostItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Match with your lost item report</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one of your lost items" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lostItems.map((li) => (
                      <SelectItem key={li.id} value={li.id}>
                        {li.name} (Lost on {new Date(li.date).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proofDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Ownership</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe something unique about your item that only you would know. E.g., a specific scratch, a password, content on the device, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="proofPhoto"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Upload Photo Proof (optional)</FormLabel>
                 <FormDescription>e.g., a photo of you with the item, a receipt, or the original box.</FormDescription>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => {
                        field.onChange(e.target.files);
                        handlePhotoChange(e);
                    }} />
                </FormControl>
                {proofPhotoPreview && (
                    <div className="mt-2">
                        <img src={proofPhotoPreview} alt="Proof Preview" className="max-w-[100px] rounded-md" />
                    </div>
                )}
                <FormMessage />
                </FormItem>
            )}
            />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={resetAndClose}>Cancel</Button>
            <Button type="submit">Verify with AI <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );

  const renderStep2 = () => {
    const matchPercentage = verificationResult ? Math.round(verificationResult.score * 100) : 0;
    const isGoodMatch = matchPercentage > 60;
    
    return (
    <>
      <DialogHeader>
        <DialogTitle>AI Verification Result</DialogTitle>
        <DialogDescription>
          Our AI has analyzed your claim. Here is the result.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        {isVerifying ? (
             <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is verifying your claim...</p>
             </div>
        ) : (
            verificationResult && (
                <Alert variant={isGoodMatch ? "default" : "destructive"} className="bg-opacity-20">
                    {isGoodMatch ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                    <AlertTitle>{isGoodMatch ? "Potential Match Found!" : "Potential Mismatch"}</AlertTitle>
                    <AlertDescription>
                        {verificationResult.reason}
                    </AlertDescription>
                    <div className="mt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Match Score</span>
                            <span className="text-sm font-medium">{matchPercentage}%</span>
                        </div>
                        <Progress value={matchPercentage} className="h-2" />
                    </div>
                </Alert>
            )
        )}
      </div>
       <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={isVerifying}>Back</Button>
            <Button type="button" onClick={handleFinalSubmit} disabled={isVerifying}>
                Submit Claim for Final Review
            </Button>
      </DialogFooter>
    </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-6" disabled={item.status === 'Claimed'}>
            {item.status === 'Claimed' ? 'Item Already Claimed' : 'Claim This Item'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]" onInteractOutside={(e) => e.preventDefault()}>
        {step === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
}
