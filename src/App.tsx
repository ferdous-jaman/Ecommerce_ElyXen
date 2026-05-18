import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "@/routes";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

function ThemeInitializer() {
  useTheme();
  return null;
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeInitializer />
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "bg-background text-foreground border-border shadow-lg text-sm",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}
