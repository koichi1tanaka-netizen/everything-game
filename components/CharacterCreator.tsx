"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";

const SKIN_TONES = ["#FFE0BD", "#F1C27D", "#C68642", "#8D5524", "#5C3A21"];
const HAIR_COLORS = ["#2B2440", "#3B2415", "#B85C38", "#F4D35E", "#E8E8E8", "#7C5CFF"];
const HAIRSTYLES = [
  { id: "short", label: "Short", emoji: "✂️" },
  { id: "curly", label: "Curly", emoji: "🌀" },
  { id: "long", label: "Long", emoji: "💇" },
  { id: "buzz", label: "Buzz", emoji: "🧑‍🦲" },
  { id: "ponytail", label: "Ponytail", emoji: "🎀" },
];
const OUTFITS = [
  { id: "casual", label: "Casual", emoji: "👕" },
  { id: "sporty", label: "Sporty", emoji: "🎽" },
  { id: "fancy", label: "Fancy", emoji: "🥻" },
  { id: "cozy", label: "Cozy", emoji: "🧥" },
];
const ACCESSORIES = [
  { id: "none", label: "None", emoji: "🚫" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "hat", label: "Hat", emoji: "🧢" },
  { id: "bow", label: "Bow", emoji: "🎀" },
];

function PickerRow<T extends { id: string; label: string; emoji: string }>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-xl border-4 px-3 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
            value === opt.id ? "border-ink bg-grape text-white" : "border-ink/30 bg-white text-ink"
          }`}
        >
          <span className="mr-1">{opt.emoji}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorRow({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          onClick={() => onChange(c)}
          className={`h-9 w-9 rounded-full border-4 transition-transform hover:-translate-y-0.5 ${
            value === c ? "border-ink scale-110" : "border-ink/20"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export default function CharacterCreator() {
  const router = useRouter();
  const createCharacter = useGameStore((s) => s.createCharacter);

  const [name, setName] = useState("");
  const [skinTone, setSkinTone] = useState(SKIN_TONES[1]);
  const [hair, setHair] = useState("short");
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [outfit, setOutfit] = useState("casual");
  const [accessories, setAccessories] = useState("none");

  const canSubmit = name.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    createCharacter({ name: name.trim(), skinTone, hair, hairColor, outfit, accessories });
    router.replace("/town");
  }

  return (
    <div className="game-card w-full max-w-md p-6">
      <h1 className="font-display text-3xl font-extrabold text-ink">Create your character</h1>
      <p className="mt-1 text-sm text-ink/70">This is who you'll be exploring the town as.</p>

      <div className="mt-5 flex flex-col items-center gap-2">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-ink text-5xl"
          style={{ backgroundColor: skinTone }}
        >
          🙂
        </div>
        <span className="text-xs font-bold text-ink/50">Preview</span>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-1 block font-display text-sm font-bold">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="What should we call you?"
            className="w-full rounded-xl border-4 border-ink px-3 py-2 font-body outline-none focus:ring-4 focus:ring-grape/30"
          />
        </div>

        <div>
          <label className="mb-1 block font-display text-sm font-bold">Skin tone</label>
          <ColorRow colors={SKIN_TONES} value={skinTone} onChange={setSkinTone} />
        </div>

        <div>
          <label className="mb-1 block font-display text-sm font-bold">Hair style</label>
          <PickerRow options={HAIRSTYLES} value={hair} onChange={setHair} />
        </div>

        <div>
          <label className="mb-1 block font-display text-sm font-bold">Hair color</label>
          <ColorRow colors={HAIR_COLORS} value={hairColor} onChange={setHairColor} />
        </div>

        <div>
          <label className="mb-1 block font-display text-sm font-bold">Outfit</label>
          <PickerRow options={OUTFITS} value={outfit} onChange={setOutfit} />
        </div>

        <div>
          <label className="mb-1 block font-display text-sm font-bold">Accessory</label>
          <PickerRow options={ACCESSORIES} value={accessories} onChange={setAccessories} />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="game-btn mt-6 w-full bg-mint disabled:cursor-not-allowed disabled:opacity-40"
      >
        Enter the town →
      </button>
    </div>
  );
}
