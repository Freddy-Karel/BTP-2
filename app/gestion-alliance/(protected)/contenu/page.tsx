import Link from "next/link";
import HeroEditForm from "@/components/admin/HeroEditForm";
import AboutEditForm from "@/components/admin/AboutEditForm";
import { getSiteContent } from "@/lib/site-content-server";

export default async function AdminContenuPage() {
  const content = await getSiteContent();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Contenu
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
          Textes du site
        </h1>
        <p className="mt-2 max-w-2xl text-body text-muted">
          Modifie Accueil et À propos. Contact →{" "}
          <Link href="/gestion-alliance/contact" className="font-semibold text-navy underline">
            module Contact
          </Link>
          .
        </p>
      </div>

      <HeroEditForm hero={content.hero} />
      <AboutEditForm about={content.about} />
    </div>
  );
}
