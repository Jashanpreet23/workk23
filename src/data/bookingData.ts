/**
 * Venue applications, hire history, compliant-doc summaries, venue catalogue, and (CR) venue blocks.
 * Persisted in localStorage (Assignment 1 — no REST, no database).
 */

export type Venue = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  suitability: string;
};

export type ApplicationStatus = "pending" | "approved";

export type VenueApplication = {
  id: string;
  hirerEmail: string;
  hirerFirstName: string;
  hirerLastName: string;
  hirerPhone: string;
  venueId: string;
  eventName: string;
  eventType: string;
  expectedGuests: number;
  eventDate: string;
  startTime: string;
  durationHours: number;
  status: ApplicationStatus;
  /** Vendor has marked this applicant as a candidate they are considering. */
  vendorShortlisted: boolean;
  vendorNotes: string;
};

export type PastHire = {
  venueName: string;
  location: string;
  eventName: string;
  hireDate: string;
  ratingOutOf5: number;
};

export type CompliantDocument = {
  label: string;
  fileType: string;
  status: "on_file" | "not_provided";
  summary: string;
};

const KEY_VENUES = "vv_venues";
const KEY_APPLICATIONS = "vv_applications";
const KEY_HIRER_HISTORY = "vv_hirer_history";
const KEY_HIRER_DOCS = "vv_hirer_docs";
const KEY_VENUE_BLOCKS = "vv_venue_blocks";

/** Vendor maintenance / blackout window (CR e.iii). Dates YYYY-MM-DD inclusive. */
export type VenueBlock = {
  id: string;
  venueId: string;
  startDate: string;
  endDate: string;
  note: string;
};

function lsGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function lsSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

const seedVenues: Venue[] = [
  {
    id: "ven-harbour",
    name: "Harbour View Ballroom",
    location: "Docklands, Melbourne",
    capacity: 320,
    suitability: "Corporate conferences, gala dinners, product launches",
  },
  {
    id: "ven-river",
    name: "Riverside Warehouse",
    location: "Southbank, Melbourne",
    capacity: 180,
    suitability: "Live performances, weddings, community fundraisers",
  },
  {
    id: "ven-botanic",
    name: "Botanic Courtyard Marquee",
    location: "South Yarra, Melbourne",
    capacity: 220,
    suitability: "Weddings, milestone celebrations, outdoor corporate events",
  },
  {
    id: "ven-loft",
    name: "Collins Street Loft",
    location: "Melbourne CBD",
    capacity: 95,
    suitability: "Intimate launches, workshops, private dinners, film screenings",
  },
  {
    id: "ven-gallery",
    name: "Northside Gallery Events",
    location: "Brunswick, Melbourne",
    capacity: 140,
    suitability: "Exhibitions, cocktail receptions, creative industry events",
  },
  {
    id: "ven-rooftop",
    name: "Skyline Rooftop Terrace",
    location: "Carlton, Melbourne",
    capacity: 160,
    suitability: "Sunset drinks, summer parties, brand activations with city views",
  },
  {
    id: "ven-pavilion",
    name: "Fitzroy Community Pavilion",
    location: "Fitzroy, Melbourne",
    capacity: 200,
    suitability: "Community fairs, markets, live music, family-friendly gatherings",
  },
  {
    id: "ven-studios",
    name: "Richmond Creative Studios",
    location: "Richmond, Melbourne",
    capacity: 75,
    suitability: "Photo/video shoots, small team offsites, podcast recordings",
  },
  {
    id: "ven-heritage",
    name: "Old Town Hall Ballroom",
    location: "Prahran, Melbourne",
    capacity: 280,
    suitability: "Formal balls, large dinners, awards nights, heritage charm",
  },
];

