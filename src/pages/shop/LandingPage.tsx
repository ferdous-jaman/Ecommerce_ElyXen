import { Truck, Shield, HeadphonesIcon, RotateCcw } from "lucide-react";
import { HeroCarousel } from "@/components/shop/HeroCarousel";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { TrendingProducts } from "@/components/shop/TrendingProducts";

const trustBadges = [
  { icon: Truck,          title: "Free Shipping",    desc: "On orders over ৳999" },
  { icon: Shield,         title: "Secure Payment",   desc: "100% safe & encrypted" },
  { icon: HeadphonesIcon, title: "24/7 Support",     desc: "Always here to help" },
  { icon: RotateCcw,      title: "Easy Returns",     desc: "7-day hassle-free return" },
];

export function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust badges */}
      <div className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {trustBadges.map((b) => (
              <div key={b.title} className="flex items-center gap-3 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <b.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Trending Products */}
      <TrendingProducts />
    </div>
  );
}
