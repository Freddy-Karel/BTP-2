import Link from "next/link";
import ClientForm from "@/components/admin/ClientForm";

export default function NouveauClientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/gestion-alliance/clients" className="text-sm font-medium text-muted hover:text-navy">
        ← Retour
      </Link>
      <h1 className="font-display text-2xl font-semibold text-navy">Nouveau client</h1>
      <ClientForm />
    </div>
  );
}
