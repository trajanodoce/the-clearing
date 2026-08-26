"use client";

import { useState } from "react";
import { SOURCES, type FeedItem, type SourceKey } from "@/lib/sources";
import { ItemCard } from "./ItemCard";

export function FeedView({ items }: { items: FeedItem[] }) {
  const [active, setActive] = useState<SourceKey | "all">("all");

  const visible = items.filter((i) => active === "all" || i.source === active);
  const attention = visible.filter(
    (i) => (i.needs_attention && !i.resolved_at) || i.pinned
  );
  const rest = visible.filter((i) => !attention.includes(i));
  const present = new Set(items.map((i) => i.source));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <Chip
          label="All"
          active={active === "all"}
          onClick={() => setActive("all")}
          activeClass="bg-brand-600 text-ink-inverse border-brand-600"
        />
        {SOURCES.filter((s) => present.has(s.key)).map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            active={active === s.key}
            onClick={() => setActive(active === s.key ? "all" : s.key)}
            activeClass={s.chip}
          />
        ))}
      </div>

      {attention.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Needs attention
          </h2>
          <div className="space-y-2">
            {attention.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        {attention.length > 0 && (
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Everything else
          </h2>
        )}
        {rest.length === 0 && attention.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-subtle">
            Nothing here yet — the first sync will fill this in.
          </p>
        ) : (
          <div className="space-y-2">
            {rest.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  activeClass,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? activeClass
          : "border-line/15 bg-surface-card text-ink-muted hover:border-line/30"
      }`}
    >
      {label}
    </button>
  );
}
