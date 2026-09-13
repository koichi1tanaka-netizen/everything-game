"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { useAuth } from "@/components/AuthProvider";

export default function RequireCharacter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, supabaseConfigured } = useAuth();
  const hasCharacter = useGameStore((s) => s.hasCharacter);

  useEffect(() => {
    if (loading) return;
    if (supabaseConfigured && !user) {
      router.replace("/login");
      return;
    }
    if (!hasCharacter) router.replace("/");
  }, [loading, supabaseConfigured, user, hasCharacter, router]);

  if (loading) return null;
  if (supabaseConfigured && !user) return null;
  if (!hasCharacter) return null;

  return <>{children}</>;
}