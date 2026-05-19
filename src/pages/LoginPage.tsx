import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo");
  const stateFrom = (location.state as { from?: string })?.from;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const result = await login(data);
    if (!result.success) {
      setError("root", { message: result.error });
      return;
    }
    toast.success("Welcome back!", { description: "Signed in successfully." });

    if (returnTo) {
      navigate(returnTo, { replace: true });
      return;
    }
    if (stateFrom && stateFrom !== "/login") {
      navigate(stateFrom, { replace: true });
      return;
    }
    const freshProfile = await authService.getProfile(result.data!.user.id);
    if (freshProfile?.role === "customer") {
      navigate("/shop", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkt94IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 max-w-md text-center text-primary-foreground space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ElyXen</h1>
            <p className="mt-2 text-primary-foreground/80 text-lg">
              Professional Ecommerce Management
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { label: "Orders Managed", value: "50K+" },
              { label: "Revenue Tracked", value: "$12M+" },
              { label: "Products Active", value: "8,400+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 backdrop-blur-sm p-4"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">ElyXen</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {errors.root && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-10 text-sm"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-10 pr-10 text-sm"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Create account
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground/60">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
