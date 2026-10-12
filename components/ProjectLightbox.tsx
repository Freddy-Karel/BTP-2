"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import Portal from "@/components/Portal";
import { categoryLabel, projectGallery, type Project } from "@/lib/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
};

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-mist bg-white px-4 py-3 shadow-sm">
      <div className="mb-2 text-green">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-navy">
        {value}
      </p>
    </div>
  );
}

export default function ProjectLightbox({ project, onClose }: Props) {
  if (!project) return null;

  return (
    <ProjectLightboxContent key={project.id} project={project} onClose={onClose} />
  );
}

function ProjectLightboxContent({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const gallery = projectGallery(project);
  const src = gallery[index] ?? project.image;
  const hasMany = gallery.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMany) {
        setIndex((i) => (i - 1 + gallery.length) % gallery.length);
      }
      if (e.key === "ArrowRight" && hasMany) {
        setIndex((i) => (i + 1) % gallery.length);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose, gallery.length, hasMany]);

  const prev = () => setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setIndex((i) => (i + 1) % gallery.length);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
      >
        <button
          type="button"
          className="lightbox-backdrop animate-backdrop-in absolute inset-0"
          aria-label="Fermer"
          onClick={onClose}
        />

        <div className="animate-modal-in relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-sand shadow-modal sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl">
          <div className="relative shrink-0 overflow-hidden bg-navy text-white">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover opacity-28"
              sizes="1024px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy-mid/78" />
            <div className="relative flex min-h-[136px] items-start justify-between gap-4 px-5 pb-5 pt-5 sm:min-h-[154px] sm:px-7 sm:pb-6 sm:pt-6">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                    Projet client
                  </span>
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {categoryLabel[project.category]}
                  </span>
                </div>
                <h2
                  id="project-title"
                  className="max-w-3xl font-display text-2xl font-bold leading-[1.12] text-balance sm:text-3xl"
                >
                  {project.title}
                </h2>
                <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-white/72 xl:block">
                  Fiche de reference avec contexte client, localisation,
                  galerie visuelle et nature des travaux.
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
              <DetailCard
                label="Client"
                value={project.client ?? "Reference client"}
                icon={<BriefcaseBusiness size={18} />}
              />
              <DetailCard
                label="Localisation"
                value={project.location}
                icon={<MapPin size={18} />}
              />
              <DetailCard
                label="Annee"
                value={project.year}
                icon={<Calendar size={18} />}
              />
              <DetailCard
                label="Domaine"
                value={categoryLabel[project.category]}
                icon={<ShieldCheck size={18} />}
              />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
              <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                  Nature des travaux
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/82">
                  {project.description ||
                    "Reference chantier presentee dans le catalogue ALLIANCE M.O BTP. Les photos et informations pourront etre completees depuis l'espace d'administration."}
                </p>
              </section>

              <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  Lecture professionnelle
                </p>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-navy/78">
                  <p>
                    Cette fiche sert de support commercial : elle situe le
                    chantier, le client, le domaine d&apos;intervention et les
                    visuels associes.
                  </p>
                  <p className="rounded-xl bg-green-soft px-3 py-3 text-green">
                    Image provisoire ou definitive, remplacable depuis l&apos;admin.
                  </p>
                </div>
              </section>
            </div>

            <section className="mt-6">
              <div className="mb-4 flex flex-col gap-2 border-b border-mist pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                    Galerie du chantier
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-navy">
                    Support visuel de reference
                  </h3>
                </div>
                <p className="text-sm text-muted">
                  {index + 1} / {gallery.length} photo{gallery.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-mist bg-navy shadow-sm">
                <div className="relative h-[min(54dvh,520px)] min-h-[280px]">
                  <Image
                    key={src}
                    src={src}
                    alt={`${project.title} - photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-transparent" />

                  {hasMany ? (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-hover transition hover:bg-white"
                        aria-label="Photo precedente"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-hover transition hover:bg-white"
                        aria-label="Photo suivante"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  ) : null}

                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy/70 px-3 py-2 text-white backdrop-blur-sm">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold">
                      <ImageIcon size={16} className="text-green-bright" />
                      {project.title}
                    </span>
                    <span className="font-mono text-caption text-white/70">
                      {project.location}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 rounded-2xl border border-green/15 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                  Projet similaire
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/78">
                  Vous pouvez solliciter ALLIANCE M.O BTP pour une intervention
                  de meme nature : etude, execution, suivi et livraison des
                  travaux.
                </p>
              </div>
              <Link
                href="/#contact"
                className="btn-primary justify-center !py-3 text-sm"
                onClick={onClose}
              >
                Demander un devis
                <ArrowRight size={16} />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </Portal>
  );
}
