import Image from "next/image";
import { CheckCircle2, ImageIcon, RotateCcw } from "lucide-react";
import { saveImageAsset } from "@/app/gestion-alliance/image-actions";
import ImageField from "@/components/admin/ImageField";
import { IMAGE_STATUS_LABEL } from "@/lib/image-assets";
import { getAdminImageAssets } from "@/lib/image-assets-server";

export default async function ProvisionalImagesPage() {
  const assets = await getAdminImageAssets();
  const replacedCount = assets.filter((asset) => asset.replacement_url).length;
  const replaceCount = assets.filter((asset) => asset.status === "replace").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-green">
            Images provisoires
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-navy md:text-3xl">
            Remplacements publics
          </h1>
          <p className="mt-2 max-w-3xl text-body text-muted">
            Remplace les visuels illustratifs utilisés sur le site public lorsque
            les photos définitives du propriétaire sont disponibles. Les images
            de réalisations et de rapports restent modifiables dans le module
            Réalisations.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-mist bg-white p-5 shadow-rest">
          <p className="text-caption text-muted">Images suivies</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy">
            {assets.length}
          </p>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-5 shadow-rest">
          <p className="text-caption text-muted">Remplacées</p>
          <p className="mt-2 font-display text-3xl font-semibold text-green">
            {replacedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-5 shadow-rest">
          <p className="text-caption text-muted">À remplacer</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy">
            {replaceCount}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {assets.map((asset) => (
          <form
            key={asset.key}
            action={saveImageAsset}
            className="rounded-2xl border border-mist bg-white p-5 shadow-rest"
          >
            <input type="hidden" name="key" value={asset.key} />
            <input type="hidden" name="area" value={asset.area} />
            <input type="hidden" name="label" value={asset.label} />
            <input type="hidden" name="original_url" value={asset.original_url} />
            <input type="hidden" name="sort_order" value={asset.sort_order} />

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-green-soft px-2 py-1 text-caption font-bold uppercase tracking-wide text-green">
                    {asset.area}
                  </span>
                  <span className="rounded-md bg-sand px-2 py-1 text-caption font-semibold text-navy/70">
                    {IMAGE_STATUS_LABEL[asset.status]}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold text-navy">
                  {asset.label}
                </h2>
                <p className="mt-1 break-all text-xs text-muted">{asset.key}</p>
              </div>

              <label className="shrink-0">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                  Statut
                </span>
                <select
                  name="status"
                  defaultValue={asset.status}
                  className="rounded-xl border border-mist bg-white px-3 py-2 text-sm font-medium text-navy outline-none ring-green/30 focus:ring-2"
                >
                  <option value="provisional">Provisoire</option>
                  <option value="replace">À remplacer</option>
                  <option value="validated">Validée</option>
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-navy">
                  Image actuelle
                </p>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist">
                  <Image
                    src={asset.effective_url}
                    alt={asset.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                  {asset.replacement_url ? (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-green px-2 py-1 text-caption font-bold text-white">
                      <CheckCircle2 size={13} />
                      Remplacée
                    </span>
                  ) : (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-navy/80 px-2 py-1 text-caption font-bold text-white">
                      <ImageIcon size={13} />
                      Provisoire
                    </span>
                  )}
                </div>
              </div>

              <ImageField
                name="replacement_url"
                label="Nouvelle image"
                defaultValue={asset.replacement_url ?? ""}
                required={false}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-mist pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-caption text-muted">
                Laisse le champ vide pour revenir à l&apos;image provisoire
                d&apos;origine.
              </p>
              <div className="flex gap-2">
                {asset.replacement_url ? (
                  <button
                    type="submit"
                    name="reset"
                    value="1"
                    className="inline-flex items-center gap-2 rounded-xl border border-mist px-3 py-2 text-sm font-semibold text-navy transition hover:bg-navy/5"
                  >
                    <RotateCcw size={15} />
                    Réinitialiser
                  </button>
                ) : null}
                <button type="submit" className="btn-primary !py-2.5 text-sm">
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