const seedApplications: VenueApplication[] = [
  {
    id: "app-annual",
    hirerEmail: "johndoe@example.com",
    hirerFirstName: "John",
    hirerLastName: "Doe",
    hirerPhone: "0412 555 014",
    venueId: "ven-harbour",
    eventName: "Annual partner summit",
    eventType: "Corporate conference",
    expectedGuests: 260,
    eventDate: "2026-05-18",
    startTime: "09:00",
    durationHours: 10,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
  {
    id: "app-charity",
    hirerEmail: "johndoe@example.com",
    hirerFirstName: "John",
    hirerLastName: "Doe",
    hirerPhone: "0412 555 014",
    venueId: "ven-river",
    eventName: "Harbour Lights charity night",
    eventType: "Fundraiser and live entertainment",
    expectedGuests: 150,
    eventDate: "2026-07-04",
    startTime: "18:30",
    durationHours: 5,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
  {
    id: "app-product",
    hirerEmail: "johndoe@example.com",
    hirerFirstName: "John",
    hirerLastName: "Doe",
    hirerPhone: "0412 555 014",
    venueId: "ven-botanic",
    eventName: "Spring product reveal",
    eventType: "Outdoor brand experience",
    expectedGuests: 190,
    eventDate: "2026-09-22",
    startTime: "15:00",
    durationHours: 4,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
  {
    id: "app-star-gala",
    hirerEmail: "starclient@example.com",
    hirerFirstName: "Morgan",
    hirerLastName: "Lee",
    hirerPhone: "0401 222 333",
    venueId: "ven-harbour",
    eventName: "Awards gala evening",
    eventType: "Formal dinner",
    expectedGuests: 200,
    eventDate: "2026-04-10",
    startTime: "18:00",
    durationHours: 6,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
  {
    id: "app-low-meetup",
    hirerEmail: "budgethosts@example.com",
    hirerFirstName: "Riley",
    hirerLastName: "Nguyen",
    hirerPhone: "0402 444 555",
    venueId: "ven-river",
    eventName: "Community meet-up",
    eventType: "Informal gathering",
    expectedGuests: 80,
    eventDate: "2026-06-01",
    startTime: "14:00",
    durationHours: 3,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
  {
    id: "app-first-timer",
    hirerEmail: "firstevent@example.com",
    hirerFirstName: "Sam",
    hirerLastName: "Taylor",
    hirerPhone: "0403 666 777",
    venueId: "ven-botanic",
    eventName: "Garden party",
    eventType: "Private celebration",
    expectedGuests: 40,
    eventDate: "2026-08-15",
    startTime: "12:00",
    durationHours: 5,
    status: "pending",
    vendorShortlisted: false,
    vendorNotes: "",
  },
];

const seedHistory: Record<string, PastHire[]> = {
  "johndoe@example.com": [
    {
      venueName: "City North Convention Hall",
      location: "Carlton, Melbourne",
      eventName: "Regional sales kick-off",
      hireDate: "2024-03-06",
      ratingOutOf5: 5,
    },
    {
      venueName: "Yarra Loft Studios",
      location: "Richmond, Melbourne",
      eventName: "Design week showcase",
      hireDate: "2025-01-15",
      ratingOutOf5: 4,
    },
  ],
  "starclient@example.com": [
    {
      venueName: "Grand Hall Collins",
      location: "Melbourne CBD",
      eventName: "Annual charity ball",
      hireDate: "2024-11-20",
      ratingOutOf5: 5,
    },
    {
      venueName: "Riverside Pavilion",
      location: "Docklands",
      eventName: "Product celebration",
      hireDate: "2025-08-03",
      ratingOutOf5: 5,
    },
  ],
  "budgethosts@example.com": [
    {
      venueName: "Neighbourhood Hall",
      location: "Brunswick",
      eventName: "Local mixer",
      hireDate: "2024-02-14",
      ratingOutOf5: 2,
    },
  ],
};

const seedDocs: Record<string, CompliantDocument[]> = {
  "johndoe@example.com": [
    {
      label: "Driver licence (photo ID)",
      fileType: "JPG scan",
      status: "on_file",
      summary: "Verified copy on record from February 2026.",
    },
    {
      label: "Public liability insurance certificate of currency",
      fileType: "PDF",
      status: "on_file",
      summary: "Covers events up to 500 guests, expires January 2027.",
    },
    {
      label: "Business registration (ABN certificate)",
      fileType: "PDF",
      status: "not_provided",
      summary: "Applicant indicated individual hire; certificate not required on file.",
    },
  ],
};

function parseVenue(raw: unknown): Venue | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id.trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const location = typeof o.location === "string" ? o.location.trim() : "";
  const capacity = typeof o.capacity === "number" && o.capacity > 0 ? o.capacity : 0;
  const suitability = typeof o.suitability === "string" ? o.suitability.trim() : "";
  if (!id || !name || !location || !capacity || !suitability) return null;
  return { id, name, location, capacity, suitability };
}

function parseApplication(raw: unknown): VenueApplication | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id.trim() : "";
  const hirerEmail = typeof o.hirerEmail === "string" ? o.hirerEmail.trim() : "";
  const hirerFirstName =
    typeof o.hirerFirstName === "string" ? o.hirerFirstName.trim() : "";
  const hirerLastName =
    typeof o.hirerLastName === "string" ? o.hirerLastName.trim() : "";
  const hirerPhone = typeof o.hirerPhone === "string" ? o.hirerPhone.trim() : "";
  const venueId = typeof o.venueId === "string" ? o.venueId.trim() : "";
  const eventName = typeof o.eventName === "string" ? o.eventName.trim() : "";
  const eventType = typeof o.eventType === "string" ? o.eventType.trim() : "";
  const expectedGuests =
    typeof o.expectedGuests === "number" && o.expectedGuests > 0
      ? o.expectedGuests
      : 0;
  const eventDate = typeof o.eventDate === "string" ? o.eventDate.trim() : "";
  const startTime = typeof o.startTime === "string" ? o.startTime.trim() : "";
  const durationHours =
    typeof o.durationHours === "number" && o.durationHours > 0
      ? o.durationHours
      : 0;
  const status = o.status === "approved" || o.status === "pending" ? o.status : null;
  const vendorShortlisted = o.vendorShortlisted === true;
  const vendorNotes =
    typeof o.vendorNotes === "string" ? o.vendorNotes.trim() : "";
  if (
    !id ||
    !hirerEmail ||
    !hirerFirstName ||
    !hirerLastName ||
    !hirerPhone ||
    !venueId ||
    !eventName ||
    !eventType ||
    !expectedGuests ||
    !eventDate ||
    !startTime ||
    !durationHours ||
    !status
  ) {
    return null;
  }
  return {
    id,
    hirerEmail,
    hirerFirstName,
    hirerLastName,
    hirerPhone,
    venueId,
    eventName,
    eventType,
    expectedGuests,
    eventDate,
    startTime,
    durationHours,
    status,
    vendorShortlisted,
    vendorNotes,
  };
}

function readVenuesFromStorage(): Venue[] {
  try {
    const raw = lsGet(KEY_VENUES);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseVenue).filter((v): v is Venue => v !== null);
  } catch {
    return [];
  }
}

function readApplicationsFromStorage(): VenueApplication[] {
  try {
    const raw = lsGet(KEY_APPLICATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseApplication).filter((a): a is VenueApplication => a !== null);
  } catch {
    return [];
  }
}

/** One-time seed per key. Clear localStorage to pick up new demo data. */
export function seedBookingData(): void {
  if (typeof window === "undefined") return;
  if (!lsGet(KEY_VENUES)) lsSet(KEY_VENUES, JSON.stringify(seedVenues));
  if (!lsGet(KEY_APPLICATIONS)) lsSet(KEY_APPLICATIONS, JSON.stringify(seedApplications));
  if (!lsGet(KEY_HIRER_HISTORY)) lsSet(KEY_HIRER_HISTORY, JSON.stringify(seedHistory));
  if (!lsGet(KEY_HIRER_DOCS)) lsSet(KEY_HIRER_DOCS, JSON.stringify(seedDocs));
  if (!lsGet(KEY_VENUE_BLOCKS)) lsSet(KEY_VENUE_BLOCKS, JSON.stringify([]));
}

export function readVenues(): Venue[] {
  seedBookingData();
  return readVenuesFromStorage();
}

export function getVenueById(id: string): Venue | undefined {
  return readVenues().find((v) => v.id === id);
}

export function readApplications(): VenueApplication[] {
  seedBookingData();
  return readApplicationsFromStorage();
}

export function writeApplications(next: VenueApplication[]): void {
  lsSet(KEY_APPLICATIONS, JSON.stringify(next));
}

export function updateApplication(
  id: string,
  patch: Partial<
    Pick<VenueApplication, "vendorNotes" | "status" | "vendorShortlisted">
  >
): VenueApplication | null {
  const apps = readApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const current = apps[idx];
  const updated: VenueApplication = {
    ...current,
    ...patch,
    vendorNotes:
      typeof patch.vendorNotes === "string"
        ? patch.vendorNotes.trim()
        : current.vendorNotes,
    vendorShortlisted:
      typeof patch.vendorShortlisted === "boolean"
        ? patch.vendorShortlisted
        : current.vendorShortlisted,
  };
  const next = [...apps];
  next[idx] = updated;
  writeApplications(next);
  return updated;
}

export function readHirerHistory(hirerEmail: string): PastHire[] {
  seedBookingData();
  try {
    const raw = lsGet(KEY_HIRER_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const row = parsed[hirerEmail.toLowerCase()];
    if (!Array.isArray(row)) return [];
    return row
      .map((item): PastHire | null => {
        if (typeof item !== "object" || item === null) return null;
        const o = item as Record<string, unknown>;
        const venueName = typeof o.venueName === "string" ? o.venueName : "";
        const location = typeof o.location === "string" ? o.location : "";
        const eventName = typeof o.eventName === "string" ? o.eventName : "";
        const hireDate = typeof o.hireDate === "string" ? o.hireDate : "";
        const rating =
          typeof o.ratingOutOf5 === "number" &&
          o.ratingOutOf5 >= 0 &&
          o.ratingOutOf5 <= 5
            ? o.ratingOutOf5
            : null;
        if (!venueName || !location || !eventName || !hireDate || rating === null)
          return null;
        return { venueName, location, eventName, hireDate, ratingOutOf5: rating };
      })
      .filter((h): h is PastHire => h !== null);
  } catch {
    return [];
  }
}

export function readHirerDocuments(hirerEmail: string): CompliantDocument[] {
  seedBookingData();
  try {
    const raw = lsGet(KEY_HIRER_DOCS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const row = parsed[hirerEmail.toLowerCase()];
    if (!Array.isArray(row)) return [];
    return row
      .map((item): CompliantDocument | null => {
        if (typeof item !== "object" || item === null) return null;
        const o = item as Record<string, unknown>;
        const label = typeof o.label === "string" ? o.label : "";
        const fileType = typeof o.fileType === "string" ? o.fileType : "";
        const raw = o.status;
        const status =
          raw === "on_file" || raw === "not_provided"
            ? raw
            : raw === "pending_review"
              ? "not_provided"
              : null;
        const summary = typeof o.summary === "string" ? o.summary : "";
        if (!label || !fileType || !status || !summary) return null;
        return { label, fileType, status, summary };
      })
      .filter((d): d is CompliantDocument => d !== null);
  } catch {
    return [];
  }
}

function parseVenueBlock(item: unknown): VenueBlock | null {
  if (typeof item !== "object" || item === null) return null;
  const o = item as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id.trim() : "";
  const venueId = typeof o.venueId === "string" ? o.venueId.trim() : "";
  const startDate = typeof o.startDate === "string" ? o.startDate.trim() : "";
  const endDate = typeof o.endDate === "string" ? o.endDate.trim() : "";
  const note = typeof o.note === "string" ? o.note.trim() : "";
  if (!id || !venueId || !startDate || !endDate) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return null;
  }
  if (startDate > endDate) return null;
  return { id, venueId, startDate, endDate, note };
}

function readVenueBlocksFromStorage(): VenueBlock[] {
  try {
    const raw = lsGet(KEY_VENUE_BLOCKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(parseVenueBlock)
      .filter((b): b is VenueBlock => b !== null);
  } catch {
    return [];
  }
}

export function readVenueBlocks(): VenueBlock[] {
  seedBookingData();
  return readVenueBlocksFromStorage();
}

export function readVenueBlocksForVenue(venueId: string): VenueBlock[] {
  const vid = venueId.trim();
  return readVenueBlocks().filter((b) => b.venueId === vid);
}

function writeVenueBlocksRaw(blocks: VenueBlock[]): void {
  lsSet(KEY_VENUE_BLOCKS, JSON.stringify(blocks));
}

export function addVenueBlock(
  venueId: string,
  startDate: string,
  endDate: string,
  note: string
): { ok: true; id: string } | { ok: false; message: string } {
  seedBookingData();
  const vid = venueId.trim();
  if (!getVenueById(vid)) {
    return { ok: false, message: "Unknown venue." };
  }
  const s = startDate.trim();
  const e = endDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !/^\d{4}-\d{2}-\d{2}$/.test(e)) {
    return { ok: false, message: "Use valid start and end dates (YYYY-MM-DD)." };
  }
  if (s > e) {
    return { ok: false, message: "Start date must be on or before end date." };
  }
  const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const next: VenueBlock[] = [
    ...readVenueBlocksFromStorage(),
    {
      id,
      venueId: vid,
      startDate: s,
      endDate: e,
      note: note.trim().slice(0, 200),
    },
  ];
  writeVenueBlocksRaw(next);
  return { ok: true, id };
}

export function removeVenueBlock(id: string): void {
  seedBookingData();
  const next = readVenueBlocksFromStorage().filter((b) => b.id !== id);
  writeVenueBlocksRaw(next);
}

function dayStamp(isoDay: string): number {
  return new Date(`${isoDay}T12:00:00`).getTime();
}

/** True when the event day falls inside a saved blackout for that venue (CR e.iii). */
export function isVenueDateBlocked(venueId: string, eventDate: string): boolean {
  const d = eventDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = dayStamp(d);
  return readVenueBlocks().some((b) => {
    if (b.venueId !== venueId) return false;
    return t >= dayStamp(b.startDate) && t <= dayStamp(b.endDate);
  });
}

/** Average 0–5 star rating from past hires; null if none (CR e.ii). */
export function hirerReputationAverage(hirerEmail: string): number | null {
  const rows = readHirerHistory(hirerEmail);
  if (rows.length === 0) return null;
  const sum = rows.reduce((acc, h) => acc + h.ratingOutOf5, 0);
  return Math.round((sum / rows.length) * 10) / 10;
}
