type QuickStat = {
  label: string;
  value: string;
};

const quickStats: QuickStat[] = [
  { label: "Registered venues", value: "42" },
  { label: "Total applications", value: "128" },
  { label: "Confirmed bookings", value: "67" },
];

const platformFeatures: string[] = [
  "Simple sign-in entry point for approved users",
  "Structured event application workflow",
  "Transparent shortlist and booking confirmation process",
  "Client-side data persistence with localStorage",
];

const systemHighlights: string[] = [
  "Responsive layout for desktop, tablet, and mobile devices",
  "Clear page structure with header, content sections, and footer",
  "Professional copy focused on event venue hiring",
  "Designed for iterative implementation in later assignment parts",
];

export default function CommonHomeMain() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:px-8">
      <section className="rounded-2xl bg-slate-900 px-6 py-10 text-white shadow-sm lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          Welcome
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
          Venue Vendors: a common starting point for all users.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
          This landing page introduces the Venue Vendors system, where event
          applications and venue bookings are managed in one streamlined
          workflow. Role-specific experiences can be added in later milestones.
        </p>
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
          <h3 className="text-xl font-semibold text-slate-900">
            Platform Features
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Core capabilities available in the current prototype:
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {platformFeatures.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            Design Highlights
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Important qualities of this home page implementation:
          </p>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {systemHighlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Assignment note</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          This prototype is fully client-side with React + TypeScript and stores
          temporary data in localStorage only. No database or external REST API
          is used at this stage.
        </p>
      </section>
    </main>
  );
}
