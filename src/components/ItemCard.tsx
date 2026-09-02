"use client";

import { useState } from "react";
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

// Snooze presets, resolved at click time against the local clock.
function snoozeTargets() {
  const now = new Date();
  const laterToday = new Date(now.getTime() + 4 * 3600 * 1000);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + ((8 - nextWeek.getDay()) % 7 || 7));
  nextWeek.setHours(8, 0, 0, 0);
  return [
    { label: "Later today", at: laterToday },
    { label: "Tomorrow 8am", at: tomorrow },
    { label: "Monday 8am", at: nextWeek },
  ];
}

export function ItemCard({
  item,
  onHandled,
  onSnooze,
  handledView = false,
}: {
  item: FeedItem;
  onHandled: (id: string, handled: boolean) => void;
  onSnooze: (id: string, until: Date) => void;
  handledView?: boolean;
}) {
  const meta = sourceMeta(item.source);
  const [menu, setMenu] = useState(false);

  return (
    <div className="group relative flex items-start gap-3 rounded-xl border border-line/8 bg-surface-card px-4 py-3 transition hover:border-brand-600/25 hover:shadow-sm">
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

        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 block truncate text-sm font-medium text-ink hover:text-brand-700 hover:underline"
          >
            {item.title}
          </a>
        ) : (
          <p className="mt-0.5 truncate text-sm font-medium text-ink">{item.title}</p>
        )}

        {item.snippet && (
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{item.snippet}</p>
        )}

        {item.snoozed_until && !handledView && (
          <p className="mt-1 text-xs text-accent-teal">
            snoozed until{" "}
            {new Date(item.snoozed_until).toLocaleString("en-US", {
              weekday: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
        {item.needs_attention && !item.resolved_at && !handledView && (
          <span className="rounded-full bg-accent-coral/40 px-2 py-0.5 text-[11px] font-medium text-brand-900">
            needs you
          </span>
        )}

        {handledView ? (
          <button
            onClick={() => onHandled(item.id, false)}
            className="rounded-md border border-line/15 px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-brand-600/40 hover:text-brand-700"
            title="Put this back in the feed"
          >
            Undo
          </button>
        ) : (
          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={() => setMenu((v) => !v)}
              className="rounded-md border border-line/15 px-2 py-1 text-[11px] font-medium text-ink-muted hover:border-accent-teal/50 hover:text-accent-teal"
              title="Snooze — hides it here until later"
            >
              Snooze
            </button>
            <button
              onClick={() => onHandled(item.id, true)}
              className="rounded-md bg-brand-600 px-2.5 py-1 text-[11px] font-medium text-ink-inverse hover:bg-brand-700"
              title="Clear from the feed — your email and Slack are untouched"
            >
              Done
            </button>
          </div>
        )}

        {menu && (
          <div className="absolute right-3 top-11 z-20 w-40 overflow-hidden rounded-lg border border-line/15 bg-white shadow-lg">
            {snoozeTargets().map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  setMenu(false);
                  onSnooze(item.id, t.at);
                }}
                className="block w-full px-3 py-2 text-left text-xs text-ink-secondary hover:bg-brand-600/8 hover:text-brand-700"
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
