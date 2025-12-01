"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { autoFillFormDetails } from "@/ai/flows/auto-fill-form-details";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, { message: "Please select a category." }),
  color: z.string().min(1, { message: "Color is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  photo: z.any().optional(),
});

const categories = ["Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];

export function ReportLostForm() {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "",
      color: "",
      location: "",
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFill = async () => {
    const description = form.getValues("description");
    if (!description && !photoPreview) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide a description or a photo for the AI to work.",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await autoFillFormDetails({
        description,
        photoDataUri: photoPreview ?? undefined,
      });

      if (result) {
        form.setValue("category", result.itemCategory, { shouldValidate: true });
        form.setValue("color", result.itemColor, { shouldValidate: true });
        form.setValue("location", result.itemLocation, { shouldValidate: true });
        if (result.additionalDetails && !form.getValues("description")) {
            form.setValue("description", result.additionalDetails, { shouldValidate: true });
        }
        toast({
          title: "AI Auto-fill Complete",
          description: "We've filled in some details for you. Please review and complete the form.",
        });
      }
    } catch (error) {
      console.error("AI auto-fill failed:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not auto-fill details. Please fill them in manually.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Report Submitted!",
      description: "Your lost item report has been successfully submitted.",
    });
    form.reset();
    setPhotoPreview(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Photo of the item (optional)</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => {
                        field.onChange(e.target.files);
                        handlePhotoChange(e);
                    }} />
                </FormControl>
                {photoPreview && (
                    <div className="mt-4">
                        <img src={photoPreview} alt="Preview" className="max-w-xs rounded-md" />
                    </div>
                )}
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="e.g., A black leather wallet with a small scratch on the front. Contains a driver's license and a few credit cards."
                    {...field}
                    rows={5}
                    />
                </FormControl>
                <FormDescription>
                    Provide as much detail as possible. Mention any unique features.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="relative">
            <Button type="button" variant="outline" onClick={handleAutoFill} disabled={isAiLoading} className="w-full">
                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Auto-fill details with AI
            </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Color</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Known Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Library, 2nd floor near the study rooms" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full sm:w-auto">Submit Report</Button>
      </form>
    </Form>
  );
}
