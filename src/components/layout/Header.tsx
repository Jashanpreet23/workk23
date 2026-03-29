import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { User } from "@/data/seedData";
import { AUTH_CHANGED_EVENT, readSessionUser } from "@/data/seedData";

export default function Header() {
  const router = useRouter();
  const [session, setSession] = useState<User | null>(null);

  useEffect(() => {
    const sync = () => setSession(readSessionUser());

    sync();
    const onRoute = () => sync();
    router.events.on("routeChangeComplete", onRoute);
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => {
      router.events.off("routeChangeComplete", onRoute);
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGED_EVENT, sync);
    };
  }, [router]);

  const welcomeName = session?.name?.trim() || "";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="rounded-md outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Venue Vendors
          </p>
          <h1 className="text-lg font-bold text-slate-900">
            Find &amp; book event spaces
          </h1>
        </Link>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {session && welcomeName && (
            <p className="text-sm text-slate-600">
              Welcome,{" "}
              <span className="font-semibold text-slate-900">{welcomeName}</span>
            </p>
          )}

          <nav aria-label="Main navigation">
            <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
              <li>
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Home
                </Link>
              </li>
              {!session && (
                <>
                  <li>
                    <Link
                      href="/signup"
                      className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Sign up
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signin"
                      className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Sign in
                    </Link>
                  </li>
                </>
              )}
              {session && (
                <li>
                  <Link
                    href="/signout"
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Sign out
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
