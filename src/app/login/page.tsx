"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // only the existing account can sign in
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface-card border border-line/10 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-900">The Clearing</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every input, one pane of glass.
        </p>
        {sent ? (
          <p className="mt-6 text-sm text-state-success">
            Check your email for the sign-in link.
          </p>
        ) : (
          <form onSubmit={sendLink} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@stackblitz.com"
              className="w-full rounded-lg border border-line/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-ink-inverse hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send magic link"}
            </button>
            {error && <p className="text-sm text-state-error">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
