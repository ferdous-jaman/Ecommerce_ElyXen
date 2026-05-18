import { useNavigate } from "react-router-dom";
import { ShieldOff, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
        <ShieldOff className="h-10 w-10 text-destructive" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-destructive/70">Error 403</p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Access Denied</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          You don't have the required permissions to access this page. Contact your administrator if you believe this is a mistake.
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
    </div>
  );
}
