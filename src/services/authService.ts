import { supabase } from "@/lib/supabase";
import type { LoginCredentials, SignupCredentials, AuthResult } from "@/types/auth";
import type { Profile } from "@/types/database";
import type { Session, User } from "@supabase/supabase-js";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult<{ user: User; session: Session }>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }
    if (!data.user || !data.session) {
      return { success: false, error: "Authentication failed. Please try again." };
    }

    return { success: true, data: { user: data.user, session: data.session } };
  },

  async signup(credentials: SignupCredentials): Promise<AuthResult<{ user: User }>> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName.trim(),
        },
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }
    if (!data.user) {
      return { success: false, error: "Signup failed. Please try again." };
    }

    return { success: true, data: { user: data.user } };
  },

  async logout(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: undefined };
  },

  async getSession(): Promise<{ user: User | null; session: Session | null }> {
    const { data } = await supabase.auth.getSession();
    return {
      user: data.session?.user ?? null,
      session: data.session ?? null,
    };
  },

  async refreshSession(): Promise<AuthResult<Session>> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
      return { success: false, error: "Session refresh failed." };
    }
    return { success: true, data: data.session };
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[authService] getProfile error:", error.message);
      return null;
    }
    return data;
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<Profile, "full_name" | "avatar_url">>
  ): Promise<AuthResult<Profile>> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async resetPassword(email: string): Promise<AuthResult> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: undefined };
  },

  onAuthStateChange(
    callback: (user: User | null, session: Session | null) => void
  ) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null, session);
    });
    return data.subscription;
  },
};

function mapAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (message.includes("Email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (message.includes("User already registered")) {
    return "An account with this email already exists.";
  }
  if (message.includes("Password should be at least")) {
    return "Password must be at least 8 characters long.";
  }
  if (message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}
