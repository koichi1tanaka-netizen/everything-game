"use client";

import { useState } from "react";
import { Check, Coins } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { SHOP_ITEMS } from "@/lib/gameData";
import { ItemCategory } from "@/lib/types";
import RequireCharacter from "@/components/RequireCharacter";

const CATEGORIES: { id: ItemCategory | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "🛍️" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "furniture", label: "Furniture", icon: "🏠" },
  { id: "decorations", label: "Decor", icon: "🎨" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "pets", label: "Pets", icon: "🐾" },
];

const RARITY_STYLES: Record<string, string> = {
  common: "bg-white text-ink border-ink/30",
  uncommon: "bg-mint/30 text-ink border-mint",
  rare: "bg-sky/30 text-ink border-sky",
  epic: "bg-grape/20 text-grape border-grape",
};

export default function ShopPage() {
  const [category, setCategory] = useState<ItemCategory | "all">("all");
  const coins = useGameStore((s) => s.coins);
  const inventory = useGameStore((s) => s.inventory);
  const buyItem = useGameStore((s) => s.buyItem);
  const pushToast = useGameStore((s) => s.pushToast);

  const items = SHOP_ITEMS.filter((i) => category === "all" || i.category === category);

  function handleBuy(itemId: string, name: string) {
    const result = buyItem(itemId);
    if (result.success) {
      pushToast(`✓ Bought ${name}!`);
    } else {
      pushToast(result.reason ?? "Couldn't buy that.");
    }
  }

  return (
    <RequireCharacter>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold">🏪 Shop</h1>
          <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-mango px-3 py-1 text-sm font-bold">
            <Coins className="h-4 w-4" /> {coins}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold ${
                category === c.id ? "bg-grape text-white" : "bg-white text-ink"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const owned = inventory.find((i) => i.itemId === item.id);
            const canAfford = coins >= item.price;
            return (
              <div key={item.id} className="game-card flex flex-col p-3">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`rounded-full border-2 px-1.5 py-0.5 text-[10px] font-bold uppercase ${RARITY_STYLES[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-bold leading-tight">{item.name}</h3>
                <p className="mt-0.5 flex-1 text-xs text-ink/60">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <Coins className="h-3.5 w-3.5" /> {item.price}
                  </span>
                  {owned ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-mint-foreground text-green-700">
                      <Check className="h-3.5 w-3.5" /> Owned{owned.quantity > 1 ? ` x${owned.quantity}` : ""}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.id, item.name)}
                      disabled={!canAfford}
                      className="rounded-lg border-2 border-ink bg-mint px-2 py-1 text-xs font-bold disabled:opacity-40"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RequireCharacter>
  );
}
