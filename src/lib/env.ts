// Supabase client config. Both values are public by design (they ship in the
// browser bundle); access control lives in RLS + shouldCreateUser:false.
// Env vars win when present so local overrides still work.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://zudwneeqijvqnsqbuwgn.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable__r990E0bfyIfX5OoXx4CHQ_zYq-WiCj";
