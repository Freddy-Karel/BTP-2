import { writeFileSync } from "fs";

const data = [
  {
    id: "oct",
    name: "Owendo Container Terminal",
    short_name: "OCT",
    logo: "/clients/oct.png",
    featured: true,
    slug: "oct",
    summary:
      "Notre principal client est OCT. Plus de 20 travaux effectués sur leur site à Owendo — dont les rapports documentés (fenêtre IT, abri bus, caniveaux, éviers, conteneur DRH).",
    projects: [
      { year: 2026, description: "Aménagement d'une fenêtre — salle IT (BDC N°5004)" },
      { year: 2026, description: "Aménagement d'un abri bus — zone U (BDC N°4430)" },
      { year: 2026, description: "Grilles et bordures de caniveaux — T1 zone frigo (BDC N°4291 / 4292)" },
      { year: 2026, description: "Double évier industriel — T1 près de l'infirmerie (BDC N°4264)" },
      { year: 2026, description: "Aménagement conteneur archives DRH (BDC N°4143)" },
      { year: 2026, description: "Évier industriel — T1 zone frigo (BDC N°4045)" },
    ],
  },
  {
    id: "pharmacie-forestiers",
    name: "Grande Pharmacie des Forestiers",
    short_name: "Pharmacie des Forestiers",
    logo: "/clients/pharmacie-forestiers.png",
    featured: false,
    slug: "pharmacie-forestiers",
    summary: null,
    projects: [
      { year: 2024, description: "Travaux de réaménagement des bureaux du service Facturation" },
      { year: 2024, description: "Réaménagement du garage de la villa du Directeur Informatique (Batterie IV)" },
      { year: 2024, description: "Construction d'une salle de stockage en Placoplâtre avec isolation thermique et phonique" },
      { year: 2025, description: "Maintenance en plomberie (circuit d'alimentation et d'évacuation d'eau)" },
    ],
  },
  {
    id: "gonelec",
    name: "GONELEC",
    short_name: "GONELEC",
    logo: "/clients/gonelec.png",
    featured: false,
    slug: "gonelec",
    summary: null,
    projects: [{ year: 2024, description: "Réalisation des plans de récolement" }],
  },
  {
    id: "imp-conseils",
    name: "IMP Conseils",
    short_name: "IMP Conseils",
    logo: "/clients/imp-conseils.png",
    featured: false,
    slug: "imp-conseils",
    summary: null,
    projects: [
      { year: 2024, description: "Rénovation de deux appartements à l'Ancienne Sobraga" },
      { year: 2024, description: "Réhabilitation des bureaux Ex BS Gabon" },
      { year: 2024, description: "Traitement des fissures, étanchéité du bâtiment de la Galerie de l'Esplanade" },
    ],
  },
  {
    id: "dgpe",
    name: "Direction Générale du Patrimoine de l'État",
    short_name: "DGPE",
    logo: "/clients/dgpe.png",
    featured: false,
    slug: "dgpe",
    summary: null,
    projects: [{ year: 2025, description: "Maintenance d'un groupe électrogène PERKINS de 150 KVA" }],
  },
  {
    id: "assurances",
    name: "Direction Nationale des Assurances",
    short_name: "DNA",
    logo: "/clients/assurances.png",
    featured: false,
    slug: "assurances",
    summary: null,
    projects: [{ year: 2025, description: "Aménagement de bureau" }],
  },
  {
    id: "particuliers",
    name: "Particuliers",
    short_name: "Particuliers",
    logo: null,
    featured: false,
    slug: "particuliers",
    summary: null,
    projects: [{ year: 2025, description: "Rénovation de deux appartements type F3 à Akanda" }],
  },
  {
    id: "eaux-forets",
    name: "Ministère des Eaux et Forêts",
    short_name: "Eaux et Forêts",
    logo: "/clients/eaux-forets.png",
    featured: false,
    slug: "eaux-forets",
    summary: null,
    projects: [
      {
        year: 2025,
        description:
          "Rénovation du bâtiment écloserie (Direction Provinciale de la Pêche et de l'Aquaculture)",
      },
    ],
  },
];

function esc(s) {
  return String(s).replace(/'/g, "''");
}

const rows = data
  .map((c, i) => {
    const logo = c.logo ? `'${esc(c.logo)}'` : "null";
    const summary = c.summary ? `'${esc(c.summary)}'` : "null";
    const projects = `'${esc(JSON.stringify(c.projects))}'::jsonb`;
    return `('${esc(c.id)}','${esc(c.name)}','${esc(c.short_name)}',${logo},${c.featured},'${esc(c.slug)}',${summary},${projects},${i + 1})`;
  })
  .join(",\n");

const sql = `insert into public.site_clients (id, name, short_name, logo, featured, slug, summary, projects, sort_order)
select * from (values
${rows}
) as v(id, name, short_name, logo, featured, slug, summary, projects, sort_order)
where not exists (select 1 from public.site_clients limit 1);`;

writeFileSync(new URL("../supabase/migrations/003_seed_clients.sql", import.meta.url), sql);
console.log("wrote seed", data.length);
