import { useState } from "react";
import Link from "next/link";
import type { User, UserRole } from "@/data/seedData";
import { registerUserLocal } from "@/data/seedData";

function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v.includes("@")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isStrongPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("hirer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim() || !password || !confirm) {
      setError("Please fill in every field.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const candidate: User = {
      email: email.trim(),
      password,
      role,
    };

    const result = registerUserLocal(candidate);
    if (result === "duplicate") {
      setError("An account with this email already exists. Sign in instead.");
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirm("");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
      <p className="mt-1 text-sm text-slate-500">
        Tell us how you will use Venue Vendors. You can sign in anytime with the email and password
        you choose here.
      </p>

      {success && (
        <p
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          role="status"
        >
          You are all set.{" "}
          <Link href="/signin" className="font-medium text-emerald-900 underline">
            Sign in
          </Link>{" "}
          to continue.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-role" className="block text-sm font-medium text-slate-700">
            I am here to
          </label>
          <select
            id="signup-role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="hirer">Book a venue for an event</option>
            <option value="vendor">List or manage venues</option>
          </select>
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Re-enter password"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/signin" className="font-medium text-sky-600">
          Sign in
        </Link>
      </p>
    </main>
  );
}
