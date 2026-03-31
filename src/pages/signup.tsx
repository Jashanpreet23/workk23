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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    const firstTrimmed = firstName.trim();
    const lastTrimmed = lastName.trim();
    const emailTrimmed = email.trim();

    if (!firstTrimmed) {
      setError("First name is required.");
      return;
    }
    if (!lastTrimmed) {
      setError("Last name is required.");
      return;
    }
    if (!emailTrimmed) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!confirm) {
      setError("Please confirm your password.");
      return;
    }

    if (!isValidEmail(emailTrimmed)) {
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
      firstName: firstTrimmed,
      lastName: lastTrimmed,
      email: emailTrimmed,
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
        All fields marked with <span className="text-red-600">*</span> are required.
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-first" className="block text-sm font-medium text-slate-700">
              First name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="signup-first"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              aria-required="true"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              placeholder="Alex"
            />
          </div>
          <div>
            <label htmlFor="signup-last" className="block text-sm font-medium text-slate-700">
              Last name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="signup-last"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              aria-required="true"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              placeholder="Morgan"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
            Email <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-role" className="block text-sm font-medium text-slate-700">
            I am here to <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <select
            id="signup-role"
            name="role"
            required
            aria-required="true"
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
            Password <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700">
            Confirm password <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-required="true"
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
