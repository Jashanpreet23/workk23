import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// placeholder page for the vendor dashboard (built out later)
export default function VendorDashboard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // hide the welcome banner after 3 seconds
  useEffect(() => {
    if (router.query.welcome === "true") {
      const timer = setTimeout(() => setDismissed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query.welcome]);

  const showWelcome = router.query.welcome === "true" && !dismissed;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:px-8">
      {showWelcome && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Signed in successfully
        </div>
      )}
      <h2 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h2>
      <p className="mt-2 text-sm text-slate-500">
        This page is under construction. Applicant management and booking approvals will go here.
      </p>
    </main>
  );
}
