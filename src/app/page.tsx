import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/Shell";
import { FeedView } from "@/components/FeedView";
import { FEED_COLUMNS, type FeedItem, type SyncRun } from "@/lib/sources";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: runs }] = await Promise.all([
    supabase
      .from("feed_items")
      .select(FEED_COLUMNS)
      .order("occurred_at", { ascending: false })
      .limit(300),
    supabase
      .from("sync_runs")
      .select("source, finished_at, status")
      .order("started_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <Shell active="feed" syncRuns={(runs ?? []) as SyncRun[]}>
      <FeedView items={(items ?? []) as unknown as FeedItem[]} />
    </Shell>
  );
}
