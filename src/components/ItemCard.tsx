import { sourceMeta, type FeedItem } from "@/lib/sources";

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const mins = Math.round((now.getTime() - d.getTime()) / 60000);
  if (Math.abs(mins) < 60) return mins >= 0 ? `${mins}m ago` : `in ${-mins}m`;
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return time;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

export function ItemCard({ item }: { item: FeedItem }) {
  const meta = sourceMeta(item.source);
  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-line/8 bg-surface-card px-4 py-3 transition hover:border-brand-600/25 hover:shadow-sm">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={`text-[11px] font-medium uppercase tracking-wide ${meta.text}`}>
            {meta.label}
          </span>
          {item.actor && (
            <span className="truncate text-xs text-ink-muted">{item.actor}</span>
          )}
          <span className="ml-auto shrink-0 text-xs text-ink-subtle">
            {timeLabel(item.occurred_at)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium text-ink">{item.title}</p>
        {item.snippet && (
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{item.snippet}</p>
        )}
      </div>
      {item.needs_attention && !item.resolved_at && (
        <span className="mt-1 shrink-0 rounded-full bg-accent-coral/40 px-2 py-0.5 text-[11px] font-medium text-brand-900">
          needs you
        </span>
      )}
    </div>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
