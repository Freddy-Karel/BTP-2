"use client";

import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Handshake,
  Quote,
  Shield,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { scrollToSection } from "@/lib/navigation";
import { useSiteContent } from "@/components/SiteContentProvider";

const values = [
  {
    icon: Wrench,
    title: "Savoir-faire",
  },
  {
    icon: Shield,
    title: "Discipline",
  },
  {
    icon: Handshake,
    title: "Engagement",
  },
  {
    icon: Target,
    title: "Responsabilité",
  },
  {
    icon: Sparkles,
    title: "Efficacité",
  },
];

export default function About() {
  const { about } = useSiteContent();
  const go = (hash: string) => {
    scrollToSection(hash);
  };

  return (
    <section id="apropos" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <span className="section-label">À propos</span>
            <h2 className="section-title">{about.title}</h2>
            <p className="text-body-lg text-muted">{about.paragraph1}</p>
            <p className="text-body text-muted">{about.paragraph2}</p>

            <ul className="space-y-2.5 pt-2">
              {about.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-ink">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-green"
                    size={18}
                  />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => go("#contact")}
              className="btn-outline mt-2"
            >
              Parler de votre projet
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative">
            <div className="group overflow-hidden rounded-2xl shadow-rest">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=1100&fit=crop&q=80"
                alt="Équipe BTP sur chantier au Gabon"
                width={900}
                height={1100}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="img-zoom aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-mist bg-white/90 p-4 shadow-hover backdrop-blur-sm md:left-auto md:right-[-0.75rem] md:w-64">
              <p className="text-xs font-semibold uppercase tracking-wider text-green">
                Identité
              </p>
              <p className="mt-1 text-sm font-semibold text-navy">
                NIF 2024 0100 1098 N
              </p>
              <p className="text-xs text-muted">
                RCCM GA-LBV-01-2024-B13-00042
              </p>
            </div>
          </div>
        </div>

        {/* Philosophie + Valeurs — lecture fluide, sans surcharge */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-10">
            <Quote
              className="absolute -right-2 -top-2 text-white/10"
              size={120}
              aria-hidden
            />
            <span className="section-label !text-green-bright">
              Notre philosophie
            </span>
            <p className="relative mt-5 font-display text-2xl font-semibold leading-snug text-balance md:text-[1.75rem]">
              Des réalisations de qualité dans la sécurité pour la satisfaction
              du client.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-7 md:p-8">
            <span className="section-label !mt-0">Nos valeurs</span>
            <p className="mt-3 text-sm text-muted">
              Cinq piliers qui guident chaque chantier.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <li
                    key={value.title}
                    className="inline-flex items-center gap-2 rounded-lg border border-mist bg-sand px-3.5 py-2 text-sm font-semibold text-navy transition hover:border-green/25 hover:bg-green-soft"
                  >
                    <Icon size={15} className="text-green" />
                    {value.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
