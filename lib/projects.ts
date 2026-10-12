export type ProjectCategory = "batiments" | "travaux";

export type Project = {
  id: number;
  title: string;
  location: string;
  image: string;
  /** Galerie (image principale + autres) */
  images: string[];
  category: ProjectCategory;
  year: number;
  client?: string;
  description?: string;
};

/**
 * Fallback local si Supabase indisponible.
 * Source de vérité en prod : table catalog_projects.
 */
export const projects: Project[] = [
  {
    id: 1,
    title: "Réaménagement des bureaux — service Facturation",
    location: "Libreville",
    image: "/chantiers/appartement-f4.jpg",
    images: [
      "/chantiers/appartement-f4.jpg",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=900&fit=crop&q=80",
    ],
    category: "batiments",
    year: 2024,
    client: "Grande Pharmacie des Forestiers",
    description:
      "Travaux de réaménagement des bureaux du service Facturation pour la Grande Pharmacie des Forestiers.",
  },
  {
    id: 9,
    title: "Maintenance groupe électrogène PERKINS 150 KVA",
    location: "Libreville",
    image: "/chantiers/dgpe-groupe.jpg",
    images: [
      "/chantiers/dgpe-groupe.jpg",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=900&fit=crop&q=80",
    ],
    category: "travaux",
    year: 2025,
    client: "DGPE",
    description:
      "Maintenance d'un groupe électrogène PERKINS de 150 KVA pour la Direction Générale du Patrimoine de l'État.",
  },
  {
    id: 11,
    title: "Rénovation appartements type F3 — Akanda",
    location: "Akanda",
    image: "/chantiers/appartement-f4.jpg",
    images: [
      "/chantiers/appartement-f4.jpg",
      "/chantiers/fondations-peche.jpg",
    ],
    category: "batiments",
    year: 2025,
    client: "Particulier",
    description:
      "Rénovation de deux appartements type F3 à Akanda — suivi de chantier en milieu résidentiel gabonais.",
  },
  {
    id: 12,
    title: "Rénovation du bâtiment écloserie",
    location: "Libreville",
    image: "/chantiers/ecloserie.jpg",
    images: ["/chantiers/ecloserie.jpg", "/chantiers/fondations-peche.jpg"],
    category: "travaux",
    year: 2025,
    client: "Ministère des Eaux et Forêts",
    description:
      "Travaux de rénovation du bâtiment écloserie (Direction Provinciale de la Pêche et de l'Aquaculture).",
  },
];

export const previewProjects = projects.slice(0, 6);

export const categoryLabel: Record<ProjectCategory | "all", string> = {
  all: "Tout",
  batiments: "Bâtiments",
  travaux: "Travaux publics",
};

export function projectGallery(p: Project): string[] {
  const list = [p.image, ...(p.images ?? [])].filter(Boolean);
  return [...new Set(list)];
}
