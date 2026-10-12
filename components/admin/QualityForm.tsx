"use client";

import { useActionState } from "react";
import {
  saveQualityContent,
  type QualityActionState,
} from "@/app/gestion-alliance/quality-actions";
import type { QualityContent } from "@/lib/quality-content";

const initial: QualityActionState = {};

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
          className={className}
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

export default function QualityForm({ content }: { content: QualityContent }) {
  const [state, action, pending] = useActionState(saveQualityContent, initial);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy">
            En-tête de section
          </h2>
          <p className="mt-1 text-sm text-muted">
            Ces textes alimentent directement la section publique Sécurité & qualité.
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
          Méthode chantier
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label="Libellé méthode"
            name="methodLabel"
            defaultValue={content.methodLabel}
          />
          <Field
            label="Titre méthode"
            name="methodTitle"
            defaultValue={content.methodTitle}
          />
        </div>
        <div className="mt-4">
          <Field
            label="Texte méthode"
            name="methodText"
            defaultValue={content.methodText}
            multiline
            rows={4}
          />
        </div>
        <div className="mt-4">
          <Field
            label="Étapes du processus (une par ligne)"
            name="process"
            defaultValue={content.process.join("\n")}
            multiline
            rows={5}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <h2 className="font-display text-lg font-semibold text-navy">
          Piliers HSE
        </h2>
        <div className="mt-5 grid gap-5">
          {content.pillars.map((pillar) => (
            <article key={pillar.id} className="rounded-2xl border border-mist bg-sand/70 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="Icône Lucide"
                  name={`${pillar.id}_icon`}
                  defaultValue={pillar.icon}
                />
                <Field
                  label="Titre"
                  name={`${pillar.id}_title`}
                  defaultValue={pillar.title}
                />
                <Field
                  label="Points (une ligne chacun)"
                  name={`${pillar.id}_items`}
                  defaultValue={pillar.items.join("\n")}
                  multiline
                  rows={4}
                />
              </div>
              <div className="mt-4">
                <Field
                  label="Texte descriptif"
                  name={`${pillar.id}_text`}
                  defaultValue={pillar.text}
                  multiline
                  rows={3}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-mist bg-white p-6 shadow-rest">
        <Field
          label="Phrase d'engagement"
          name="commitment"
          defaultValue={content.commitment}
          multiline
          rows={3}
        />
      </section>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
          Section HSE enregistrée et publiée.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : "Enregistrer la section HSE"}
      </button>
    </form>
  );
}
