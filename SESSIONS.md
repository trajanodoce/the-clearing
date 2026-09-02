# The Clearing — Session Log

Every working session on The Clearing gets a named entry here, newest first.
Group the work inside each session under short named headings so any session
can be skimmed in ten seconds. Claude: append to this file at the end of any
session that touches the project.

---

## 2026-09-02 — The Triage Turn (feed becomes the to-do list)

### Why it changed
Taylor's email routine was burying her action items: `email-afternoon-wrap`
Step 3.5 archived everything it categorized, **including 🔴 Respond Today**,
rationalized as "Gmail brings threads back when someone replies" — true only
when the OTHER party acts. When the ball was in her court, nothing came back.
Her inbox had been reduced to 8 messages, 7 of them protected PR domains.

The root cause wasn't the rule, it was the premise: her inbox was being used
as both an archive and a to-do list, so it had to be emptied to stay usable.

### The fix — The Clearing becomes the triage surface
- If The Clearing is the to-do list, Gmail never needs emptying. The whole
  archiving apparatus loses its reason to exist.
- `feed_items` gains `handled_at` + `snoozed_until`; `set_handled` /
  `set_snooze` RPCs gated to Taylor's JWT. **Triage state lives only here and
  is never written back to any source** — mistakes are cosmetic, not
  permanent. `sync_upsert_items` preserves triage state across re-syncs.
- Feed gains Active / Snoozed / Handled views; cards get Done + Snooze
  (Later today / Tomorrow 8am / Monday 8am) with optimistic updates that roll
  back on failure. Panels show active items only. Verified end-to-end on prod:
  Done → persisted → Undo → cleared.

### Routine consequences
- **Retired:** `email-afternoon-wrap`, `email-morning-briefing` (banners added
  to their SKILL.md so nobody re-enables them blindly).
- **Defanged:** `daily-creator-sweep` labels + marks read but no longer
  archives — keeps mail in the inbox, out of The Clearing's unread pull.
- **Widened:** Gmail pull now 4d/50 (nothing auto-archives any more);
  Slack now pulls DMs as well as mentions.
- Earlier same-day fixes: ad/billboard/media/event vendors route to
  Taylor-Inbound not Promo (Promo is what the monthly digest proposes
  deleting); 6 wrongly-archived emails restored to the inbox.

### Date error worth remembering
Claude anchored "today" on the newest email in the inbox (Aug 28) instead of
the actual date, so a pause meant to lift Mon Aug 31 ran until Wed Sep 2.
**Missed as a result:** `contentedcal-maintenance` (Aug 31),
`monthly-receipts-compile` and `monthly-email-cleanup-digest` (both Sep 1).
Cron does not backfill. Always take the date from `date`, never from content.

### Open
- `inbox-invite-auto-accept` left OFF pending Taylor's call — it both
  auto-accepts invites and archives mail, the same class of behavior this
  session pulled back everywhere else.
- `monthly-receipts-compile` missed Sep 1 and needs a manual run if the
  Everything Marketing draft is wanted this month.
- 25 archived threads still carry Needs Response / Follow-Up labels back to
  May (incl. Sam Sabin at Axios, two customer-story replies). Step 2 of the
  retired wrap was supposed to clear those labels and never did.
- Repo still has no GitHub remote. Setup PAT still live.

---

## 2026-08-26 — Genesis Day (idea → live app in one session)

### Scoping & architecture
- Taylor pitched a single-pane-of-glass web app over Notion, Gmail, GCal,
  ContentedCal, Slack, Linear, and Front. Decisions: Claude-fed sync (no
  per-service OAuth), unified feed + panels, view-only v1.
- Front dropped (needs company-admin API token) → replaced by a daily
  flagged "Check Front" reminder item in the feed.
- Named **The Clearing** by Taylor. Design system lifted wholesale from
  ContentedCal's portable token kit (`src/design-system/`).

### boltdash teardown
- On Taylor's call, the dormant PR Dashboard (boltdash.app) was retired:
  data double-backed-up (local `~/Documents/Backups/boltdash-final-2026-08-26/`
  + in-DB `boltdash_archive` schema), 4 non-Taylor logins deleted, tables
  dropped, Vercel project paused (boltdash.app → 503). Last human login had
  been Jul 6; its Profound feed dead since ~Aug 17.

### Build & first deploy
- Next.js 15 + Tailwind + ContentedCal tokens; magic-link auth locked to
  taylor@stackblitz.com (no signups possible); RLS on every table.
- Feed view (needs-attention group + source filter chips) and Panels view.
- Deployed to **the-clearing-two.vercel.app** via the Vercel MCP (the local
  vercel CLI is logged into the wrong account — gotcha recorded).
- First real sync: 73 items, all 7 sources clean.

### Move to personal Supabase
- Taylor chose full separation from the work org: new home = project
  `zudwneeqijvqnsqbuwgn` in her personal Supabase account (free tier).
- Everything done via Management API with a one-day access token: schema,
  RLS, three sync RPCs, her auth user, site URL + redirect allowlist.
  Login verified end-to-end on production.
- Sync writes now go through the RPCs with a project-scoped service key
  (`~/.config/the-clearing/service-role-key`); the setup token is
  disposable (Taylor deletes it after each use).

### Sync routine saga
- Local scheduled task `the-clearing-sync` (every 15 min, 8–7 weekdays,
  contract in SYNC.md) built and verified.
- Cloud-routine attempt abandoned: creation blocked by StackBlitz org admin
  policy on write-capable connectors — prompt wording can't fix that.
  Local task re-enabled as canonical.
- Feed rules tuned per Taylor: ContentedCal = next-7-days + blocked only;
  Notion = @-mentions and replies to her only (her "inbox as alerts" call).
- Personal-Claude expansion designed and documented
  (`docs/personal-claude-bootstrap.md`): same DB, `p-` id namespace,
  cleanup RPC namespaced so the two routines can't touch each other's rows.

### Open at session end
- Taylor: delete the `the-clearing-setup` Supabase token; one "Run now" on
  the task to pre-approve its tools.
- Later calls: delete the old work project (archive is backed up locally),
  boltdash.app domain fate, dark mode (waiting on ContentedCal's dark pass),
  push repo to GitHub, personal-Claude routine setup.
