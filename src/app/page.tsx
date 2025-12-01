import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wind } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline">FindMeNow</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-2xl">
          <Wind className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Welcome to FindMeNow
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The smart, simple, and secure way to find what you've lost. Our AI-powered platform helps reconnect you with your belongings quickly and efficiently.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FindMeNow. All rights reserved.
      </footer>
    </div>
  );
}
