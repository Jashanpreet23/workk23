/*
 * Seed data for the Venue Vendors app.
 * Since sign-up isn't implemented yet, we store dummy users
 * in localStorage so sign-in has something to work with.
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
