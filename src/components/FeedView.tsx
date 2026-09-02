"use client";

import { useState } from "react";
import { SOURCES, isActive, type FeedItem, type SourceKey } from "@/lib/sources";
import { ItemCard } from "./ItemCard";
import { useTriage } from "@/lib/useTriage";

type View = "active" | "snoozed" | "handled";

export function FeedView({ items: initial }: { items: FeedItem[] }) {
  const { items, setHandled, snooze, error } = useTriage(initial);
  const [source, setSource] = useState<SourceKey | "all">("all");
  const [view, setView] = useState<View>("active");

  const now = Date.now();
  const bySource = items.filter((i) => source === "all" || i.source === source);

  const active = bySource.filter((i) => isActive(i, now));
  const snoozed = bySource.filter(
    (i) => !i.handled_at && i.snoozed_until && new Date(i.snoozed_until).getTime() > now
  );
  const handled = bySource.filter((i) => i.handled_at);

  const shown = view === "active" ? active : view === "snoozed" ? snoozed : handled;
  const attention = view === "active" ? shown.filter((i) => (i.needs_attention && !i.resolved_at) || i.pinned) : [];
  const rest = shown.filter((i) => !attention.includes(i));
  const present = new Set(items.map((i) => i.source));

  const card = (i: FeedItem) => (
    <ItemCard
      key={i.id}
      item={i}
      onHandled={setHandled}
      onSnooze={snooze}
      handledView={view === "handled"}
    />
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {(["active", "snoozed", "handled"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              view === v
                ? "bg-brand-900 text-ink-inverse"
                : "text-ink-muted hover:bg-brand-600/8 hover:text-brand-700"
            }`}
          >
            {v}
            {v === "active" && active.length > 0 && ` (${active.length})`}
            {v === "snoozed" && snoozed.length > 0 && ` (${snoozed.length})`}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-line-subtle" />
        <Chip
          label="All"
          active={source === "all"}
          onClick={() => setSource("all")}
          activeClass="bg-brand-600 text-ink-inverse border-brand-600"
        />
        {SOURCES.filter((s) => present.has(s.key)).map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            active={source === s.key}
            onClick={() => setSource(source === s.key ? "all" : s.key)}
            activeClass={s.chip}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-state-error/10 px-3 py-2 text-sm text-state-error">
          Couldn&apos;t save that change: {error}
        </p>
      )}

      {attention.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Needs attention
          </h2>
          <div className="space-y-2">{attention.map(card)}</div>
        </section>
      )}

      <section className="mt-6">
        {attention.length > 0 && rest.length > 0 && (
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Everything else
          </h2>
        )}
        {shown.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-subtle">
            {view === "active"
              ? "Nothing needs you right now."
              : view === "snoozed"
              ? "Nothing snoozed."
              : "Nothing marked done yet."}
          </p>
        ) : (
          <div className="space-y-2">{rest.map(card)}</div>
        )}
      </section>

      {view === "handled" && handled.length > 0 && (
        <p className="mt-6 text-center text-xs text-ink-subtle">
          Marking things done here never changes your email or Slack — those stay exactly as they are.
        </p>
      )}
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
