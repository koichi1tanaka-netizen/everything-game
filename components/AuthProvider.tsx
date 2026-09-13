"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  supabaseConfigured: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  supabaseConfigured: false,
  signOut: async () => {},
});

// Routes reachable without being signed in.
const PUBLIC_ROUTES = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    setSupabaseConfigured(true);

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Redirect rules (only once we know the auth state):
  // - no user on a private route  -> go to /login
  // - signed-in user sitting on /login -> go home
  useEffect(() => {
    if (loading) return;
    // If Supabase isn't set up, don't trap the user on a login page that can't work.
    if (!supabaseConfigured) return;

    if (!user && !isPublicRoute) {
      router.replace("/login");
    } else if (user && isPublicRoute) {
      router.replace("/");
    }
  }, [loading, user, isPublicRoute, supabaseConfigured, router]);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  // While we're checking the session, don't flash the game or the builder.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse font-display text-sm font-bold text-ink/60">Loading…</p>
      </div>
    );
  }

  // Signed out on a private route: hold the UI blank for the one frame
  // before the redirect above kicks in, so the game never appears.
  if (supabaseConfigured && !user && !isPublicRoute) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, supabaseConfigured, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}