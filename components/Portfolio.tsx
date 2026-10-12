"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { type Project } from "@/lib/projects";
import ProjectLightbox from "@/components/ProjectLightbox";

export default function Portfolio({ projects }: { projects: Project[] }) {
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const preview = projects.slice(0, 6);

  return (
    <section id="realisations" className="relative bg-navy py-20 text-white md:py-28">
      <div className="plan-on-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label !text-green-bright">Réalisations</span>
          <h2 className="section-title !mt-3 !text-white">
            Nos chantiers & références
          </h2>
          <p className="mt-4 text-body-lg text-white/65">
            Aperçu de quelques chantiers. Cliquez pour agrandir, ou consultez le
            catalogue complet.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setLightbox(project)}
              className="card-chantier group relative overflow-hidden rounded-2xl text-left shadow-rest"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="card-chantier-veil" aria-hidden />
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-navy via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-[2] p-5">
                <p className="mb-1 font-mono text-caption text-green-bright">
                  {project.year}
                  {project.client ? ` · ${project.client}` : ""}
                </p>
                <h3 className="font-display text-lg font-bold leading-snug">
                  {project.title}
                </h3>
                {project.description ? (
                  <p className="mt-1.5 line-clamp-2 text-caption text-white/65">
                    {project.description}
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5 text-caption text-white/55">
                    <MapPin size={14} />
                    {project.location}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/realisations"
            className="btn-primary inline-flex !bg-white !text-navy hover:!bg-green-soft"
          >
            Voir le catalogue
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <ProjectLightbox project={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
