// Registry of every surface The Clearing aggregates. Dot/text/chip classes
// pull from the ContentedCal status spectrum so sources read as one system.
export type SourceKey =
  | "gmail"
  | "gcal"
  | "slack"
  | "linear"
  | "notion"
  | "contentedcal"
  | "front"
  | "system";

export interface SourceMeta {
  key: SourceKey;
  label: string;
  dot: string; // bg-* class for the identity dot
  chip: string; // classes for the filter chip when active
  text: string; // text-* class for accents
  homeUrl: string;
}

export const SOURCES: SourceMeta[] = [
  {
    key: "gmail",
    label: "Gmail",
    dot: "bg-status-blocked",
    chip: "bg-status-blocked/15 text-status-blocked border-status-blocked/30",
    text: "text-status-blocked",
    homeUrl: "https://mail.google.com",
  },
  {
    key: "gcal",
    label: "Calendar",
    dot: "bg-status-done",
    chip: "bg-status-done/15 text-status-done border-status-done/30",
    text: "text-status-done",
    homeUrl: "https://calendar.google.com",
  },
  {
    key: "slack",
    label: "Slack",
    dot: "bg-status-draft",
    chip: "bg-status-draft/15 text-status-draft border-status-draft/30",
    text: "text-status-draft",
    homeUrl: "slack://open",
  },
  {
    key: "linear",
    label: "Linear",
    dot: "bg-status-review",
    chip: "bg-status-review/15 text-status-review border-status-review/30",
    text: "text-status-review",
    homeUrl: "https://linear.app",
  },
  {
    key: "notion",
    label: "Notion",
    dot: "bg-slate-700",
    chip: "bg-slate-700/10 text-slate-700 border-slate-700/30",
    text: "text-slate-700",
    homeUrl: "https://notion.so",
  },
  {
    key: "contentedcal",
    label: "ContentedCal",
    dot: "bg-brand-600",
    chip: "bg-brand-600/12 text-brand-600 border-brand-600/30",
    text: "text-brand-600",
    homeUrl: "https://contentedcal.app",
  },
  {
    key: "front",
    label: "Front",
    dot: "bg-status-research",
    chip: "bg-status-research/20 text-amber-700 border-status-research/40",
    text: "text-status-research",
    homeUrl: "https://app.frontapp.com",
  },
  {
    key: "system",
    label: "Reminders",
    dot: "bg-accent-teal",
    chip: "bg-accent-teal/12 text-accent-teal border-accent-teal/30",
    text: "text-accent-teal",
    homeUrl: "#",
  },
];

export const sourceMeta = (key: string): SourceMeta =>
  SOURCES.find((s) => s.key === key) ?? SOURCES[SOURCES.length - 1];

export interface FeedItem {
  id: string;
  source: SourceKey;
  external_id: string;
  kind: string;
  title: string;
  snippet: string | null;
  url: string | null;
  actor: string | null;
  occurred_at: string;
  needs_attention: boolean;
  pinned: boolean;
  resolved_at: string | null;
  synced_at: string;
  // Triage state — lives only in The Clearing, never written back to a source.
  handled_at: string | null;
  snoozed_until: string | null;
}

// Columns every view selects. Kept in one place so the pages can't drift.
export const FEED_COLUMNS =
  "id, source, external_id, kind, title, snippet, url, actor, occurred_at, needs_attention, pinned, resolved_at, synced_at, handled_at, snoozed_until";

// An item is live if it isn't handled and isn't sleeping.
export function isActive(i: FeedItem, now = Date.now()) {
  if (i.handled_at) return false;
  if (i.snoozed_until && new Date(i.snoozed_until).getTime() > now) return false;
  return true;
}

export interface SyncRun {
  source: string;
  finished_at: string | null;
  status: string;
}
