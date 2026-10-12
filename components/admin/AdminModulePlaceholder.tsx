import Link from "next/link";

type Props = {
  title: string;
  description: string;
  nextHint?: string;
};

export default function AdminModulePlaceholder({
  title,
  description,
  nextHint = "L’édition complète arrive en Phase 2 : textes, images, CRUD.",
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Module
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-body text-muted">{description}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 shadow-rest">
        <p className="text-sm font-medium text-navy">{nextHint}</p>
        <p className="mt-2 text-sm text-muted">
          En attendant, le site public reste inchangé pour les visiteurs. Vous
          pouvez déjà suivre la fréquentation depuis la vue d’ensemble.
        </p>
        <Link
          href="/gestion-alliance"
          className="mt-6 inline-flex rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-mid"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
