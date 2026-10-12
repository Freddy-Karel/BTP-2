"use client";

import { useActionState } from "react";
import {
  saveMeansContent,
  type MeansActionState,
} from "@/app/gestion-alliance/means-actions";
import type { MeansContent } from "@/lib/means-content";

const initial: MeansActionState = {};

function Field({
  label,
  name,
  defaultValue,
  multiline = false,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue: string;
  multiline?: boolean;
  rows?: number;
}) {
  const className =
    "w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 transition focus:ring-2";

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          className={`${className} font-mono`}
          required
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className={className}
          required
        />
      )}
    </label>
  );
}

function JsonField({
  label,
  name,
  value,
  rows = 8,
}: {
  label: string;
  name: string;
  value: unknown;
  rows?: number;
}) {
  return (
    <Field
      label={label}
      name={name}
      defaultValue={JSON.stringify(value, null, 2)}
      multiline
      rows={rows}
    />
  );
}

export default function MeansForm({ content }: { content: MeansContent }) {
  const [state, action, pending] = useActionState(saveMeansContent, initial);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy">
            En-tête de section
          </h2>
          <p className="mt-1 text-sm text-muted">
            Présentation générale de l&apos;organisation et du matériel visible sur la page d&apos;accueil.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Libellé supérieur" name="eyebrow" defaultValue={content.eyebrow} />
          <Field label="Titre principal" name="title" defaultValue={content.title} />
        </div>
        <div className="mt-4">
          <Field
            label="Sous-titre"
            name="subtitle"
            defaultValue={content.subtitle}
            multiline
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">
          Indicateurs rapides
        </h2>
        <p className="mt-1 text-sm text-muted">
          Format attendu : tableau JSON avec label, value et icon.
        </p>
        <div className="mt-5">
          <JsonField label="Statistiques" name="stats" value={content.stats} rows={10} />
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">
          Organisation opérationnelle
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field
            label="Titre"
            name="organization_title"
            defaultValue={content.organization.title}
          />
          <Field
            label="Sous-titre"
            name="organization_subtitle"
            defaultValue={content.organization.subtitle}
          />
          <Field
            label="Badge"
            name="organization_badge"
            defaultValue={content.organization.badge}
          />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <JsonField
            label="Gérant"
            name="organization_manager"
            value={content.organization.manager}
            rows={7}
          />
          <JsonField
            label="Ouvriers"
            name="organization_workers"
            value={content.organization.workers}
            rows={7}
          />
          <JsonField
            label="Niveau 2"
            name="organization_level2"
            value={content.organization.level2}
            rows={12}
          />
          <JsonField
            label="Niveau 3"
            name="organization_level3"
            value={content.organization.level3}
            rows={12}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">
          Parc matériel
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field
            label="Titre"
            name="equipment_title"
            defaultValue={content.equipment.title}
          />
          <Field
            label="Badge"
            name="equipment_badge"
            defaultValue={content.equipment.badge}
          />
          <Field
            label="Mention propriétaire"
            name="equipment_ownerLabel"
            defaultValue={content.equipment.ownerLabel}
          />
        </div>
        <div className="mt-5">
          <JsonField
            label="Groupes de matériel"
            name="equipment_groups"
            value={content.equipment.groups}
            rows={22}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">
          Garantie opérationnelle
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label="Libellé"
            name="guaranteeLabel"
            defaultValue={content.guaranteeLabel}
          />
          <Field
            label="Titre"
            name="guaranteeTitle"
            defaultValue={content.guaranteeTitle}
          />
        </div>
        <div className="mt-4">
          <Field
            label="Engagements (un par ligne)"
            name="commitments"
            defaultValue={content.commitments.join("\n")}
            multiline
            rows={4}
          />
        </div>
      </section>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
          Section Moyens enregistrée et publiée.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer la section Moyens"}
      </button>
    </form>
  );
}
