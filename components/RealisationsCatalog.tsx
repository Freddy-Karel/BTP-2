"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  HardHat,
  Images,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import Reveal from "@/components/Reveal";
import ReportDetail from "@/components/ReportDetail";
import ProjectLightbox from "@/components/ProjectLightbox";
import {
  categoryLabel,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import { type WorkReport } from "@/lib/rapports";
import { type ClientRef, projectMatchesClient } from "@/lib/clients";

type Filter = "all" | ProjectCategory;

function plural(count: number, singular: string, pluralLabel: string) {
  return count > 1 ? pluralLabel : singular;
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-white backdrop-blur-sm">
      <div className="mb-2 text-green-bright">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/48">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-bold leading-none">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  aside,
}: {
  eyebrow: string;
  title: string;
  text: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-green">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
          {text}
        </p>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
        active
          ? "border-white bg-white text-navy shadow-md"
          : "border-white/10 bg-white/5 text-white/62 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`rounded-md px-1.5 py-0.5 text-[11px] ${
          active ? "bg-navy/8 text-navy" : "bg-white/10 text-white/55"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (p: Project) => void;
}) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=900&fit=crop&q=80";
  const imageUrl = project.image || fallbackImage;
  const galleryCount = Math.max(1, project.images?.length ?? 1);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="group overflow-hidden rounded-2xl border border-mist bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green/30 hover:shadow-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/88 via-navy/18 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {categoryLabel[project.category]}
          </span>
          <span className="rounded-md bg-white/92 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
            Projet client
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-mono text-[11px] font-semibold text-green-bright">
            {project.year}
            {project.client ? ` - ${project.client}` : ""}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-white text-balance">
            {project.title}
          </h3>
        </div>
      </div>
      <div className="space-y-3 p-4">
        {project.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-mist pt-3 text-xs font-semibold text-navy/70">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-green" />
            <span className="truncate">{project.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-sand px-2 py-1">
            <Images size={13} className="text-green" />
            {galleryCount}
          </span>
        </div>
      </div>
    </button>
  );
}

