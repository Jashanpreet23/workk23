/**
 * Vendor dashboard: PA task (d) plus CR (e.ii, e.iii) — sort applicants by reputation, block venues.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  getVenueById,
  hirerReputationAverage,
  isVenueDateBlocked,
  readApplications,
  readHirerDocuments,
  readHirerHistory,
  seedBookingData,
  updateApplication,
  type VenueApplication,
} from "@/data/bookingData";
import { readSessionUser } from "@/data/seedData";
import ApplicationCard from "@/components/vendor/ApplicationCard";
import VenueBlockingPanel from "@/components/vendor/VenueBlockingPanel";

type SortMode = "default" | "reputation_desc" | "reputation_asc";

export default function VendorDashboard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [applications, setApplications] = useState<VenueApplication[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const refresh = useCallback(() => {
    seedBookingData();
    setApplications(readApplications());
  }, []);

  useEffect(() => {
    const session = readSessionUser();
    if (!session) {
      void router.replace("/signin");
      return;
    }
    if (session.role !== "vendor") {
      void router.replace("/hirer");
      return;
    }
    refresh();
  }, [router, refresh]);

  useEffect(() => {
    if (router.query.welcome === "true") {
      const timer = setTimeout(() => setDismissed(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [router.query.welcome]);

  const showWelcome = router.query.welcome === "true" && !dismissed;

  const withVenues = useMemo(
    () => applications.filter((app) => Boolean(getVenueById(app.venueId))),
    [applications]
  );

  const sortedApps = useMemo(() => {
    const list = [...withVenues];
    if (sortMode === "default") return list;

    const rep = (app: VenueApplication) => hirerReputationAverage(app.hirerEmail);

    list.sort((a, b) => {
      const ra = rep(a);
      const rb = rep(b);
      const unratedBottom = (aNull: boolean, bNull: boolean, cmp: number) => {
        if (aNull && bNull) return 0;
        if (aNull) return 1;
        if (bNull) return -1;
        return cmp;
      };

      let primary = 0;
      if (sortMode === "reputation_desc") {
        primary = unratedBottom(ra === null, rb === null, (rb ?? 0) - (ra ?? 0));
      } else {
        primary = unratedBottom(ra === null, rb === null, (ra ?? 0) - (rb ?? 0));
      }
      if (primary !== 0) return primary;
      return a.eventDate.localeCompare(b.eventDate) || a.id.localeCompare(b.id);
    });
    return list;
  }, [withVenues, sortMode]);

  function handleToggleShortlist(id: string, next: boolean) {
    updateApplication(id, { vendorShortlisted: next });
    refresh();
  }

  function handleSaveNotes(id: string, notes: string) {
    const current = readApplications().find((a) => a.id === id);
    if (!current) return { ok: false as const, message: "Application no longer exists." };
    if (current.status === "approved") {
      return { ok: false as const, message: "This booking is already confirmed." };
    }
    updateApplication(id, { vendorNotes: notes });
    refresh();
    return { ok: true as const };
  }

  function handleApprove(id: string, notes: string) {
    const current = readApplications().find((a) => a.id === id);
    if (!current) return { ok: false as const, message: "Application no longer exists." };
    if (current.status === "approved") {
      return { ok: false as const, message: "This booking is already confirmed." };
    }
    updateApplication(id, { vendorNotes: notes, status: "approved" });
    refresh();
    return { ok: true as const };
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:px-8">
      {showWelcome && (
        <div
          className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
          role="status"
        >
          Signed in successfully. Review applications, use reputation sort if needed, and manage
          venue blocks below.
        </div>
      )}

      <header className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Vendor workspace</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Pass-level: applicant list, hire history, compliant documents, shortlist, validated comments,
          approve booking. Credit-level: sort applicants by average reputation from past hires, and block
          venue date ranges for maintenance.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="vendor-sort" className="text-sm font-medium text-slate-700">
          Sort applicants by reputation
        </label>
        <select
          id="vendor-sort"
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 sm:w-auto"
        >
          <option value="default">Default (submission order)</option>
          <option value="reputation_desc">Reputation: high to low (no rating at bottom)</option>
          <option value="reputation_asc">Reputation: low to high (no rating at bottom)</option>
        </select>
      </div>

      <section className="mt-8 space-y-6" aria-label="Applicant list">
        {sortedApps.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No applications to show yet.
          </p>
        ) : (
          sortedApps.map((app) => {
            const venue = getVenueById(app.venueId)!;
            return (
              <ApplicationCard
                key={app.id}
                application={app}
                venue={venue}
                history={readHirerHistory(app.hirerEmail)}
                documents={readHirerDocuments(app.hirerEmail)}
                reputationAverage={hirerReputationAverage(app.hirerEmail)}
                eventDateBlocked={isVenueDateBlocked(app.venueId, app.eventDate)}
                onToggleShortlist={handleToggleShortlist}
                onSaveNotes={handleSaveNotes}
                onApprove={handleApprove}
              />
            );
          })
        )}
      </section>

      <VenueBlockingPanel />
    </main>
  );
}
