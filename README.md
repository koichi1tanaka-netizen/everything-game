# The Everything Game

A small interactive virtual world built with Next.js (App Router), TypeScript, Tailwind, and Zustand. This is **stage 1**: character creation, the town map, stats, coins/XP/leveling, house decorating, the shop, inventory, and the arcade with one fully playable mini-game (Reaction Time).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll land on character creation, then move into the town.

The game saves to your browser's localStorage automatically (via Zustand `persist`), so it works immediately with **no setup required**.

## Connecting Supabase (optional, for cloud saves / accounts)

1. Create a project at https://supabase.com.
2. In the Supabase SQL editor, run `supabase/schema.sql` — it creates the tables (`profiles`, `inventory_items`, `house_furniture`, `missions_progress`, `achievements_unlocked`, `minigame_scores`) with Row Level Security so each player only sees their own data.
3. Copy `.env.local.example` to `.env.local` and fill in your project URL and anon key.
4. The Supabase client is scaffolded at `lib/supabase/client.ts`. Wiring up auth (sign in/up) and syncing the Zustand store to these tables is the natural next step — the schema and RLS policies are ready for it.

## Project structure

```
app/                 routes (one folder per screen)
  town/               the map with clickable buildings
  home/               house/room decorating
  shop/               buy items
  inventory/          owned items
  arcade/             mini-game hub
  arcade/reaction/    the Reaction Time mini-game
  achievements/        missions + achievements
  profile/            stats + reset
components/          shared UI (TopBar, BottomNav, CharacterCreator, ...)
lib/gameData.ts       buildings, shop items, missions, achievements — edit this to add content
lib/types.ts          shared TypeScript types
store/useGameStore.ts the whole game state (Zustand, persisted to localStorage)
supabase/schema.sql   DB schema + RLS policies for when you're ready to add cloud saves
```

## Adding new content

- **New shop item**: add an entry to `SHOP_ITEMS` in `lib/gameData.ts`.
- **New building**: add to `BUILDINGS` in `lib/gameData.ts` and unlock it at a level.
- **New mission/achievement**: add to `MISSIONS` / `ACHIEVEMENTS` in `lib/gameData.ts`.
- **New mini-game**: add a route under `app/arcade/<game>/page.tsx`, then flip `live: true` for it in `app/arcade/page.tsx`. Call `recordGamePlayed()`, `addCoins()`, `addXp()` from the store when the player finishes a round.

## Not built yet (on purpose)

Per the brief, these are intentionally left for later: the Beach/Island/Mountain/Castle/Space Station areas, the full pet system, other mini-games (Memory, Wordle, Sudoku, Snake, Trivia, Aim Trainer), energy/happiness decay mechanics, and multiplayer.
