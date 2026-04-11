import { useCallback, useEffect, useState } from "react";
import {
  addVenueBlock,
  getVenueById,
  readVenueBlocks,
  readVenues,
  removeVenueBlock,
  type Venue,
  type VenueBlock,
} from "@/data/bookingData";

export default function VenueBlockingPanel() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [blocks, setBlocks] = useState<VenueBlock[]>([]);
  const [venueId, setVenueId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  const sync = useCallback(() => {
    setVenues(readVenues());
    setBlocks(readVenueBlocks());
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!venueId) {
      setFormError("Choose a venue.");
      return;
    }
    const result = addVenueBlock(venueId, startDate, endDate, note);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setStartDate("");
    setEndDate("");
    setNote("");
    sync();
  }

  return (
    <section
      className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-labelledby="venue-blocking-heading"
    >
      <h3 id="venue-blocking-heading" className="text-lg font-semibold text-slate-900">
        Block venue availability
      </h3>

      <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="block-venue" className="block text-sm font-medium text-slate-700">
            Venue
          </label>
          <select
            id="block-venue"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="">Select venue</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="block-start" className="block text-sm font-medium text-slate-700">
            From
          </label>
          <input
            id="block-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            required
          />
        </div>
        <div>
          <label htmlFor="block-end" className="block text-sm font-medium text-slate-700">
            To
          </label>
          <input
            id="block-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            required
          />
        </div>
        <div className="min-w-[200px] flex-[2]">
          <label htmlFor="block-note" className="block text-sm font-medium text-slate-700">
            Note (optional)
          </label>
          <input
            id="block-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder="e.g. Stage maintenance"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Save block
        </button>
      </form>
      {formError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-800">Active blocks</h4>
        {blocks.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No blocked periods saved.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {blocks.map((b) => {
              const v = getVenueById(b.venueId);
              return (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-slate-900">{v?.name ?? b.venueId}</span>
                    <span className="text-slate-600">
                      {" "}
                      · {b.startDate} → {b.endDate}
                    </span>
                    {b.note ? <span className="block text-xs text-slate-500">{b.note}</span> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeVenueBlock(b.id);
                      sync();
                    }}
                    className="rounded-md text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
