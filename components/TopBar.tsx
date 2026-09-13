"use client";

import { Coins, Heart, Smile, Star } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { XP_PER_LEVEL } from "@/lib/gameData";

export default function TopBar() {
  const { hasCharacter, character, level, xp, coins, energy, happiness } = useGameStore();

  if (!hasCharacter) return null;

  const xpTarget = XP_PER_LEVEL(level);
  const xpPct = Math.min(100, Math.round((xp / xpTarget) * 100));

  return (
    <div className="sticky top-0 z-20 border-b-4 border-ink bg-cream/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-ink text-2xl"
          style={{ backgroundColor: character.skinTone }}
        >
          🙂
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-display text-base font-bold">{character.name || "Player"}</span>
            <span className="flex shrink-0 items-center gap-1 rounded-full border-2 border-ink bg-grape px-2 py-0.5 text-xs font-bold text-white">
              <Star className="h-3 w-3 fill-white" /> Lv {level}
            </span>
          </div>
          <div className="progress-track mt-1">
            <div className="progress-fill bg-grape" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-sm font-bold">
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-mango px-2 py-0.5">
          <Coins className="h-4 w-4" /> {coins}
        </span>
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-bubblegum px-2 py-0.5 text-white">
          <Heart className="h-4 w-4 fill-white" /> {energy}
        </span>
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-mint px-2 py-0.5">
          <Smile className="h-4 w-4" /> {happiness}
        </span>
      </div>
    </div>
  );
}
