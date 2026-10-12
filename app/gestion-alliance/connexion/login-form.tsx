"use client";

import { useActionState } from "react";
import { loginAdmin, type AuthState } from "../actions";

const initial: AuthState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-navy"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 transition focus:ring-2"
          placeholder="admin@exemple.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-navy"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 transition focus:ring-2"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
