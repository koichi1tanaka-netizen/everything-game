"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useGameStore } from "@/store/useGameStore";
import { loadGameState, pickGameState, saveGameState } from "@/lib/supabase/sync";

export default function GameSync() {
  const { user, loading } = useAuth();
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);
  const hydratedRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the cloud save once we know who's logged in.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;

    loadGameState(user.id).then((saved) => {
      if (cancelled) return;
      if (saved) hydrateFromSave(saved);
      hydratedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [user, loading, hydrateFromSave]);

  // Auto-save (debounced) whenever the game state changes.
  useEffect(() => {
    if (!user) return;

    const unsubscribe = useGameStore.subscribe((state) => {
      if (!hydratedRef.current) return; // don't overwrite the cloud save before we've loaded it
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveGameState(user.id, pickGameState(state));
      }, 1200);
    });

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [user]);

  return null;
}