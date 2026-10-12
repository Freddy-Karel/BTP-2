"use client";

import { useActionState } from "react";
import {
  saveContactContent,
  type SaveState,
} from "@/app/gestion-alliance/content-actions";
import type { ContactContent } from "@/lib/site-content";

const initial: SaveState = {};

function Field({
  label,
  name,
  defaultValue,
  hint,
  multiline,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-navy outline-none ring-green/30 transition focus:ring-2";
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          defaultValue={defaultValue}
          className={className}
          required
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          defaultValue={defaultValue}
          className={className}
          required
        />
      )}
      {hint ? <p className="mt-1 text-caption text-muted">{hint}</p> : null}
    </div>
  );
}

export default function ContactEditForm({ contact }: { contact: ContactContent }) {
  const [state, action, pending] = useActionState(saveContactContent, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-mist bg-white p-6 shadow-rest">
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">
          Coordonnées & section Contact
        </h2>
        <p className="mt-1 text-sm text-muted">
          Modifie l’email, WhatsApp, téléphones, adresse — immédiatement sur le site.
        </p>
      </div>

      <Field
        label="Titre de section"
        name="sectionTitle"
        defaultValue={contact.sectionTitle}
      />
      <Field
        label="Sous-titre"
        name="sectionSubtitle"
        defaultValue={contact.sectionSubtitle}
        multiline
      />
      <Field label="Email" name="email" defaultValue={contact.email} />
      <Field
        label="WhatsApp (chiffres seuls)"
        name="whatsapp"
        defaultValue={contact.whatsapp}
        hint="Ex. 24162712263 (sans + ni espaces)"
      />
      <Field label="Téléphone 1" name="phone1" defaultValue={contact.phone1} />
      <Field label="Téléphone 2" name="phone2" defaultValue={contact.phone2} />
      <Field
        label="ID page Facebook / Messenger"
        name="facebookPageId"
        defaultValue={contact.facebookPageId}
      />
      <Field label="Adresse" name="address" defaultValue={contact.address} />
      <Field
        label="Recherche carte Google"
        name="mapQuery"
        defaultValue={contact.mapQuery}
      />

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-green/20 bg-green-soft px-4 py-3 text-sm text-green">
          Enregistré — visible sur le site public.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Enregistrer le contact"}
      </button>
    </form>
  );
}
