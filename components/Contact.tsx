"use client";

import { FormEvent, useState } from "react";
import {
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useSiteContent } from "@/components/SiteContentProvider";
import {
  facebookMessengerUrlFrom,
  openWhatsApp,
  phoneTelHref,
  smsUrlFrom,
  whatsappAppUrlFrom,
  whatsappUrlFrom,
} from "@/lib/site-content";

function FacebookIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export default function Contact() {
  const { contact } = useSiteContent();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const formBody = () =>
    `Nom: ${form.name}\nTéléphone: ${form.phone}\n\n${form.message}`;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    openWhatsApp(contact.whatsapp, formBody());
    setStatus("sent");
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    contact.mapQuery,
  )}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contact.mapQuery,
  )}`;

  return (
    <section id="contact" className="relative overflow-hidden bg-mist/50 py-20 md:py-24">
      <div className="mx-auto max-w-[92rem] px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Contact</span>
          <h2 className="section-title">{contact.sectionTitle}</h2>
          <p className="mt-4 text-body-lg text-muted">
            {contact.sectionSubtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card-lift rounded-3xl border border-mist bg-white/95 p-5 shadow-sm backdrop-blur-sm md:p-7">
            <div className="rounded-2xl bg-navy p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green-bright">
                Demande rapide
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold">
                Envoyez votre besoin, nous vous recontactons.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Décrivez le chantier, le lieu et l&apos;urgence. Le message est
                préparé pour WhatsApp afin de faciliter la prise de contact.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-navy"
                >
                  Nom complet
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="w-full rounded-2xl border border-mist bg-white px-4 py-3 text-sm outline-none ring-green/30 transition focus:ring-2"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-semibold text-navy"
                >
                  Téléphone
                </label>
                <input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  className="w-full rounded-2xl border border-mist bg-white px-4 py-3 text-sm outline-none ring-green/30 transition focus:ring-2"
                  placeholder="+241 ..."
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-semibold text-navy"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                  className="w-full resize-none rounded-2xl border border-mist bg-white px-4 py-3 text-sm outline-none ring-green/30 transition focus:ring-2"
                  placeholder="Décrivez votre projet, le lieu et le délai souhaité..."
                />
              </div>

              <button type="submit" className="btn-primary w-full !py-3">
                <Send size={16} />
                Envoyer via WhatsApp
              </button>

              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href={smsUrlFrom(
                    contact.phone1,
                    form.message || "Bonjour ALLIANCE M.O BTP",
                  )}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-navy/5"
                >
                  <Phone size={15} />
                  SMS
                </a>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(
                    "Demande ALLIANCE M.O BTP",
                  )}&body=${encodeURIComponent(formBody())}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-navy/5"
                >
                  <Mail size={15} />
                  E-mail
                </a>
              </div>

              {status === "sent" && (
                <p className="rounded-xl bg-green-soft px-4 py-3 text-sm leading-relaxed text-navy">
                  Si WhatsApp ne s&apos;ouvre pas, utilisez SMS, e-mail ou appelez
                  directement.{" "}
                  <a
                    href={whatsappAppUrlFrom(contact.whatsapp, formBody())}
                    className="font-semibold text-green underline"
                  >
                    Réessayer l&apos;app
                  </a>
                  {" · "}
                  <a
                    href={whatsappUrlFrom(contact.whatsapp, formBody())}
                    className="font-semibold text-green underline"
                  >
                    Lien web
                  </a>
                </p>
              )}
            </form>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => openWhatsApp(contact.whatsapp)}
                className="flex items-center gap-4 rounded-2xl bg-green p-5 text-left text-white shadow-rest transition hover:bg-[#157525] hover:shadow-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <MessageCircle size={25} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">WhatsApp</p>
                  <p className="text-xs text-white/80">Réponse rapide</p>
                </div>
              </button>

              <a
                href={facebookMessengerUrlFrom(contact.facebookPageId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-[#1877F2] p-5 text-white shadow-rest transition hover:bg-[#166fe0] hover:shadow-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <FacebookIcon size={25} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">Facebook</p>
                  <p className="text-xs text-white/80">Ouvrir Messenger</p>
                </div>
              </a>
            </div>

            <div className="rounded-3xl border border-mist bg-white/95 p-5 shadow-sm backdrop-blur-sm md:p-6">
              <div className="flex flex-col gap-4 border-b border-mist pb-5 sm:flex-row sm:items-center sm:justify-between">
                <Logo variant="full" height={42} className="block" />
                <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-soft px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-green">
                  <Clock3 size={14} />
                  Contact direct
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-sand/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Phone size={19} />
                  </div>
                  <p className="font-semibold text-navy">Téléphone</p>
                  <a
                    href={phoneTelHref(contact.phone1)}
                    className="mt-1 block text-sm text-muted hover:text-green"
                  >
                    {contact.phone1}
                  </a>
                  <a
                    href={phoneTelHref(contact.phone2)}
                    className="block text-sm text-muted hover:text-green"
                  >
                    {contact.phone2}
                  </a>
                </div>

                <div className="rounded-2xl bg-sand/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
                    <Mail size={19} />
                  </div>
                  <p className="font-semibold text-navy">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1 block break-all text-sm text-muted hover:text-green"
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="rounded-2xl bg-sand/80 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-green">
                    <MapPin size={19} />
                  </div>
                  <p className="font-semibold text-navy">Adresse</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-mist bg-white shadow-rest">
              <div className="flex flex-col gap-3 border-b border-mist p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green">
                    Localisation
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-navy">
                    Ancienne Sobraga, Libreville
                  </h3>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-mid"
                >
                  <Navigation size={15} />
                  Ouvrir Maps
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="relative h-80 overflow-hidden bg-sand md:h-[24rem]">
                <iframe
                  title={`Carte - ${contact.address}`}
                  src={mapSrc}
                  className="h-full w-full border-0 grayscale-[12%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
