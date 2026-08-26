import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import type { SyncRun } from "@/lib/sources";
import { Freshness } from "./Freshness";

export function Shell({
  active,
  syncRuns,
  children,
}: {
  active: "feed" | "panels";
  syncRuns: SyncRun[];
  children: React.ReactNode;
}) {
  const tab = (href: string, key: string, label: string) => (
    <Link
      href={href}
      className={
        active === key
          ? "rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-ink-inverse"
          : "rounded-full px-4 py-1.5 text-sm font-medium text-ink-muted hover:text-brand-700 hover:bg-brand-600/8"
      }
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line/10 bg-surface-page/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight text-brand-900">
            The Clearing
          </h1>
          <nav className="flex gap-1">
            {tab("/", "feed", "Feed")}
            {tab("/panels", "panels", "Panels")}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Freshness runs={syncRuns} />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
