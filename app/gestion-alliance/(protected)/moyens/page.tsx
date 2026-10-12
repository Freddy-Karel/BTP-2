import MeansForm from "@/components/admin/MeansForm";
import { getMeansContent } from "@/lib/means-content-server";

export default async function AdminMeansPage() {
  const content = await getMeansContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green">
          Moyens
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy">
          Organisation & matériel
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Mettez à jour les effectifs, l&apos;organigramme, les équipements et les
          engagements opérationnels présentés sur le site public.
        </p>
      </div>

      <MeansForm content={content} />
    </div>
  );
}
