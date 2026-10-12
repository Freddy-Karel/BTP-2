import Link from "next/link";
import ReportForm from "@/components/admin/ReportForm";

export default function NouveauRapportPage() {
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
          Nouveau rapport OCT
        </h1>
      </div>
      <ReportForm />
    </div>
  );
}
