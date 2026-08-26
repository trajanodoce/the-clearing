import { createClient } from "@/lib/supabase/server";
import { Shell } from "@/components/Shell";
import { ItemCard } from "@/components/ItemCard";
import { SOURCES, sourceMeta, type FeedItem, type SyncRun } from "@/lib/sources";

export const dynamic = "force-dynamic";

export default async function PanelsPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: runs }] = await Promise.all([
    supabase
      .from("feed_items")
      .select(
        "id, source, external_id, kind, title, snippet, url, actor, occurred_at, needs_attention, pinned, resolved_at, synced_at"
      )
      .order("occurred_at", { ascending: false })
      .limit(400),
    supabase
      .from("sync_runs")
      .select("source, finished_at, status")
      .order("started_at", { ascending: false })
      .limit(20),
  ]);

  const all = (items ?? []) as FeedItem[];
  const bySource = SOURCES.map((s) => ({
    meta: s,
    items: all.filter((i) => i.source === s.key).slice(0, 6),
  })).filter((g) => g.items.length > 0);

  return (
    <Shell active="panels" syncRuns={(runs ?? []) as SyncRun[]}>
      {bySource.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-subtle">
          Nothing here yet — the first sync will fill this in.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bySource.map(({ meta, items }) => (
            <section
              key={meta.key}
              className="rounded-2xl border border-line/8 bg-surface-nested p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <h2 className="text-sm font-semibold text-ink">{meta.label}</h2>
                <a
                  href={meta.homeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`ml-auto text-xs ${sourceMeta(meta.key).text} hover:underline`}
                >
                  open →
                </a>
              </div>
              <div className="space-y-2">
                {items.map((i) => (
                  <ItemCard key={i.id} item={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}
