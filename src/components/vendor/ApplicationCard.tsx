import { useEffect, useState } from "react";
import type { CompliantDocument, PastHire, Venue, VenueApplication } from "@/data/bookingData";

const NOTE_MIN = 4;
const NOTE_MAX = 800;

function Stars({ value }: { value: number }) {
  const full = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <span className="text-amber-500" aria-label={`${full} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="text-slate-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function docStatusLabel(status: CompliantDocument["status"]): string {
  switch (status) {
    case "on_file":
      return "On file";
    default:
      return "Not provided";
  }
}

type Props = {
  application: VenueApplication;
  venue: Venue;
  history: PastHire[];
  documents: CompliantDocument[];
  /** Average 0–5 from past hires; null = no rating (CR e.ii). */
  reputationAverage: number | null;
  /** Event date falls in a vendor-configured blackout (CR e.iii). */
  eventDateBlocked: boolean;
  onToggleShortlist: (id: string, next: boolean) => void;
  onSaveNotes: (id: string, notes: string) => { ok: true } | { ok: false; message: string };
  onApprove: (id: string, notes: string) => { ok: true } | { ok: false; message: string };
};

export default function ApplicationCard({
  application: app,
  venue,
  history,
  documents,
  reputationAverage,
  eventDateBlocked,
  onToggleShortlist,
  onSaveNotes,
  onApprove,
}: Props) {
  const [draftNotes, setDraftNotes] = useState(app.vendorNotes);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setDraftNotes(app.vendorNotes);
  }, [app.vendorNotes]);

  const hirerName = `${app.hirerFirstName} ${app.hirerLastName}`.trim();
  const dateLabel = new Date(`${app.eventDate}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const isApproved = app.status === "approved";

  function validateNotes(text: string): string | null {
    const t = text.trim();
    if (t.length < NOTE_MIN) {
      return `Comments must be at least ${NOTE_MIN} characters (after trimming spaces).`;
    }
    if (t.length > NOTE_MAX) {
      return `Comments must be at most ${NOTE_MAX} characters.`;
    }
    return null;
  }

  function handleSaveNotes() {
    setLocalError("");
    const err = validateNotes(draftNotes);
    if (err) {
      setLocalError(err);
      return;
    }
    const result = onSaveNotes(app.id, draftNotes.trim());
    if (!result.ok) setLocalError(result.message);
  }

  function handleApprove() {
    setLocalError("");
    const err = validateNotes(draftNotes);
    if (err) {
      setLocalError(err);
      return;
    }
    const result = onApprove(app.id, draftNotes.trim());
    if (!result.ok) setLocalError(result.message);
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{app.eventName}</h3>
          <p className="mt-1 text-sm text-slate-600">
            Applicant: <span className="font-medium text-slate-800">{hirerName}</span> —{" "}
            {app.hirerEmail} · {app.hirerPhone}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Requested venue:{" "}
            <span className="font-medium text-slate-700">{venue.name}</span> ·{" "}
            {venue.location} · capacity {venue.capacity}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Reputation (avg. from past hires):{" "}
            {reputationAverage !== null ? (
              <span className="font-semibold text-amber-600">
                {reputationAverage} / 5 <span aria-hidden="true">★</span>
              </span>
            ) : (
              <span className="text-slate-500">No rating</span>
            )}
          </p>
          {eventDateBlocked && (
            <p
              className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900"
              role="status"
            >
              This event date falls within a blocked period for this venue (e.g. maintenance).
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {isApproved && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
              Booking confirmed
            </span>
          )}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Event type</dt>
          <dd className="font-medium text-slate-900">{app.eventType}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Guests</dt>
          <dd className="font-medium text-slate-900">{app.expectedGuests}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Date</dt>
          <dd className="font-medium text-slate-900">{dateLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Start &amp; duration</dt>
          <dd className="font-medium text-slate-900">
            {app.startTime} · {app.durationHours} hours
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <p className="font-medium text-slate-800">Venue profile (suitability from listing)</p>
        <p className="mt-1">{venue.suitability}</p>
      </div>

      <section className="mt-5" aria-labelledby={`history-${app.id}`}>
        <h4 id={`history-${app.id}`} className="text-sm font-semibold text-slate-900">
          Hiring reputation — previous venues
        </h4>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No past hiring history available.</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Venue</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Event</th>
                  <th className="px-3 py-2 font-medium">Hire date</th>
                  <th className="px-3 py-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((row, i) => (
                  <tr key={`${row.hireDate}-${i}`} className="bg-white">
                    <td className="px-3 py-2 text-slate-900">{row.venueName}</td>
                    <td className="px-3 py-2 text-slate-600">{row.location}</td>
                    <td className="px-3 py-2 text-slate-600">{row.eventName}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {new Date(`${row.hireDate}T00:00:00`).toLocaleDateString("en-AU")}
                    </td>
                    <td className="px-3 py-2">
                      <Stars value={row.ratingOutOf5} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-5" aria-labelledby={`docs-${app.id}`}>
        <h4 id={`docs-${app.id}`} className="text-sm font-semibold text-slate-900">
          Compliant documents on record
        </h4>
        {documents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No document list available for this applicant.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {documents.map((doc, i) => (
              <li
                key={`${doc.label}-${i}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{doc.label}</span>
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {doc.fileType} · {docStatusLabel(doc.status)}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">{doc.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
            checked={app.vendorShortlisted}
            disabled={isApproved}
            onChange={(e) => onToggleShortlist(app.id, e.target.checked)}
          />
          Select as candidate for this venue hire
        </label>
      </div>

      <div className="mt-4">
        <label htmlFor={`notes-${app.id}`} className="block text-sm font-medium text-slate-700">
          Vendor comments on this applicant
        </label>
        <textarea
          id={`notes-${app.id}`}
          rows={4}
          disabled={isApproved}
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 disabled:bg-slate-50"
          placeholder="Summarise credibility, requirements match, and follow-up needs. Required before saving comments or approving."
        />
        <p className="mt-1 text-xs text-slate-500">
          Between {NOTE_MIN} and {NOTE_MAX} characters after trimming.
        </p>
        {localError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {localError}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isApproved}
          onClick={handleSaveNotes}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save comments
        </button>
        <button
          type="button"
          disabled={isApproved}
          onClick={handleApprove}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve application &amp; confirm booking
        </button>
      </div>
    </article>
  );
}
