"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { scrollToSection } from "@/lib/navigation";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function Hero({ chantierCount = 0 }: { chantierCount?: number }) {
  const { hero } = useSiteContent();
  const go = (hash: string) => {
    scrollToSection(hash);
  };

  return (
    <section
      id="accueil"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop&q=80"
          alt="Chantier de construction moderne"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/82 to-navy/50" />
        <div className="hero-grid absolute inset-0 opacity-25" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[92rem] gap-12 px-4 py-28 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div className="space-y-7">
          <p className="animate-fade-up flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-white/70">
            <MapPin size={15} className="shrink-0 text-green-bright" />
            <span>{hero.locationLine}</span>
            <span className="hidden text-white/35 sm:inline" aria-hidden>
              —
            </span>
            <span className="text-white/55">{hero.cityLine}</span>
          </p>

          <div className="animate-fade-up-delay-1">
            <span className="section-label !text-green-bright">Accueil</span>
            <p className="mb-3 mt-4 font-display text-caption font-semibold uppercase tracking-[0.2em] text-white/55">
              {hero.brandLabel}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] text-white md:text-5xl lg:text-6xl">
              {hero.titleLine1}
              <span className="mt-1 block text-green-bright">
                {hero.titleLine2}
              </span>
            </h1>
          </div>

          <p className="animate-fade-up-delay-2 max-w-xl text-body-lg text-white/75">
            {hero.subtitle}
          </p>

          <div className="animate-fade-up-delay-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => go("#activites")}
              className="btn-primary"
            >
              Voir nos activités
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => go("#contact")}
              className="btn-secondary"
            >
              Nous contacter
            </button>
          </div>
        </div>

        <div className="animate-fade-up-delay-2 mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-mid/80 p-3 shadow-hover sm:p-4">
            <div className="relative overflow-hidden rounded-xl">
              <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
                <Image
                  src="/images/equipe-chantier.jpg"
                  alt="Équipe ALLIANCE M.O BTP sur chantier — gilet aux couleurs de l'entreprise"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-center"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <span className="absolute left-3 top-3 rounded-md bg-green px-2.5 py-1 text-caption font-semibold text-white">
                Équipe — Libreville
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:mt-4 sm:gap-3">
              {[
                { value: "2024", label: "Création" },
                { value: `${chantierCount || "—"}`, label: "Chantiers" },
                { value: "15", label: "Personnes" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3"
                >
                  <div className="font-display text-lg font-bold text-white sm:text-xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-caption uppercase tracking-wide text-white/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go("#apropos")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 transition hover:text-white/80 md:block"
        aria-label="Défiler vers À propos"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-current p-1">
          <div className="h-2 w-0.5 animate-bounce rounded-full bg-current" />
        </div>
      </button>
    </section>
  );
}
