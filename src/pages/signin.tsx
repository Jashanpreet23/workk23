import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { User } from "@/data/seedData";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");

    // auth check that both fields are filled in
    if (!email || !password) {
      setError("Please enter both email AND password");
      return;
    }

    // validate email format
    // TODO: make this with regex later
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    // validate strong password (8+ chars, uppercase, lowercase, number, special char)
    // spec says to validate strong password on sign IN for some reason
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError("Password must be 8+ characters with uppercase, lowercase, number, and special character");
      return;
    }

    // check credentials against localStorage
    const stored = localStorage.getItem("vv_users");
    if (!stored) {
      setError("No users found");
      return;
    }

    const users: User[] = JSON.parse(stored);
    const match = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      setError("Invalid email/password");
      return;
    }

    // save who's logged in and redirect to their dashboard
    localStorage.setItem("vv_current_user", JSON.stringify(match));
    const dest = match.role === "hirer" ? "/hirer" : "/vendor";
    router.push(`${dest}?welcome=true`);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
      <p className="mt-1 text-sm text-slate-500">
        Sign into Venue Vendors
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="you@example.com"
          />
        </div>

        {/* password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Enter your password"
          />
        </div>

        {/* error message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Dont have an account?{" "}
        <Link href="/signup" className="font-medium text-sky-600">
          Sign up
        </Link>
      </p>
    </main>
  );
}
