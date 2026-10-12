import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getCatalogProjectById } from "@/lib/catalog-server";

type Props = { params: Promise<{ id: string }> };

export default async function EditChantierPage({ params }: Props) {
  const { id } = await params;
  const project = await getCatalogProjectById(Number(id));
  if (!project) notFound();

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
          Modifier le chantier
        </h1>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
