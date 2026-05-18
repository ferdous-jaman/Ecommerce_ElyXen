import { Bell, Search, Menu, LogOut, User, Settings, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useCommandStore } from "@/store/useCommandStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  staff: "Staff",
  customer: "Customer",
};

export function Navbar() {
  const { setMobileOpen } = useSidebarStore();
  const { user, profile, logout } = useAuth();
  const { setOpen: openCommand } = useCommandStore();
  const navigate = useNavigate();

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const displayEmail = user?.email ?? "";
  const displayRole = profile?.role ? ROLE_LABELS[profile.role] : "";
  const avatarUrl = profile?.avatar_url ?? "";

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully.");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={() => openCommand(true)}
          className="hidden md:flex items-center gap-2 h-8 max-w-xs flex-1 rounded-md border border-input bg-muted/50 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search anything…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden text-muted-foreground"
          onClick={() => openCommand(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 overflow-hidden">
                  <p className="text-sm font-semibold leading-none truncate">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{displayEmail}</p>
                  {displayRole && (
                    <span
                      className={cn(
                        "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        profile?.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {displayRole}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
