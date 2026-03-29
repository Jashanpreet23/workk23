/*
 * Venue Vendors client-side data (Assignment 1: localStorage only — no DB, no REST).
 * Dummy users seed on first visit; sign-up appends to the same vv_users list.
 */

export type UserRole = "hirer" | "vendor";

export type User = {
  email: string;
  password: string;
  role: UserRole;
};

// one account per role so we can test both flows
const users: User[] = [
  {
    email: "johndoe@example.com",
    password: "Johndoe@123",
    role: "hirer",
  },
  {
    email: "batman@example.com",
    password: "Batman@123",
    role: "vendor",
  },
];

// writes users into localStorage on first visit
// skips if already seeded so we don't overwrite anything
export function seedLocalStorage(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("vv_seeded")) return;

  localStorage.setItem("vv_users", JSON.stringify(users));
  localStorage.setItem("vv_seeded", "true");
}

export function readUsersFromStorage(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("vv_users");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is User =>
        typeof u === "object" &&
        u !== null &&
        typeof (u as User).email === "string" &&
        typeof (u as User).password === "string" &&
        ((u as User).role === "hirer" || (u as User).role === "vendor")
    );
  } catch {
    return [];
  }
}

export function writeUsersToStorage(next: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("vv_users", JSON.stringify(next));
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
    { ...candidate, email: candidate.email.trim() },
  ]);
  return "ok";
}
