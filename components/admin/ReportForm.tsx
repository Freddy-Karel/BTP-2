"use client";

import { useActionState } from "react";
import {
  saveCatalogReport,
  type CatalogActionState,
} from "@/app/gestion-alliance/catalog-actions";
import type { CatalogReportRow } from "@/lib/catalog-server";
import ImageField from "@/components/admin/ImageField";
import MultiImageField from "@/components/admin/MultiImageField";

const initial: CatalogActionState = {};

export default function ReportForm({
  report,
}: {
  report?: CatalogReportRow | null;
}) {
  const [state, action, pending] = useActionState(saveCatalogReport, initial);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest"
    >
      {report ? <input type="hidden" name="id" value={report.id} /> : null}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="title">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={report?.title ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={report?.slug ?? ""}
            placeholder="auto si vide"
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={report?.category ?? "batiments"}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          >
            <option value="batiments">Bâtiments</option>
            <option value="travaux">Travaux publics</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="client">
            Client
          </label>
          <input
            id="client"
            name="client"
            defaultValue={report?.client ?? "OCT"}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="client_slug">
            Slug client
          </label>
          <input
            id="client_slug"
            name="client_slug"
            defaultValue={report?.client_slug ?? "oct"}
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="location">
          Lieu
        </label>
        <input
          id="location"
          name="location"
          defaultValue={report?.location ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="objective">
          Objectif / description
        </label>
        <textarea
          id="objective"
          name="objective"
          rows={4}
          defaultValue={report?.objective ?? ""}
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="start_label">
            Début
          </label>
          <input
            id="start_label"
            name="start_label"
            defaultValue={report?.start_label ?? ""}
            placeholder="25/03/2026"
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
          <input type="hidden" name="start_date" defaultValue={report?.start_date ?? ""} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="end_label">
            Fin
          </label>
          <input
            id="end_label"
            name="end_label"
            defaultValue={report?.end_label ?? ""}
            placeholder="25/03/2026"
            className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
          />
          <input type="hidden" name="end_date" defaultValue={report?.end_date ?? ""} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="refs">
          Références administratives
        </label>
        <textarea
          id="refs"
          name="refs"
          rows={2}
          defaultValue={(report?.refs ?? []).join("\n")}
          placeholder="Une référence par ligne"
          className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <ImageField
        name="cover"
        defaultValue={report?.cover ?? ""}
        label="Image de couverture"
      />

      <MultiImageField
        name="before_images"
        label="Photos avant travaux"
        defaultValue={report?.before_images ?? []}
        helper="Ajoutez les photos documentant l'état initial du chantier."
      />

      <MultiImageField
        name="after_images"
        label="Photos après travaux"
        defaultValue={report?.after_images ?? []}
        helper="Ajoutez les photos documentant le résultat livré."
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor="sort_order">
          Ordre
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={report?.sort_order ?? 0}
          className="w-full max-w-xs rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          name="published"
          defaultChecked={report?.published ?? true}
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
        {pending ? "Enregistrement..." : report ? "Mettre à jour" : "Ajouter le rapport"}
      </button>
    </form>
  );
}
