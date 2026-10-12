export type OrgBoxContent = {
  title: string;
  name?: string;
  count?: number;
  role: string;
};

export type EquipmentContent = {
  icon: string;
  name: string;
  brand: string;
  qty: number;
  condition: "Bon" | "Excellent";
};

export type EquipmentGroupContent = {
  title: string;
  description: string;
  icon: string;
  items: EquipmentContent[];
};

export type MeansStatContent = {
  label: string;
  value: string;
  icon: string;
};

export type MeansContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: MeansStatContent[];
  organization: {
    title: string;
    subtitle: string;
    badge: string;
    manager: OrgBoxContent;
    level2: OrgBoxContent[];
    level3: OrgBoxContent[];
    workers: OrgBoxContent;
  };
  equipment: {
    title: string;
    badge: string;
    ownerLabel: string;
    groups: EquipmentGroupContent[];
  };
  guaranteeLabel: string;
  guaranteeTitle: string;
  commitments: string[];
};

export const DEFAULT_MEANS_CONTENT: MeansContent = {
  eyebrow: "Moyens",
  title: "Organisation & matériel",
  subtitle:
    "Une structure opérationnelle claire, un parc matériel maîtrisé et des responsabilités identifiées pour piloter chaque chantier avec sérieux.",
  stats: [
    { label: "Collaborateurs mobilisables", value: "18+", icon: "Users" },
    { label: "Références matériel", value: "12", icon: "Wrench" },
    { label: "Pôles d'intervention", value: "02", icon: "Layers" },
    { label: "Suivi QHSE intégré", value: "QHSE", icon: "ShieldCheck" },
  ],
  organization: {
    title: "Organisation opérationnelle",
    subtitle: "Direction, conduite travaux, QHSE et équipes terrain",
    badge: "Structure officielle",
    manager: {
      title: "Gérant",
      name: "Jean Dominique OKE EBANG",
      role: "Direction générale, arbitrage et relation client",
    },
    level2: [
      {
        title: "Ingénieur Génie Civil",
        name: "Burrel MENIE",
        count: 1,
        role: "Études, méthodes et validation technique",
      },
      {
        title: "Conducteur Travaux",
        name: "Roland Oleri",
        count: 1,
        role: "Planification, coordination et suivi terrain",
      },
      {
        title: "Responsable QHSE",
        name: "Landry MATEYI",
        count: 1,
        role: "Qualité, hygiène, sécurité et environnement",
      },
    ],
    level3: [
      {
        title: "Dessinateur",
        count: 1,
        role: "Plans, détails d'exécution et supports techniques",
      },
      {
        title: "Techniciens Supérieurs",
        count: 3,
        role: "Encadrement de proximité et contrôle des travaux",
      },
      {
        title: "Secrétaire",
        count: 1,
        role: "Administration, dossiers et coordination documentaire",
      },
    ],
    workers: {
      title: "Ouvriers",
      count: 10,
      role: "Exécution des travaux sur chantier",
    },
  },
  equipment: {
    title: "Parc matériel",
    badge: "Inventaire maîtrisé",
    ownerLabel: "Propriété ALLIANCE M.O BTP",
    groups: [
      {
        title: "Production béton & maçonnerie",
        description: "Moyens de fabrication, vibration et production d'ouvrages.",
        icon: "BrickWall",
        items: [
          {
            icon: "Settings",
            name: "Bétonnière à benne de 120 L",
            brand: "HATZ (3 ans et 1 an)",
            qty: 2,
            condition: "Bon",
          },
          {
            icon: "Waves",
            name: "Vibreur avec lot d'aiguilles",
            brand: "HONDA",
            qty: 2,
            condition: "Bon",
          },
          {
            icon: "BrickWall",
            name: "Pondeuse à brique industrielle",
            brand: "Marque non précisée",
            qty: 1,
            condition: "Excellent",
          },
        ],
      },
      {
        title: "Transport & accès chantier",
        description: "Véhicules et équipements pour approvisionnement et mobilité.",
        icon: "Truck",
        items: [
          {
            icon: "Truck",
            name: "Camionnette Pick-up",
            brand: "NISSAN HARDBODY",
            qty: 1,
            condition: "Bon",
          },
          {
            icon: "Truck",
            name: "Camionnette Pick-up",
            brand: "MAZDA BT50",
            qty: 1,
            condition: "Bon",
          },
          {
            icon: "HardHat",
            name: "Échafaudage façadier 104 m²",
            brand: "Marque non précisée",
            qty: 2,
            condition: "Excellent",
          },
        ],
      },
      {
        title: "Énergie & perforation",
        description: "Matériel d'appui pour travaux techniques et reprises lourdes.",
        icon: "Zap",
        items: [
          { icon: "Zap", name: "Compresseur", brand: "HONDA", qty: 1, condition: "Bon" },
          {
            icon: "Zap",
            name: "Compresseur",
            brand: "Marque non précisée",
            qty: 2,
            condition: "Bon",
          },
          { icon: "Zap", name: "Groupe électrogène", brand: "Total", qty: 2, condition: "Bon" },
          { icon: "Drill", name: "Perfo-burineur", brand: "MAKITA", qty: 2, condition: "Bon" },
          {
            icon: "Hammer",
            name: "Marteau-piqueur hexagonal 28 mm",
            brand: "Makita HM1810",
            qty: 2,
            condition: "Excellent",
          },
        ],
      },
      {
        title: "Topographie & contrôle",
        description: "Équipements de précision pour implantation et nivellement.",
        icon: "Compass",
        items: [
          {
            icon: "Compass",
            name: "Niveau topographique (kit complet)",
            brand: "Marque non précisée",
            qty: 2,
            condition: "Excellent",
          },
        ],
      },
    ],
  },
  guaranteeLabel: "Ce que cela garantit",
  guaranteeTitle: "Une capacité chantier lisible avant même le démarrage",
  commitments: [
    "Responsabilités identifiées avant démarrage",
    "Matériel essentiel disponible pour l'exécution",
    "Suivi qualité, sécurité et délais à chaque phase",
  ],
};

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberOr(value: unknown, fallback?: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function stringArrayOr(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const lines = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
}

function normalizeOrgBox(value: unknown, fallback: OrgBoxContent): OrgBoxContent {
  const input =
    typeof value === "object" && value !== null ? (value as Partial<OrgBoxContent>) : {};
  return {
    title: stringOr(input.title, fallback.title),
    name: typeof input.name === "string" && input.name.trim() ? input.name.trim() : fallback.name,
    count: numberOr(input.count, fallback.count),
    role: stringOr(input.role, fallback.role),
  };
}

function normalizeStat(value: unknown, fallback: MeansStatContent): MeansStatContent {
  const input =
    typeof value === "object" && value !== null ? (value as Partial<MeansStatContent>) : {};
  return {
    label: stringOr(input.label, fallback.label),
    value: stringOr(input.value, fallback.value),
    icon: stringOr(input.icon, fallback.icon),
  };
}

function normalizeEquipment(value: unknown, fallback: EquipmentContent): EquipmentContent {
  const input =
    typeof value === "object" && value !== null ? (value as Partial<EquipmentContent>) : {};
  return {
    icon: stringOr(input.icon, fallback.icon),
    name: stringOr(input.name, fallback.name),
    brand: stringOr(input.brand, fallback.brand),
    qty: numberOr(input.qty, fallback.qty) ?? fallback.qty,
    condition: input.condition === "Excellent" ? "Excellent" : "Bon",
  };
}

function normalizeGroup(value: unknown, fallback: EquipmentGroupContent): EquipmentGroupContent {
  const input =
    typeof value === "object" && value !== null ? (value as Partial<EquipmentGroupContent>) : {};
  const submittedItems = Array.isArray(input.items) ? input.items : [];
  const items = fallback.items.map((item, index) =>
    normalizeEquipment(submittedItems[index], item),
  );
  const extraItems = submittedItems.slice(fallback.items.length).map((item, index) =>
    normalizeEquipment(item, {
      icon: "Wrench",
      name: `Matériel ${index + 1}`,
      brand: "Marque non précisée",
      qty: 1,
      condition: "Bon",
    }),
  );

  return {
    title: stringOr(input.title, fallback.title),
    description: stringOr(input.description, fallback.description),
    icon: stringOr(input.icon, fallback.icon),
    items: [...items, ...extraItems],
  };
}

export function normalizeMeansContent(value: unknown): MeansContent {
  const input =
    typeof value === "object" && value !== null ? (value as Partial<MeansContent>) : {};
  const organization =
    typeof input.organization === "object" && input.organization !== null
      ? input.organization
      : ({} as Partial<MeansContent["organization"]>);
  const equipment =
    typeof input.equipment === "object" && input.equipment !== null
      ? input.equipment
      : ({} as Partial<MeansContent["equipment"]>);

  return {
    eyebrow: stringOr(input.eyebrow, DEFAULT_MEANS_CONTENT.eyebrow),
    title: stringOr(input.title, DEFAULT_MEANS_CONTENT.title),
    subtitle: stringOr(input.subtitle, DEFAULT_MEANS_CONTENT.subtitle),
    stats: DEFAULT_MEANS_CONTENT.stats.map((stat, index) =>
      normalizeStat(Array.isArray(input.stats) ? input.stats[index] : undefined, stat),
    ),
    organization: {
      title: stringOr(organization.title, DEFAULT_MEANS_CONTENT.organization.title),
      subtitle: stringOr(organization.subtitle, DEFAULT_MEANS_CONTENT.organization.subtitle),
      badge: stringOr(organization.badge, DEFAULT_MEANS_CONTENT.organization.badge),
      manager: normalizeOrgBox(
        organization.manager,
        DEFAULT_MEANS_CONTENT.organization.manager,
      ),
      level2: DEFAULT_MEANS_CONTENT.organization.level2.map((box, index) =>
        normalizeOrgBox(
          Array.isArray(organization.level2) ? organization.level2[index] : undefined,
          box,
        ),
      ),
      level3: DEFAULT_MEANS_CONTENT.organization.level3.map((box, index) =>
        normalizeOrgBox(
          Array.isArray(organization.level3) ? organization.level3[index] : undefined,
          box,
        ),
      ),
      workers: normalizeOrgBox(
        organization.workers,
        DEFAULT_MEANS_CONTENT.organization.workers,
      ),
    },
    equipment: {
      title: stringOr(equipment.title, DEFAULT_MEANS_CONTENT.equipment.title),
      badge: stringOr(equipment.badge, DEFAULT_MEANS_CONTENT.equipment.badge),
      ownerLabel: stringOr(equipment.ownerLabel, DEFAULT_MEANS_CONTENT.equipment.ownerLabel),
      groups: DEFAULT_MEANS_CONTENT.equipment.groups.map((group, index) =>
        normalizeGroup(
          Array.isArray(equipment.groups) ? equipment.groups[index] : undefined,
          group,
        ),
      ),
    },
    guaranteeLabel: stringOr(input.guaranteeLabel, DEFAULT_MEANS_CONTENT.guaranteeLabel),
    guaranteeTitle: stringOr(input.guaranteeTitle, DEFAULT_MEANS_CONTENT.guaranteeTitle),
    commitments: stringArrayOr(input.commitments, DEFAULT_MEANS_CONTENT.commitments),
  };
}
