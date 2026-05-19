import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  Warehouse, ChevronLeft, ChevronRight, Zap, FolderOpen, Images, ShieldAlert,
  LogOut, User, DollarSign, Store, Briefcase, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { cn, getInitials } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard",           icon: LayoutDashboard },
  { label: "Products",   href: "/dashboard/products",   icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: FolderOpen },
  { label: "Banners",    href: "/dashboard/banners",    icon: Images },
  { label: "Orders",     href: "/dashboard/orders",     icon: ShoppingCart },
  { label: "Customers",  href: "/dashboard/customers",  icon: Users },
  { label: "Inventory",  href: "/dashboard/inventory",  icon: Warehouse },
  { label: "Analytics",  href: "/dashboard/analytics",   icon: BarChart3 },
  { label: "Fraud Check", href: "/dashboard/fraud-check", icon: ShieldAlert },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type SidebarNavItemProps = {
  item: NavItem;
  isCollapsed: boolean;
};

function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
  const location = useLocation();
  const isActive =
    item.href === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(item.href);

  const Icon = item.icon;

  const content = (
    <NavLink
      to={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          isCollapsed ? "h-5 w-5" : "h-4 w-4",
          isActive
            ? "text-primary"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
        )}
      />
      {!isCollapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const displayRole = profile?.role ?? "staff";
  const avatarUrl = profile?.avatar_url ?? "";
  const isAdmin = profile?.role === "admin";
  const isStaff = profile?.role === "staff";

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully.");
    navigate("/login");
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "relative flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-sidebar-border px-4",
            isCollapsed && "justify-center px-2"
          )}
        >
          <NavLink
            to="/"
            className={cn(
              "flex items-center gap-2.5 overflow-hidden",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                  ElyXen
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Management
                </span>
              </div>
            )}
          </NavLink>
        </div>

        <ScrollArea className="flex-1 py-3">
          <nav className={cn("flex flex-col gap-0.5 px-2")}>
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {isAdmin && (
            <>
              <Separator className="my-3 bg-sidebar-border" />
              {!isCollapsed && (
                <p className="px-4 mb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Admin</p>
              )}
              <nav className={cn("flex flex-col gap-0.5 px-2")}>
                {[
                  { label: "Staff Mgmt",  href: "/dashboard/staff",   icon: Users },
                  { label: "Payroll",     href: "/dashboard/salary",  icon: DollarSign },
                ].map((item) => (
                  <SidebarNavItem key={item.href} item={item} isCollapsed={isCollapsed} />
                ))}
              </nav>
            </>
          )}

          <Separator className="my-3 bg-sidebar-border" />

          <nav className={cn("flex flex-col gap-0.5 px-2")}>
            {bottomNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t border-sidebar-border">
          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {!isCollapsed ? (
                <button className="flex w-full items-center gap-2.5 px-3 py-3 hover:bg-sidebar-accent rounded-none transition-colors text-left">
                  <Avatar className="h-7 w-7 shrink-0 ring-2 ring-primary/20">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-semibold text-sidebar-foreground">{displayName}</span>
                    <span className="truncate text-[10px] capitalize text-muted-foreground">{displayRole}</span>
                  </div>
                </button>
              ) : (
                <div className="flex justify-center py-2">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button className="rounded-full hover:ring-2 hover:ring-primary/30 transition-all">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={avatarUrl} alt={displayName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{displayName}</p>
                      <p className="text-xs capitalize text-muted-foreground">{displayRole}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56 mb-1">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{displayRole}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/settings?tab=profile")}>
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/settings")}>
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {isStaff && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/settings?tab=staff")}>
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> My Shift
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/orders")}>
                      <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" /> Orders Queue
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/staff")}>
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> Staff Management
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/salary")}>
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Payroll
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-xs" onClick={() => navigate("/dashboard/settings?tab=store")}>
                      <Store className="h-3.5 w-3.5 text-muted-foreground" /> Store Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="border-t border-sidebar-border p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className={cn(
                "h-8 w-full text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed ? "justify-center" : "justify-end pr-1"
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
