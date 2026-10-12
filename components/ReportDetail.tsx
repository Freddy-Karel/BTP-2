"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  ImageIcon,
  MapPin,
  Maximize2,
  ShieldCheck,
  X,
} from "lucide-react";
import Portal from "@/components/Portal";
import { categoryLabel } from "@/lib/projects";
import type { WorkReport } from "@/lib/rapports";

type Props = {
  report: WorkReport | null;
  onClose: () => void;
};

type ReportImage = {
  src: string;
  label: string;
  phase: "Avant" | "Apres";
};

function ReportInfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-mist bg-white px-4 py-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-green">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-navy">
        {value}
      </p>
    </div>
  );
}

function PhotoCard({
  image,
  onOpen,
}: {
  image: ReportImage;
  onOpen: (image: ReportImage) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      className="group overflow-hidden rounded-xl border border-mist bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green/30 hover:shadow-hover"
    >
      <div className="relative aspect-[4/3] bg-mist">
        <Image
          src={image.src}
          alt={image.label}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent opacity-80" />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy shadow-sm">
          {image.phase}
        </span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-navy shadow-sm transition group-hover:bg-green group-hover:text-white">
          <Maximize2 size={16} />
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <ImageIcon size={14} className="shrink-0 text-green" />
        <span className="truncate text-xs font-semibold text-navy">
          {image.label}
        </span>
      </div>
    </button>
  );
}

export default function ReportDetail({ report, onClose }: Props) {
  const [activeImage, setActiveImage] = useState<ReportImage | null>(null);

  useEffect(() => {
    if (!report) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeImage) {
          setActiveImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [report, onClose, activeImage]);

  const gallery = useMemo<ReportImage[]>(() => {
    if (!report) return [];
    return [
      ...report.before.map((src, index) => ({
        src,
        phase: "Avant" as const,
        label: `Avant travaux - photo ${index + 1}`,
      })),
      ...report.after.map((src, index) => ({
        src,
        phase: "Apres" as const,
        label: `Apres travaux - photo ${index + 1}`,
      })),
    ];
  }, [report]);

  if (!report) return null;

  const dateLabel =
    report.endLabel !== report.startLabel
      ? `${report.startLabel} - ${report.endLabel}`
      : report.startLabel;
  const referenceLabel = report.refs.length ? report.refs.join(" / ") : "Non renseigne";
  const cover = report.cover || report.after[0] || report.before[0];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
      >
        <button
          type="button"
          className="animate-backdrop-in absolute inset-0 border-0 bg-navy/55 backdrop-blur-[7px]"
          aria-label="Fermer"
          onClick={onClose}
        />

        <div className="animate-modal-in relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-sand shadow-modal sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl">
          <div className="relative shrink-0 overflow-hidden bg-navy text-white">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover opacity-24"
                sizes="1024px"
                priority
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy-mid/82" />
            <div className="relative flex min-h-[178px] items-start justify-between gap-4 px-5 pb-7 pt-5 sm:min-h-[198px] sm:px-7 sm:pb-8 sm:pt-6">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                    Rapport de travaux
                  </span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {report.client}
                  </span>
                </div>
                <h2
                  id="report-title"
                  className="max-w-3xl font-display text-2xl font-bold leading-[1.12] text-balance sm:text-3xl"
                >
                  {report.title}
                </h2>
                <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-white/72 sm:block">
                  Fiche d&apos;intervention documentee avec objectif, reference,
                  periode et photos avant / apres travaux.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white transition hover:bg-white hover:text-navy"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ReportInfoCard
                label="Client"
                value={report.client}
                icon={<FileText size={18} />}
              />
              <ReportInfoCard
                label="Localisation"
                value={report.location}
                icon={<MapPin size={18} />}
              />
              <ReportInfoCard
                label="Periode"
                value={dateLabel}
                icon={<Calendar size={18} />}
              />
              <ReportInfoCard
                label="Domaine"
                value={categoryLabel[report.category]}
                icon={<ShieldCheck size={18} />}
              />
            </div>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                  Objectif de l&apos;intervention
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/82">
                  {report.objective}
                </p>
              </div>

              <div className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  Reference administrative
                </p>
                <p className="mt-3 font-mono text-sm font-semibold text-navy">
                  {referenceLabel}
                </p>
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-green-soft px-3 py-3 text-sm text-green">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed">
                    Intervention presentee selon une lecture claire : contexte,
                    objectif, preuves visuelles et resultat livre.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-4 flex flex-col gap-2 border-b border-mist pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                    Comparatif visuel
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-navy">
                    Avant / apres travaux
                  </h3>
                </div>
                <p className="text-sm text-muted">
                  {gallery.length} photo{gallery.length > 1 ? "s" : ""} documentee
                  {gallery.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-mist bg-white p-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider text-navy">
                      Avant travaux
                    </h4>
                    <span className="font-mono text-caption text-muted">
                      Debut - {report.startLabel}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {report.before.map((src, index) => (
                      <PhotoCard
                        key={src}
                        image={{
                          src,
                          phase: "Avant",
                          label: `Avant travaux - photo ${index + 1}`,
                        }}
                        onOpen={setActiveImage}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-mist bg-white p-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider text-navy">
                      Apres travaux
                    </h4>
                    <span className="font-mono text-caption text-muted">
                      Fin - {report.endLabel}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {report.after.map((src, index) => (
                      <PhotoCard
                        key={src}
                        image={{
                          src,
                          phase: "Apres",
                          label: `Apres travaux - photo ${index + 1}`,
                        }}
                        onOpen={setActiveImage}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 rounded-2xl border border-green/15 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                  Resultat & qualite
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/78">
                  Les travaux sont presentes avec une logique de tracabilite :
                  situation initiale, intervention realisee et etat final.
                  Cette lecture valorise la discipline de chantier, le respect
                  des delais et l&apos;engagement qualite d&apos;ALLIANCE M.O BTP.
                </p>
              </div>
              <Link
                href="/#contact"
                className="btn-primary justify-center !py-3 text-sm"
                onClick={onClose}
              >
                Demander un devis similaire
                <ArrowRight size={16} />
              </Link>
            </section>
          </div>

          {activeImage ? (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-navy/92 p-3 backdrop-blur-sm sm:p-6">
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Fermer la photo"
                onClick={() => setActiveImage(null)}
              />
              <div className="relative z-10 flex h-full w-full max-w-5xl flex-col">
                <div className="mb-3 flex items-center justify-between gap-3 text-white">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-bright">
                      {activeImage.phase}
                    </p>
                    <p className="text-sm font-semibold">{activeImage.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveImage(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy transition hover:bg-green hover:text-white"
                    aria-label="Fermer la photo"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-navy-mid">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.label}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Portal>
  );
}
