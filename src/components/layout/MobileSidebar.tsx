import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Warehouse,
  Zap,
  X,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NavItem } from "@/types";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: FolderOpen },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const location = useLocation();

  const handleClose = () => setMobileOpen(false);

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
        <SheetHeader className="flex h-14 flex-row items-center justify-between border-b border-sidebar-border px-4">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <NavLink
            to="/"
            onClick={handleClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                ElyXen
              </span>
              <span className="text-[10px] text-muted-foreground">
                Management
              </span>
            </div>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={handleClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
