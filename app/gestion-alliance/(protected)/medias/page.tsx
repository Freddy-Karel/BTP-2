import { listCatalogueMedia } from "@/app/gestion-alliance/media-actions";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default async function AdminMediasPage() {
  const items = await listCatalogueMedia();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Médias
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
          Bibliothèque d’images
        </h1>
        <p className="mt-2 max-w-2xl text-body text-muted">
          Téléverse, copie l’URL et colle-la dans les formulaires Catalogue / Clients /
          Contenu.
        </p>
      </div>
      <MediaLibrary initial={items} />
    </div>
  );
}
