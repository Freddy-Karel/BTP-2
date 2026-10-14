"use client";

import type { ReactNode } from "react";
import {
  BrickWall,
  ChevronDown,
  ClipboardCheck,
  Compass,
  Drill,
  Hammer,
  HardHat,
  Layers,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Waves,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_MEANS_CONTENT,
  type MeansContent,
  type OrgBoxContent,
} from "@/lib/means-content";

const iconMap: Record<string, LucideIcon> = {
  BrickWall,
  ClipboardCheck,
  Compass,
  Drill,
  Hammer,
  HardHat,
  Layers,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Waves,
  Wrench,
  Zap,
};

function IconByName({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = iconMap[name] ?? Wrench;
  return <Icon size={size} />;
}

function OrgCard({
  box,
  featured = false,
}: {
  box: OrgBoxContent;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-center transition ${
        featured
          ? "border-navy bg-navy text-white shadow-lg shadow-navy/20"
          : "border-mist bg-white shadow-sm"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
          featured ? "text-white/80" : "text-navy/55"
        }`}
      >
        {box.count != null && (
          <span className={featured ? "text-white/65" : "text-navy/40"}>
            {String(box.count).padStart(2, "0")} ·{" "}
          </span>
        )}
        {box.title}
      </p>
      {box.name && (
        <p
          className={`mt-1.5 text-sm font-bold leading-snug ${
            featured ? "text-white" : "text-navy"
          }`}
        >
          {box.name}
        </p>
      )}
      <p
        className={`mt-2 text-xs leading-relaxed ${
          featured ? "text-white/72" : "text-muted"
        }`}
      >
        {box.role}
      </p>
    </div>
  );
}

function VConnector() {
  return (
    <div className="flex justify-center py-2" aria-hidden>
      <div className="h-6 w-px bg-navy/20" />
    </div>
  );
}

function Accordion({
  title,
  subtitle,
  icon,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-3xl border border-mist bg-white/95 shadow-sm backdrop-blur-sm open:shadow-rest">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden sm:p-6 md:p-7">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-bold text-navy">
              {title}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">
              {subtitle}
            </span>
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-3">
          {badge ? (
            <span className="hidden rounded-xl bg-navy/6 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-navy sm:inline-flex">
              {badge}
            </span>
          ) : null}
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sand text-navy transition group-open:rotate-180">
            <ChevronDown size={20} />
          </span>
        </span>
      </summary>
      <div className="border-t border-mist px-5 pb-5 pt-5 sm:px-6 md:px-7 md:pb-7">
        {children}
      </div>
    </details>
  );
}

export default function Means({
  content = DEFAULT_MEANS_CONTENT,
}: {
  content?: MeansContent;
}) {
  const equipmentCount = content.equipment.groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <section id="moyens" className="py-20 md:py-28">
      <div className="mx-auto max-w-[92rem] px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="mt-4 text-body-lg text-muted">{content.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-mist bg-white/90 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-3xl font-bold text-navy">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-muted">
                    {stat.label}
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy/6 text-navy">
                  <IconByName name={stat.icon} size={21} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4">
          <Accordion
            title={content.organization.title}
            subtitle={content.organization.subtitle}
            badge={content.organization.badge}
            icon={<Users size={22} />}
          >
            <div className="mx-auto max-w-5xl">
              <div className="mx-auto max-w-[290px]">
                <OrgCard box={content.organization.manager} featured />
              </div>

              <VConnector />

              <div className="relative">
                <div
                  className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-0 hidden h-px bg-navy/20 sm:block"
                  aria-hidden
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {content.organization.level2.map((box) => (
                    <OrgCard key={box.title} box={box} />
                  ))}
                </div>
              </div>

              <VConnector />

              <div className="relative">
                <div
                  className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-0 hidden h-px bg-navy/20 sm:block"
                  aria-hidden
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {content.organization.level3.map((box) => (
                    <OrgCard key={box.title} box={box} />
                  ))}
                </div>
              </div>

              <VConnector />

              <div className="mx-auto max-w-[260px]">
                <OrgCard box={content.organization.workers} />
              </div>
            </div>
          </Accordion>

          <Accordion
            title={content.equipment.title}
            subtitle={`${equipmentCount} références · ${content.equipment.ownerLabel}`}
            badge={content.equipment.badge}
            icon={<Wrench size={22} />}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {content.equipment.groups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-mist bg-sand/60 p-4"
                >
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-navy shadow-sm">
                      <IconByName name={group.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-base font-bold text-navy">
                        {group.title}
                      </h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {group.items.map((item, index) => (
                      <li
                        key={`${group.title}-${item.name}-${item.brand}-${index}`}
                        className="flex items-start gap-3 rounded-xl bg-white px-3 py-3"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/6 text-navy">
                          <IconByName name={item.icon} size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold leading-snug text-navy">
                              {item.name}
                            </p>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                item.condition === "Excellent"
                                  ? "bg-navy/10 text-navy"
                                  : "bg-sand text-navy/70"
                              }`}
                            >
                              {item.condition}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted">
                            {item.brand}
                            <span className="mx-1.5 text-mist">·</span>
                            Qté {String(item.qty).padStart(2, "0")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="mt-8 rounded-2xl border border-navy/10 bg-white/86 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white">
                  <ClipboardCheck size={21} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy/55">
                    {content.guaranteeLabel}
                  </p>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {content.guaranteeTitle}
                  </h3>
                </div>
              </div>
            </div>

            <ul className="grid gap-3 lg:grid-cols-3">
              {content.commitments.map((commitment) => (
                <li
                  key={commitment}
                  className="flex items-start gap-2 rounded-xl bg-sand/70 px-4 py-3 text-sm font-semibold leading-snug text-navy shadow-sm"
                >
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-navy/65" />
                  <span>{commitment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
