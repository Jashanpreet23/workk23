import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  clearPersistedCurrentUser,
  hasPersistedCurrentUser,
  notifyAuthChanged,
} from "@/data/seedData";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const wasLoggedIn = hasPersistedCurrentUser();
    clearPersistedCurrentUser();
    notifyAuthChanged();
    router.push(wasLoggedIn ? "/?loggedout=true" : "/");
  }, [router]);

  return null;
}
