import type { SyncRun } from "@/lib/sources";

// One quiet freshness signal: how long since the most recent successful sync.
export function Freshness({ runs }: { runs: SyncRun[] }) {
  const latest = runs
    .filter((r) => r.status === "ok" && r.finished_at)
    .map((r) => new Date(r.finished_at as string).getTime())
    .sort((a, b) => b - a)[0];

  if (!latest) {
    return (
      <span className="text-xs text-ink-subtle" title="No sync has run yet">
        awaiting first sync
      </span>
    );
  }

  const mins = Math.round((Date.now() - latest) / 60000);
  const label = mins < 1 ? "just now" : mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
  const stale = mins > 45;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${stale ? "text-state-warning" : "text-ink-muted"}`}
      title="Time since the last successful sync"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${stale ? "bg-state-warning" : "bg-state-success-tint"}`}
      />
      synced {label}
    </span>
  );
}
