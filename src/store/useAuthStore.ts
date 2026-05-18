import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import type { AuthState } from "@/types/auth";

type AuthActions = {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }, false, "auth/setUser"),
      setProfile: (profile) => set({ profile }, false, "auth/setProfile"),
      setSession: (session) => set({ session }, false, "auth/setSession"),
      setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),
      setInitialized: (isInitialized) =>
        set({ isInitialized }, false, "auth/setInitialized"),
      setError: (error) => set({ error }, false, "auth/setError"),
      reset: () =>
        set(
          { ...initialState, isLoading: false, isInitialized: true },
          false,
          "auth/reset"
        ),
    }),
    { name: "AuthStore" }
  )
);

export const selectIsAuthenticated = (state: AuthState) => !!state.user;
export const selectUserRole = (state: AuthState) =>
  state.profile?.role ?? null;
export const selectIsAdmin = (state: AuthState) =>
  state.profile?.role === "admin";
export const selectIsStaff = (state: AuthState) =>
  state.profile?.role === "staff" || state.profile?.role === "admin";
