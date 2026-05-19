import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";

export type AccentTheme = "default" | "ocean" | "forest" | "rose" | "amber" | "violet" | "slate";

export const ACCENT_THEMES: Record<AccentTheme, { label: string; description: string; primary: string; preview: string[] }> = {
  default: {
    label: "ElyXen Blue",
    description: "Classic indigo blue — the default",
    primary: "221 83% 53%",
    preview: ["#3b82f6", "#6366f1", "#e0e7ff"],
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
  rose: {
    label: "Rose",
    description: "Warm rose and pink",
    primary: "346 77% 49%",
    preview: ["#f43f5e", "#e11d48", "#ffe4e6"],
  },
  amber: {
    label: "Amber",
    description: "Warm amber and orange",
    primary: "38 92% 50%",
    preview: ["#f59e0b", "#d97706", "#fef3c7"],
  },
  violet: {
    label: "Violet",
    description: "Bold purple and violet",
    primary: "262 83% 58%",
    preview: ["#8b5cf6", "#7c3aed", "#ede9fe"],
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
