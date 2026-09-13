"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, Heart } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { TownActivity, TownLocationConfig } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";
import TimingChallenge, {
  ChallengeResult,
  RESULT_COLOR,
  RESULT_LABEL,
  RESULT_MULTIPLIER,
} from "@/components/TimingChallenge";
import TapChallenge from "@/components/TapChallenge";
import CatchChallenge from "@/components/CatchChallenge";
import MemoryFlashChallenge from "@/components/MemoryFlashChallenge";

// Maps an activity's `challenge` key to the component that runs it.
// Activities with no key fall back to "timing" (the oscillating bar).
const CHALLENGES = {
  timing: TimingChallenge,
  tap: TapChallenge,
  catch: CatchChallenge,
  flash: MemoryFlashChallenge,
};

interface Floater {
  id: string;
  text: string;
}

// Per-location look. Keyed by config.id (park, school, stadium, craftStore,
// police, library, cafe). Only uses color tokens already in the project.
interface LocationTheme {
  hero: string;
  heroText: string;
  badge: string;
  button: string;
  rule: string;
}

const LOCATION_THEMES: Record<string, LocationTheme> = {
  park: {
    hero: "border-mint bg-mint/20",
    heroText: "text-ink/70",
    badge: "bg-mint/40",
    button: "bg-mint text-ink",
    rule: "bg-mint",
  },
  school: {
    hero: "border-sky bg-sky/20",
    heroText: "text-ink/70",
    badge: "bg-sky/30",
    button: "bg-sky text-ink",
    rule: "bg-sky",
  },
  stadium: {
    hero: "border-mango bg-mango/20",
    heroText: "text-ink/70",
    badge: "bg-mango/40",
    button: "bg-mango text-ink",
    rule: "bg-mango",
  },
  craftStore: {
    hero: "border-bubblegum bg-bubblegum/20",
    heroText: "text-ink/70",
    badge: "bg-bubblegum/40",
    button: "bg-bubblegum text-white",
    rule: "bg-bubblegum",
  },
  police: {
    // Dark "detective" theme — the standout of the set.
    hero: "border-ink bg-ink",
    heroText: "text-white/80",
    badge: "bg-white/15",
    button: "bg-ink text-white",
    rule: "bg-ink",
  },
  library: {
    hero: "border-grape bg-grape/20",
    heroText: "text-ink/70",
    badge: "bg-grape/30",
    button: "bg-grape text-white",
    rule: "bg-grape",
  },
  cafe: {
    // Warm bakery mix: pink wash, gold accents.
    hero: "border-bubblegum bg-bubblegum/20",
    heroText: "text-ink/70",
    badge: "bg-mango/30",
    button: "bg-mango text-ink",
    rule: "bg-mango",
  },
};

const FALLBACK_THEME: LocationTheme = {
  hero: "border-ink bg-white",
  heroText: "text-ink/70",
  badge: "bg-mint/30",
  button: "bg-mint text-ink",
  rule: "bg-ink",
};

function scale(value: number | undefined, multiplier: number) {
  if (!value) return undefined;
  return Math.max(1, Math.round(value * multiplier));
}

