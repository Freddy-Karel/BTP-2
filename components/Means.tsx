"use client";

import {
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
          featured ? "text-white/80" : "text-green"
        }`}
      >
        {box.count != null && (
          <span className={featured ? "text-white/65" : "text-navy/45"}>
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
      <div className="h-6 w-px bg-navy/25" />
    </div>
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
      <div className="mx-auto max-w-7xl px-4 md:px-6">
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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green">
                  <IconByName name={stat.icon} size={21} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card-lift flex h-full flex-col rounded-2xl border border-mist bg-white/95 p-5 shadow-sm backdrop-blur-sm sm:p-7 md:p-8 lg:min-h-[42rem] lg:max-h-[42rem]">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {content.organization.title}
                  </h3>
                  <p className="text-caption text-muted">
                    {content.organization.subtitle}
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-lg bg-green-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green">
                {content.organization.badge}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-0">
              <div className="mx-auto max-w-[290px]">
                <OrgCard box={content.organization.manager} featured />
              </div>

              <VConnector />

              <div className="relative">
                <div
                  className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-0 hidden h-px bg-navy/25 sm:block"
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
                  className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-0 hidden h-px bg-navy/25 sm:block"
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
          </div>

          <div className="card-lift flex h-full min-h-0 flex-col rounded-2xl border border-mist bg-white/95 p-5 shadow-sm backdrop-blur-sm sm:p-7 md:p-8 lg:min-h-[42rem] lg:max-h-[42rem]">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {content.equipment.title}
                  </h3>
                  <p className="text-caption text-muted">
                    {equipmentCount} références · {content.equipment.ownerLabel}
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-lg bg-navy/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-navy">
                {content.equipment.badge}
              </span>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {content.equipment.groups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-mist bg-sand/70 p-4"
                >
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green shadow-sm">
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
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-soft text-green">
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
                                  : "bg-green-soft text-green"
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
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-green/15 bg-green-soft/70 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green text-white">
                  <ClipboardCheck size={21} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">
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
                  className="flex items-start gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold leading-snug text-navy shadow-sm"
                >
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-green" />
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
