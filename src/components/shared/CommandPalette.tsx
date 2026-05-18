import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, ShoppingCart, Users, Warehouse, BarChart3,
  Settings, Plus, LayoutDashboard, FolderOpen,
} from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command";
import { useCommandStore } from "@/store/useCommandStore";

type NavEntry = { label: string; href: string; icon: React.ElementType; shortcut?: string };
type ActionEntry = { label: string; icon: React.ElementType; action: () => void; shortcut?: string };

export function CommandPalette() {
  const { open, setOpen } = useCommandStore();
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setOpen]);

  function go(href: string) {
    setOpen(false);
    navigate(href);
  }

  const pages: NavEntry[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
    { label: "Products", href: "/dashboard/products", icon: Package, shortcut: "G P" },
    { label: "Categories", href: "/dashboard/categories", icon: FolderOpen },
    { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart, shortcut: "G O" },
    { label: "Customers", href: "/dashboard/customers", icon: Users, shortcut: "G C" },
    { label: "Inventory", href: "/dashboard/inventory", icon: Warehouse, shortcut: "G I" },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, shortcut: "G S" },
  ];

  const actions: ActionEntry[] = [
    { label: "Add Product", icon: Plus, action: () => go("/dashboard/products/new") },
    { label: "Add Category", icon: Plus, action: () => go("/dashboard/categories") },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <CommandItem key={p.href} onSelect={() => go(p.href)} className="cursor-pointer">
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {p.label}
                {p.shortcut && <CommandShortcut>{p.shortcut}</CommandShortcut>}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <CommandItem key={a.label} onSelect={a.action} className="cursor-pointer">
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {a.label}
                {a.shortcut && <CommandShortcut>{a.shortcut}</CommandShortcut>}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