export default function TownLocation({ config }: { config: TownLocationConfig }) {
  const coins = useGameStore((s) => s.coins);
  const energy = useGameStore((s) => s.energy);
  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const addHappiness = useGameStore((s) => s.addHappiness);
  const addEnergy = useGameStore((s) => s.addEnergy);
  const spendCoins = useGameStore((s) => s.spendCoins);
  const pushToast = useGameStore((s) => s.pushToast);

  const theme = LOCATION_THEMES[config.id] ?? FALLBACK_THEME;

  const [log, setLog] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultFlash, setResultFlash] = useState<{ id: string; result: ChallengeResult } | null>(null);
  const [floaters, setFloaters] = useState<Record<string, Floater[]>>({});

  function canAfford(activity: TownActivity) {
    if (activity.costCoins && coins < activity.costCoins) return false;
    if (activity.costEnergy && energy < activity.costEnergy) return false;
    return true;
  }

  function handleStart(activity: TownActivity) {
    if (activeId) return; // one challenge at a time
    if (!canAfford(activity)) {
      pushToast(activity.costCoins && coins < activity.costCoins ? "Not enough coins!" : "Not enough energy!");
      return;
    }
    if (activity.costCoins) spendCoins(activity.costCoins);
    if (activity.costEnergy) addEnergy(-activity.costEnergy);
    setActiveId(activity.id);
  }

  function handleResolve(activity: TownActivity, result: ChallengeResult) {
    const multiplier = RESULT_MULTIPLIER[result];
    const coinsGained = scale(activity.rewardCoins, multiplier);
    const xpGained = scale(activity.rewardXp, multiplier);
    const happinessGained = scale(activity.rewardHappiness, multiplier);
    const energyGained = scale(activity.rewardEnergy, multiplier);

    if (coinsGained) addCoins(coinsGained);
    if (xpGained) addXp(xpGained);
    if (happinessGained) addHappiness(happinessGained);
    if (energyGained) addEnergy(energyGained);

    const parts: string[] = [];
    if (coinsGained) parts.push(`🪙+${coinsGained}`);
    if (xpGained) parts.push(`✨+${xpGained}XP`);
    if (happinessGained) parts.push(`😊+${happinessGained}`);
    if (energyGained) parts.push(`❤️+${energyGained}`);

    pushToast(`${RESULT_LABEL[result]} ${parts.join(" · ")}`);
    setLog((prev) => [{ id: `${activity.id}-${Date.now()}`, text: `${RESULT_LABEL[result]} ${activity.resultText}` }, ...prev].slice(0, 3));

    const floaterText = parts.join("  ") || "Done!";
    const floaterId = `${activity.id}-${Date.now()}`;
    setFloaters((prev) => ({ ...prev, [activity.id]: [...(prev[activity.id] ?? []), { id: floaterId, text: floaterText }] }));
    setTimeout(() => {
      setFloaters((prev) => ({ ...prev, [activity.id]: (prev[activity.id] ?? []).filter((f) => f.id !== floaterId) }));
    }, 1000);

    setResultFlash({ id: activity.id, result });
    setTimeout(() => setResultFlash(null), 600);
    setActiveId(null);
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/town" className="rounded-full border-2 border-ink bg-white p-1.5">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="font-display text-2xl font-extrabold">
              {config.icon} {config.name}
            </h1>
          </div>
          <div className={`h-1.5 w-20 rounded-full ${theme.rule}`} />
        </div>

        <div className={`game-card flex flex-col items-center gap-3 p-6 text-center ${theme.hero}`}>
          <span className={`grid h-24 w-24 place-items-center rounded-full ${theme.badge}`}>
            <span className="animate-float text-6xl leading-none">{config.icon}</span>
          </span>
          <p className={`text-sm ${theme.heroText}`}>{config.tagline}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase text-ink/60">Things to do here</h2>
          <div className="space-y-2">
            {config.activities.map((activity) => {
              const affordable = canAfford(activity);
              const isActive = activeId === activity.id;
              const isFlashing = resultFlash?.id === activity.id;
              const activeFloaters = floaters[activity.id] ?? [];
              const Challenge = CHALLENGES[activity.challenge ?? "timing"];

              return (
                <div
                  key={activity.id}
                  className={`game-card relative overflow-visible p-3 transition-colors ${
                    isFlashing ? RESULT_COLOR[resultFlash!.result] : ""
                  }`}
                >
                  {/* floating reward numbers */}
                  {activeFloaters.map((f) => (
                    <span
                      key={f.id}
                      className="pointer-events-none absolute right-3 top-0 animate-rise font-display text-sm font-extrabold text-ink"
                    >
                      {f.text}
                    </span>
                  ))}

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activity.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-bold">{activity.label}</p>
                      <p className="text-xs text-ink/60">{activity.description}</p>
                      {!isActive && (
                        <div className="mt-1 flex flex-wrap gap-1 text-[11px] font-bold">
                          {activity.costCoins && (
                            <span className="flex items-center gap-0.5 rounded-full border-2 border-ink bg-white px-1.5 py-0.5">
                              <Coins className="h-3 w-3" />-{activity.costCoins}
                            </span>
                          )}
                          {activity.costEnergy && (
                            <span className="flex items-center gap-0.5 rounded-full border-2 border-ink bg-white px-1.5 py-0.5">
                              <Heart className="h-3 w-3" />-{activity.costEnergy}
                            </span>
                          )}
                          {activity.rewardCoins && (
                            <span className="flex items-center gap-0.5 rounded-full border-2 border-ink bg-mango px-1.5 py-0.5">
                              <Coins className="h-3 w-3" />+{activity.rewardCoins}
                            </span>
                          )}
                          {activity.rewardXp && (
                            <span className="rounded-full border-2 border-ink bg-grape px-1.5 py-0.5 text-white">
                              ✨+{activity.rewardXp}
                            </span>
                          )}
                          {activity.rewardHappiness && (
                            <span className="rounded-full border-2 border-ink bg-mint px-1.5 py-0.5">😊+{activity.rewardHappiness}</span>
                          )}
                          {activity.rewardEnergy && (
                            <span className="flex items-center gap-0.5 rounded-full border-2 border-ink bg-bubblegum px-1.5 py-0.5 text-white">
                              <Heart className="h-3 w-3 fill-white" />+{activity.rewardEnergy}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isActive && (
                      <button
                        onClick={() => handleStart(activity)}
                        disabled={!affordable || activeId !== null}
                        className={`shrink-0 rounded-xl border-4 border-ink px-3 py-2 text-xs font-bold transition-transform active:scale-90 disabled:opacity-40 disabled:active:scale-100 ${theme.button}`}
                      >
                        Do it
                      </button>
                    )}
                  </div>

                  {isActive && (
                    <div className="mt-2">
                      <Challenge onResolve={(result) => handleResolve(activity, result)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {log.length > 0 && (
          <div className="game-card p-3">
            <h2 className="mb-1 font-display text-xs font-bold uppercase text-ink/60">What just happened</h2>
            <ul className="space-y-1 text-sm">
              {log.map((entry) => (
                <li key={entry.id} className="text-ink/70">
                  {entry.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </RequireCharacter>
  );
}