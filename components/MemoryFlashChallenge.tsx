"use client";

import { useEffect, useState } from "react";
import { ChallengeResult } from "@/lib/challenge";

const ICONS = ["🍎", "⭐", "🎈", "🌙", "🔥", "💧"];

function pickSequence(): string[] {
  const shuffled = [...ICONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function MemoryFlashChallenge({ onResolve }: { onResolve: (result: ChallengeResult) => void }) {
  const [sequence] = useState(pickSequence);
  const [options] = useState(() => [...sequence].sort(() => Math.random() - 0.5));
  const [showIndex, setShowIndex] = useState(0);
  const [phase, setPhase] = useState<"showing" | "input">("showing");
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (phase !== "showing") return;
    if (showIndex >= sequence.length) {
      const t = setTimeout(() => setPhase("input"), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowIndex((i) => i + 1), 600);
    return () => clearTimeout(t);
  }, [showIndex, phase, sequence.length]);

  function handlePick(icon: string) {
    if (phase !== "input" || picked.includes(icon) || picked.length >= sequence.length) return;
    const next = [...picked, icon];
    setPicked(next);
    if (next.length === sequence.length) {
      const correctCount = next.filter((v, i) => v === sequence[i]).length;
      const result: ChallengeResult = correctCount === sequence.length ? "perfect" : correctCount >= sequence.length - 1 ? "good" : "miss";
      setTimeout(() => onResolve(result), 300);
    }
  }

  return (
    <div className="space-y-2 animate-pop text-center">
      {phase === "showing" ? (
        <>
          <p className="text-xs font-bold text-ink/60">Watch the order!</p>
          <div className="flex justify-center gap-3 text-4xl">
            {sequence.map((icon, i) => (
              <span key={i} className={`transition-opacity ${i === showIndex ? "opacity-100" : "opacity-20"}`}>
                {icon}
              </span>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-xs font-bold text-ink/60">Tap them back in the same order!</p>
          <div className="flex justify-center gap-2">
            {options.map((icon, i) => (
              <button
                key={i}
                onClick={() => handlePick(icon)}
                disabled={picked.includes(icon)}
                className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-ink bg-white text-3xl transition-transform active:scale-90 disabled:opacity-30"
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="flex min-h-[2rem] justify-center gap-2 text-2xl">
            {picked.map((icon, i) => (
              <span key={i}>{icon}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}