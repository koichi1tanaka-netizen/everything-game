"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { TYPING_WORDS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

const ROUND_SECONDS = 30;

function randomWord(exclude?: string) {
  let word = TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)];
  while (word === exclude) {
    word = TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)];
  }
  return word;
}

function rewardFor(score: number) {
  if (score >= 20) return { coins: 100, xp: 50 };
  if (score >= 14) return { coins: 70, xp: 35 };
  if (score >= 8) return { coins: 40, xp: 20 };
  return { coins: 15, xp: 10 };
}

export default function TypingGamePage() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [word, setWord] = useState(() => randomWord());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [shake, setShake] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addCoins = useGameStore((s) => s.addCoins);
  const addXp = useGameStore((s) => s.addXp);
  const recordGamePlayed = useGameStore((s) => s.recordGamePlayed);
  const recordTypingScore = useGameStore((s) => s.recordTypingScore);
  const bestTypingWpm = useGameStore((s) => s.bestTypingWpm);
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
    recordTypingScore(finalScore);
    pushToast(`⌨️ ${finalScore} words — +${reward.coins} coins, +${reward.xp} XP`);
  }

  function startGame() {
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setWord(randomWord());
    setInput("");
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
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
    if (input.trim().toLowerCase() === word.toLowerCase()) {
      setScore((s) => s + 1);
      setWord((w) => randomWord(w));
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
    setInput("");
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/arcade" className="rounded-full border-2 border-ink bg-white p-1.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-extrabold">⌨️ Typing Test</h1>
        </div>

        {bestTypingWpm !== null && <p className="text-sm font-bold text-ink/70">Best: {bestTypingWpm} words</p>}

        {phase === "idle" && (
          <div className="game-card flex flex-col items-center gap-3 p-8 text-center">
            <span className="text-5xl">⌨️</span>
            <p className="text-sm text-ink/70">Type as many words as you can correctly in {ROUND_SECONDS} seconds.</p>
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
            <p className={`font-display text-4xl font-extrabold tracking-wide ${shake ? "text-bubblegum" : ""}`}>{word}</p>
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <input
                ref={inputRef}
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full rounded-xl border-4 px-3 py-2 text-center font-display text-xl outline-none focus:ring-4 focus:ring-grape/30 ${
                  shake ? "border-bubblegum" : "border-ink"
                }`}
                placeholder="Type it..."
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
            <p className="font-display text-2xl font-extrabold">{score} words correct!</p>
            <button onClick={startGame} className="game-btn w-full bg-mint">
              Play again
            </button>
          </div>
        )}

        <div className="game-card p-3 text-xs text-ink/60">
          <p className="font-bold text-ink">How rewards work:</p>
          <p>20+ words → 100 coins + 50 XP</p>
          <p>14–19 words → 70 coins + 35 XP</p>
          <p>8–13 words → 40 coins + 20 XP</p>
          <p>Under 8 → 15 coins + 10 XP</p>
        </div>
      </div>
    </RequireCharacter>
  );
}