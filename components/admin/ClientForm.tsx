"use client";

import { useActionState } from "react";
import {
  saveSiteClient,
  type ClientActionState,
} from "@/app/gestion-alliance/client-actions";
import type { SiteClientRow } from "@/lib/clients-server";
import ImageField from "@/components/admin/ImageField";

const initial: ClientActionState = {};

export default function ClientForm({ client }: { client?: SiteClientRow | null }) {
  const [state, action, pending] = useActionState(saveSiteClient, initial);

  const projectsText = (client?.projects ?? [])
    .map((p) => `${p.year} - ${p.description}`)
    .join("\n");

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest">
      {client ? <input type="hidden" name="id" value={client.id} /> : null}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={client?.name ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="short_name" className="mb-1.5 block text-sm font-medium text-navy">
            Nom court
          </label>
          <input
            id="short_name"
            name="short_name"
            defaultValue={client?.short_name ?? ""}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-navy">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={client?.slug ?? ""}
            placeholder="auto si vide"
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
      </div>

      <ImageField name="logo" defaultValue={client?.logo ?? ""} label="Logo (URL)" required={false} />

      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm font-medium text-navy">
          Résumé (fiche)
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={client?.summary ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="projects" className="mb-1.5 block text-sm font-medium text-navy">
          Travaux (une ligne : AAAA - description)
        </label>
        <textarea
          id="projects"
          name="projects"
          rows={6}
          defaultValue={projectsText}
          className="w-full rounded-xl border border-mist px-4 py-3 font-mono text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="sort_order" className="mb-1.5 block text-sm font-medium text-navy">
          Ordre
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={client?.sort_order ?? 0}
          className="w-full max-w-xs rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" name="featured" defaultChecked={client?.featured ?? false} className="h-4 w-4" />
        Client principal
      </label>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" name="published" defaultChecked={client?.published ?? true} className="h-4 w-4" />
        Publié
      </label>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary !py-3 text-sm disabled:opacity-60">
        {pending ? "Enregistrement…" : client ? "Mettre à jour" : "Ajouter le client"}
      </button>
    </form>
  );
}
