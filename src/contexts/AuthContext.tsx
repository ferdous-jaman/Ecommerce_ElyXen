import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginCredentials, SignupCredentials, AuthResult } from "@/types/auth";
import type { Profile } from "@/types/database";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult<{ user: User; session: Session }>>;
  signup: (credentials: SignupCredentials) => Promise<AuthResult<{ user: User }>>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    setUser,
    setProfile,
    setSession,
    setLoading,
    setInitialized,
    setError,
    reset,
  } = useAuthStore();

  const initCalled = useRef(false);

  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;

    async function initialize() {
      setLoading(true);

      const { user: currentUser, session: currentSession } =
        await authService.getSession();

      setUser(currentUser);
      setSession(currentSession);

      if (currentUser) {
        const userProfile = await authService.getProfile(currentUser.id);
        setProfile(userProfile);
      }

      setLoading(false);
      setInitialized(true);
    }

    initialize();

    const subscription = authService.onAuthStateChange(
      async (authUser, authSession) => {
        setUser(authUser);
        setSession(authSession);

        if (authUser) {
          const userProfile = await authService.getProfile(authUser.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setError, setInitialized, setLoading, setProfile, setSession, setUser]);

  async function login(
    credentials: LoginCredentials
  ): Promise<AuthResult<{ user: User; session: Session }>> {
    setError(null);
    const result = await authService.login(credentials);
    if (!result.success) {
      setError(result.error);
      return result;
    }
    const { user: loggedInUser, session: loggedInSession } = result.data!;
    setUser(loggedInUser);
    setSession(loggedInSession);
    const userProfile = await authService.getProfile(loggedInUser.id);
    setProfile(userProfile);
    return result;
  }

  async function signup(
    credentials: SignupCredentials
  ): Promise<AuthResult<{ user: User }>> {
    setError(null);
    const result = await authService.signup(credentials);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }

  async function logout() {
    await authService.logout();
    reset();
  }

  async function refreshProfile() {
    if (!user) return;
    const userProfile = await authService.getProfile(user.id);
    setProfile(userProfile);
  }

  const value: AuthContextValue = {
    user,
    profile,
    session,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
