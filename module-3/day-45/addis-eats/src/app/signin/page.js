// src/app/signin/page.js
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import SignInForm from "./SignInForm";

// src/app/signin/page.js
export const metadata = {
  title: "Sign in",
  description: "Sign in to place and track your Addis Eats orders.",
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }) {
  const { next } = await searchParams;
  const safe = safeNext(next);

  if (await getSession()) redirect(safe); // already signed in

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <SignInForm next={safe} />
      <p className="mt-6 text-sm text-stone-500">
        Demo accounts: hana@example.com / hana-pass-123, dawit@example.com /
        dawit-pass-123, kitchen@example.com / kitchen-pass-123 (staff)
      </p>
    </main>
  );
}