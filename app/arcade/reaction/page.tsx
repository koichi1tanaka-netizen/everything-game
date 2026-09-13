"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import RequireCharacter from "@/components/RequireCharacter";

type Phase = "idle" | "waiting" | "ready" | "tooSoon" | "result";

function rewardFor(ms: number) {
  if (ms < 250) return { coins: 100, xp: 50 };
  if (ms < 400) return { coins: 60, xp: 30 };
  if (ms < 600) return { coins: 30, xp: 15 };
  return { coins: 10, xp: 5 };
}

export default function ReactionGamePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultMs, setResultMs] = useState<number | null>(null);
  const [reward, setReward] = useState<{ coins: number; xp: number } | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const recordGamePlayed = useGameStore((s) => s.recordGamePlayed);
  const recordReactionScore = useGameStore((s) => s.recordReactionScore);
  const bestReactionMs = useGameStore((s) => s.bestReactionMs);
  const pushToast = useGameStore((s) => s.pushToast);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const startRound = useCallback(() => {
    setPhase("waiting");
    setResultMs(null);
    setReward(null);
    const delay = 1200 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setPhase("ready");
    }, delay);
  }, []);

  function handleTap() {
    if (phase === "idle" || phase === "result" || phase === "tooSoon") {
      startRound();
      return;
    }
    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "ready") {
      const ms = Math.round(performance.now() - startTimeRef.current);
      const r = rewardFor(ms);
      setResultMs(ms);
      setReward(r);
      setPhase("result");
      addCoins(r.coins);
      addXp(r.xp);
      recordGamePlayed();
      recordReactionScore(ms);
      pushToast(`⚡ ${ms}ms — +${r.coins} coins, +${r.xp} XP`);
    }
  }

  const bgClass =
    phase === "ready"
      ? "bg-mint"
      : phase === "tooSoon"
      ? "bg-bubblegum"
      : phase === "waiting"
      ? "bg-ink"
      : "bg-grape";

  const label =
    phase === "idle"
      ? "Tap to start"
      : phase === "waiting"
      ? "Wait for green..."
      : phase === "ready"
      ? "TAP NOW!"
      : phase === "tooSoon"
      ? "Too soon! Tap to retry"
      : "Tap to play again";

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/arcade" className="rounded-full border-2 border-ink bg-white p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-extrabold">⚡ Reaction Time</h1>
        </div>

        {bestReactionMs !== null && (
          <p className="text-sm font-bold text-ink/70">Your best: {bestReactionMs}ms</p>
        )}

        <button
          onClick={handleTap}
          className={`flex h-72 w-full flex-col items-center justify-center gap-3 rounded-blob border-4 border-ink text-2xl font-display font-extrabold text-white shadow-chunky transition-colors ${bgClass}`}
        >
          {label}
          {phase === "result" && resultMs !== null && reward && (
            <div className="text-center text-base font-bold">
              <p>{resultMs}ms</p>
              <p className="mt-1 text-sm">🪙 +{reward.coins} · ✨ +{reward.xp} XP</p>
            </div>
          )}
        </button>

        <div className="game-card p-3 text-xs text-ink/60">
          <p className="font-bold text-ink">How rewards work:</p>
          <p>Under 250ms → 100 coins + 50 XP</p>
          <p>250–400ms → 60 coins + 30 XP</p>
          <p>400–600ms → 30 coins + 15 XP</p>
          <p>Over 600ms → 10 coins + 5 XP</p>
        </div>
      </div>
    </RequireCharacter>
  );
}
