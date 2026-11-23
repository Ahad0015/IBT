// src/app/signin/SignInForm.js
"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions";

const initialState = { message: "", email: "" };

export default function SignInForm({ next }) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-sm">
      <input type="hidden" name="next" value={next} />
      <input name="email" type="email" placeholder="Email" autoComplete="email"
        defaultValue={state.email} className="border p-2" />
      <input name="password" type="password" placeholder="Password"
        autoComplete="current-password" className="border p-2" />
      <button disabled={isPending} className="bg-green-700 text-white p-2 rounded">
        {isPending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-red-600">{state.message}</p>
    </form>
  );
}