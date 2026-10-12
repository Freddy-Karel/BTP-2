import ContactEditForm from "@/components/admin/ContactEditForm";
import { getSiteContent } from "@/lib/site-content-server";

export default async function AdminContactPage() {
  const content = await getSiteContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Contact
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">
          Coordonnées
        </h1>
        <p className="mt-2 max-w-2xl text-body text-muted">
          Mets à jour les infos affichées dans Contact, le footer et les boutons
          WhatsApp / Messenger.
        </p>
      </div>

      <ContactEditForm contact={content.contact} />
    </div>
  );
}
