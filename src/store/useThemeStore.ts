import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";

export type AccentTheme =
  | "default" | "ocean" | "forest" | "rose" | "amber" | "violet" | "slate"
  | "midnight" | "coral" | "gold" | "jade" | "crimson" | "nordic"
  | "sunset" | "neon" | "chocolate";

export const ACCENT_THEMES: Record<AccentTheme, { label: string; description: string; primary: string; preview: string[] }> = {
  default: {
    label: "ElyXen Blue",
    description: "Classic indigo blue — the default",
    primary: "221 83% 53%",
    preview: ["#3b82f6", "#6366f1", "#e0e7ff"],
  },
  midnight: {
    label: "Midnight",
    description: "Deep navy — sophisticated & premium",
    primary: "226 71% 40%",
    preview: ["#1e3a8a", "#1d4ed8", "#dbeafe"],
  },
  ocean: {
    label: "Ocean",
    description: "Deep teal and cyan tones",
    primary: "186 100% 35%",
    preview: ["#0891b2", "#06b6d4", "#cffafe"],
  },
  forest: {
    label: "Forest",
    description: "Natural emerald green",
    primary: "142 71% 45%",
    preview: ["#22c55e", "#16a34a", "#dcfce7"],
  },
  jade: {
    label: "Jade",
    description: "Luxurious deep jade green",
    primary: "162 63% 35%",
    preview: ["#047857", "#059669", "#d1fae5"],
  },
  rose: {
    label: "Rose",
    description: "Warm rose and pink",
    primary: "346 77% 49%",
    preview: ["#f43f5e", "#e11d48", "#ffe4e6"],
  },
  coral: {
    label: "Coral",
    description: "Vibrant coral — fresh and energetic",
    primary: "14 100% 57%",
    preview: ["#ff4d00", "#ff6b35", "#ffede6"],
  },
  crimson: {
    label: "Crimson",
    description: "Rich crimson — bold and elegant",
    primary: "348 83% 47%",
    preview: ["#be123c", "#e11d48", "#ffe4e6"],
  },
  amber: {
    label: "Amber",
    description: "Warm amber and orange",
    primary: "38 92% 50%",
    preview: ["#f59e0b", "#d97706", "#fef3c7"],
  },
  gold: {
    label: "Royal Gold",
    description: "Premium gold — luxury and prestige",
    primary: "45 93% 47%",
    preview: ["#d97706", "#b45309", "#fef9c3"],
  },
  sunset: {
    label: "Sunset",
    description: "Warm orange-to-pink gradient feel",
    primary: "25 95% 53%",
    preview: ["#f97316", "#fb923c", "#fff7ed"],
  },
  violet: {
    label: "Violet",
    description: "Bold purple and violet",
    primary: "262 83% 58%",
    preview: ["#8b5cf6", "#7c3aed", "#ede9fe"],
  },
  neon: {
    label: "Neon Purple",
    description: "Electric neon purple — futuristic",
    primary: "280 100% 60%",
    preview: ["#9333ea", "#a855f7", "#f3e8ff"],
  },
  nordic: {
    label: "Nordic",
    description: "Cool nordic blue-grey — clean & calm",
    primary: "210 40% 45%",
    preview: ["#4a7fa5", "#5b8db8", "#e0eef8"],
  },
  chocolate: {
    label: "Chocolate",
    description: "Rich warm brown — earthy elegance",
    primary: "20 60% 35%",
    preview: ["#78350f", "#92400e", "#fef3c7"],
  },
  slate: {
    label: "Slate",
    description: "Neutral slate — minimal look",
    primary: "215 25% 27%",
    preview: ["#475569", "#334155", "#f1f5f9"],
  },
};

type ThemeState = {
  theme: Theme;
  accentTheme: AccentTheme;
  setTheme: (theme: Theme) => void;
  setAccentTheme: (accent: AccentTheme) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      accentTheme: "default",
      setTheme: (theme) => set({ theme }),
      setAccentTheme: (accentTheme) => set({ accentTheme }),
    }),
    {
      name: "elyxen-theme",
    }
  )
);
