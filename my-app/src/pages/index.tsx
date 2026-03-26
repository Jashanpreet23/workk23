export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="text-xl font-bold tracking-tight text-indigo-700">
            VendorHub
          </a>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-6 text-sm font-medium text-slate-700">
              <li>
                <a href="#features" className="transition hover:text-indigo-700">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition hover:text-indigo-700">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#contact" className="transition hover:text-indigo-700">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Vendor Portal
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Manage your services with confidence.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              A clear and simple platform for vendors to publish offerings, review incoming
              requests, and track service status from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#how-it-works"
                className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Overview</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-700">
              <li className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span>Open requests</span>
                <strong className="text-indigo-700">12</strong>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span>In progress</span>
                <strong className="text-amber-600">7</strong>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span>Completed today</span>
                <strong className="text-emerald-600">18</strong>
              </li>
            </ul>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900">Core Features</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Service Listings</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create and update your services so clients always see accurate information.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Request Tracking</h3>
              <p className="mt-2 text-sm text-slate-600">
                Monitor each request status from submission through completion.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Performance Snapshot</h3>
              <p className="mt-2 text-sm text-slate-600">
                Quickly review activity and productivity with simple dashboard metrics.
              </p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-14">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            <ol className="mt-6 grid gap-5 text-sm text-slate-700 md:grid-cols-3">
              <li className="rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-indigo-700">Step 1</p>
                <p className="mt-2">Add your service details and set your availability.</p>
              </li>
              <li className="rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-indigo-700">Step 2</p>
                <p className="mt-2">Receive requests and update their progress in real time.</p>
              </li>
              <li className="rounded-xl border border-slate-200 p-5">
                <p className="font-semibold text-indigo-700">Step 3</p>
                <p className="mt-2">Complete jobs and keep a clear history for future planning.</p>
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} VendorHub. All rights reserved.</p>
          <p>Support: support@vendorhub.example</p>
        </div>
      </footer>
    </div>
  );
}
