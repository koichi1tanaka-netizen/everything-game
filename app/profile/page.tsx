"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { XP_PER_LEVEL } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, supabaseConfigured, signOut } = useAuth();
  const {
    character,
    level,
    xp,
    coins,
    energy,
    happiness,
    gamesPlayed,
    coinsEarnedTotal,
    coinsSpentTotal,
    bestReactionMs,
    bestMemoryMoves,
    bestMathScore,
    bestTriviaCorrect,
    bestTypingWpm,
    resetGame,
  } = useGameStore();

  const xpTarget = XP_PER_LEVEL(level);

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold">👤 Profile</h1>

        <div className="game-card flex flex-col items-center gap-2 p-6">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink text-5xl"
            style={{ backgroundColor: character.skinTone }}
          >
            🙂
          </div>
          <p className="font-display text-xl font-bold">{character.name}</p>
          <p className="text-xs text-ink/60">
            {character.hair} hair · {character.outfit} outfit · {character.accessories} accessory
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Level" value={level} />
          <Stat label="XP" value={`${xp}/${xpTarget}`} />
          <Stat label="Coins" value={coins} />
          <Stat label="Energy" value={energy} />
          <Stat label="Happiness" value={happiness} />
          <Stat label="Games played" value={gamesPlayed} />
          <Stat label="Coins earned" value={coinsEarnedTotal} />
          <Stat label="Coins spent" value={coinsSpentTotal} />
          {bestReactionMs !== null && <Stat label="Best reaction" value={`${bestReactionMs}ms`} />}
          {bestMemoryMoves !== null && <Stat label="Best memory" value={`${bestMemoryMoves} moves`} />}
          {bestMathScore !== null && <Stat label="Best math" value={bestMathScore} />}
          {bestTriviaCorrect !== null && <Stat label="Best trivia" value={`${bestTriviaCorrect}/10`} />}
          {bestTypingWpm !== null && <Stat label="Best typing" value={`${bestTypingWpm} words`} />}
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all progress? This can't be undone.")) resetGame();
          }}
          className="game-btn w-full bg-bubblegum text-white"
        >
          Reset game
        </button>

        {supabaseConfigured && user && (
          <div className="game-card p-3 text-center text-sm">
            <p className="text-ink/60">Signed in as {user.email}</p>
            <button
              onClick={async () => {
                await signOut();
                router.replace("/login");
              }}
              className="mt-2 font-bold text-grape underline"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </RequireCharacter>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="game-card p-3 text-center">
      <p className="font-display text-lg font-extrabold">{value}</p>
      <p className="text-[11px] font-bold uppercase text-ink/50">{label}</p>
    </div>
  );
}