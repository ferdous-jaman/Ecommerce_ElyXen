import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  order_index: number;
};

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "f1",
    title: "Mega Sale — Up to 70% Off",
    subtitle: "Shop the biggest sale of the year on electronics, fashion and more.",
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400",
    link_url: "/shop",
    button_text: "Shop Now",
    order_index: 1,
  },
  {
    id: "f2",
    title: "New Arrivals This Week",
    subtitle: "Fresh drops every week — be the first to grab the latest products.",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400",
    link_url: "/shop?sort=newest",
    button_text: "Browse New",
    order_index: 2,
  },
  {
    id: "f3",
    title: "Free Shipping on Orders Over ৳999",
    subtitle: "Order today and get free doorstep delivery anywhere in Bangladesh.",
    image_url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1400",
    link_url: "/shop",
    button_text: "Start Shopping",
    order_index: 3,
  },
];

export function HeroCarousel() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase
        .from("banners")
        .select("id,title,subtitle,image_url,link_url,button_text,order_index")
        .eq("is_active", true)
        .order("order_index");
      if (data && data.length > 0) setBanners(data);
    }
    fetchBanners();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + banners.length) % banners.length);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [banners.length, isTransitioning]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = banners[current];

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: "clamp(280px, 55vw, 560px)" }}>
      {/* Slides */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <div
            className="max-w-lg transition-all duration-500"
            style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(10px)" : "translateY(0)" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed max-w-md drop-shadow">
                {slide.subtitle}
              </p>
            )}
            <Button
              size="lg"
              className="mt-6 gap-2 font-bold shadow-lg"
              onClick={() => navigate(slide.link_url ?? "/shop")}
            >
              {slide.button_text ?? "Shop Now"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
