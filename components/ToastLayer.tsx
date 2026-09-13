"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";

export default function ToastLayer() {
  const toast = useGameStore((s) => s.toast);
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="animate-pop game-card border-grape bg-white px-4 py-2 text-center font-display text-sm font-bold text-ink">
        {toast}
      </div>
    </div>
  );
}