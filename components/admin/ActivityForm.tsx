"use client";

import { useActionState } from "react";
import {
  saveActivity,
  type ActivityActionState,
} from "@/app/gestion-alliance/activity-actions";
import { type ActivityContent } from "@/lib/activities-content";
import ImageField from "@/components/admin/ImageField";

const initial: ActivityActionState = {};

export default function ActivityForm({ activity }: { activity: ActivityContent }) {
  const [state, action, pending] = useActionState(saveActivity, initial);

  return (
    <form
      action={action}
      className="rounded-2xl border border-mist bg-white p-5 shadow-rest"
    >
      <input type="hidden" name="id" value={activity.id} />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <ImageField
          name="image"
          label="Image"
          defaultValue={activity.image}
          required
        />

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-title`}>
                Titre
              </label>
              <input
                id={`${activity.id}-title`}
                name="title"
                required
                defaultValue={activity.title}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-family`}>
                Famille métier
              </label>
              <input
                id={`${activity.id}-family`}
                name="family"
                defaultValue={activity.family}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-category`}>
                Domaine
              </label>
              <select
                id={`${activity.id}-category`}
                name="category"
                defaultValue={activity.category}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              >
                <option value="Bâtiments">Bâtiments</option>
                <option value="Travaux Publics">Travaux Publics</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-icon`}>
                Icône
              </label>
              <input
                id={`${activity.id}-icon`}
                name="icon"
                defaultValue={activity.icon}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-location`}>
                Localisation
              </label>
              <input
                id={`${activity.id}-location`}
                name="location"
                defaultValue={activity.location}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-sort`}>
                Ordre
              </label>
              <input
                id={`${activity.id}-sort`}
                name="sort_order"
                type="number"
                defaultValue={activity.sortOrder}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-short`}>
              Résumé carte
            </label>
            <input
              id={`${activity.id}-short`}
              name="short"
              defaultValue={activity.short}
              className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-detail`}>
              Description détaillée
            </label>
            <textarea
              id={`${activity.id}-detail`}
              name="detail"
              rows={3}
              defaultValue={activity.detail}
              className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-points`}>
                Points clés
              </label>
              <textarea
                id={`${activity.id}-points`}
                name="points"
                rows={4}
                defaultValue={activity.points.join("\n")}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-applications`}>
                Applications
              </label>
              <textarea
                id={`${activity.id}-applications`}
                name="applications"
                rows={4}
                defaultValue={activity.applications.join("\n")}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy" htmlFor={`${activity.id}-promise`}>
              Engagement
            </label>
            <textarea
              id={`${activity.id}-promise`}
              name="promise"
              rows={2}
              defaultValue={activity.promise}
              className="w-full rounded-xl border border-mist px-4 py-3 text-sm outline-none ring-green/30 focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                name="published"
                defaultChecked={activity.published}
                className="h-4 w-4 rounded border-mist"
              />
              Publié sur le site
            </label>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary !py-2.5 text-sm disabled:opacity-60"
            >
              {pending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>

          {state.error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          ) : null}
          {state.ok ? (
            <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
              Activité enregistrée.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
