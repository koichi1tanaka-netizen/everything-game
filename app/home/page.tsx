"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { SHOP_ITEMS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

const COLS = 4;
const ROWS = 3;

export default function HomePage() {
  const inventory = useGameStore((s) => s.inventory);
  const furniture = useGameStore((s) => s.furniture);
  const placeFurniture = useGameStore((s) => s.placeFurniture);
  const removeFurniture = useGameStore((s) => s.removeFurniture);
  const [selected, setSelected] = useState<string | null>(null);

  const placeableOwned = inventory
    .map((o) => SHOP_ITEMS.find((i) => i.id === o.itemId))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.placeable);

  const placedIds = new Set(furniture.map((f) => f.itemId));

  function cellContents(x: number, y: number) {
    const placed = furniture.find((f) => f.x === x && f.y === y);
    if (!placed) return null;
    return SHOP_ITEMS.find((i) => i.id === placed.itemId) ?? null;
  }

  function handleCellClick(x: number, y: number) {
    const occupied = furniture.find((f) => f.x === x && f.y === y);
    if (occupied) {
      removeFurniture(occupied.itemId);
      return;
    }
    if (selected) {
      placeFurniture(selected, x, y);
      setSelected(null);
    }
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">🏠 Your Room</h1>
          <p className="text-sm text-ink/70">
            {selected ? "Tap an empty tile to place it." : "Pick furniture below, then tap a tile. Tap a placed item to remove it."}
          </p>
        </div>

        <div
          className="game-card grid gap-2 bg-cream p-3"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
        >
          {Array.from({ length: ROWS }).map((_, y) =>
            Array.from({ length: COLS }).map((__, x) => {
              const item = cellContents(x, y);
              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-ink/30 bg-white text-2xl hover:border-ink"
                >
                  {item ? item.icon : ""}
                </button>
              );
            })
          )}
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold uppercase text-ink/60">Your furniture</h2>
          {placeableOwned.length === 0 ? (
            <div className="game-card p-4 text-center text-sm text-ink/60">
              No furniture yet — buy some from the 🏪 Shop!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {placeableOwned.map((item) => {
                const isPlaced = placedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => !isPlaced && setSelected(item.id)}
                    disabled={isPlaced}
                    className={`flex items-center gap-1.5 rounded-xl border-4 px-3 py-2 text-sm font-bold ${
                      isPlaced
                        ? "border-ink/20 bg-white/50 text-ink/40"
                        : selected === item.id
                        ? "border-ink bg-grape text-white"
                        : "border-ink bg-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                    {isPlaced && <X className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RequireCharacter>
  );
}
