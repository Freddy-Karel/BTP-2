"use client";

import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_QUALITY_CONTENT,
  type QualityContent,
} from "@/lib/quality-content";

const iconMap: Record<string, LucideIcon> = {
  Award,
  HeartPulse,
  ShieldCheck,
};

export default function Quality({
  content = DEFAULT_QUALITY_CONTENT,
}: {
  content?: QualityContent;
}) {
  return (
    <section id="securite" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="mt-4 text-body-lg text-muted">{content.subtitle}</p>
        </div>

        <div className="mt-10 rounded-3xl border border-mist bg-white/90 p-5 shadow-rest backdrop-blur-sm md:p-7">
          <div className="rounded-2xl bg-navy p-6 text-white md:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green text-white">
                  <ClipboardCheck size={24} />
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-green-bright">
                  {content.methodLabel}
                </p>
                <h3 className="mt-2 max-w-xl font-display text-2xl font-bold leading-tight md:text-3xl">
                  {content.methodTitle}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/72">
                  {content.methodText}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5">
                {content.process.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="rounded-xl bg-white/8 px-3 py-3 text-center sm:text-left"
                  >
                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/12 text-xs font-bold text-green-bright sm:mx-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-tight text-white/88">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {content.pillars.map((pillar) => {
              const Icon = iconMap[pillar.icon] ?? ShieldCheck;
              return (
                <article
                  key={pillar.id}
                  className="group rounded-2xl border border-mist bg-white p-6 shadow-sm transition hover:border-green/25 hover:shadow-hover md:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green transition duration-300 group-hover:bg-green group-hover:text-white">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold leading-tight text-navy">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {pillar.text}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    {pillar.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-xl bg-sand/80 px-3 py-2.5 text-sm text-ink"
                      >
                        <CheckCircle2
                          className="mt-0.5 shrink-0 text-green"
                          size={16}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-green/15 bg-green-soft/70 px-5 py-4">
            <p className="text-sm font-semibold leading-relaxed text-navy">
              {content.commitment}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
