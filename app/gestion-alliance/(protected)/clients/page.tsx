import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { deleteSiteClient } from "@/app/gestion-alliance/client-actions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { getAdminSiteClients } from "@/lib/clients-server";

export default async function AdminClientsPage() {
  const clients = await getAdminSiteClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-green">
            Clients
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
            Références clients
          </h1>
          <p className="mt-2 max-w-2xl text-body text-muted">
            Logos, fiches et listes de travaux affichés sur le site.
          </p>
        </div>
        <Link
          href="/gestion-alliance/clients/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid"
        >
          <Plus size={16} />
          Nouveau client
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mist bg-white shadow-rest">
        <ul className="divide-y divide-mist">
          {clients.map((c) => (
            <li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-mist bg-sand">
                {c.logo ? (
                  <Image src={c.logo} alt="" width={80} height={40} className="object-contain" />
                ) : (
                  <span className="text-caption font-bold text-navy/50">{c.short_name}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">
                  {c.name}
                  {c.featured ? (
                    <span className="ml-2 rounded-md bg-green-soft px-2 py-0.5 text-caption font-bold text-green">
                      Principal
                    </span>
                  ) : null}
                </p>
                <p className="text-caption text-muted">
                  {c.projects?.length ?? 0} travaux · /{c.slug}
                  {!c.published ? " · Brouillon" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/gestion-alliance/clients/${c.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-mist px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                >
                  <Pencil size={14} />
                  Modifier
                </Link>
                <ConfirmDeleteButton
                  action={deleteSiteClient}
                  id={c.id}
                  message="Supprimer ce client ?"
                />
              </div>
            </li>
          ))}
          {clients.length === 0 ? (
            <li className="p-6 text-sm text-muted">Aucun client.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
