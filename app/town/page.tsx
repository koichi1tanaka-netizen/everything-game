"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { BUILDINGS, RANDOM_EVENTS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

function BuildingCard({ building, unlocked }: { building: (typeof BUILDINGS)[number]; unlocked: boolean }) {
  const content = (
    <div
      className={`game-card flex aspect-square flex-col items-center justify-center gap-1.5 p-2 text-center transition-transform ${
        unlocked ? "hover:-translate-y-1 hover:shadow-none active:translate-y-1" : "opacity-60"
      }`}
    >
      {unlocked ? (
        <>
          <span className="animate-float text-5xl leading-none">{building.icon}</span>
          <span className="font-display text-xs font-bold leading-tight">{building.name}</span>
        </>
      ) : (
        <>
          <Lock className="h-9 w-9 text-ink/60" />
          <span className="font-display text-xs font-bold leading-tight">{building.name}</span>
          <span className="text-[10px] font-bold text-ink/50">Lv {building.unlockLevel}</span>
        </>
      )}
    </div>
  );

  if (!unlocked) return content;
  return <Link href={building.href}>{content}</Link>;
}

export default function TownPage() {
  const level = useGameStore((s) => s.level);
  const character = useGameStore((s) => s.character);
  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const pushToast = useGameStore((s) => s.pushToast);
  const [event, setEvent] = useState<(typeof RANDOM_EVENTS)[number] | null>(null);

  useEffect(() => {
    if (Math.random() < 0.35) {
      const picked = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setEvent(picked);
    }
  }, []);

  function claimEvent() {
    if (!event) return;
    if (event.coins) addCoins(event.coins);
    if (event.xp) addXp(event.xp);
    pushToast(`${event.icon} ${event.coins ? `+${event.coins} coins ` : ""}${event.xp ? `+${event.xp} XP` : ""}`);
    setEvent(null);
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Welcome back, {character.name}!</h1>
          <p className="text-sm text-ink/70">Explore the town. Locked buildings unlock as you level up.</p>
        </div>

        {event && (
          <button
            onClick={claimEvent}
            className="game-card flex w-full items-center gap-3 border-mango bg-mango/20 p-3 text-left animate-pop"
          >
            <span className="text-3xl">{event.icon}</span>
            <span className="flex-1 text-sm font-bold">{event.text} Tap to claim!</span>
          </button>
        )}

        <div className="grid grid-cols-3 gap-3">
          {BUILDINGS.map((b) => (
            <BuildingCard key={b.id} building={b} unlocked={level >= b.unlockLevel} />
          ))}
        </div>

        <div className="game-card border-sky bg-sky/10 p-3 text-sm">
          <p className="font-bold">🌊 🏝️ 🏔️ 🏰 🚀</p>
          <p className="mt-1 text-ink/70">More areas — the Beach, Island, Mountain, Castle, and Space Station — unlock in future updates.</p>
        </div>
      </div>
    </RequireCharacter>
  );
}