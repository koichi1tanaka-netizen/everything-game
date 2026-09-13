"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase isn't configured yet — add your project URL and anon key to .env.local.");
      return;
    }

    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.replace("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMessage("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="game-card w-full max-w-sm p-6">
        <h1 className="font-display text-2xl font-extrabold">{mode === "signin" ? "Welcome back!" : "Create an account"}</h1>
        <p className="mt-1 text-sm text-ink/70">
          {mode === "signin" ? "Sign in to load your saved game." : "Sign up to save your progress across devices."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border-4 border-ink px-3 py-2 font-body outline-none focus:ring-4 focus:ring-grape/30"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border-4 border-ink px-3 py-2 font-body outline-none focus:ring-4 focus:ring-grape/30"
          />

          {error && <p className="text-sm font-bold text-bubblegum">{error}</p>}
          {message && <p className="text-sm font-bold text-mint">{message}</p>}

          <button type="submit" disabled={loading} className="game-btn w-full bg-mint disabled:opacity-50">
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm font-bold text-grape underline"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}