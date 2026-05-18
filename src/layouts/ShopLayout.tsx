import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogIn, UserPlus, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function ShopLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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
              {isAuthenticated ? (
                <Button size="sm" onClick={() => navigate("/")} className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              ) : (
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
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
            <Link to="/shop" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            {isAuthenticated ? (
              <Button size="sm" className="w-full gap-2" onClick={() => { navigate("/"); setMobileOpen(false); }}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            ) : (
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
          </div>
        )}
      </header>

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
