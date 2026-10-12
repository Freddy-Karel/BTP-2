"use client";

import { useActionState } from "react";
import {
  saveAboutContent,
  type SaveState,
} from "@/app/gestion-alliance/content-actions";
import type { AboutContent } from "@/lib/site-content";

const initial: SaveState = {};

export default function AboutEditForm({ about }: { about: AboutContent }) {
  const [state, action, pending] = useActionState(saveAboutContent, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest">
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">
          Section À propos
        </h2>
        <p className="mt-1 text-sm text-muted">Textes de la page d’accueil.</p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-navy">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={about.title}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="paragraph1" className="mb-1.5 block text-sm font-medium text-navy">
          Paragraphe 1
        </label>
        <textarea
          id="paragraph1"
          name="paragraph1"
          rows={4}
          required
          defaultValue={about.paragraph1}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="paragraph2" className="mb-1.5 block text-sm font-medium text-navy">
          Paragraphe 2
        </label>
        <textarea
          id="paragraph2"
          name="paragraph2"
          rows={3}
          required
          defaultValue={about.paragraph2}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="bullets" className="mb-1.5 block text-sm font-medium text-navy">
          Points clés (un par ligne)
        </label>
        <textarea
          id="bullets"
          name="bullets"
          rows={4}
          defaultValue={about.bullets.join("\n")}
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
          Enregistré — visible sur le site.
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary !py-3 text-sm disabled:opacity-60">
        {pending ? "Enregistrement…" : "Enregistrer À propos"}
      </button>
    </form>
  );
}
