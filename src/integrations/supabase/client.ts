import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let supabase: SupabaseClient<Database> | undefined;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const url = import.meta.env["VITE_SUPABASE_URL"]?.trim();
  const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]?.trim();

  if (!url || !publishableKey) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di file .env.",
    );
  }

  try {
    const parsedUrl = new URL(url);
    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.hostname !== "localhost" &&
      parsedUrl.hostname !== "127.0.0.1"
    ) {
      throw new Error();
    }
  } catch {
    throw new Error("VITE_SUPABASE_URL harus berupa URL Supabase HTTPS atau URL localhost.");
  }

  if (publishableKey.startsWith("sb_secret_")) {
    throw new Error("Jangan gunakan secret/service_role key pada aplikasi frontend.");
  }

  supabase = createClient<Database>(url, publishableKey);
  return supabase;
}
