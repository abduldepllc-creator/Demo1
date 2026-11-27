"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/actions/admin/auth";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, action, pending] = useActionState(login, {} as LoginState);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-navy">Username</label>
        <input id="username" name="username" autoComplete="username" required autoFocus className="input" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-navy">Password</label>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className="input pr-11!" />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-mist"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? <Loader2 className="size-5 animate-spin" /> : <LogIn className="size-5" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
