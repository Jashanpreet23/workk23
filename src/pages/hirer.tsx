import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  readPreferences,
  savePreferences,
  readSessionUser,
  updateUserProfile,
} from "@/data/seedData";
import {
  readVenues,
  readApplications,
  writeApplications,
  readHirerHistory,
  type Venue,
  type VenueApplication,
  type PastHire,
} from "@/data/bookingData";

// hirer dashboard shows venue list after sign in
export default function HirerDashboard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [history, setHistory] = useState<PastHire[]>([]);
  const [applyingTo, setApplyingTo] = useState<Venue | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showReputation, setShowReputation] = useState(false);

  // load venues and preferences on mount
  useEffect(() => {
    const user = readSessionUser();
    if (user) {
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone || "");
      setPrefs(readPreferences(user.email));
      setHistory(readHirerHistory(user.email));
    }
    setVenues(readVenues());
  }, []);

  // hide the welcome banner after 3 seconds
  useEffect(() => {
    if (router.query.welcome === "true") {
      const timer = setTimeout(() => setDismissed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query.welcome]);

  const showWelcome = router.query.welcome === "true" && !dismissed;

  // add or remove a venue from the shortlist
  function togglePref(id: string) {
    let next: string[];
    if (prefs.includes(id)) {
      next = prefs.filter((p) => p !== id);
    } else {
      next = [...prefs, id];
    }
    setPrefs(next);
    savePreferences(email, next);
  }

  // swap a venue up or down in the ranked list
  function movePref(id: string, dir: -1 | 1) {
    const idx = prefs.indexOf(id);
    if (idx === -1) return;
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= prefs.length) return;
    const next = [...prefs];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setPrefs(next);
    savePreferences(email, next);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:px-8">
      {showWelcome && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Signed in successfully
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Hirer Dashboard</h2>
        <div className="flex gap-4">
          <button
            onClick={() => { setShowReputation(!showReputation); setShowProfile(false); }}
            className="text-sm font-medium text-sky-600 hover:text-sky-800"
          >
            {showReputation ? "Back to venues" : "Reputation"}
          </button>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowReputation(false); }}
            className="text-sm font-medium text-sky-600 hover:text-sky-800"
          >
            {showProfile ? "Back to venues" : "Edit profile"}
          </button>
        </div>
      </div>

      {/* profile editing */}
      {showProfile && (
        <ProfileForm
          email={email}
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          onSave={(fn, ln, ph) => {
            setFirstName(fn);
            setLastName(ln);
            setPhone(ph);
          }}
        />
      )}

      {/* reputation / hire history */}
      {showReputation && (
        <div className="mt-6">
          <div className="mb-4 max-w-md rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Average rating from past venues</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {history.length > 0
                ? (history.reduce((sum, h) => sum + h.ratingOutOf5, 0) / history.length).toFixed(1)
                : "N/A"
              }
              {history.length > 0 && <span className="text-yellow-500"> ★</span>}
            </p>
            <p className="text-xs text-slate-400">{history.length} previous hire(s)</p>
          </div>
          
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">No hiring history yet.</p>
          ) : (
            <div className="max-w-md space-y-3">
              {history.map((h, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{h.eventName}</h4>
                      <p className="text-xs text-slate-500">{h.venueName} · {h.location} · {h.hireDate}</p>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">
                      {"★".repeat(h.ratingOutOf5)}{"☆".repeat(5 - h.ratingOutOf5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* venue browsing content (hidden when editing profile or viewing reputation) */}
      {!showProfile && !showReputation && <>

      {/* shortlist / preference ranking */}
      {prefs.length > 0 && (
        <div className="mt-6 max-w-md rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Your venue shortlist</h3>
          <p className="mt-1 text-xs text-slate-500">Ranked by preference. Use arrows to reorder.</p>
          <ol className="mt-3 space-y-2">
            {prefs.map((id, i) => {
              const v = venues.find((x) => x.id === id);
              if (!v) return null;
              return (
                <li key={id} className="flex items-center gap-2 text-sm text-slate-800">
                  <span className="w-5 text-right font-semibold text-slate-500">{i + 1}.</span>
                  <span>{v.name}</span>
                  <button
                    onClick={() => movePref(id, -1)}
                    disabled={i === 0}
                    className="rounded px-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePref(id, 1)}
                    disabled={i === prefs.length - 1}
                    className="rounded px-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => togglePref(id)}
                    className="rounded px-1 text-red-400 hover:text-red-600"
                    title="Remove from shortlist"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* venue cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image src="/venue-placeholder.jpg" alt={v.name} width={600} height={160} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{v.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{v.location} | Up to {v.capacity} guests</p>
              <p className="mt-2 text-sm text-slate-600">{v.suitability}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => togglePref(v.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    prefs.includes(v.id)
                      ? "bg-sky-100 text-sky-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {prefs.includes(v.id) ? "In shortlist" : "Add to shortlist"}
                </button>
                <button
                  onClick={() => setApplyingTo(v)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* apply modal */}
      {applyingTo && (
        <ApplyForm
          venue={applyingTo}
          email={email}
          firstName={firstName}
          lastName={lastName}
          onClose={() => setApplyingTo(null)}
        />
      )}

      </>}
    </main>
  );
}

// form for applying to a venue
function ApplyForm({
  venue,
  email,
  firstName,
  lastName,
  onClose,
}: {
  venue: Venue;
  email: string;
  firstName: string;
  lastName: string;
  onClose: () => void;
}) {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // validate all the fields
    if (!eventName.trim()) { setError("Event name is required."); return; }
    if (!eventType.trim()) { setError("Event type is required."); return; }
    if (!guests || parseInt(guests) <= 0) { setError("Enter a valid number of guests."); return; }
    if (parseInt(guests) > venue.capacity) { setError(`This venue only fits ${venue.capacity} guests.`); return; }
    if (!date) { setError("Date is required."); return; }
    if (!time) { setError("Time is required."); return; }
    if (!duration || parseFloat(duration) <= 0) { setError("Enter a valid duration in hours."); return; }
    if (!phone.trim() || !/^[\d\s\-+()]{6,15}$/.test(phone.trim())) { setError("Enter a valid phone number."); return; }

    // build the application in the format the vendor page expects
    const app: VenueApplication = {
      id: `app-${Date.now()}`,
      hirerEmail: email,
      hirerFirstName: firstName,
      hirerLastName: lastName,
      hirerPhone: phone.trim(),
      venueId: venue.id,
      eventName: eventName.trim(),
      eventType: eventType.trim(),
      expectedGuests: parseInt(guests),
      eventDate: date,
      startTime: time,
      durationHours: parseFloat(duration),
      status: "pending",
      vendorShortlisted: false,
      vendorNotes: "",
    };

    // append to existing applications
    const all = readApplications();
    all.push(app);
    writeApplications(all);
    setSuccess(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">Apply for {venue.name}</h3>

        {success ? (
          <div className="mt-4">
            <p className="text-sm text-green-700">Application submitted.</p>
            <button onClick={onClose} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Event name</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Birthday Party" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Event type</label>
              <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Wedding, Corporate" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Expected guests</label>
              <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. 50" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Duration (hours)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. 3" min="0.5" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. 0412 345 678" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Submit</button>
              <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// profile editing form for name and phone
function ProfileForm({
  email,
  firstName: initFirst,
  lastName: initLast,
  phone: initPhone,
  onSave,
}: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  onSave: (firstName: string, lastName: string, phone: string) => void;
}) {
  const [first, setFirst] = useState(initFirst);
  const [last, setLast] = useState(initLast);
  const [ph, setPh] = useState(initPhone);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!first.trim()) { setError("First name is required."); return; }
    if (!last.trim()) { setError("Last name is required."); return; }
    // validate phone if they entered something
    if (ph.trim() && !/^[\d\s\-+()]{6,15}$/.test(ph.trim())) {
      setError("Enter a valid phone number.");
      return;
    }

    updateUserProfile(email, {
      firstName: first.trim(),
      lastName: last.trim(),
      phone: ph.trim(),
    });
    onSave(first.trim(), last.trim(), ph.trim());
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="mt-6 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">First name</label>
        <input type="text" value={first} onChange={(e) => setFirst(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Last name</label>
        <input type="text" value={last} onChange={(e) => setLast(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input type="email" value={email} disabled
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400" />
        <p className="mt-1 text-xs text-slate-400">Email cant be changed</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Phone number</label>
        <input type="tel" value={ph} onChange={(e) => setPh(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. 0412 345 678" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Profile updated.</p>}

      <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Save changes
      </button>
    </form>
  );
}
