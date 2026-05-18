import { useNavigate } from "react-router-dom";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <div className="rounded-2xl bg-destructive/10 p-5">
        <ShieldOff className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          You don't have permission to access this page. Contact your
          administrator if you believe this is a mistake.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="gap-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Button>
    </div>
  );
}
