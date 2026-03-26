import Link from "next/link";

type HeaderProps = {
  links: Array<{ label: string; href: string }>;
};

export default function Header({ links }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Venue Vendors
          </p>
          <h1 className="text-lg font-bold text-slate-900">
            Event Venue Hiring Portal
          </h1>
        </div>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
