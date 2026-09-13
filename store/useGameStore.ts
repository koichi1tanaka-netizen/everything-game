import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS, MISSIONS, SHOP_ITEMS, XP_PER_LEVEL } from "@/lib/gameData";
import { Character, GameState } from "@/lib/types";

interface GameActions {
  createCharacter: (character: Character) => void;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  addHappiness: (amount: number) => void;
  addEnergy: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  buyItem: (itemId: string) => { success: boolean; reason?: string };
  placeFurniture: (itemId: string, x: number, y: number) => void;
  removeFurniture: (itemId: string) => void;
  recordGamePlayed: () => void;
  recordReactionScore: (ms: number) => void;
  recordMemoryScore: (moves: number) => void;
  recordMathScore: (score: number) => void;
  recordTriviaScore: (correct: number) => void;
  toast: string | null;
  pushToast: (message: string) => void;
  clearToast: () => void;
  newlyUnlockedAchievements: string[];
  clearNewAchievements: () => void;
  resetGame: () => void;

  hydrateFromSave: (data: Partial<GameState>) => void;
}

const initialCharacter: Character = {
  name: "",
  skinTone: "#F1C27D",
  hair: "short",
  hairColor: "#3B2415",
  outfit: "casual",
  accessories: "none",
};

const initialState: GameState = {
  hasCharacter: false,
  character: initialCharacter,
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL(1),
  coins: 100,
  energy: 100,
  happiness: 80,
  inventory: [],
  furniture: [],
  gamesPlayed: 0,
  coinsEarnedTotal: 0,
  coinsSpentTotal: 0,
  bestReactionMs: null,
  bestMemoryMoves: null,
  bestMathScore: null,
  bestTriviaCorrect: null,
  missionProgress: {},
  completedMissions: [],
  unlockedAchievements: [],
};

function checkAchievements(state: GameState): { unlocked: string[]; ids: string[] } {
  const itemsOwned = state.inventory.reduce((sum, i) => sum + i.quantity, 0);
  const context = {
    gamesPlayed: state.gamesPlayed,
    coinsSpent: state.coinsSpentTotal,
    level: state.level,
    itemsOwned,
  };
  const newly: string[] = [];
  const allIds = [...state.unlockedAchievements];
  for (const a of ACHIEVEMENTS) {
    if (!allIds.includes(a.id) && a.check(context)) {
      allIds.push(a.id);
      newly.push(a.id);
    }
  }
  return { unlocked: newly, ids: allIds };
}

function applyMissionProgress(
  state: GameState,
  type: "playGames" | "earnCoins" | "buyFurniture",
  incrementBy: number
): Pick<GameState, "missionProgress" | "completedMissions" | "coins" | "xp"> & { newlyCompleted: string[] } {
  const missionProgress = { ...state.missionProgress };
  const completedMissions = [...state.completedMissions];
  let coins = state.coins;
  let xp = state.xp;
  const newlyCompleted: string[] = [];

  for (const mission of MISSIONS.filter((m) => m.type === type)) {
    if (completedMissions.includes(mission.id)) continue;
    const current = missionProgress[mission.id] ?? 0;
    const updated = current + incrementBy;
    missionProgress[mission.id] = updated;
    if (updated >= mission.target) {
      completedMissions.push(mission.id);
      coins += mission.rewardCoins;
      xp += mission.rewardXp;
      newlyCompleted.push(mission.id);
    }
  }
  return { missionProgress, completedMissions, coins, xp, newlyCompleted };
}

