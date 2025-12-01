import { ReportLostForm } from "@/components/report-lost-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportLostPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Report a Lost Item</CardTitle>
                <CardDescription>
                Fill in the details of your lost item below. The more information you provide, the better our chances of finding a match.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ReportLostForm />
            </CardContent>
        </Card>
    </div>
  );
}
