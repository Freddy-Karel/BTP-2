"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Images,
  Star,
  X,
} from "lucide-react";
import Portal from "@/components/Portal";
import { projectMatchesClient, type ClientRef } from "@/lib/clients";
import { categoryLabel, type Project } from "@/lib/projects";
import { type WorkReport } from "@/lib/rapports";

const BASE_SPEED = 42;
const DRAG_THRESHOLD = 10;

function ClientMonogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span className="font-display text-lg font-bold tracking-tight text-navy/70 transition group-hover:text-navy md:text-xl">
      {initials}
    </span>
  );
}

function LogoButton({
  client,
  onOpen,
}: {
  client: ClientRef;
  onOpen: (client: ClientRef) => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpen(client);
      }}
      aria-label={`${client.name} - voir les projets`}
      className="group relative z-[1] flex h-20 min-w-[150px] shrink-0 cursor-pointer items-center justify-center px-5 transition hover:opacity-100 focus-visible:outline-none md:h-24 md:min-w-[170px]"
    >
      {client.featured && (
        <span className="pointer-events-none absolute -top-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-green px-2 py-0.5 text-caption font-bold uppercase tracking-wider text-white shadow-rest">
          <Star size={9} className="fill-white" />
          Principal
        </span>
      )}

      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={200}
          height={80}
          draggable={false}
          className={`pointer-events-none w-auto select-none object-contain opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100 ${
            client.featured ? "max-h-14 md:max-h-16" : "max-h-12 md:max-h-14"
          }`}
        />
      ) : (
        <span className="pointer-events-none flex flex-col items-center gap-0.5">
          <ClientMonogram name={client.shortName} />
          <span className="max-w-[120px] truncate text-caption font-semibold uppercase tracking-wide text-muted transition group-hover:text-navy">
            {client.shortName}
          </span>
        </span>
      )}
    </button>
  );
}

type ClientWorkItem = {
  kind: "project" | "report";
  id: string;
  title: string;
  year: number;
  category: Project["category"];
  location: string;
  description: string;
  href: string;
  photos: number;
};

