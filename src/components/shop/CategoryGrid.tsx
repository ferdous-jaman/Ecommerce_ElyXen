import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen, ShoppingBasket, Gamepad2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Category = { id: string; name: string; slug: string };

const ICON_MAP: Record<string, React.ElementType> = {
  electronics: Laptop,
  fashion: Shirt,
  "home-living": Home,
  sports: Dumbbell,
  beauty: Sparkles,
  books: BookOpen,
  groceries: ShoppingBasket,
  "toys-kids": Gamepad2,
};

const COLOR_MAP: Record<string, string> = {
  electronics:  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  fashion:      "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "home-living":"bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sports:       "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  beauty:       "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  books:        "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  groceries:    "bg-lime-500/10 text-lime-600 dark:text-lime-400",
  "toys-kids":  "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function CategoryGrid() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug")
      .order("name")
      .then(({ data }) => { if (data) setCategories(data); });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-10 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? ShoppingBasket;
            const colorClass = COLOR_MAP[cat.slug] ?? "bg-primary/10 text-primary";
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-accent transition-colors group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClass} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
