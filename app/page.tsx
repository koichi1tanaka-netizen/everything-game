"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { useAuth } from "@/components/AuthProvider";
import CharacterCreator from "@/components/CharacterCreator";

export default function RootPage() {
  const router = useRouter();
  const { user, loading, supabaseConfigured } = useAuth();
  const hasCharacter = useGameStore((s) => s.hasCharacter);

  useEffect(() => {
    if (loading) return;

    // Not signed in -> always go to login (unless Supabase truly isn't set up).
    if (!user) {
      if (supabaseConfigured) router.replace("/login");
      return;
    }

    // Signed in and already has a character -> straight to town.
    if (hasCharacter) router.replace("/town");
  }, [loading, supabaseConfigured, user, hasCharacter, router]);

  if (loading) return null;
  if (!user && supabaseConfigured) return null;
  if (user && hasCharacter) return null;

  // If Supabase isn't configured, make it obvious instead of silently
  // dropping into the character builder.
  if (!supabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="game-card border-bubblegum bg-white p-4">
          <p className="font-display text-sm font-bold text-ink">Supabase isn’t connected</p>
          <p className="mt-1 text-xs text-ink/70">
            The app can’t see your <code>NEXT_PUBLIC_SUPABASE_URL</code> / <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            Check <code>.env.local</code> is in the app folder and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <CharacterCreator />
    </div>
  );
}