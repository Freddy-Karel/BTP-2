import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NouveauChantierPage() {
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
          Nouveau chantier
        </h1>
      </div>
      <ProjectForm />
    </div>
  );
}
