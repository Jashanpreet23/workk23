import Link from "next/link";

// sign-up isn't implemented yet, just a placeholder for now
export default function SignUp() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Sign up</h2>
      <p className="mt-2 text-sm text-slate-500">
        Sign-ups arent available right now
      </p>

      <Link
        href="/signin"
        className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
      >
        Sign in instead
      </Link>
    </main>
  );
}
