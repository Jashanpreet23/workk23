/**
 * PA (Pass) scope: venue applications, hirer hire history + compliant-doc summaries, venue catalogue.
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
const KEY_BOOKING_MERGED = "vv_booking_seed_merged";

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

function mergeSeeds(): void {
  if (typeof window === "undefined") return;
  const firstMerge = !lsGet(KEY_BOOKING_MERGED);

  if (!lsGet(KEY_VENUES)) {
    lsSet(KEY_VENUES, JSON.stringify(seedVenues));
  } else {
    mergeVenues();
  }

  if (!lsGet(KEY_APPLICATIONS)) {
    lsSet(KEY_APPLICATIONS, JSON.stringify(seedApplications));
  } else {
    mergeApplications();
  }

  if (!lsGet(KEY_HIRER_HISTORY)) {
    lsSet(KEY_HIRER_HISTORY, JSON.stringify(seedHistory));
  }

  if (!lsGet(KEY_HIRER_DOCS)) {
    lsSet(KEY_HIRER_DOCS, JSON.stringify(seedDocs));
  }

  if (firstMerge) {
    lsSet(KEY_BOOKING_MERGED, "true");
  }
}

function mergeVenues(): void {
  const existing = readVenuesFromStorage();
  const seen = new Set(existing.map((v) => v.id));
  const next = [...existing];
  for (const v of seedVenues) {
    if (!seen.has(v.id)) {
      next.push(v);
      seen.add(v.id);
    }
  }
  lsSet(KEY_VENUES, JSON.stringify(next));
}

function mergeApplications(): void {
  const existing = readApplicationsFromStorage();
  const seen = new Set(existing.map((a) => a.id));
  const next = [...existing];
  for (const a of seedApplications) {
    if (!seen.has(a.id)) {
      next.push(a);
      seen.add(a.id);
    }
  }
  lsSet(KEY_APPLICATIONS, JSON.stringify(next));
}

export function seedBookingData(): void {
  if (typeof window === "undefined") return;
  mergeSeeds();
  mergeVenues();
  mergeApplications();
  if (!lsGet(KEY_HIRER_HISTORY)) {
    lsSet(KEY_HIRER_HISTORY, JSON.stringify(seedHistory));
  }
  if (!lsGet(KEY_HIRER_DOCS)) {
    lsSet(KEY_HIRER_DOCS, JSON.stringify(seedDocs));
  }
}

export const BOOKING_DATA_CHANGED_EVENT = "vv-booking-data-changed";

export function notifyBookingDataChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BOOKING_DATA_CHANGED_EVENT));
  }
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
  notifyBookingDataChanged();
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
