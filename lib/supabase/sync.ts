import { createClient } from "@/lib/supabase/client";
import { GameState } from "@/lib/types";

// Pulls out just the durable game-data fields (no toast/UI state, no actions)
// so we save a clean snapshot regardless of what else is on the store.
export function pickGameState(state: GameState): GameState {
  const {
    hasCharacter,
    character,
    level,
    xp,
    xpToNextLevel,
    coins,
    energy,
    happiness,
    inventory,
    furniture,
    gamesPlayed,
    coinsEarnedTotal,
    coinsSpentTotal,
    bestReactionMs,
    bestMemoryMoves,
    bestMathScore,
    bestTriviaCorrect,
    bestTypingScore,
    missionProgress,
    completedMissions,
    unlockedAchievements,
  } = state;

  return {
    hasCharacter,
    character,
    level,
    xp,
    xpToNextLevel,
    coins,
    energy,
    happiness,
    inventory,
    furniture,
    gamesPlayed,
    coinsEarnedTotal,
    coinsSpentTotal,
    bestReactionMs,
    bestMemoryMoves,
    bestMathScore,
    bestTriviaCorrect,
    bestTypingScore,
    missionProgress,
    completedMissions,
    unlockedAchievements,
  };
}

export async function loadGameState(userId: string): Promise<Partial<GameState> | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("game_saves").select("data").eq("user_id", userId).maybeSingle();

  if (error || !data) return null;
  return data.data as Partial<GameState>;
}

export async function saveGameState(userId: string, state: GameState) {
  const supabase = createClient();
  if (!supabase) return;

  await supabase.from("game_saves").upsert({
    user_id: userId,
    data: pickGameState(state),
    updated_at: new Date().toISOString(),
  });
}