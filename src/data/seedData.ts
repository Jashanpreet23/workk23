/**
 * Assignment 1: all app data uses HTML5 localStorage (no database, no REST).
 * Dummy registration rows (first name, last name, email + password + role) satisfy the PA brief; sign-up can append more.
 */

export type UserRole = "hirer" | "vendor";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

/** Display name for header and greetings. */
export function userDisplayName(u: User): string {
  return `${u.firstName} ${u.lastName}`.trim();
}

const KEY_USERS = "vv_users";
const KEY_SEEDED = "vv_seeded";
const KEY_CURRENT = "vv_current_user";

/** Dummy accounts stored in localStorage for sign-in testing (PA requirement). */
const seedUsers: User[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "Johndoe@123",
    role: "hirer",
  },
  {
    firstName: "Bruce",
    lastName: "Wayne",
    email: "batman@example.com",
    password: "Batman@123",
    role: "vendor",
  },
];

function lsGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function lsSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function lsRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

function parseUser(raw: unknown): User | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  let firstName = typeof o.firstName === "string" ? o.firstName.trim() : "";
  let lastName = typeof o.lastName === "string" ? o.lastName.trim() : "";
  const legacyName = typeof o.name === "string" ? o.name.trim() : "";
  if (legacyName && (!firstName || !lastName)) {
    const parts = legacyName.split(/\s+/).filter(Boolean);
    if (!firstName) firstName = parts[0] ?? "";
    if (!lastName) lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const password = typeof o.password === "string" ? o.password : "";
  const role = o.role === "hirer" || o.role === "vendor" ? o.role : null;
  if (!firstName || !lastName || !email || !password || !role) return null;
  return { firstName, lastName, email, password, role };
}

function readValidUsersFromStorage(): User[] {
  try {
    const raw = lsGet(KEY_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(parseUser)
      .filter((u): u is User => u !== null);
  } catch {
    return [];
  }
}

function ensureSeedUsersInStorage(): void {
  const existing = readValidUsersFromStorage();
  const seen = new Set(
    existing.map((u) => u.email.trim().toLowerCase())
  );
  let changed = false;
  const next = [...existing];
  for (const demo of seedUsers) {
    const key = demo.email.trim().toLowerCase();
    if (!seen.has(key)) {
      next.push(demo);
      seen.add(key);
      changed = true;
    }
  }
  if (changed) {
    lsSet(KEY_USERS, JSON.stringify(next));
  }
}

/**
 * First visit: write dummy `seedUsers` (or merge them in if `vv_users` already exists).
 * Later: merge any missing demo rows so John/Bruce stay available alongside sign-ups.
 */
export function seedLocalStorage(): void {
  if (typeof window === "undefined") return;
  if (!lsGet(KEY_SEEDED)) {
    lsSet(KEY_SEEDED, "true");
    if (lsGet(KEY_USERS) === null) {
      lsSet(KEY_USERS, JSON.stringify(seedUsers));
    } else {
      ensureSeedUsersInStorage();
    }
    return;
  }
  ensureSeedUsersInStorage();
}

export function readUsersFromStorage(): User[] {
  if (typeof window === "undefined") return [];
  seedLocalStorage();
  return readValidUsersFromStorage();
}

export function writeUsersToStorage(next: User[]): void {
  lsSet(KEY_USERS, JSON.stringify(next));
}

/** Append one user if that email is not already registered (case-insensitive). */
export function registerUserLocal(candidate: User): "ok" | "duplicate" {
  const emailNorm = candidate.email.trim().toLowerCase();
  const users = readUsersFromStorage();
  if (users.some((u) => u.email.trim().toLowerCase() === emailNorm)) {
    return "duplicate";
  }
  writeUsersToStorage([
    ...users,
    {
      ...candidate,
      email: candidate.email.trim(),
      firstName: candidate.firstName.trim(),
      lastName: candidate.lastName.trim(),
    },
  ]);
  return "ok";
}

export function persistCurrentUser(user: User): void {
  lsSet(KEY_CURRENT, JSON.stringify(user));
}

export function hasPersistedCurrentUser(): boolean {
  return lsGet(KEY_CURRENT) !== null;
}

export function clearPersistedCurrentUser(): void {
  lsRemove(KEY_CURRENT);
}

export function readSessionUser(): User | null {
  if (typeof window === "undefined") return null;
  seedLocalStorage();
  try {
    const raw = lsGet(KEY_CURRENT);
    if (!raw) return null;
    return parseUser(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export const AUTH_CHANGED_EVENT = "vv-auth-changed";

export function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
