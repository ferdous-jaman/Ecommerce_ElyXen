import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, LogIn, UserPlus, Zap, Menu, X, ShoppingCart,
  User, ChevronDown, LogOut, Heart, Package, Search, Phone,
  Facebook, Instagram, Twitter, Truck, Shield, HeadphonesIcon, RotateCcw,
  ClipboardList, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { getInitials } from "@/lib/utils";

export function ShopLayout() {
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart } = useCartStore();
  const { totalItems: wishlistCount } = useWishlistStore();
  const cartCount = totalItems();
  const wCount = wishlistCount();

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

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  }

  function closeAll() { setMobileOpen(false); setAccountOpen(false); }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs text-center py-2 px-4 font-medium">
        🎉 Free shipping on orders over ৳999 &nbsp;·&nbsp; Cash on Delivery available &nbsp;·&nbsp;
        <span className="underline cursor-pointer" onClick={() => navigate("/shop")}>Shop Now →</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-black text-lg text-foreground shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              ElyXen
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="pl-9 pr-4 h-10 rounded-xl border-border bg-muted/50 focus:bg-background"
              />
            </form>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">

              {/* Guest */}
              {!isAuthenticated && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="gap-1.5">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")} className="gap-1.5">
                    <UserPlus className="h-4 w-4" /> Register
                  </Button>
                </>
              )}

              {/* Admin / Staff */}
              {isAuthenticated && isAdminOrStaff && (
                <Button size="sm" variant="outline" onClick={() => navigate("/dashboard")} className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              )}

              {/* Customer dropdown */}
              {isAuthenticated && isCustomer && (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {getInitials(displayName)}
                    </div>
                    <span className="max-w-[90px] truncate">{displayName}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-background shadow-xl py-2 z-50 animate-fade-in">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shrink-0">
                            {getInitials(displayName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      {[
                        { icon: User, label: "My Profile", path: "/account/profile" },
                        { icon: ClipboardList, label: "My Orders", path: "/account/orders" },
                        { icon: Heart, label: "Wishlist", path: "/account/wishlist", badge: wCount > 0 ? wCount : undefined },
                        { icon: Settings, label: "Account Settings", path: "/account/profile" },
                      ].map(({ icon: Icon, label, path, badge }) => (
                        <button key={label}
                          onClick={() => { setAccountOpen(false); navigate(path); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {label}
                          {badge !== undefined && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                              {badge}
                            </span>
                          )}
                        </button>
                      ))}

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={async () => { setAccountOpen(false); await logout(); navigate("/"); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist icon */}
              {isAuthenticated && isCustomer && (
                <button onClick={() => navigate("/account/wishlist")}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors"
                  aria-label="Wishlist">
                  <Heart className="h-4 w-4" />
                  {wCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                      {wCount > 9 ? "9+" : wCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart */}
              <button onClick={toggleCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors"
                aria-label="Cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile right */}
            <div className="flex md:hidden items-center gap-2 ml-auto">
              {isAuthenticated && isCustomer && (
                <button onClick={() => navigate("/account/wishlist")}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors">
                  <Heart className="h-4 w-4" />
                  {wCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{wCount > 9 ? "9+" : wCount}</span>}
                </button>
              )}
              <button onClick={toggleCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cartCount > 99 ? "99+" : cartCount}</span>}
              </button>
              <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Nav links row */}
          <div className="hidden md:flex items-center gap-6 py-2 border-t border-border/50 text-sm font-medium">
            <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>All Products</Link>
            <Link to="/shop?category=electronics" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Electronics</Link>
            <Link to="/shop?category=fashion" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Fashion</Link>
            <Link to="/shop?category=home-living" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Home & Living</Link>
            <Link to="/shop?category=sports" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Sports</Link>
            <Link to="/shop?category=beauty" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Beauty</Link>
            <Link to="/shop?category=books" className="text-muted-foreground hover:text-foreground transition-colors" onClick={closeAll}>Books</Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." className="pl-9" />
            </form>

            {/* Category links */}
            <div className="grid grid-cols-3 gap-1.5">
              {["All", "Electronics", "Fashion", "Home", "Sports", "Beauty"].map((cat) => (
                <button key={cat}
                  onClick={() => { navigate(cat === "All" ? "/shop" : `/shop?category=${cat.toLowerCase().replace(" ", "-")}`); closeAll(); }}
                  className="text-xs font-medium px-2 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground">
                  {cat}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              {!isAuthenticated && (
                <>
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { navigate("/login"); closeAll(); }}>
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                  <Button size="sm" className="w-full gap-2" onClick={() => { navigate("/signup"); closeAll(); }}>
                    <UserPlus className="h-4 w-4" /> Create Account
                  </Button>
                </>
              )}

              {isAuthenticated && isAdminOrStaff && (
                <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => { navigate("/dashboard"); closeAll(); }}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              )}

              {isAuthenticated && isCustomer && (
                <div className="rounded-xl border border-border p-3 space-y-1">
                  <div className="flex items-center gap-3 pb-2 border-b border-border mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {getInitials(displayName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  {[
                    { icon: User, label: "My Profile", path: "/account/profile" },
                    { icon: ClipboardList, label: "My Orders", path: "/account/orders" },
                    { icon: Heart, label: "Wishlist", path: "/account/wishlist" },
                  ].map(({ icon: Icon, label, path }) => (
                    <button key={label} onClick={() => { navigate(path); closeAll(); }}
                      className="flex w-full items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground" /> {label}
                    </button>
                  ))}
                  <button
                    onClick={async () => { closeAll(); await logout(); navigate("/"); }}
                    className="flex w-full items-center gap-2 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-1">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
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
      <footer className="border-t border-border bg-muted/20 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 font-black text-lg text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                ElyXen
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your one-stop shop for quality products at the best prices. Fast delivery across Bangladesh.
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>01700-000000</span>
              </div>
              <div className="flex items-center gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop links */}
            <div>
              <p className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Shop</p>
              <ul className="space-y-2.5">
                {[
                  { label: "All Products", href: "/shop" },
                  { label: "Electronics", href: "/shop?category=electronics" },
                  { label: "Fashion", href: "/shop?category=fashion" },
                  { label: "Home & Living", href: "/shop?category=home-living" },
                  { label: "Sports", href: "/shop?category=sports" },
                  { label: "Books", href: "/shop?category=books" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account links — role-aware */}
            <div>
              <p className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Account</p>
              <ul className="space-y-2.5">
                {!isAuthenticated ? (
                  <>
                    <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
                    <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Account</Link></li>
                  </>
                ) : isCustomer ? (
                  <>
                    <li><Link to="/account/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Profile</Link></li>
                    <li><Link to="/account/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Orders</Link></li>
                    <li><Link to="/account/wishlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link></li>
                    <li><Link to="/checkout" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Checkout</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                    <li><Link to="/dashboard/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</Link></li>
                    <li><Link to="/dashboard/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Orders</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Trust badges */}
            <div>
              <p className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Why ElyXen</p>
              <ul className="space-y-3">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over ৳999" },
                  { icon: Shield, title: "Secure Payment", desc: "100% safe & encrypted" },
                  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here to help" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
                ].map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ElyXen. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/shop" className="hover:text-foreground transition-colors">
                <Package className="h-3.5 w-3.5 inline mr-1" />Products
              </Link>
              <span>·</span>
              <span>Bangladesh 🇧🇩</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
