import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6 text-center animate-fade-in">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Error 404</p>
        <h1 className="text-7xl font-black tracking-tight text-foreground">404</h1>
        <p className="text-xl font-semibold text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved to a different URL.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={() => navigate("/")} className="gap-2 min-w-[140px]">
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 min-w-[140px]">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <p className="text-xs text-muted-foreground/60">
        Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd> to search
      </p>
    </div>
  );
}
