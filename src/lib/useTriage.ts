"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FeedItem } from "@/lib/sources";

/**
 * Triage state for the feed. Every action writes ONLY to The Clearing's own
 * database via a locked-down RPC — nothing is ever sent to Gmail, Slack, or
 * any other source. Updates apply optimistically and roll back if the write
 * fails, so the UI can never quietly disagree with the database.
 */
export function useTriage(initial: FeedItem[]) {
  const [items, setItems] = useState<FeedItem[]>(initial);
  const [error, setError] = useState<string | null>(null);

  async function run(
    optimistic: (prev: FeedItem[]) => FeedItem[],
    call: () => PromiseLike<{ error: { message: string } | null }>
  ) {
    const snapshot = items;
    setItems(optimistic);
    setError(null);
    const { error } = await call();
    if (error) {
      setItems(snapshot);
      setError(error.message);
    }
  }

  const setHandled = (id: string, handled: boolean) =>
    run(
      (prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                handled_at: handled ? new Date().toISOString() : null,
                snoozed_until: handled ? null : i.snoozed_until,
              }
            : i
        ),
      () => createClient().rpc("set_handled", { p_id: id, p_handled: handled })
    );

  const snooze = (id: string, until: Date) =>
    run(
      (prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, snoozed_until: until.toISOString(), handled_at: null }
            : i
        ),
      () =>
        createClient().rpc("set_snooze", {
          p_id: id,
          p_until: until.toISOString(),
        })
    );

  return { items, setHandled, snooze, error };
}
