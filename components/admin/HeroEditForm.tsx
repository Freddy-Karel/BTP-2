"use client";

import { useActionState } from "react";
import {
  saveHeroContent,
  type SaveState,
} from "@/app/gestion-alliance/content-actions";
import type { HeroContent } from "@/lib/site-content";

const initial: SaveState = {};

function Field({
  label,
  name,
  defaultValue,
  multiline,
}: {
  label: string;
  name: string;
  defaultValue: string;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 transition focus:ring-2";
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={defaultValue}
          className={className}
          required
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          defaultValue={defaultValue}
          className={className}
          required
        />
      )}
    </div>
  );
}

export default function HeroEditForm({ hero }: { hero: HeroContent }) {
  const [state, action, pending] = useActionState(saveHeroContent, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest">
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">
          Section Accueil (Hero)
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ces textes s’affichent sur la page d’accueil publique.
        </p>
      </div>

      <Field label="Nom de marque" name="brandLabel" defaultValue={hero.brandLabel} />
      <Field label="Titre — ligne 1" name="titleLine1" defaultValue={hero.titleLine1} />
      <Field label="Titre — ligne 2 (verte)" name="titleLine2" defaultValue={hero.titleLine2} />
      <Field label="Sous-titre" name="subtitle" defaultValue={hero.subtitle} multiline />
      <Field label="Ligne métiers" name="locationLine" defaultValue={hero.locationLine} />
      <Field label="Ville / pays" name="cityLine" defaultValue={hero.cityLine} />

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
          Enregistré — visible sur le site public.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer l’accueil"}
      </button>
    </form>
  );
}
