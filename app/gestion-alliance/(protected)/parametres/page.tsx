import Link from "next/link";
import PasswordForm from "@/components/admin/PasswordForm";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth/local-admin";
import { hasDatabaseUrl } from "@/lib/db/postgres";

export default async function AdminParametresPage() {
  let email = "Admin";

  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    email = session?.email ?? email;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    email = typeof data?.claims?.email === "string" ? data.claims.email : email;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Paramètres
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy md:text-3xl">
          Administration
        </h1>
        <p className="mt-2 text-body text-muted">
          Sécurité du compte et accès. Connexion :{" "}
          <code className="rounded bg-mist px-1.5 py-0.5 text-sm">
            /gestion-alliance/connexion
          </code>
        </p>
      </div>

      <PasswordForm email={email} />

      <div className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">Rappels</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Aucun bouton connexion n&apos;apparaît pour les visiteurs.</li>
          <li>
            Une fois connecté, le bouton <strong>Administration</strong> est dans
            le header du site.
          </li>
          <li>
            Contenu · Contact · Réalisations · Clients · Médias sont éditables
            depuis le menu.
          </li>
          <li>
            En local, l&apos;admin utilise PostgreSQL. En hébergement, il basculera
            vers Supabase lorsque les variables publiques Supabase seront présentes.
          </li>
        </ul>
        <Link
          href="/gestion-alliance"
          className="mt-5 inline-flex rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid"
        >
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}
