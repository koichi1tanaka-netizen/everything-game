"use client";

import { useEffect, useRef, useState } from "react";
import { ChallengeResult } from "@/lib/challenge";

const DURATION_MS = 2200;
const PERFECT_TAPS = 16;
const GOOD_TAPS = 9;

export default function TapChallenge({ onResolve }: { onResolve: (result: ChallengeResult) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_MS);
  const doneRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = performance.now();
    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, DURATION_MS - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTaps((finalTaps) => {
          const result: ChallengeResult = finalTaps >= PERFECT_TAPS ? "perfect" : finalTaps >= GOOD_TAPS ? "good" : "miss";
          onResolve(result);
          return finalTaps;
        });
      }
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap() {
    if (doneRef.current) return;
    setTaps((t) => t + 1);
  }

  const pct = (timeLeft / DURATION_MS) * 100;

  return (
    <div className="space-y-2 animate-pop">
      <p className="text-center text-xs font-bold text-ink/60">Tap as fast as you can!</p>
      <div className="progress-track">
        <div className="progress-fill bg-bubblegum" style={{ width: `${pct}%` }} />
      </div>
      <button onClick={handleTap} className="game-btn w-full bg-mango active:scale-90">
        Tap! ({taps})
      </button>
    </div>
  );
}