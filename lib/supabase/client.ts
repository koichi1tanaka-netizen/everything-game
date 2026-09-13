import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("[supabase] client not created — env missing:", {
        hasUrl: Boolean(url),
        hasAnonKey: Boolean(key),
      });
    }
    return null;
  }
  return createBrowserClient(url, key);
}