"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Backpack, Gamepad2, Globe2, Home, Store, Trophy, User } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

const links = [
  { href: "/town", label: "Town", icon: Globe2, color: "bg-sky" },
  { href: "/home", label: "Home", icon: Home, color: "bg-mango" },
  { href: "/arcade", label: "Arcade", icon: Gamepad2, color: "bg-grape" },
  { href: "/shop", label: "Shop", icon: Store, color: "bg-bubblegum" },
  { href: "/inventory", label: "Bag", icon: Backpack, color: "bg-mint" },
  { href: "/achievements", label: "Trophies", icon: Trophy, color: "bg-mango" },
  { href: "/profile", label: "You", icon: User, color: "bg-sky" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const hasCharacter = useGameStore((s) => s.hasCharacter);

  if (!hasCharacter) return null;

  const activeIndex = Math.max(0, links.findIndex((l) => l.href === pathname));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-2xl">
      <div className="relative border-t-4 border-ink bg-cream px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-5">
        {/* dashed trail connecting every stop, like a board-game path */}
        <svg
          className="pointer-events-none absolute left-0 top-0 h-5 w-full"
          viewBox="0 0 700 20"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="50" y1="10" x2="650" y2="10" stroke="#2B2440" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        </svg>

        <ul className="relative flex justify-between">
          {links.map(({ href, label, icon: Icon, color }, i) => {
            const active = i === activeIndex;
            return (
              <li key={href} className="flex flex-1 justify-center">
                <Link href={href} className="group flex flex-col items-center gap-1">
                  {/* bouncing pin over the current stop */}
                  <span className={`mb-0.5 text-sm leading-none transition-opacity ${active ? "animate-float opacity-100" : "opacity-0"}`} aria-hidden="true">
                    📍
                  </span>

                  {/* the "stop" on the trail */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-ink text-white transition-transform ${
                      active ? `${color} -translate-y-1 shadow-chunky-sm` : "bg-white text-ink group-hover:-translate-y-0.5"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-white" : "text-ink/70"}`} />
                  </span>

                  <span className={`font-display text-[10px] font-bold leading-none ${active ? "text-ink" : "text-ink/40"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}