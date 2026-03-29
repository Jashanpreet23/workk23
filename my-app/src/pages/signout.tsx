import { useEffect } from "react";
import { useRouter } from "next/router";

// clears login state and redirects to home
export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const wasLoggedIn = localStorage.getItem("vv_current_user") !== null;
    localStorage.removeItem("vv_current_user");
    router.push(wasLoggedIn ? "/?loggedout=true" : "/");
  }, [router]);

  return null;
}
