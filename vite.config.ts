import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-avatar",
            "@radix-ui/react-separator",
            "@radix-ui/react-progress",
            "@radix-ui/react-switch",
            "@radix-ui/react-popover",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-alert-dialog",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
          ],
          "vendor-charts": ["recharts"],
          "vendor-forms":  ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-misc": ["zustand", "sonner", "lucide-react", "cmdk"],
        },
      },
    },
  },
});
