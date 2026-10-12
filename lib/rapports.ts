export type ReportCategory = "batiments" | "travaux";

export type WorkReport = {
  id: string;
  slug: string;
  title: string;
  client: string;
  clientSlug: string;
  location: string;
  category: ReportCategory;
  objective: string;
  startDate: string;
  endDate: string;
  startLabel: string;
  endLabel: string;
  refs: string[];
  before: string[];
  after: string[];
  cover: string;
};

/**
 * Rapports de travaux OCT — images extraites des Word (public/rapports/).
 * Pas de recommandations (demande client).
 */
export const workReports: WorkReport[] = [
  {
    id: "fenetre-salle-it",
    slug: "fenetre-salle-it",
    title: "Aménagement d'une fenêtre — salle IT",
    client: "OCT",
    clientSlug: "oct",
    location: "Salle IT / open space",
    category: "batiments",
    objective:
      "Installer une fenêtre coulissante dans la salle open space des IT, dans le respect des règles QHSE (délai 1 jour). BDC OCT N°5004.",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    startLabel: "25/03/2026",
    endLabel: "25/03/2026",
    refs: ["BDC OCT N°5004"],
    before: ["/rapports/fenetre-salle-it/01.png"],
    after: [
      "/rapports/fenetre-salle-it/02.png",
      "/rapports/fenetre-salle-it/03.png",
    ],
    cover: "/rapports/fenetre-salle-it/02.png",
  },
  {
    id: "abri-bus-zone-u",
    slug: "abri-bus-zone-u",
    title: "Aménagement d'un abri bus",
    client: "OCT",
    clientSlug: "oct",
    location: "Zone U — conteneur transformé",
    category: "travaux",
    objective:
      "Transformer un conteneur accidenté (zone U) en abri bus, dans le respect des règles QHSE (délai 10 jours). BDC OCT N°4430.",
    startDate: "2026-03-12",
    endDate: "2026-03-19",
    startLabel: "12/03/2026",
    endLabel: "19/03/2026",
    refs: ["BDC OCT N°4430"],
    before: ["/rapports/abri-bus-zone-u/01.png"],
    after: [
      "/rapports/abri-bus-zone-u/02.png",
      "/rapports/abri-bus-zone-u/03.png",
    ],
    cover: "/rapports/abri-bus-zone-u/02.png",
  },
  {
    id: "grilles-bordures-caniveaux-t1",
    slug: "grilles-bordures-caniveaux-t1",
    title: "Installation de grilles et bordures de caniveaux",
    client: "OCT",
    clientSlug: "oct",
    location: "Terminal 1 — zone frigo",
    category: "travaux",
    objective:
      "Remplacer les grilles et bordures de caniveaux au Terminal 1 (zone frigo), dans le respect des règles QHSE (délai 7 jours). BDC OCT N°4291 et 4292.",
    startDate: "2026-03-11",
    endDate: "2026-03-14",
    startLabel: "11/03/2026",
    endLabel: "14/03/2026",
    refs: ["BDC OCT N°4291", "BDC OCT N°4292"],
    before: [
      "/rapports/grilles-bordures-caniveaux-t1/01.png",
      "/rapports/grilles-bordures-caniveaux-t1/02.png",
      "/rapports/grilles-bordures-caniveaux-t1/03.png",
    ],
    after: [
      "/rapports/grilles-bordures-caniveaux-t1/04.png",
      "/rapports/grilles-bordures-caniveaux-t1/05.png",
      "/rapports/grilles-bordures-caniveaux-t1/06.png",
    ],
    cover: "/rapports/grilles-bordures-caniveaux-t1/04.png",
  },
  {
    id: "double-evier-industriel-t1",
    slug: "double-evier-industriel-t1",
    title: "Installation d'un double évier industriel — T1",
    client: "OCT",
    clientSlug: "oct",
    location: "Terminal 1 — près de l'infirmerie",
    category: "batiments",
    objective:
      "Rénover le lave-mains (double évier) au Terminal 1, à côté de l'infirmerie, dans le respect des règles QHSE (délai 3 jours). BDC OCT N°4264.",
    startDate: "2026-02-23",
    endDate: "2026-02-25",
    startLabel: "23/02/2026",
    endLabel: "25/02/2026",
    refs: ["BDC OCT N°4264"],
    before: [
      "/rapports/double-evier-industriel-t1/01.png",
      "/rapports/double-evier-industriel-t1/02.png",
    ],
    after: [
      "/rapports/double-evier-industriel-t1/03.png",
      "/rapports/double-evier-industriel-t1/04.png",
    ],
    cover: "/rapports/double-evier-industriel-t1/03.png",
  },
  {
    id: "conteneur-archives-drh",
    slug: "conteneur-archives-drh",
    title: "Aménagement conteneur archives DRH",
    client: "OCT",
    clientSlug: "oct",
    location: "Conteneur archives DRH",
    category: "batiments",
    objective:
      "Aménager un espace du conteneur archives DRH (fermetures, porte coulissante, finitions), dans le respect des règles QHSE (délai 5 jours). BDC OCT N°4143.",
    startDate: "2026-02-20",
    endDate: "2026-02-23",
    startLabel: "20/02/2026",
    endLabel: "23/02/2026",
    refs: ["BDC OCT N°4143"],
    before: [
      "/rapports/conteneur-archives-drh/01.png",
      "/rapports/conteneur-archives-drh/02.png",
    ],
    after: [
      "/rapports/conteneur-archives-drh/03.png",
      "/rapports/conteneur-archives-drh/04.png",
      "/rapports/conteneur-archives-drh/05.png",
    ],
    cover: "/rapports/conteneur-archives-drh/03.png",
  },
  {
    id: "evier-industriel-t1",
    slug: "evier-industriel-t1",
    title: "Installation d'un évier industriel — T1",
    client: "OCT",
    clientSlug: "oct",
    location: "Terminal 1 — zone frigo",
    category: "batiments",
    objective:
      "Rénover le lave-mains (évier industriel) au Terminal 1, zone frigo, dans le respect des règles QHSE (délai 7 jours). BDC OCT N°4045.",
    startDate: "2026-02-12",
    endDate: "2026-02-16",
    startLabel: "12/02/2026",
    endLabel: "16/02/2026",
    refs: ["BDC OCT N°4045"],
    before: [
      "/rapports/evier-industriel-t1/01.png",
      "/rapports/evier-industriel-t1/02.png",
    ],
    after: [
      "/rapports/evier-industriel-t1/03.png",
      "/rapports/evier-industriel-t1/04.png",
    ],
    cover: "/rapports/evier-industriel-t1/03.png",
  },
];

export const previewReports = workReports.slice(0, 3);

export function getReportBySlug(slug: string) {
  return workReports.find((r) => r.slug === slug);
}