function levelUpIfNeeded(coins: number, xp: number, level: number) {
  let newLevel = level;
  let newXp = xp;
  let xpToNext = XP_PER_LEVEL(newLevel);
  while (newXp >= xpToNext) {
    newXp -= xpToNext;
    newLevel += 1;
    xpToNext = XP_PER_LEVEL(newLevel);
  }
  return { level: newLevel, xp: newXp, xpToNextLevel: xpToNext };
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      toast: null,
      newlyUnlockedAchievements: [],

      pushToast: (message) => set({ toast: message }),
      clearToast: () => set({ toast: null }),
      clearNewAchievements: () => set({ newlyUnlockedAchievements: [] }),

      createCharacter: (character) => set({ character, hasCharacter: true }),

      addCoins: (amount) => {
        const state = get();
        const missionResult = applyMissionProgress(state, "earnCoins", amount);
        const newCoins = missionResult.coins + amount;
        const { unlocked, ids } = checkAchievements({
          ...state,
          coins: newCoins,
          coinsEarnedTotal: state.coinsEarnedTotal + amount,
        });
        set({
          coins: newCoins,
          coinsEarnedTotal: state.coinsEarnedTotal + amount,
          missionProgress: missionResult.missionProgress,
          completedMissions: missionResult.completedMissions,
          xp: missionResult.xp,
          unlockedAchievements: ids,
          newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, ...unlocked],
        });
      },

      addXp: (amount) => {
        const state = get();
        const leveled = levelUpIfNeeded(state.coins, state.xp + amount, state.level);
        const { unlocked, ids } = checkAchievements({ ...state, level: leveled.level });
        set({
          xp: leveled.xp,
          level: leveled.level,
          xpToNextLevel: leveled.xpToNextLevel,
          unlockedAchievements: ids,
          newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, ...unlocked],
        });
      },

      addHappiness: (amount) => {
        const state = get();
        set({ happiness: Math.max(0, Math.min(100, state.happiness + amount)) });
      },

      addEnergy: (amount) => {
        const state = get();
        set({ energy: Math.max(0, Math.min(100, state.energy + amount)) });
      },

      spendCoins: (amount) => {
        const state = get();
        if (state.coins < amount) return false;
        set({ coins: state.coins - amount, coinsSpentTotal: state.coinsSpentTotal + amount });
        return true;
      },

      buyItem: (itemId) => {
        const state = get();
        const item = SHOP_ITEMS.find((i) => i.id === itemId);
        if (!item) return { success: false, reason: "Item not found." };
        if (state.coins < item.price) {
          return { success: false, reason: "Not enough coins!" };
        }
        const inventory = [...state.inventory];
        const existing = inventory.find((i) => i.itemId === itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          inventory.push({ itemId, quantity: 1 });
        }
        const newCoins = state.coins - item.price;
        const missionResult =
          item.category === "furniture"
            ? applyMissionProgress({ ...state, coins: newCoins }, "buyFurniture", 1)
            : { missionProgress: state.missionProgress, completedMissions: state.completedMissions, coins: newCoins, xp: state.xp, newlyCompleted: [] };

        const itemsOwned = inventory.reduce((sum, i) => sum + i.quantity, 0);
        const { unlocked, ids } = checkAchievements({
          ...state,
          coinsSpentTotal: state.coinsSpentTotal + item.price,
        });

        set({
          inventory,
          coins: missionResult.coins,
          coinsSpentTotal: state.coinsSpentTotal + item.price,
          missionProgress: missionResult.missionProgress,
          completedMissions: missionResult.completedMissions,
          xp: missionResult.xp,
          unlockedAchievements: ids,
          newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, ...unlocked],
        });
        return { success: true };
      },

      placeFurniture: (itemId, x, y) => {
        const state = get();
        const furniture = state.furniture.filter((f) => f.itemId !== itemId);
        furniture.push({ itemId, x, y });
        set({ furniture });
      },

      removeFurniture: (itemId) => {
        set({ furniture: get().furniture.filter((f) => f.itemId !== itemId) });
      },

      recordGamePlayed: () => {
        const state = get();
        const missionResult = applyMissionProgress(state, "playGames", 1);
        const { unlocked, ids } = checkAchievements({
          ...state,
          gamesPlayed: state.gamesPlayed + 1,
        });
        set({
          gamesPlayed: state.gamesPlayed + 1,
          missionProgress: missionResult.missionProgress,
          completedMissions: missionResult.completedMissions,
          coins: missionResult.coins,
          xp: missionResult.xp,
          unlockedAchievements: ids,
          newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, ...unlocked],
        });
      },

      recordReactionScore: (ms) => {
        const state = get();
        if (state.bestReactionMs === null || ms < state.bestReactionMs) {
          set({ bestReactionMs: ms });
        }
      },

      recordMemoryScore: (moves) => {
        const state = get();
        if (state.bestMemoryMoves === null || moves < state.bestMemoryMoves) {
          set({ bestMemoryMoves: moves });
        }
      },

      recordMathScore: (score) => {
        const state = get();
        if (state.bestMathScore === null || score > state.bestMathScore) {
          set({ bestMathScore: score });
        }
      },

      recordTriviaScore: (correct) => {
        const state = get();
        if (state.bestTriviaCorrect === null || correct > state.bestTriviaCorrect) {
          set({ bestTriviaCorrect: correct });
        }
      },
      recordTypingScore: (score) => {
        const state = get();
        if (state.bestTypingScore === null || score > state.bestTypingScore) {
          set({ bestTypingScore: score });
        }
      },
      resetGame: () => set({ ...initialState, toast: null, newlyUnlockedAchievements: [] }),
    }),
    {
      name: "everything-game-save",
    }
  )
);