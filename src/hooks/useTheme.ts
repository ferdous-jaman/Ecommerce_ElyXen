import { useEffect } from "react";
import { useThemeStore, ACCENT_THEMES } from "@/store/useThemeStore";
import type { Theme } from "@/types";

export function useTheme() {
  const { theme, setTheme, accentTheme, setAccentTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const config = ACCENT_THEMES[accentTheme];
    if (config) {
      root.style.setProperty("--primary", config.primary);
      root.style.setProperty("--ring", config.primary);
    }
  }, [accentTheme]);

  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return { theme, setTheme, resolvedTheme, accentTheme, setAccentTheme };
}

export type { Theme };
