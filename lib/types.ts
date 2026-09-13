export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type ItemCategory = "clothing" | "furniture" | "pets" | "decorations" | "gaming";

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  rarity: Rarity;
  icon: string; // emoji for now, swap for real art later
  description: string;
  placeable?: boolean; // can be placed in the house
}

export interface OwnedItem {
  itemId: string;
  quantity: number;
  equipped?: boolean;
}

export interface PlacedFurniture {
  itemId: string;
  x: number; // grid column 0-5
  y: number; // grid row 0-3
}

export interface Character {
  name: string;
  skinTone: string;
  hair: string;
  hairColor: string;
  outfit: string;
  accessories: string;
}

export type BuildingId =
  | "home"
  | "arcade"
  | "shop"
  | "school"
  | "stadium"
  | "craftStore"
  | "park"
  | "police"
  | "library"
  | "cafe";

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardCoins: number;
  rewardXp: number;
  type: "playGames" | "earnCoins" | "buyFurniture";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  check: (state: { gamesPlayed: number; coinsSpent: number; level: number; itemsOwned: number }) => boolean;
}

export interface GameState {
  hasCharacter: boolean;
  character: Character;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  energy: number;
  happiness: number;

  inventory: OwnedItem[];
  furniture: PlacedFurniture[];

  gamesPlayed: number;
  coinsEarnedTotal: number;
  coinsSpentTotal: number;
  bestReactionMs: number | null;
  bestMemoryMoves: number | null;
  bestMathScore: number | null;
  bestTriviaCorrect: number | null;
  bestTypingScore: number | null;
  missionProgress: Record<string, number>;
  completedMissions: string[];
  unlockedAchievements: string[];
}