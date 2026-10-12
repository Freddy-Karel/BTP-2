import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import {
  deleteCatalogProject,
  deleteCatalogReport,
} from "@/app/gestion-alliance/catalog-actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import {
  getAdminCatalogProjects,
  getAdminCatalogReports,
} from "@/lib/catalog-server";
import { categoryLabel } from "@/lib/projects";

export default async function AdminRealisationsPage() {
  const [projects, reports] = await Promise.all([
    getAdminCatalogProjects(),
    getAdminCatalogReports(),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-green">
            Catalogue
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
            Réalisations
          </h1>
          <p className="mt-2 max-w-2xl text-body text-muted">
            Ajoute, modifie ou supprime les chantiers clients et les rapports
            OCT. Les changements s’affichent sur le site public.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/gestion-alliance/realisations/chantier/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid"
          >
            <Plus size={16} />
            Chantier
          </Link>
          <Link
            href="/gestion-alliance/realisations/rapport/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-bright"
          >
            <Plus size={16} />
            Rapport OCT
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-navy">
          Chantiers clients ({projects.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-mist bg-white shadow-rest">
          <ul className="divide-y divide-mist">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-mist">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{p.title}</p>
                  <p className="text-caption text-muted">
                    {categoryLabel[p.category]} · {p.location} · {p.year}
                    {!p.published ? " · Brouillon" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/gestion-alliance/realisations/chantier/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-mist px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                  >
                    <Pencil size={14} />
                    Modifier
                  </Link>
                  <ConfirmDeleteButton
                    action={deleteCatalogProject}
                    id={p.id}
                    message="Supprimer ce chantier ?"
                  />
                </div>
              </li>
            ))}
            {projects.length === 0 ? (
              <li className="p-6 text-sm text-muted">Aucun chantier.</li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-navy">
          Rapports OCT ({reports.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-mist bg-white shadow-rest">
          <ul className="divide-y divide-mist">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-mist">
                  {r.cover ? (
                    <Image
                      src={r.cover}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{r.title}</p>
                  <p className="text-caption text-muted">
                    {r.client} · {categoryLabel[r.category]} · {r.location}
                    {!r.published ? " · Brouillon" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/gestion-alliance/realisations/rapport/${r.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-mist px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                  >
                    <Pencil size={14} />
                    Modifier
                  </Link>
                  <ConfirmDeleteButton
                    action={deleteCatalogReport}
                    id={r.id}
                    message="Supprimer ce rapport ?"
                  />
                </div>
              </li>
            ))}
            {reports.length === 0 ? (
              <li className="p-6 text-sm text-muted">Aucun rapport.</li>
            ) : null}
          </ul>
        </div>
      </section>
    </div>
  );
}
