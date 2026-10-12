import ActivityForm from "@/components/admin/ActivityForm";
import { getSiteActivities } from "@/lib/activities-content-server";

export default async function AdminActivitiesPage() {
  const activities = await getSiteActivities();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-green">
          Activités
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy md:text-3xl">
          Savoir-faire public
        </h1>
        <p className="mt-2 max-w-3xl text-body text-muted">
          Modifie les cartes et fiches détaillées de la section Activités :
          textes, image, famille métier, points clés, applications, ordre et
          publication.
        </p>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => (
          <ActivityForm key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
