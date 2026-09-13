"use client";

import { useEffect, useRef, useState } from "react";

export type ChallengeResult = "perfect" | "good" | "miss";

export const RESULT_MULTIPLIER: Record<ChallengeResult, number> = {
  perfect: 1.5,
  good: 1,
  miss: 0.6,
};

export const RESULT_LABEL: Record<ChallengeResult, string> = {
  perfect: "Perfect timing! 🎯",
  good: "Nice one! 👍",
  miss: "Just okay...",
};

export const RESULT_COLOR: Record<ChallengeResult, string> = {
  perfect: "bg-mint/30",
  good: "bg-sky/30",
  miss: "bg-bubblegum/30",
};

// A marker sweeps back and forth across a bar. Tap "Stop!" to land it in
// the sweet spot for a reward bonus. Used to turn each town activity into
// a tiny interactive beat instead of a plain button press.
export default function TimingChallenge({ onResolve }: { onResolve: (result: ChallengeResult) => void }) {
  const [position, setPosition] = useState(50);
  const startRef = useRef<number>(performance.now());
  const frameRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    function tick(now: number) {
      const elapsed = (now - startRef.current) / 1000;
      const pos = 50 + 47 * Math.sin(elapsed * 3.4);
      setPosition(pos);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function handleStop() {
    if (doneRef.current) return;
    doneRef.current = true;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const dist = Math.abs(position - 50);
    const result: ChallengeResult = dist <= 7 ? "perfect" : dist <= 20 ? "good" : "miss";
    onResolve(result);
  }

  return (
    <div className="space-y-2 animate-pop">
      <p className="text-center text-xs font-bold text-ink/60">Stop the marker in the zone for a bonus!</p>
      <div className="relative h-7 w-full overflow-hidden rounded-full border-4 border-ink bg-white">
        <div className="absolute inset-y-0 left-[30%] w-[40%] bg-sky/40" />
        <div className="absolute inset-y-0 left-[43%] w-[14%] bg-mint" />
        <div
          className="absolute top-0 h-full w-2 -translate-x-1/2 rounded-full bg-ink transition-none"
          style={{ left: `${position}%` }}
        />
      </div>
      <button onClick={handleStop} className="game-btn w-full bg-bubblegum text-white active:scale-95">
        Stop!
      </button>
    </div>
  );
}