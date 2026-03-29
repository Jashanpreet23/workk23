import Link from "next/link";

type QuickStat = {
  label: string;
  value: string;
};

const quickStats: QuickStat[] = [
  { label: "Venues on the network", value: "120+" },
  { label: "Events supported this year", value: "2.4k" },
  { label: "Average reply time", value: "Under 24h" },
];

const forHosts: string[] = [
  "Browse spaces by capacity, location, and vibe—not endless email threads",
  "Submit one structured request with your date, guest count, and event details",
  "Track shortlists and confirmations in a single place",
];

const forVenues: string[] = [
  "See serious enquiries with the context you need to respond fast",
  "Review applicant history and notes from past bookings",
  "Accept the right events and keep your calendar under control",
];

export default function CommonHomeMain() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:px-8">
      <section className="rounded-2xl bg-slate-900 px-6 py-10 text-white shadow-lg lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Melbourne &amp; surrounds
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          The calmer way to hire a venue for your next event.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
          Venue Vendors connects people planning weddings, corporate functions, and community events
          with spaces that want to host them—clear applications, faster decisions, less back-and-forth.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Create free account
          </Link>
          <Link
            href="/signin"
            className="inline-flex rounded-lg border border-slate-500 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {quickStats.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Planning an event?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Whether it is an intimate dinner or a full-scale celebration, we help you move from idea to
            confirmed venue without the chaos.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {forHosts.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Own or manage a venue?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Spend less time qualifying leads and more time hosting great events. We surface the
            details you care about up front.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {forVenues.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/60 p-6 lg:p-8">
        <h3 className="text-lg font-semibold text-slate-900">Why hosts and venues use Venue Vendors</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          One platform for enquiries, profiles, and next steps—so everyone knows where things stand.
          Built for real events in the real world: clear expectations, respectful timelines, and room to
          grow as your plans do.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          New here?{" "}
          <Link href="/signup" className="font-medium text-sky-700 underline-offset-2 hover:underline">
            Join in a minute
          </Link>
          {" · "}
          <Link href="/signin" className="font-medium text-sky-700 underline-offset-2 hover:underline">
            Already a member? Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
