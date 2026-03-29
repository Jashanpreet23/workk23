/* App user list: starter profiles on first load; sign-up adds more. */

export type UserRole = "hirer" | "vendor";

export type User = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const users: User[] = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "Johndoe@123",
    role: "hirer",
  },
  {
    name: "Bruce Wayne",
    email: "batman@example.com",
    password: "Batman@123",
    role: "vendor",
  },
];

function parseUser(raw: unknown): User | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const password = typeof o.password === "string" ? o.password : "";
  const role = o.role === "hirer" || o.role === "vendor" ? o.role : null;
  if (!name || !email || !password || !role) return null;
  return { name, email, password, role };
}

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
    return parsed
      .map(parseUser)
      .filter((u): u is User => u !== null);
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
    {
      ...candidate,
      email: candidate.email.trim(),
      name: candidate.name.trim(),
    },
  ]);
  return "ok";
}

/** Current session object stored under `vv_current_user` (same shape as User). */
export function readSessionUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vv_current_user");
    if (!raw) return null;
    return parseUser(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

/** Lets the header update right after sign-in / sign-out (same tab). */
export const AUTH_CHANGED_EVENT = "vv-auth-changed";

export function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}
