import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { notifyAuthChanged, readUsersFromStorage } from "@/data/seedData";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");

    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!emailTrimmed.includes("@")) {
      setError("That email does not look quite right.");
      return;
    }

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

    const users = readUsersFromStorage();
    if (users.length === 0) {
      setError("No account found yet. Create one on the sign-up page first.");
      return;
    }

    const match = users.find(
      (u) => u.email.trim() === emailTrimmed && u.password === password
    );

    if (!match) {
      setError("We could not match that email and password. Try again or create an account.");
      return;
    }

    localStorage.setItem("vv_current_user", JSON.stringify(match));
    notifyAuthChanged();
    const dest = match.role === "hirer" ? "/hirer" : "/vendor";
    router.push(`${dest}?welcome=true`);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500">
        Sign in to manage your events or venues. Fields marked with{" "}
        <span className="text-red-600">*</span> are required.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Enter your password"
          />
        </div>

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
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-sky-600">
          Sign up
        </Link>
      </p>
    </main>
  );
}
