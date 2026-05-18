const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

function validateEnv() {
  const missing: string[] = [];
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.includes("your-")) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    console.warn(
      `[ElyXen] Missing or placeholder env vars: ${missing.join(", ")}\n` +
        "Copy .env.example to .env and fill in your Supabase credentials."
    );
  }
}

validateEnv();

export const env = {
  supabase: {
    url: requiredEnvVars.VITE_SUPABASE_URL as string,
    anonKey: requiredEnvVars.VITE_SUPABASE_ANON_KEY as string,
  },
  app: {
    name: (import.meta.env.VITE_APP_NAME as string) ?? "ElyXen",
    version: (import.meta.env.VITE_APP_VERSION as string) ?? "2.0.0",
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
