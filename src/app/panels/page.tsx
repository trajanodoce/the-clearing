import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/Shell";
import { PanelsView } from "@/components/PanelsView";
import { FEED_COLUMNS, type FeedItem, type SyncRun } from "@/lib/sources";

export const dynamic = "force-dynamic";

export default async function PanelsPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: runs }] = await Promise.all([
    supabase
      .from("feed_items")
      .select(FEED_COLUMNS)
      .order("occurred_at", { ascending: false })
      .limit(400),
    supabase
      .from("sync_runs")
      .select("source, finished_at, status")
      .order("started_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <Shell active="panels" syncRuns={(runs ?? []) as SyncRun[]}>
      <PanelsView items={(items ?? []) as unknown as FeedItem[]} />
    </Shell>
  );
}
