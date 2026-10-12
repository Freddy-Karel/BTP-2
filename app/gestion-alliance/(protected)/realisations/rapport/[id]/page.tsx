import Link from "next/link";
import { notFound } from "next/navigation";
import ReportForm from "@/components/admin/ReportForm";
import { getCatalogReportById } from "@/lib/catalog-server";

type Props = { params: Promise<{ id: string }> };

export default async function EditRapportPage({ params }: Props) {
  const { id } = await params;
  const report = await getCatalogReportById(id);
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/gestion-alliance/realisations"
          className="text-sm font-medium text-muted hover:text-navy"
        >
          ← Retour au catalogue
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold text-navy">
          Modifier le rapport
        </h1>
      </div>
      <ReportForm report={report} />
    </div>
  );
}
