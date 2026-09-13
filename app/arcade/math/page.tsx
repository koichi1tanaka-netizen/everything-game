"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import RequireCharacter from "@/components/RequireCharacter";

const ROUND_SECONDS = 30;

function randomProblem() {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { text: `${a} ${op} ${b}`, answer };
}

function rewardFor(score: number) {
  if (score >= 15) return { coins: 100, xp: 50 };
  if (score >= 10) return { coins: 70, xp: 35 };
  if (score >= 5) return { coins: 40, xp: 20 };
  return { coins: 15, xp: 10 };
}

export default function MathGamePage() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [problem, setProblem] = useState(randomProblem());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const recordGamePlayed = useGameStore((s) => s.recordGamePlayed);
  const recordMathScore = useGameStore((s) => s.recordMathScore);
  const bestMathScore = useGameStore((s) => s.bestMathScore);
  const pushToast = useGameStore((s) => s.pushToast);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  function finishGame(finalScore: number) {
    setPhase("done");
    if (intervalRef.current) clearInterval(intervalRef.current);
    const reward = rewardFor(finalScore);
    addCoins(reward.coins);
    addXp(reward.xp);
    recordGamePlayed();
    recordMathScore(finalScore);
    pushToast(`➕ ${finalScore} correct — +${reward.coins} coins, +${reward.xp} XP`);
  }

  function startGame() {
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setProblem(randomProblem());
    setInput("");
    setPhase("playing");
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setScore((s) => {
            finishGame(s);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== "playing" || input === "") return;
    if (Number(input) === problem.answer) {
      setScore((s) => s + 1);
    }
    setProblem(randomProblem());
    setInput("");
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/arcade" className="rounded-full border-2 border-ink bg-white p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-extrabold">➕ Quick Math</h1>
        </div>

        {bestMathScore !== null && <p className="text-sm font-bold text-ink/70">Best: {bestMathScore} correct</p>}

        {phase === "idle" && (
          <div className="game-card flex flex-col items-center gap-3 p-8 text-center">
            <span className="text-5xl">🧮</span>
            <p className="text-sm text-ink/70">Solve as many problems as you can in {ROUND_SECONDS} seconds.</p>
            <button onClick={startGame} className="game-btn w-full bg-mint">
              Start
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="game-card flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex w-full items-center justify-between text-sm font-bold">
              <span>Score: {score}</span>
              <span className={timeLeft <= 5 ? "text-bubblegum" : ""}>{timeLeft}s</span>
            </div>
            <p className="font-display text-4xl font-extrabold">{problem.text}</p>
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <input
                autoFocus
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/[^-\d]/g, ""))}
                className="w-full rounded-xl border-4 border-ink px-3 py-2 text-center font-display text-xl outline-none focus:ring-4 focus:ring-grape/30"
                placeholder="?"
              />
              <button type="submit" className="game-btn shrink-0 bg-grape text-white">
                Go
              </button>
            </form>
          </div>
        )}

        {phase === "done" && (
          <div className="game-card flex flex-col items-center gap-3 p-8 text-center">
            <span className="text-5xl">🎉</span>
            <p className="font-display text-2xl font-extrabold">{score} correct!</p>
            <button onClick={startGame} className="game-btn w-full bg-mint">
              Play again
            </button>
          </div>
        )}

        <div className="game-card p-3 text-xs text-ink/60">
          <p className="font-bold text-ink">How rewards work:</p>
          <p>15+ correct → 100 coins + 50 XP</p>
          <p>10–14 correct → 70 coins + 35 XP</p>
          <p>5–9 correct → 40 coins + 20 XP</p>
          <p>Under 5 → 15 coins + 10 XP</p>
        </div>
      </div>
    </RequireCharacter>
  );
}