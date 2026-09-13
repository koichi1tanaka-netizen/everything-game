"use client";

import { useEffect, useRef, useState } from "react";
import { ChallengeResult } from "@/lib/challenge";

const ROUNDS = 3;
const VISIBLE_MS = 700;

export default function CatchChallenge({ onResolve }: { onResolve: (result: ChallengeResult) => void }) {
  const [round, setRound] = useState(0);
  const [catches, setCatches] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const caughtRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (round >= ROUNDS) {
      const result: ChallengeResult = catches === ROUNDS ? "perfect" : catches >= 2 ? "good" : "miss";
      onResolve(result);
      return;
    }
    caughtRef.current = false;
    const delay = 300 + Math.random() * 500;
    const showTimer = setTimeout(() => {
      setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 60 });
      setVisible(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setRound((r) => r + 1);
      }, VISIBLE_MS);
    }, delay);
    return () => {
      clearTimeout(showTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function handleCatch() {
    if (caughtRef.current || !visible) return;
    caughtRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCatches((c) => c + 1);
    setVisible(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="space-y-2 animate-pop">
      <p className="text-center text-xs font-bold text-ink/60">
        Tap it fast! Round {Math.min(round + 1, ROUNDS)}/{ROUNDS} · Caught: {catches}
      </p>
      <div className="relative h-32 w-full overflow-hidden rounded-xl border-4 border-ink bg-sky/10">
        {visible && (
          <button
            onClick={handleCatch}
            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-ink bg-mango text-2xl animate-pop"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            🎯
          </button>
        )}
      </div>
    </div>
  );
}