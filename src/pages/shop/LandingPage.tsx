import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, Zap, Shield, Truck, HeadphonesIcon,
  ArrowRight, Star, Package, Users, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on all orders over $50. Fast and reliable.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is always safe and encrypted.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our support team is available around the clock to help you.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Same-day dispatch on orders placed before 2PM.",
  },
];

const stats = [
  { icon: Package, label: "Products", value: "10,000+" },
  { icon: Users, label: "Happy Customers", value: "50,000+" },
  { icon: TrendingUp, label: "Orders Delivered", value: "200,000+" },
  { icon: Star, label: "Average Rating", value: "4.9 / 5" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Verified Buyer",
    review: "Amazing quality and super fast delivery. ElyXen is now my go-to shop for everything.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Verified Buyer",
    review: "The product selection is incredible. Found exactly what I was looking for at a great price.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Verified Buyer",
    review: "Customer support was phenomenal. They resolved my issue within minutes. Highly recommend!",
    rating: 5,
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 text-xs font-semibold">
            <Zap className="h-3 w-3" />
            New arrivals every week
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-tight">
            Shop Smarter.
            <br />
            <span className="text-primary">Live Better.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover thousands of premium products at unbeatable prices. Fast shipping, secure checkout, and world-class customer support.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/shop")} className="gap-2 min-w-[180px] text-base">
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signup")} className="gap-2 min-w-[180px] text-base">
              Create Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No account required to browse · Free to sign up · Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Shop with ElyXen?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need for a great shopping experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">What Our Customers Say</h2>
            <p className="mt-2 text-sm text-muted-foreground">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border bg-card">
                <CardContent className="pt-6 flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{t.review}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary p-10 md:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Ready to Start Shopping?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
              Join over 50,000 customers and discover premium products with fast delivery.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/shop")}
                className="gap-2 min-w-[160px]"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup")}
                className="gap-2 min-w-[160px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Sign Up Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
