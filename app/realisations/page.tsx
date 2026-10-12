import type { Metadata } from "next";
import { Suspense } from "react";
import RealisationsCatalog from "@/components/RealisationsCatalog";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getSiteContent } from "@/lib/site-content-server";
import {
  getCatalogProjects,
  getCatalogReports,
} from "@/lib/catalog-server";
import { getSiteClients } from "@/lib/clients-server";

export const metadata: Metadata = {
  title: "Catalogue de réalisations | ALLIANCE M.O BTP",
  description:
    "Découvrez l'ensemble des chantiers et références d'ALLIANCE M.O BTP à Libreville et au Gabon — bâtiments et travaux publics.",
};

export default async function RealisationsPage() {
  const [content, projects, reports, clients] = await Promise.all([
    getSiteContent(),
    getCatalogProjects(),
    getCatalogReports(),
    getSiteClients(),
  ]);

  return (
    <SiteContentProvider value={content}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-navy text-white/70">
            Chargement du catalogue…
          </div>
        }
      >
        <RealisationsCatalog
          projects={projects}
          reports={reports}
          clients={clients}
        />
      </Suspense>
    </SiteContentProvider>
  );
}
