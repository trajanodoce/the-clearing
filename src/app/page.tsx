import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/Shell";
import { FeedView } from "@/components/FeedView";
import type { FeedItem, SyncRun } from "@/lib/sources";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: runs }] = await Promise.all([
    supabase
      .from("feed_items")
      .select(
        "id, source, external_id, kind, title, snippet, url, actor, occurred_at, needs_attention, pinned, resolved_at, synced_at"
      )
      .order("occurred_at", { ascending: false })
      .limit(200),
    supabase
      .from("sync_runs")
      .select("source, finished_at, status")
      .order("started_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <Shell active="feed" syncRuns={(runs ?? []) as SyncRun[]}>
      <FeedView items={(items ?? []) as FeedItem[]} />
    </Shell>
  );
}
