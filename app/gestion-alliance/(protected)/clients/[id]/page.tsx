import Link from "next/link";
import { notFound } from "next/navigation";
import ClientForm from "@/components/admin/ClientForm";
import { getSiteClientById } from "@/lib/clients-server";

type Props = { params: Promise<{ id: string }> };

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;
  const client = await getSiteClientById(id);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/gestion-alliance/clients" className="text-sm font-medium text-muted hover:text-navy">
        ← Retour
      </Link>
      <h1 className="font-display text-2xl font-semibold text-navy">Modifier le client</h1>
      <ClientForm client={client} />
    </div>
  );
}
