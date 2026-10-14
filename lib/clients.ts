export type ClientProject = {
  year: number;
  description: string;
};

export type ClientRef = {
  id: string;
  name: string;
  shortName: string;
  /** Chemin public du logo, ou null si pas de logo */
  logo: string | null;
  /** Client principal mis en avant */
  featured?: boolean;
  /** Texte affiché dans la fiche client (au-dessus de la liste) */
  summary?: string;
  /** Slug pour filtrer /realisations?client=… (préparé pour plus tard) */
  slug: string;
  projects: ClientProject[];
};

/**
 * Références clients — source unique.
 * Ajouter un logo : placer le fichier dans public/clients/ et renseigner `logo`.
 */
export const clients: ClientRef[] = [
  {
    id: "oct",
    name: "Owendo Container Terminal",
    shortName: "OCT",
    logo: "/clients/oct.png",
    featured: true,
    slug: "oct",
    summary:
      "Notre principal client est OCT. Plus de 20 travaux effectués sur leur site à Owendo — dont les rapports documentés (fenêtre IT, abri bus, caniveaux, éviers, conteneur DRH).",
    projects: [
      {
        year: 2026,
        description:
          "Aménagement d'une fenêtre — salle IT (BDC N°5004)",
      },
      {
        year: 2026,
        description: "Aménagement d'un abri bus — zone U (BDC N°4430)",
      },
      {
        year: 2026,
        description:
          "Grilles et bordures de caniveaux — T1 zone frigo (BDC N°4291 / 4292)",
      },
      {
        year: 2026,
        description:
          "Double évier industriel — T1 près de l'infirmerie (BDC N°4264)",
      },
      {
        year: 2026,
        description: "Aménagement conteneur archives DRH (BDC N°4143)",
      },
      {
        year: 2026,
        description: "Évier industriel — T1 zone frigo (BDC N°4045)",
      },
    ],
  },
  {
    id: "pharmacie-forestiers",
    name: "Grande Pharmacie des Forestiers",
    shortName: "Pharmacie des Forestiers",
    logo: "/clients/pharmacie-forestiers.png",
    slug: "pharmacie-forestiers",
    projects: [
      {
        year: 2024,
        description:
          "Travaux de réaménagement des bureaux du service Facturation",
      },
      {
        year: 2024,
        description:
          "Réaménagement du garage de la villa du Directeur Informatique (Batterie IV)",
      },
      {
        year: 2024,
        description:
          "Construction d'une salle de stockage en Placoplâtre avec isolation thermique et phonique",
      },
      {
        year: 2025,
        description:
          "Maintenance en plomberie (circuit d'alimentation et d'évacuation d'eau)",
      },
    ],
  },
  {
    id: "gonelec",
    name: "GONELEC",
    shortName: "GONELEC",
    logo: "/clients/gonelec.png",
    slug: "gonelec",
    projects: [
      {
        year: 2024,
        description: "Réalisation des plans de récolement",
      },
    ],
  },
  {
    id: "imp-conseils",
    name: "IMP Conseils",
    shortName: "IMP Conseils",
    logo: "/clients/imp-conseils.png",
    slug: "imp-conseils",
    projects: [
      {
        year: 2024,
        description: "Rénovation de deux appartements à l'Ancienne Sobraga",
      },
      {
        year: 2024,
        description: "Réhabilitation des bureaux Ex BS Gabon",
      },
      {
        year: 2024,
        description:
          "Traitement des fissures, étanchéité du bâtiment de la Galerie de l'Esplanade",
      },
    ],
  },
  {
    id: "dgpe",
    name: "Direction Générale du Patrimoine de l'État",
    shortName: "DGPE",
    logo: "/clients/dgpe.png",
    slug: "dgpe",
    projects: [
      {
        year: 2025,
        description: "Maintenance d'un groupe électrogène PERKINS de 150 KVA",
      },
    ],
  },
  {
    id: "assurances",
    name: "Direction Nationale des Assurances",
    shortName: "DNA",
    logo: "/clients/assurances.png",
    slug: "assurances",
    projects: [
      {
        year: 2025,
        description: "Aménagement de bureau",
      },
    ],
  },
  {
    id: "particuliers",
    name: "Particuliers",
    shortName: "Particuliers",
    logo: null,
    slug: "particuliers",
    projects: [
      {
        year: 2025,
        description: "Rénovation de deux appartements type F3 à Akanda",
      },
    ],
  },
  {
    id: "eaux-forets",
    name: "Ministère des Eaux et Forêts",
    shortName: "Eaux et Forêts",
    logo: "/clients/eaux-forets.png",
    slug: "eaux-forets",
    projects: [
      {
        year: 2025,
        description:
          "Rénovation du bâtiment écloserie (Direction Provinciale de la Pêche et de l'Aquaculture)",
      },
    ],
  },
];

export const featuredClient = clients.find((c) => c.featured) ?? clients[0];
export const otherClients = clients.filter((c) => !c.featured);

/** Associe un projet catalogue à un client (titre / mots-clés) */
export function projectMatchesClient(
  projectTitle: string,
  client: ClientRef,
  projectClient?: string | null,
): boolean {
  const hay = `${projectTitle} ${projectClient ?? ""}`.toLowerCase();
  switch (client.slug) {
    case "pharmacie-forestiers":
      return hay.includes("pharmacie") || hay.includes("forestiers");
    case "gonelec":
      return hay.includes("gonelec");
    case "imp-conseils":
      return hay.includes("imp");
    case "dgpe":
      return hay.includes("dgpe") || hay.includes("patrimoine");
    case "assurances":
      return hay.includes("assurance");
    case "eaux-forets":
      return (
        hay.includes("eaux") ||
        hay.includes("forêt") ||
        hay.includes("foret") ||
        hay.includes("écloserie")
      );
    case "particuliers":
      return hay.includes("particulier");
    case "oct":
      return (
        hay.includes("oct") ||
        hay.includes("owendo container") ||
        (hay.includes("owendo") && hay.includes("terminal"))
      );
    default:
      return hay.includes(client.shortName.toLowerCase());
  }
}
