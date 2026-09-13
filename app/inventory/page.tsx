"use client";

import { useGameStore } from "@/store/useGameStore";
import { SHOP_ITEMS } from "@/lib/gameData";
import RequireCharacter from "@/components/RequireCharacter";

const RARITY_STYLES: Record<string, string> = {
  common: "bg-white text-ink border-ink/30",
  uncommon: "bg-mint/30 text-ink border-mint",
  rare: "bg-sky/30 text-ink border-sky",
  epic: "bg-grape/20 text-grape border-grape",
};

export default function InventoryPage() {
  const inventory = useGameStore((s) => s.inventory);

  const grouped = inventory.reduce<Record<string, typeof inventory>>((acc, owned) => {
    const item = SHOP_ITEMS.find((i) => i.id === owned.itemId);
    if (!item) return acc;
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(owned);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold">🎒 Inventory</h1>

        {categories.length === 0 && (
          <div className="game-card p-6 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-2 font-bold">Nothing here yet!</p>
            <p className="text-sm text-ink/60">Visit the Shop to buy your first item.</p>
          </div>
        )}

        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="mb-2 font-display text-sm font-bold uppercase text-ink/60">{cat}</h2>
            <div className="grid grid-cols-2 gap-3">
              {grouped[cat].map((owned) => {
                const item = SHOP_ITEMS.find((i) => i.id === owned.itemId)!;
                return (
                  <div key={owned.itemId} className="game-card flex items-center gap-3 p-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold">{item.name}</p>
                      <span className={`mt-0.5 inline-block rounded-full border-2 px-1.5 py-0.5 text-[10px] font-bold uppercase ${RARITY_STYLES[item.rarity]}`}>
                        {item.rarity}
                      </span>
                    </div>
                    {owned.quantity > 1 && (
                      <span className="rounded-full border-2 border-ink bg-cream px-2 py-0.5 text-xs font-bold">x{owned.quantity}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </RequireCharacter>
  );
}
