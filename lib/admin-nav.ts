export const ADMIN_NAV = [
  {
    href: "/gestion-alliance",
    label: "Vue d'ensemble",
    description: "Stats et fréquentation",
  },
  {
    href: "/gestion-alliance/contenu",
    label: "Contenu",
    description: "Textes et sections",
  },
  {
    href: "/gestion-alliance/medias",
    label: "Médias",
    description: "Images et fichiers",
  },
  {
    href: "/gestion-alliance/images-provisoires",
    label: "Images provisoires",
    description: "Remplacements publics",
  },
  {
    href: "/gestion-alliance/activites",
    label: "Activités",
    description: "Savoir-faire public",
  },
  {
    href: "/gestion-alliance/hse",
    label: "HSE",
    description: "Sécurité et qualité",
  },
  {
    href: "/gestion-alliance/moyens",
    label: "Moyens",
    description: "Organisation et matériel",
  },
  {
    href: "/gestion-alliance/realisations",
    label: "Réalisations",
    description: "Chantiers et rapports",
  },
  {
    href: "/gestion-alliance/clients",
    label: "Clients",
    description: "Références",
  },
  {
    href: "/gestion-alliance/contact",
    label: "Contact",
    description: "Coordonnées",
  },
  {
    href: "/gestion-alliance/parametres",
    label: "Paramètres",
    description: "Compte et site",
  },
] as const;

export type AdminNavHref = (typeof ADMIN_NAV)[number]["href"];