function ReportCard({
  report,
  onOpen,
}: {
  report: WorkReport;
  onOpen: (r: WorkReport) => void;
}) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=900&fit=crop&q=80";
  const imageUrl = report.cover || fallbackImage;
  const photoCount = report.before.length + report.after.length;

  return (
    <button
      type="button"
      onClick={() => onOpen(report)}
      className="group overflow-hidden rounded-2xl border border-green/15 bg-navy text-left text-white shadow-rest transition duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={report.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/38 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Rapport documente
          </span>
          <span className="rounded-md bg-white/92 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
            {categoryLabel[report.category]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-mono text-[11px] font-semibold text-green-bright">
            {report.client} - {report.startLabel}
            {report.endLabel !== report.startLabel ? ` / ${report.endLabel}` : ""}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight text-white text-balance">
            {report.title}
          </h3>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-white/66">
          {report.objective}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs font-semibold text-white/70">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-green-bright" />
            <span className="truncate">{report.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1">
            <Camera size={13} className="text-green-bright" />
            {photoCount}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function RealisationsCatalog({
  projects,
  reports,
  clients,
}: {
  projects: Project[];
  reports: WorkReport[];
  clients: ClientRef[];
}) {
  const searchParams = useSearchParams();
  const clientSlug = searchParams.get("client");
  const projectParam = searchParams.get("project");
  const reportParam = searchParams.get("report");
  const clientRef = clients.find((c) => c.slug === clientSlug);

  const [filter, setFilter] = useState<Filter>("all");
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const openedFromQueryRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("catalog-page");
    return () => document.documentElement.classList.remove("catalog-page");
  }, []);

  useEffect(() => {
    if (openedFromQueryRef.current) return;

    if (reportParam) {
      const report = reports.find(
        (item) => item.slug === reportParam || item.id === reportParam,
      );
      if (report) {
        openedFromQueryRef.current = true;
        const frame = window.requestAnimationFrame(() => {
          setSelectedReport(report);
        });
        return () => window.cancelAnimationFrame(frame);
      }
    }

    if (projectParam) {
      const projectId = Number(projectParam);
      const project = projects.find((item) => item.id === projectId);
      if (project) {
        openedFromQueryRef.current = true;
        const frame = window.requestAnimationFrame(() => {
          setLightbox(project);
        });
        return () => window.cancelAnimationFrame(frame);
      }
    }
  }, [projectParam, reportParam, projects, reports]);

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (clientRef) {
      list = list.filter((p) => projectMatchesClient(p.title, clientRef, p.client));
    }
    if (filter !== "all") {
      list = list.filter((p) => p.category === filter);
    }
    return list;
  }, [filter, clientRef, projects]);

  const filteredReports = useMemo(() => {
    let list = reports;
    if (clientRef) {
      list = list.filter((r) => r.clientSlug === clientRef.slug);
    }
    if (filter !== "all") {
      list = list.filter((r) => r.category === filter);
    }
    return list;
  }, [filter, clientRef, reports]);

  const baseProjects = clientRef
    ? projects.filter((p) => projectMatchesClient(p.title, clientRef, p.client))
    : projects;
  const baseReports = clientRef
    ? reports.filter((r) => r.clientSlug === clientRef.slug)
    : reports;

  const allCount = baseProjects.length + baseReports.length;
  const buildingCount =
    baseProjects.filter((p) => p.category === "batiments").length +
    baseReports.filter((r) => r.category === "batiments").length;
  const publicWorksCount =
    baseProjects.filter((p) => p.category === "travaux").length +
    baseReports.filter((r) => r.category === "travaux").length;

  const featuredClients = clients.slice(0, 6);

  return (
    <div className="site-shell min-h-screen bg-navy">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 bg-navy">
          <div className="plan-on-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
          <div id="catalogue-hero" className="relative mx-auto max-w-[92rem] px-4 pb-8 pt-[6.5rem] md:px-6 md:pb-10 md:pt-28">
            <Link
              href="/#realisations"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-white/48 transition hover:text-white"
            >
              <ArrowLeft size={12} />
              Retour au site
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_440px] lg:items-end">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-green-bright">
                  Catalogue des references
                </p>
                <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight text-white text-balance md:text-5xl">
                  Chantiers, rapports et preuves visuelles d&apos;ALLIANCE M.O BTP
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/68 md:text-base">
                  Une lecture claire des realisations : projets clients,
                  interventions documentees, domaines d&apos;activite et photos
                  remplacables depuis l&apos;administration.
                </p>

                {clientRef ? (
                  <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/72">
                    Filtre client actif :
                    <span className="font-semibold text-white">{clientRef.name}</span>
                    <Link
                      href="/realisations"
                      className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-green-bright transition hover:bg-white/15"
                    >
                      Effacer
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatCard label="References" value={allCount} icon={<BriefcaseBusiness size={18} />} />
                <StatCard label="Rapports" value={baseReports.length} icon={<FileText size={18} />} />
                <StatCard label="Clients" value={clients.length} icon={<Building2 size={18} />} />
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-20 border-b border-white/10 bg-navy/95 backdrop-blur-md md:top-[4.5rem]">
          <div className="mx-auto flex max-w-[92rem] items-center gap-2 overflow-x-auto px-4 py-3 md:px-6">
            <div className="flex items-center gap-2" role="tablist" aria-label="Filtrer les realisations">
              <FilterButton
                active={filter === "all"}
                label="Tout"
                count={allCount}
                onClick={() => setFilter("all")}
              />
              <FilterButton
                active={filter === "batiments"}
                label="Batiments"
                count={buildingCount}
                onClick={() => setFilter("batiments")}
              />
              <FilterButton
                active={filter === "travaux"}
                label="Travaux publics"
                count={publicWorksCount}
                onClick={() => setFilter("travaux")}
              />
            </div>
          </div>
        </section>

        <div className="bg-sand">
          <section className="border-b border-mist bg-white/80 py-6">
            <div className="mx-auto max-w-[92rem] px-4 md:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">
                    Ils nous ont fait confiance
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    References commerciales issues du dossier entreprise.
                  </p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                  {featuredClients.map((client) => (
                    <Link
                      key={client.id}
                      href={`/realisations?client=${client.slug}`}
                      className="shrink-0 rounded-xl border border-mist bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:border-green/30 hover:bg-green-soft"
                    >
                      {client.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="chantiers-clients" className="py-12 md:py-16">
            <div className="mx-auto max-w-[92rem] px-4 md:px-6">
              <SectionHeading
                eyebrow="Chantiers clients"
                title="Projets realises"
                text={`${filteredProjects.length} ${plural(
                  filteredProjects.length,
                  "projet presente",
                  "projets presentes",
                )} avec une image de couverture provisoire ou definitive, une description courte et une galerie remplacable depuis l'espace admin.`}
                aside={
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm">
                    <CheckCircle2 size={16} className="text-green" />
                    Supports visuels harmonises
                  </span>
                }
              />

              {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-mist bg-white/70 px-6 py-16 text-center">
                  <HardHat className="mx-auto text-navy/30" size={32} />
                  <p className="mt-4 font-display text-lg font-bold text-navy">
                    Aucun chantier dans ce filtre
                  </p>
                </div>
              ) : (
                <Reveal>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onOpen={setLightbox}
                      />
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>

          <section id="rapports-travaux" className="border-y border-mist bg-white/78 py-12 md:py-16">
            <div className="mx-auto max-w-[92rem] px-4 md:px-6">
              <SectionHeading
                eyebrow="Rapports de travaux"
                title="Interventions documentees"
                text={`${filteredReports.length} ${plural(
                  filteredReports.length,
                  "rapport detaille",
                  "rapports detailles",
                )} avec objectif, dates, references administratives et comparatif avant / apres.`}
                aside={
                  <span className="inline-flex items-center gap-2 rounded-xl bg-navy px-3 py-2 text-sm font-semibold text-white shadow-sm">
                    <ClipboardList size={16} className="text-green-bright" />
                    Niveau preuve client
                  </span>
                }
              />

              {filteredReports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-mist bg-white/70 px-6 py-16 text-center">
                  <FileText className="mx-auto text-navy/30" size={32} />
                  <p className="mt-4 font-display text-lg font-bold text-navy">
                    Aucun rapport dans ce filtre
                  </p>
                </div>
              ) : (
                <Reveal>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onOpen={setSelectedReport}
                      />
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </section>

          <section className="bg-sand py-12 md:py-16">
            <div className="mx-auto max-w-[92rem] px-4 md:px-6">
              <div className="rounded-2xl bg-navy px-5 py-6 text-white shadow-modal md:flex md:items-center md:justify-between md:gap-8 md:px-8">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-green-bright">
                    Votre projet
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                    Un chantier a lancer ?
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/68">
                    ALLIANCE M.O BTP accompagne les entreprises, administrations
                    et particuliers pour les travaux de batiment, renovation,
                    rehabilitation et travaux publics.
                  </p>
                </div>
                <Link href="/#contact" className="btn-primary mt-5 shrink-0 md:mt-0">
                  Demander un devis
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <SocialFloat />
      <ReportDetail
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
      <ProjectLightbox project={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
