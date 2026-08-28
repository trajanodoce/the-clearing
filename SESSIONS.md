# The Clearing — Session Log

Every working session on The Clearing gets a named entry here, newest first.
Group the work inside each session under short named headings so any session
can be skimmed in ten seconds. Claude: append to this file at the end of any
session that touches the project.

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
