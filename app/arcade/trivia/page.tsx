"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { TRIVIA_QUESTIONS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

function rewardFor(correct: number, total: number) {
  const pct = correct / total;
  if (pct === 1) return { coins: 100, xp: 50 };
  if (pct >= 0.7) return { coins: 70, xp: 35 };
  if (pct >= 0.4) return { coins: 40, xp: 20 };
  return { coins: 15, xp: 10 };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TriviaGamePage() {
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState(() => shuffle(TRIVIA_QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const recordGamePlayed = useGameStore((s) => s.recordGamePlayed);
  const recordTriviaScore = useGameStore((s) => s.recordTriviaScore);
  const bestTriviaCorrect = useGameStore((s) => s.bestTriviaCorrect);
  const pushToast = useGameStore((s) => s.pushToast);

  const q = questions[current];
  const total = questions.length;

  function startNewGame() {
    setQuestions(shuffle(TRIVIA_QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setRound((r) => r + 1);
  }

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === q.correctIndex;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) setCorrectCount(nextCorrect);

    setTimeout(() => {
      if (current + 1 >= total) {
        setFinished(true);
        const reward = rewardFor(nextCorrect, total);
        addCoins(reward.coins);
        addXp(reward.xp);
        recordGamePlayed();
        recordTriviaScore(nextCorrect);
        pushToast(`❓ ${nextCorrect}/${total} — +${reward.coins} coins, +${reward.xp} XP`);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 700);
  }

  return (
    <RequireCharacter key={round}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/arcade" className="rounded-full border-2 border-ink bg-white p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-extrabold">❓ Trivia</h1>
        </div>

        {bestTriviaCorrect !== null && (
          <p className="text-sm font-bold text-ink/70">Best: {bestTriviaCorrect}/{total}</p>
        )}

        {!finished ? (
          <div className="game-card space-y-4 p-6">
            <div className="flex items-center justify-between text-xs font-bold text-ink/60">
              <span>Question {current + 1} of {total}</span>
              <span>Score: {correctCount}</span>
            </div>
            <p className="font-display text-lg font-bold">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correctIndex;
                const showState = selected !== null;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    className={`flex w-full items-center justify-between rounded-xl border-4 px-3 py-2 text-left text-sm font-bold transition-colors ${
                      showState && isCorrect
                        ? "border-ink bg-mint/50"
                        : showState && isSelected && !isCorrect
                        ? "border-ink bg-bubblegum/40"
                        : "border-ink/30 bg-white hover:border-ink"
                    }`}
                  >
                    {opt}
                    {showState && isCorrect && <Check className="h-4 w-4" />}
                    {showState && isSelected && !isCorrect && <X className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="game-card flex flex-col items-center gap-3 p-8 text-center">
            <span className="text-5xl">🎉</span>
            <p className="font-display text-2xl font-extrabold">
              {correctCount}/{total} correct!
            </p>
            <button onClick={startNewGame} className="game-btn w-full bg-mint">
              Play again
            </button>
          </div>
        )}
      </div>
    </RequireCharacter>
  );
}