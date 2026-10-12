import QualityForm from "@/components/admin/QualityForm";
import { getQualityContent } from "@/lib/quality-content-server";

export default async function AdminHsePage() {
  const content = await getQualityContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green">
          Sécurité & qualité
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy">
          Piloter l&apos;engagement HSE
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Ajustez la méthode chantier, les piliers de sécurité, d&apos;hygiène et de
          qualité, puis publiez les changements sur la page d&apos;accueil.
        </p>
      </div>

      <QualityForm content={content} />
    </div>
  );
}
