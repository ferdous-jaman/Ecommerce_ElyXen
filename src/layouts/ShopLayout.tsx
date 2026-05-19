import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogIn, UserPlus, Zap, Menu, X, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useState, useRef, useEffect } from "react";
import { getInitials } from "@/lib/utils";

export function ShopLayout() {
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart } = useCartStore();
  const cartCount = totalItems();

  const isCustomer = profile?.role === "customer";
  const isAdminOrStaff = profile?.role === "admin" || profile?.role === "staff";
  const displayName = profile?.full_name ?? profile?.email?.split("@")[0] ?? "Account";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              ElyXen
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </Link>
              <Link to="/shop#featured" className="text-muted-foreground hover:text-foreground transition-colors">
                Featured
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Get Started
                  </Button>
                </>
              )}
              {isAuthenticated && isAdminOrStaff && (
                <Button size="sm" variant="outline" onClick={() => navigate("/dashboard")} className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              {isAuthenticated && isCustomer && (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {getInitials(displayName)}
                    </div>
                    <span className="max-w-[80px] truncate">{displayName}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-background shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                      </div>
                      <button
                        onClick={() => { setAccountOpen(false); navigate("/orders"); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <User className="h-4 w-4" /> My Orders
                      </button>
                      <button
                        onClick={async () => { setAccountOpen(false); await logout(); navigate("/"); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Cart button */}
              <button
                onClick={toggleCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile cart + menu */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            <button
              className="p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
            <Link to="/shop" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button size="sm" className="w-full gap-2" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Button>
              </div>
            )}
            {isAuthenticated && isAdminOrStaff && (
              <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            )}
            {isAuthenticated && isCustomer && (
              <div className="rounded-lg border border-border p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={async () => { setMobileOpen(false); await logout(); navigate("/"); }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Zap className="h-3 w-3 text-primary-foreground" />
              </div>
              ElyXen
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ElyXen. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
              <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
