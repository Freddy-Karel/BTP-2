export type QualityPillar = {
  id: string;
  icon: string;
  title: string;
  text: string;
  items: string[];
};

export type QualityContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  methodLabel: string;
  methodTitle: string;
  methodText: string;
  process: string[];
  pillars: QualityPillar[];
  commitment: string;
};

export const DEFAULT_QUALITY_CONTENT: QualityContent = {
  eyebrow: "Sécurité & qualité",
  title: "Notre engagement HSE",
  subtitle:
    "Hygiène, sécurité et qualité : une méthode simple pour des chantiers maîtrisés, propres et livrés avec sérieux.",
  methodLabel: "Méthode chantier",
  methodTitle: "Une exigence visible avant, pendant et après les travaux.",
  methodText:
    "Notre approche HSE donne un cadre clair aux équipes : préparer le chantier, limiter les risques, tenir le site propre, contrôler les ouvrages et livrer un résultat conforme.",
  process: ["Préparation", "Protection", "Exécution", "Contrôle", "Réception"],
  pillars: [
    {
      id: "security",
      icon: "ShieldCheck",
      title: "Sécurité sur les chantiers",
      text: "Prévenir les risques, protéger les équipes et sécuriser les zones d'intervention.",
      items: [
        "Équipements de protection",
        "Sensibilisation du personnel",
        "Contrôles réguliers",
      ],
    },
    {
      id: "health",
      icon: "HeartPulse",
      title: "Hygiène & santé",
      text: "Maintenir des conditions de travail propres, organisées et adaptées au site.",
      items: ["Gestion des déchets", "Espaces sanitaires", "Organisation du chantier"],
    },
    {
      id: "quality",
      icon: "Award",
      title: "Qualité des travaux",
      text: "Contrôler les matériaux, l'exécution et les finitions jusqu'à la réception.",
      items: [
        "Contrôle à chaque étape",
        "Main-d'oeuvre qualifiée",
        "Suivi jusqu'à la réception",
      ],
    },
  ],
  commitment:
    "Engagement ALLIANCE M.O BTP : intervenir avec discipline, protéger les personnes, respecter le site client et suivre les travaux jusqu'à la réception.",
};

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArrayOr(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const lines = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
}

function normalizePillar(value: unknown, fallback: QualityPillar): QualityPillar {
  const input =
    typeof value === "object" && value !== null
      ? (value as Partial<QualityPillar>)
      : {};

  return {
    id: stringOr(input.id, fallback.id),
    icon: stringOr(input.icon, fallback.icon),
    title: stringOr(input.title, fallback.title),
    text: stringOr(input.text, fallback.text),
    items: stringArrayOr(input.items, fallback.items),
  };
}

export function normalizeQualityContent(value: unknown): QualityContent {
  const input =
    typeof value === "object" && value !== null
      ? (value as Partial<QualityContent>)
      : {};

  const defaultsById = new Map(
    DEFAULT_QUALITY_CONTENT.pillars.map((pillar) => [pillar.id, pillar]),
  );
  const submittedPillars = Array.isArray(input.pillars) ? input.pillars : [];
  const pillars = DEFAULT_QUALITY_CONTENT.pillars.map((fallback, index) => {
    const matching =
      submittedPillars.find((pillar) => {
        return (
          typeof pillar === "object" &&
          pillar !== null &&
          "id" in pillar &&
          defaultsById.has(String((pillar as { id?: unknown }).id))
        );
      }) ?? submittedPillars[index];

    return normalizePillar(matching, fallback);
  });

  return {
    eyebrow: stringOr(input.eyebrow, DEFAULT_QUALITY_CONTENT.eyebrow),
    title: stringOr(input.title, DEFAULT_QUALITY_CONTENT.title),
    subtitle: stringOr(input.subtitle, DEFAULT_QUALITY_CONTENT.subtitle),
    methodLabel: stringOr(input.methodLabel, DEFAULT_QUALITY_CONTENT.methodLabel),
    methodTitle: stringOr(input.methodTitle, DEFAULT_QUALITY_CONTENT.methodTitle),
    methodText: stringOr(input.methodText, DEFAULT_QUALITY_CONTENT.methodText),
    process: stringArrayOr(input.process, DEFAULT_QUALITY_CONTENT.process),
    pillars,
    commitment: stringOr(input.commitment, DEFAULT_QUALITY_CONTENT.commitment),
  };
}
