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
  {
    id: 15,
    title: "Amenagement d'une fenetre - salle IT OCT",
    location: "Salle IT / open space",
    image: "/rapports/fenetre-salle-it/02.png",
    images: [
      "/rapports/fenetre-salle-it/01.png",
      "/rapports/fenetre-salle-it/02.png",
      "/rapports/fenetre-salle-it/03.png",
    ],
    category: "batiments",
    year: 2026,
    client: "OCT",
    description:
      "Installation d'une fenetre coulissante dans la salle open space des IT, documentee par rapport de travaux.",
  },
  {
    id: 16,
    title: "Amenagement d'un abri bus - OCT zone U",
    location: "Zone U - conteneur transforme",
    image: "/rapports/abri-bus-zone-u/02.png",
    images: [
      "/rapports/abri-bus-zone-u/01.png",
      "/rapports/abri-bus-zone-u/02.png",
      "/rapports/abri-bus-zone-u/03.png",
    ],
    category: "travaux",
    year: 2026,
    client: "OCT",
    description:
      "Transformation d'un conteneur accidente en abri bus sur site OCT.",
  },
  {
    id: 17,
    title: "Grilles et bordures de caniveaux - OCT T1",
    location: "Terminal 1 - zone frigo",
    image: "/rapports/grilles-bordures-caniveaux-t1/04.png",
    images: [
      "/rapports/grilles-bordures-caniveaux-t1/01.png",
      "/rapports/grilles-bordures-caniveaux-t1/02.png",
      "/rapports/grilles-bordures-caniveaux-t1/03.png",
      "/rapports/grilles-bordures-caniveaux-t1/04.png",
      "/rapports/grilles-bordures-caniveaux-t1/05.png",
      "/rapports/grilles-bordures-caniveaux-t1/06.png",
    ],
    category: "travaux",
    year: 2026,
    client: "OCT",
    description:
      "Remplacement des grilles et bordures de caniveaux au Terminal 1, zone frigo.",
  },
  {
    id: 18,
    title: "Double evier industriel - OCT T1",
    location: "Terminal 1 - pres de l'infirmerie",
    image: "/rapports/double-evier-industriel-t1/03.png",
    images: [
      "/rapports/double-evier-industriel-t1/01.png",
      "/rapports/double-evier-industriel-t1/02.png",
      "/rapports/double-evier-industriel-t1/03.png",
      "/rapports/double-evier-industriel-t1/04.png",
    ],
    category: "batiments",
    year: 2026,
    client: "OCT",
    description:
      "Renovation du lave-mains avec installation d'un double evier industriel.",
  },
  {
    id: 19,
    title: "Amenagement conteneur archives DRH - OCT",
    location: "Conteneur archives DRH",
    image: "/rapports/conteneur-archives-drh/03.png",
    images: [
      "/rapports/conteneur-archives-drh/01.png",
      "/rapports/conteneur-archives-drh/02.png",
      "/rapports/conteneur-archives-drh/03.png",
      "/rapports/conteneur-archives-drh/04.png",
      "/rapports/conteneur-archives-drh/05.png",
    ],
    category: "batiments",
    year: 2026,
    client: "OCT",
    description:
      "Amenagement d'un espace d'archives DRH avec fermetures, porte coulissante et finitions.",
  },
  {
    id: 20,
    title: "Evier industriel - OCT T1 zone frigo",
    location: "Terminal 1 - zone frigo",
    image: "/rapports/evier-industriel-t1/03.png",
    images: [
      "/rapports/evier-industriel-t1/01.png",
      "/rapports/evier-industriel-t1/02.png",
      "/rapports/evier-industriel-t1/03.png",
      "/rapports/evier-industriel-t1/04.png",
    ],
    category: "batiments",
    year: 2026,
    client: "OCT",
    description:
      "Renovation du lave-mains avec installation d'un evier industriel au Terminal 1.",
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
