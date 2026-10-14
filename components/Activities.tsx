"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Fan,
  Fence,
  Hammer,
  HardHat,
  Layers,
  Leaf,
  MapPin,
  Paintbrush,
  PanelTop,
  Road,
  ShieldCheck,
  Shovel,
  Square,
  Waves,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Portal from "@/components/Portal";
import { type ActivityContent } from "@/lib/activities-content";

type ActivityCategory = "Bâtiments" | "Travaux Publics";
type ActivityFilter = "Tous" | ActivityCategory;

type Activity = {
  id: string;
  category: ActivityCategory;
  family: string;
  title: string;
  short: string;
  detail: string;
  points: string[];
  applications: string[];
  promise: string;
  icon: LucideIcon;
  image: string;
  location: string;
};

const filters: ActivityFilter[] = ["Tous", "Bâtiments", "Travaux Publics"];

const activities: Activity[] = [
  {
    id: "electricite",
    category: "Bâtiments",
    family: "Lots techniques",
    title: "Électricité HT / BT",
    short: "Installations électriques haute et basse tension.",
    detail:
      "Conception, mise en place et remise aux normes des installations électriques pour locaux professionnels, bâtiments administratifs et espaces techniques.",
    points: ["Tableaux et câblage", "Éclairage intérieur / extérieur", "Mise aux normes"],
    applications: ["Bureaux", "Locaux techniques", "Sites occupés"],
    promise:
      "Interventions préparées, sécurisées et livrées avec une attention forte à la continuité d'activité du client.",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "plomberie",
    category: "Bâtiments",
    family: "Lots techniques",
    title: "Plomberie",
    short: "Réseaux d'eau, évacuation et équipements sanitaires.",
    detail:
      "Installation, rénovation et maintenance des réseaux d'alimentation, d'évacuation et des équipements sanitaires pour des locaux fiables et fonctionnels.",
    points: ["Alimentation et évacuation", "Sanitaires et robinetterie", "Réparation de fuites"],
    applications: ["Sanitaires", "Bâtiments tertiaires", "Rénovations"],
    promise:
      "Des réseaux lisibles, accessibles et réalisés pour limiter les reprises après livraison.",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "carrelage",
    category: "Bâtiments",
    family: "Finitions",
    title: "Carrelage",
    short: "Pose de revêtements carrelés pour sols et murs.",
    detail:
      "Préparation des supports, calepinage, pose et finitions de carrelage dans les zones sèches ou humides, avec un rendu net et durable.",
    points: ["Préparation des supports", "Pose sols et murs", "Étanchéité pièces humides"],
    applications: ["Sanitaires", "Accueil public", "Locaux professionnels"],
    promise:
      "Un niveau de finition propre, pensé pour l'usage quotidien et la facilité d'entretien.",
    icon: Square,
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "maconnerie",
    category: "Bâtiments",
    family: "Gros œuvre",
    title: "Maçonnerie",
    short: "Ouvrages maçonnés, reprises et gros œuvre.",
    detail:
      "Réalisation de fondations, élévations, enduits, reprises et ouvrages maçonnés adaptés aux contraintes de chantier et au climat local.",
    points: ["Fondations et élévation", "Enduits et finitions", "Ouvertures et renforts"],
    applications: ["Extensions", "Réparations", "Locaux techniques"],
    promise:
      "Une exécution robuste, suivie et coordonnée avec les autres corps d'état.",
    icon: HardHat,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=900&fit=crop&q=80",
    location: "Akanda · Gabon",
  },
  {
    id: "renovation",
    category: "Bâtiments",
    family: "Réhabilitation",
    title: "Rénovation de bâtiments",
    short: "Modernisation d'espaces existants.",
    detail:
      "Rénovation partielle ou complète de locaux avec coordination multi-corps d'état, mise à niveau technique et amélioration du confort d'usage.",
    points: ["Diagnostic et planning", "Travaux multi-corps d'état", "Finitions soignées"],
    applications: ["Bureaux", "Espaces clients", "Locaux administratifs"],
    promise:
      "Un chantier organisé par phases pour garder la maîtrise des délais, des accès et de la qualité.",
    icon: Paintbrush,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "rehabilitation",
    category: "Bâtiments",
    family: "Réhabilitation",
    title: "Réhabilitation de bâtiments",
    short: "Remise en état, adaptation et valorisation.",
    detail:
      "Remise en état de bâtiments existants, amélioration de la sécurité, adaptation à de nouveaux usages et valorisation des espaces livrés.",
    points: ["Renforcement structurel", "Mise aux normes", "Valorisation du patrimoine"],
    applications: ["Sites anciens", "Bâtiments occupés", "Réaménagements"],
    promise:
      "Une lecture claire de l'existant avant travaux pour intervenir avec précision.",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=900&fit=crop&q=80",
    location: "Owendo · Gabon",
  },
  {
    id: "revetement-sol",
    category: "Bâtiments",
    family: "Finitions",
    title: "Revêtement de sol",
    short: "Sols intérieurs adaptés aux usages du site.",
    detail:
      "Préparation, pose et reprise de revêtements de sol pour améliorer la résistance, l'esthétique et la facilité d'entretien des locaux.",
    points: ["Préparation du support", "Pose soignée", "Finitions et joints"],
    applications: ["Circulations", "Bureaux", "Espaces de service"],
    promise:
      "Des finitions régulières et adaptées à la fréquentation réelle des espaces.",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1595514535116-d0401260e7cf?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "revetement-mural",
    category: "Bâtiments",
    family: "Finitions",
    title: "Revêtement mural",
    short: "Traitement esthétique et protection des murs.",
    detail:
      "Préparation des supports, application de revêtements, peintures, panneaux ou protections murales selon les contraintes d'usage.",
    points: ["Préparation des murs", "Pose / application", "Finitions"],
    applications: ["Accueil", "Bureaux", "Zones de passage"],
    promise:
      "Un rendu sobre, propre et cohérent avec l'image professionnelle du client.",
    icon: PanelTop,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "faux-plafonds",
    category: "Bâtiments",
    family: "Aménagement intérieur",
    title: "Faux plafonds",
    short: "Plafonds techniques, décoratifs et fonctionnels.",
    detail:
      "Réalisation de faux plafonds pour améliorer l'acoustique, l'esthétique, l'isolation et l'intégration des équipements techniques.",
    points: ["Plafonds techniques", "Isolation", "Intégration éclairage"],
    applications: ["Bureaux", "Salles de réunion", "Espaces commerciaux"],
    promise:
      "Une intégration discrète des réseaux, avec des finitions nettes et accessibles.",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "espaces-verts",
    category: "Bâtiments",
    family: "Aménagement extérieur",
    title: "Entretien d'espaces verts",
    short: "Aménagement, entretien et mise en valeur paysagère.",
    detail:
      "Création, entretien et valorisation des espaces extérieurs autour des bâtiments afin de renforcer la qualité d'accueil et l'image du site.",
    points: ["Entretien régulier", "Plantation", "Mise en valeur"],
    applications: ["Abords de bureaux", "Cours", "Espaces clients"],
    promise:
      "Des extérieurs propres, lisibles et entretenus selon le rythme d'exploitation du site.",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "froid-clim",
    category: "Bâtiments",
    family: "Lots techniques",
    title: "Froid et climatisation",
    short: "Confort thermique et maintenance des équipements.",
    detail:
      "Installation, contrôle et entretien de systèmes de climatisation et de froid pour stabiliser le confort thermique des locaux.",
    points: ["Étude des besoins", "Pose et mise en service", "Entretien préventif"],
    applications: ["Bureaux", "Locaux techniques", "Espaces recevant du public"],
    promise:
      "Des solutions dimensionnées avec sérieux pour limiter les pannes et les surconsommations.",
    icon: Fan,
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "vrd",
    category: "Travaux Publics",
    family: "Voirie et réseaux",
    title: "VRD",
    short: "Voirie, accès et réseaux divers.",
    detail:
      "Réalisation de voies d'accès, réseaux divers et aménagements extérieurs permettant de desservir les sites avec une lecture technique claire.",
    points: ["Voirie légère", "Réseaux divers", "Aménagements d'accès"],
    applications: ["Accès chantier", "Plateformes", "Sites industriels"],
    promise:
      "Une coordination terrain précise pour assurer continuité, drainage et exploitabilité.",
    icon: Road,
    image:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&h=900&fit=crop&q=80",
    location: "Estuaire · Gabon",
  },
  {
    id: "bordures",
    category: "Travaux Publics",
    family: "Voirie et réseaux",
    title: "Pose de bordures",
    short: "Bordures de voirie, caniveaux et délimitations.",
    detail:
      "Implantation, nivellement et pose de bordures pour structurer les circulations, protéger les abords et organiser les écoulements.",
    points: ["Tracé et nivellement", "Pose de bordures", "Finitions"],
    applications: ["Parkings", "Voies internes", "Caniveaux"],
    promise:
      "Des alignements propres et des finitions contrôlées pour un rendu durable.",
    icon: Fence,
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "profilage-laterite",
    category: "Travaux Publics",
    family: "Terrassement",
    title: "Profilage de voie latéritique",
    short: "Mise en forme, nivellement et compactage.",
    detail:
      "Profilage et entretien de voies latéritiques pour améliorer la circulation, corriger les déformations et prolonger la tenue des accès.",
    points: ["Nivellement", "Profilage", "Compactage"],
    applications: ["Pistes", "Accès chantier", "Voiries internes"],
    promise:
      "Un traitement du support adapté aux contraintes d'eau, de pente et de trafic.",
    icon: Shovel,
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&h=900&fit=crop&q=80",
    location: "Estuaire · Gabon",
  },
  {
    id: "assainissement",
    category: "Travaux Publics",
    family: "Réseaux humides",
    title: "Assainissement",
    short: "Évacuation des eaux, drainage et ouvrages associés.",
    detail:
      "Mise en place de solutions d'assainissement et de drainage pour protéger les sites, maîtriser les écoulements et respecter l'environnement.",
    points: ["Réseaux d'évacuation", "Drainage", "Ouvrages d'assainissement"],
    applications: ["Sites bâtis", "Voiries", "Zones sensibles à l'eau"],
    promise:
      "Des ouvrages pensés pour fonctionner dans la durée, même en saison de fortes pluies.",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "terrassement",
    category: "Travaux Publics",
    family: "Terrassement",
    title: "Terrassement",
    short: "Préparation des terrains avant construction.",
    detail:
      "Déblais, remblais, nivellement et préparation de plateformes pour sécuriser les bases d'un chantier ou d'un futur aménagement.",
    points: ["Déblais et remblais", "Nivellement", "Plateformes de chantier"],
    applications: ["Implantations", "Plateformes", "Accès provisoires"],
    promise:
      "Une préparation de terrain claire, stable et compatible avec la suite des travaux.",
    icon: Hammer,
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop&q=80",
    location: "Akanda · Gabon",
  },
  {
    id: "paves",
    category: "Travaux Publics",
    family: "Aménagement extérieur",
    title: "Pose de pavés",
    short: "Revêtements extérieurs pour circulation et accueil.",
    detail:
      "Préparation du support, pose de pavés et finitions pour allées, parkings, accès et espaces publics à forte exigence visuelle.",
    points: ["Préparation du support", "Pose de pavés", "Joints et finitions"],
    applications: ["Parkings", "Cheminements", "Cours et accès"],
    promise:
      "Un revêtement régulier, esthétique et adapté aux passages répétés.",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=900&fit=crop&q=80",
    location: "Libreville · Gabon",
  },
  {
    id: "forage",
    category: "Travaux Publics",
    family: "Réseaux humides",
    title: "Forage",
    short: "Accès à l'eau, équipements et mise en service.",
    detail:
      "Travaux de forage et équipements associés pour répondre aux besoins en eau selon les contraintes techniques et la configuration du site.",
    points: ["Étude de faisabilité", "Forage et équipement", "Mise en service"],
    applications: ["Sites isolés", "Bases vie", "Besoin d'appoint"],
    promise:
      "Une approche pragmatique, depuis l'analyse du besoin jusqu'à la mise en exploitation.",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=900&fit=crop&q=80",
    location: "Intérieur · Gabon",
  },
];

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Droplets,
  Fan,
  Fence,
  Hammer,
  HardHat,
  Layers,
  Leaf,
  Paintbrush,
  PanelTop,
  Road,
  Shovel,
  Square,
  Waves,
  Zap,
};

