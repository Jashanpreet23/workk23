/**
 * PA task (d) only (COSC2758/2938 A1): vendors review applications, reputation, documents,
 * shortlist, comment, approve. Not CR/DI/HD (no search/sort, reject, blocks, charts, uploads).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  BOOKING_DATA_CHANGED_EVENT,
  getVenueById,
  readApplications,
  readHirerDocuments,
  readHirerHistory,
  seedBookingData,
  updateApplication,
  type VenueApplication,
} from "@/data/bookingData";
import { readSessionUser } from "@/data/seedData";
import ApplicationCard from "@/components/vendor/ApplicationCard";

export default function VendorDashboard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [applications, setApplications] = useState<VenueApplication[]>([]);

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
    const onData = () => refresh();
    window.addEventListener(BOOKING_DATA_CHANGED_EVENT, onData);
    return () => window.removeEventListener(BOOKING_DATA_CHANGED_EVENT, onData);
  }, [refresh]);

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
          Signed in successfully. Review each application below, add comments, then confirm a booking
          when ready.
        </div>
      )}

      <header className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Vendor workspace</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
        List applicants with event and venue context; 
          View hiring reputation and compliant-document summaries; 
          Shortlist; 
          Validated vendor comments; 
          Approve to confirm the booking. 
        </p>
      </header>

      <section className="mt-8 space-y-6" aria-label="Applicant list">
        {withVenues.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No applications to show yet.
          </p>
        ) : (
          withVenues.map((app) => {
            const venue = getVenueById(app.venueId)!;
            return (
              <ApplicationCard
                key={app.id}
                application={app}
                venue={venue}
                history={readHirerHistory(app.hirerEmail)}
                documents={readHirerDocuments(app.hirerEmail)}
                onToggleShortlist={handleToggleShortlist}
                onSaveNotes={handleSaveNotes}
                onApprove={handleApprove}
              />
            );
          })
        )}
      </section>
    </main>
  );
}
