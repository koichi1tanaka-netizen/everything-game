"use client";

import { Check, Lock } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { ACHIEVEMENTS, MISSIONS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

export default function AchievementsPage() {
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const missionProgress = useGameStore((s) => s.missionProgress);
  const completedMissions = useGameStore((s) => s.completedMissions);

  return (
    <RequireCharacter>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold">🏆 Achievements & Missions</h1>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase text-ink/60">Missions</h2>
          <div className="space-y-2">
            {MISSIONS.map((m) => {
              const progress = missionProgress[m.id] ?? 0;
              const done = completedMissions.includes(m.id);
              const pct = Math.min(100, Math.round((progress / m.target) * 100));
              return (
                <div key={m.id} className={`game-card p-3 ${done ? "bg-mint/20" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-bold">{m.title}</p>
                    {done && <Check className="h-4 w-4 text-mint" />}
                  </div>
                  <p className="text-xs text-ink/60">{m.description}</p>
                  <div className="progress-track mt-2">
                    <div className="progress-fill bg-mint" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-ink/50">
                    {Math.min(progress, m.target)}/{m.target} · Reward: 🪙{m.rewardCoins} ✨{m.rewardXp}XP
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase text-ink/60">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedAchievements.includes(a.id);
              return (
                <div key={a.id} className={`game-card flex flex-col items-center gap-1 p-3 text-center ${unlocked ? "bg-mango/20" : "opacity-60"}`}>
                  {unlocked ? <span className="text-3xl">🏆</span> : <Lock className="h-6 w-6 text-ink/50" />}
                  <p className="font-display text-xs font-bold">{a.title}</p>
                  <p className="text-[11px] text-ink/60">{a.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RequireCharacter>
  );
}
