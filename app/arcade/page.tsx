"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { ARCADE_GAMES } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

export default function ArcadePage() {
  const bestReactionMs = useGameStore((s) => s.bestReactionMs);
  const bestMemoryMoves = useGameStore((s) => s.bestMemoryMoves);
  const bestMathScore = useGameStore((s) => s.bestMathScore);
  const bestTriviaCorrect = useGameStore((s) => s.bestTriviaCorrect);
  const bestTypingWpm = useGameStore((s) => s.bestTypingWpm);

  function bestFor(id: string) {
    if (id === "reaction" && bestReactionMs !== null) return `Best: ${bestReactionMs}ms`;
    if (id === "memory" && bestMemoryMoves !== null) return `Best: ${bestMemoryMoves} moves`;
    if (id === "math" && bestMathScore !== null) return `Best: ${bestMathScore} correct`;
    if (id === "trivia" && bestTriviaCorrect !== null) return `Best: ${bestTriviaCorrect}/${10}`;
    if (id === "typing" && bestTypingWpm !== null) return `Best: ${bestTypingWpm} WPM`;
    return null;
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold">🎮 Arcade</h1>
        <p className="text-sm text-ink/70">Pick a game. More slots are coming soon!</p>

        <div className="grid grid-cols-2 gap-3">
          {ARCADE_GAMES.map((g) => {
            const best = bestFor(g.id);
            const card = (
              <div
                className={`game-card flex aspect-square flex-col items-center justify-center gap-1 p-3 text-center ${
                  g.live ? "hover:-translate-y-1 hover:shadow-none active:translate-y-1" : "opacity-50"
                }`}
              >
                {g.live ? <span className="text-4xl">{g.icon}</span> : <Lock className="h-8 w-8 text-ink/50" />}
                <span className="font-display text-sm font-bold">{g.name}</span>
                {best && <span className="text-xs font-bold text-mint">{best}</span>}
                {!g.live && <span className="text-[10px] font-bold text-ink/50">Coming soon</span>}
              </div>
            );
            return g.live ? (
              <Link key={g.id} href={g.href}>
                {card}
              </Link>
            ) : (
              <div key={g.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </RequireCharacter>
  );
}