export default function Activities({
  activitiesContent,
  imageOverrides = {},
}: {
  activitiesContent?: ActivityContent[];
  imageOverrides?: Record<string, string>;
}) {
  const [selected, setSelected] = useState<Activity | null>(null);
  const [filter, setFilter] = useState<ActivityFilter>("Tous");
  const [expanded, setExpanded] = useState(false);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCols(4);
      else if (width >= 1024) setCols(3);
      else if (width >= 640) setCols(2);
      else setCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
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

  const sourceActivities = useMemo<Activity[]>(
    () =>
      activitiesContent?.length
        ? activitiesContent
            .map((activity) => ({
              ...activity,
              icon: iconMap[activity.icon] ?? HardHat,
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        : activities,
    [activitiesContent],
  );

  const filtered = useMemo(
    () =>
      filter === "Tous"
        ? sourceActivities
        : sourceActivities.filter((activity) => activity.category === filter),
    [filter, sourceActivities],
  );

  const previewCount = cols * 2;
  const hasMore = filtered.length > previewCount;
  const visible = expanded || !hasMore ? filtered : filtered.slice(0, previewCount);
  const hiddenCount = filtered.length - previewCount;

  const setFilterAndCollapse = (tab: ActivityFilter) => {
    setFilter(tab);
    setExpanded(false);
  };

  const activityImage = (activity: Activity) =>
    imageOverrides[`activity:${activity.id}`] || activity.image;

  return (
    <section
      id="activites"
      className="relative overflow-hidden bg-sand py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-[92rem] px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Activités</span>
          <h2 className="section-title">Ce que nous savons faire</h2>
          <p className="mt-4 text-body-lg text-muted">
            Deux domaines, des familles métier lisibles, et des fiches détaillées
            pour comprendre rapidement notre champ d&apos;intervention.
          </p>
        </div>

        <div className="mt-9 flex justify-center">
          <div
            className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-mist bg-white p-1.5"
            role="tablist"
            aria-label="Filtrer les domaines"
          >
            {filters.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={filter === tab}
                onClick={() => setFilterAndCollapse(tab)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                  filter === tab
                    ? "bg-navy text-white shadow-md shadow-navy/25"
                    : "text-muted hover:bg-sand hover:text-navy"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((activity) => {
              const Icon = activity.icon;
              const isActive = selected?.id === activity.id;
              const imageUrl = activityImage(activity);

              return (
                <article
                  key={activity.id}
                  className={`group card-lift overflow-hidden rounded-2xl border bg-white text-left shadow-sm ${
                    isActive
                      ? "border-green shadow-hover ring-2 ring-green/30"
                      : "border-mist/80 hover:border-green/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(activity)}
                    className="w-full text-left"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`${activity.title} - ${activity.location}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="img-zoom object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy shadow-sm">
                        {activity.family}
                      </span>
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/95">
                        <MapPin size={13} />
                        {activity.location}
                      </span>
                      <div
                        className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition ${
                          isActive
                            ? "bg-green text-white"
                            : "bg-white text-green group-hover:bg-green group-hover:text-white"
                        }`}
                      >
                        <Icon size={19} />
                      </div>
                    </div>
                    <div className="p-4 pb-3">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-green">
                        <span className="h-1.5 w-1.5 rounded-full bg-green" />
                        {activity.category === "Bâtiments" ? "Bâtiment" : "Infrastructure"}
                      </div>
                      <h3 className="font-display text-lg font-bold text-navy">
                        {activity.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {activity.short}
                      </p>
                    </div>
                  </button>
                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => setSelected(activity)}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green transition hover:bg-green hover:text-white"
                    >
                      Voir la fiche
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMore && !expanded && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sand via-sand/80 to-transparent"
              aria-hidden
            />
          )}
        </div>

        {hasMore && (
          <div className="relative z-10 mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-green hover:bg-green hover:text-white"
            >
              {expanded ? (
                <>
                  Voir moins
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/8 transition group-hover:bg-white/20">
                    <ChevronUp size={16} />
                  </span>
                </>
              ) : (
                <>
                  Voir plus
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-green-soft px-2 text-xs font-bold text-green transition group-hover:bg-white/25 group-hover:text-white">
                    +{hiddenCount}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/8 transition group-hover:bg-white/20">
                    <ChevronDown size={16} />
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        <p className="mt-10 text-center text-sm italic text-muted">
          N.B. : La liste des domaines d&apos;activités présentée ci-dessus
          n&apos;est point exhaustive.
        </p>
      </div>

      {selected && (
        <Portal>
          <div
            className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-title"
          >
            <button
              type="button"
              className="animate-backdrop-in absolute inset-0 border-0 bg-navy/45 backdrop-blur-[7px]"
              aria-label="Fermer"
              onClick={() => setSelected(null)}
            />
            <div className="animate-modal-in relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-modal sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl">
              <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto sm:max-h-[calc(100dvh-3rem)]">
                <div className="relative min-h-64 overflow-hidden bg-navy sm:min-h-80">
                  <Image
                    src={activityImage(selected)}
                    alt={`${selected.title} - ${selected.location}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-navy shadow-lg transition hover:bg-mist"
                    aria-label="Fermer le détail"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-green px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
                        {selected.family}
                      </span>
                      <span className="rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                        {selected.category}
                      </span>
                    </div>
                    <h3
                      id="activity-title"
                      className="max-w-2xl font-display text-3xl font-bold leading-tight text-white md:text-5xl"
                    >
                      {selected.title}
                    </h3>
                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-white/85">
                      <MapPin size={16} />
                      {selected.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 bg-sand/60 p-5 sm:p-6 md:p-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-mist bg-white p-4 shadow-sm">
                      <BriefcaseBusiness size={20} className="text-green" />
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                        Domaine
                      </p>
                      <p className="mt-1 font-semibold text-navy">{selected.category}</p>
                    </div>
                    <div className="rounded-2xl border border-mist bg-white p-4 shadow-sm">
                      <selected.icon size={20} className="text-green" />
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                        Famille métier
                      </p>
                      <p className="mt-1 font-semibold text-navy">{selected.family}</p>
                    </div>
                    <div className="rounded-2xl border border-mist bg-white p-4 shadow-sm">
                      <ShieldCheck size={20} className="text-green" />
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                        Approche
                      </p>
                      <p className="mt-1 font-semibold text-navy">Qualité, sécurité, délais</p>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm md:p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">
                        Lecture professionnelle
                      </p>
                      <h4 className="mt-2 font-display text-2xl font-bold text-navy">
                        Ce que couvre la prestation
                      </h4>
                      <p className="mt-4 text-base leading-relaxed text-muted">
                        {selected.detail}
                      </p>
                    </section>

                    <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm md:p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">
                        Engagement
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-muted">
                        {selected.promise}
                      </p>
                      <div className="mt-5 rounded-2xl bg-green-soft p-4 text-sm font-medium leading-relaxed text-green">
                        Image illustrative remplaçable depuis l&apos;administration
                        lorsque les photos de chantier définitives sont disponibles.
                      </div>
                    </section>
                  </div>

                  <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">
                          Périmètre
                        </p>
                        <h4 className="mt-2 font-display text-2xl font-bold text-navy">
                          Points clés et applications
                        </h4>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {selected.points.map((point) => (
                        <div
                          key={point}
                          className="flex gap-3 rounded-xl border border-mist bg-sand/70 p-4 text-sm font-medium text-navy"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-green"
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {selected.applications.map((application) => (
                        <span
                          key={application}
                          className="rounded-lg border border-mist bg-white px-3 py-2 text-sm font-semibold text-navy"
                        >
                          {application}
                        </span>
                      ))}
                    </div>
                  </section>

                  <div className="flex flex-col gap-3 border-t border-mist pt-5 sm:flex-row">
                    <a
                      href="#contact"
                      onClick={() => setSelected(null)}
                      className="btn-primary flex-1 text-center"
                    >
                      Demander un devis
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="btn-outline flex-1"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}
