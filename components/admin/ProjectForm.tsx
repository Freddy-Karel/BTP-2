"use client";

import { useActionState } from "react";
import {
  saveCatalogProject,
  type CatalogActionState,
} from "@/app/gestion-alliance/catalog-actions";
import type { CatalogProjectRow } from "@/lib/catalog-server";
import ImageField from "@/components/admin/ImageField";
import MultiImageField from "@/components/admin/MultiImageField";

const initial: CatalogActionState = {};

export default function ProjectForm({
  project,
}: {
  project?: CatalogProjectRow | null;
}) {
  const [state, action, pending] = useActionState(saveCatalogProject, initial);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest"
    >
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="title">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="location">
            Lieu
          </label>
          <input
            id="location"
            name="location"
            defaultValue={project?.location ?? "Libreville"}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="client">
            Client
          </label>
          <input
            id="client"
            name="client"
            defaultValue={project?.client ?? ""}
            placeholder="Ex. GONELEC, OCT, Particulier..."
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={project?.category ?? "batiments"}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          >
            <option value="batiments">Bâtiments</option>
            <option value="travaux">Travaux publics</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="year">
            Année
          </label>
          <input
            id="year"
            name="year"
            type="number"
            defaultValue={project?.year ?? new Date().getFullYear()}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="sort_order">
            Ordre
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
      </div>

      <ImageField name="image" defaultValue={project?.image ?? ""} />

      <MultiImageField
        name="images"
        label="Galerie du chantier"
        defaultValue={(project?.images ?? []).filter(
          (url) => url && url !== project?.image,
        )}
        helper="Ajoutez les photos complémentaires du chantier. L'image principale est incluse automatiquement."
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          placeholder="Description naturelle du chantier..."
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? true}
          className="h-4 w-4 rounded border-mist"
        />
        Publié sur le site
      </label>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : project ? "Mettre à jour" : "Ajouter le chantier"}
      </button>
    </form>
  );
}
