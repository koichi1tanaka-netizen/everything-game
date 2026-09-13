"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { MEMORY_ICONS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

interface Card {
  key: string;
  icon: string;
  matched: boolean;
}

function rewardFor(moves: number) {
  if (moves <= 8) return { coins: 100, xp: 50 };
  if (moves <= 12) return { coins: 70, xp: 35 };
  if (moves <= 16) return { coins: 40, xp: 20 };
  return { coins: 20, xp: 10 };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function newDeck(): Card[] {
  const pairs = MEMORY_ICONS.flatMap((icon) => [
    { key: `${icon}-a`, icon, matched: false },
    { key: `${icon}-b`, icon, matched: false },
  ]);
  return shuffle(pairs);
}

export default function MemoryGamePage() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);

  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const recordGamePlayed = useGameStore((s) => s.recordGamePlayed);
  const recordMemoryScore = useGameStore((s) => s.recordMemoryScore);
  const bestMemoryMoves = useGameStore((s) => s.bestMemoryMoves);
  const pushToast = useGameStore((s) => s.pushToast);

  function startNewGame() {
    setDeck(newDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setFinished(false);
  }

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allMatched = useMemo(() => deck.length > 0 && deck.every((c) => c.matched), [deck]);

  useEffect(() => {
    if (allMatched && !finished) {
      setFinished(true);
      const reward = rewardFor(moves);
      addCoins(reward.coins);
      addXp(reward.xp);
      recordGamePlayed();
      recordMemoryScore(moves);
      pushToast(`🧠 Solved in ${moves} moves — +${reward.coins} coins, +${reward.xp} XP`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMatched]);

  function handleFlip(index: number) {
    if (locked || finished) return;
    if (flipped.includes(index) || deck[index].matched) return;
    if (flipped.length === 2) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          setFlipped([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/arcade" className="rounded-full border-2 border-ink bg-white p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-extrabold">🧠 Memory Match</h1>
        </div>

        <div className="flex items-center justify-between text-sm font-bold text-ink/70">
          <span>Moves: {moves}</span>
          {bestMemoryMoves !== null && <span>Best: {bestMemoryMoves} moves</span>}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {deck.map((card, i) => {
            const isFlipped = flipped.includes(i) || card.matched;
            return (
              <button
                key={card.key}
                onClick={() => handleFlip(i)}
                className={`flex aspect-square items-center justify-center rounded-xl border-4 border-ink text-3xl transition-colors ${
                  card.matched ? "bg-mint/40" : isFlipped ? "bg-white" : "bg-grape"
                }`}
              >
                {isFlipped ? card.icon : ""}
              </button>
            );
          })}
        </div>

        {finished && (
          <button onClick={startNewGame} className="game-btn w-full bg-mint">
            Play again
          </button>
        )}

        <div className="game-card p-3 text-xs text-ink/60">
          <p className="font-bold text-ink">How rewards work:</p>
          <p>8 moves or fewer → 100 coins + 50 XP</p>
          <p>9–12 moves → 70 coins + 35 XP</p>
          <p>13–16 moves → 40 coins + 20 XP</p>
          <p>17+ moves → 20 coins + 10 XP</p>
        </div>
      </div>
    </RequireCharacter>
  );
}