export default function Clients({
  clients,
  projects,
  reports,
}: {
  clients: ClientRef[];
  projects: Project[];
  reports: WorkReport[];
}) {
  const [selected, setSelected] = useState<ClientRef | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const boostRef = useRef(0);
  const pausedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    x: number;
    active: boolean;
    dragging: boolean;
    pointerId: number | null;
  }>({
    x: 0,
    active: false,
    dragging: false,
    pointerId: null,
  });

  const loop = [...clients, ...clients];

  const clientWorkItems = (client: ClientRef): ClientWorkItem[] => {
    const matchedReports = reports
      .filter((report) => report.clientSlug === client.slug)
      .map((report) => ({
        kind: "report" as const,
        id: report.id,
        title: report.title,
        year:
          Number(report.startDate.slice(0, 4)) ||
          Number(report.endDate.slice(0, 4)),
        category: report.category,
        location: report.location,
        description: report.objective,
        href: `/realisations?client=${client.slug}&report=${report.slug}#rapports-travaux`,
        photos: report.before.length + report.after.length,
      }));

    const matchedProjects = projects
      .filter((project) => projectMatchesClient(project.title, client))
      .map((project) => ({
        kind: "project" as const,
        id: String(project.id),
        title: project.title,
        year: project.year,
        category: project.category,
        location: project.location,
        description:
          project.description ?? "Projet client documenté dans le catalogue.",
        href: `/realisations?client=${client.slug}&project=${project.id}#chantiers-clients`,
        photos: Math.max(1, project.images?.length ?? 1),
      }));

    return [...matchedReports, ...matchedProjects].sort(
      (a, b) => b.year - a.year,
    );
  };

  const openClient = (client: ClientRef) => {
    if (suppressClickRef.current) return;
    setSelected(client);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const baseSpeed = reduced ? 0 : BASE_SPEED;

    const wrap = () => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      while (offsetRef.current >= half) offsetRef.current -= half;
      while (offsetRef.current < 0) offsetRef.current += half;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!pausedRef.current || Math.abs(boostRef.current) > 1) {
        const speed = pausedRef.current
          ? boostRef.current
          : baseSpeed + boostRef.current;
        offsetRef.current += speed * dt;
        boostRef.current *= 0.9;
        if (Math.abs(boostRef.current) < 0.5) boostRef.current = 0;
      }

      wrap();
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      const horizontal =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (horizontal === 0) return;
      event.preventDefault();
      offsetRef.current += horizontal;
      boostRef.current = Math.max(-520, Math.min(520, horizontal * 3.2));
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragRef.current = {
        x: event.clientX,
        active: true,
        dragging: false,
        pointerId: event.pointerId,
      };
      pausedRef.current = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.x;

      if (!dragRef.current.dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragRef.current.dragging = true;
        suppressClickRef.current = true;
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }

      dragRef.current.x = event.clientX;
      offsetRef.current -= dx;
      boostRef.current = -dx * 8;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const wasDragging = dragRef.current.dragging;
      dragRef.current.active = false;
      dragRef.current.dragging = false;
      dragRef.current.pointerId = null;
      pausedRef.current = false;

      if (wasDragging) {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 50);
      }
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const selectedWorkItems = selected ? clientWorkItems(selected) : [];

  return (
    <section
      id="references"
      className="overflow-hidden border-y border-mist/80 bg-white/70 py-14 backdrop-blur-[2px] md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Références</span>
          <h2 className="section-title">Ils nous ont fait confiance</h2>
          <p className="mt-3 text-body text-muted">
            Cliquez sur un logo pour voir les projets associés, puis ouvrez la
            réalisation détaillée dans le catalogue.
          </p>
        </div>
      </div>

      <div className="relative mt-10">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24"
          aria-hidden
        />

        <div
          ref={viewportRef}
          className="overflow-hidden py-4"
          style={{ touchAction: "pan-y" }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            if (!dragRef.current.active) pausedRef.current = false;
          }}
        >
          <div ref={trackRef} className="flex w-max gap-10 will-change-transform">
            {loop.map((client, index) => (
              <LogoButton
                key={`${client.id}-${index}`}
                client={client}
                onOpen={openClient}
              />
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <Portal>
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-title"
          >
            <button
              type="button"
              className="animate-backdrop-in absolute inset-0 border-0 bg-navy/35 backdrop-blur-[6px]"
              aria-label="Fermer"
              onClick={() => setSelected(null)}
            />

            <div className="animate-modal-in relative z-10 max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-mist bg-white shadow-modal">
              <div className="flex items-start justify-between gap-4 border-b border-mist/80 p-5 sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                  {selected.logo ? (
                    <Image
                      src={selected.logo}
                      alt={selected.name}
                      width={128}
                      height={52}
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5">
                      <ClientMonogram name={selected.shortName} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p
                      id="client-title"
                      className="truncate font-display text-lg font-bold text-navy"
                    >
                      {selected.name}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green">
                      <Building2 size={12} />
                      {selectedWorkItems.length > 0
                        ? `${selectedWorkItems.length} réalisation${
                            selectedWorkItems.length > 1 ? "s" : ""
                          } publiée${selectedWorkItems.length > 1 ? "s" : ""}`
                        : "Référence client"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition hover:bg-navy hover:text-white"
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[calc(88vh-5.5rem)] space-y-4 overflow-y-auto p-5 sm:p-6">
                {selected.summary && (
                  <p className="rounded-xl border border-green/20 bg-green-soft/60 px-4 py-3 text-sm leading-relaxed text-navy">
                    {selected.summary}
                  </p>
                )}

                {selectedWorkItems.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-navy">
                        Projets réalisés pour ce client
                      </p>
                      <Link
                        href={`/realisations?client=${selected.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-green transition hover:text-navy"
                        onClick={() => setSelected(null)}
                      >
                        Tout voir
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <ul className="space-y-3">
                      {selectedWorkItems.map((item) => (
                        <li
                          key={`${item.kind}-${item.id}`}
                          className="rounded-2xl border border-mist bg-sand/90 p-4 transition hover:border-green/30 hover:bg-white"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-green-soft px-2 py-0.5 text-caption font-bold text-green">
                                  <CalendarDays size={12} />
                                  {item.year}
                                </span>
                                <span className="rounded-md bg-white px-2 py-0.5 text-caption font-bold uppercase tracking-wide text-navy/70">
                                  {categoryLabel[item.category]}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-caption font-semibold text-navy/60">
                                  {item.kind === "report" ? (
                                    <FileText size={12} />
                                  ) : (
                                    <Images size={12} />
                                  )}
                                  {item.photos}
                                </span>
                              </div>
                              <p className="mt-2 font-display text-base font-bold leading-snug text-navy">
                                {item.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                                {item.description}
                              </p>
                              <p className="mt-1 text-xs font-medium text-navy/55">
                                {item.location}
                              </p>
                            </div>
                            <Link
                              href={item.href}
                              onClick={() => setSelected(null)}
                              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy transition hover:bg-green hover:text-white"
                            >
                              Voir
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-mist bg-sand/80 px-4 py-6 text-center">
                    <Building2 className="mx-auto text-navy/30" size={28} />
                    <p className="mt-3 text-sm font-semibold text-navy">
                      Référence client à documenter prochainement
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      Le client est identifié, mais aucun projet détaillé
                      n&apos;est encore publié dans le catalogue.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="btn-primary w-full text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}
