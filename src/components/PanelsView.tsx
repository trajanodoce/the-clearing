"use client";

import { SOURCES, isActive, type FeedItem } from "@/lib/sources";
import { ItemCard } from "./ItemCard";
import { useTriage } from "@/lib/useTriage";

export function PanelsView({ items: initial }: { items: FeedItem[] }) {
  const { items, setHandled, snooze, error } = useTriage(initial);
  const now = Date.now();

  const groups = SOURCES.map((meta) => ({
    meta,
    items: items.filter((i) => i.source === meta.key && isActive(i, now)).slice(0, 6),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-ink-subtle">
        Nothing active right now.
      </p>
    );
  }

  return (
    <>
      {error && (
        <p className="mb-3 rounded-lg bg-state-error/10 px-3 py-2 text-sm text-state-error">
          Couldn&apos;t save that change: {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map(({ meta, items }) => (
          <section
            key={meta.key}
            className="rounded-2xl border border-line/8 bg-surface-nested p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
              <h2 className="text-sm font-semibold text-ink">{meta.label}</h2>
              <span className="text-xs text-ink-subtle">{items.length}</span>
              <a
                href={meta.homeUrl}
                target="_blank"
                rel="noreferrer"
                className={`ml-auto text-xs ${meta.text} hover:underline`}
              >
                open →
              </a>
            </div>
            <div className="space-y-2">
              {items.map((i) => (
                <ItemCard key={i.id} item={i} onHandled={setHandled} onSnooze={snooze} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
