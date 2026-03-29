import { useEffect } from "react";
import { useRouter } from "next/router";
import { notifyAuthChanged } from "@/data/seedData";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const wasLoggedIn = localStorage.getItem("vv_current_user") !== null;
    localStorage.removeItem("vv_current_user");
    notifyAuthChanged();
    router.push(wasLoggedIn ? "/?loggedout=true" : "/");
  }, [router]);

  return null;
}
