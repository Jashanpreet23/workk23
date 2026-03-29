import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CommonHomeMain from "@/components/home/CommonHomeMain";

/* Renders the landing page content inside the shared layout */
export default function Home() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // hide the logged out banner after 3 seconds
  useEffect(() => {
    if (router.query.loggedout === "true") {
      const timer = setTimeout(() => setDismissed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query.loggedout]);

  const showLoggedOut = router.query.loggedout === "true" && !dismissed;

  return (
    <>
      {showLoggedOut && (
        <div className="mx-auto mt-4 w-full max-w-6xl px-6 lg:px-8">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            You have been signed out.
          </div>
        </div>
      )}
      <CommonHomeMain />
    </>
  );
}
