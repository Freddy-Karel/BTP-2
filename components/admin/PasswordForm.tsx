"use client";

import { useActionState } from "react";
import {
  updateAdminPassword,
  type SettingsState,
} from "@/app/gestion-alliance/settings-actions";

const initial: SettingsState = {};

export default function PasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(updateAdminPassword, initial);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest"
    >
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">Compte</h2>
        <p className="mt-1 text-sm text-muted">Connecté : {email}</p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-navy"
        >
          Nouveau mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>
      <div>
        <label
          htmlFor="confirm"
          className="mb-1.5 block text-sm font-medium text-navy"
        >
          Confirmer
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
          Mot de passe mis à jour.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}
