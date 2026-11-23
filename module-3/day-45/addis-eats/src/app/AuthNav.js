
// src/app/AuthNav.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { signOut } from "@/app/actions";

export default function AuthNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, mutate } = useSWR("/api/me", fetcher);

  // Re-check who is signed in after every navigation (for example after sign-in).
  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  async function handleSignOut() {
    await signOut();
    await mutate({ user: null }, false);
    router.push("/");
    router.refresh();
  }

  if (!data) return null;

  if (!data.user) {
    return <Link href="/signin" className="hover:underline">Sign in</Link>;
  }

  return (
    <>
      {data.user.role === "staff" && (
        <Link href="/kitchen" className="hover:underline">Kitchen</Link>
      )}
      <span>Hi, {data.user.name}</span>
      <button onClick={handleSignOut} className="hover:underline">Sign out</button>
    </>
  );
}