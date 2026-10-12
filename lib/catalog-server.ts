import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  projects as staticProjects,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import {
  workReports as staticReports,
  type WorkReport,
} from "@/lib/rapports";

export type CatalogProjectRow = {
  id: number;
  title: string;
  location: string;
  image: string;
  images?: string[] | null;
  description?: string | null;
  category: ProjectCategory;
  year: number;
  client: string | null;
  sort_order: number;
  published: boolean;
};

export type CatalogReportRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  client_slug: string;
  location: string;
  category: ProjectCategory;
  objective: string;
  start_date: string;
  end_date: string;
  start_label: string;
  end_label: string;
  refs: string[];
  before_images: string[];
  after_images: string[];
  cover: string;
  sort_order: number;
  published: boolean;
};

function mapProject(row: CatalogProjectRow): Project {
  const images =
    Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : [row.image];
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    image: row.image || images[0],
    images,
    category: row.category,
    year: row.year,
    client: row.client ?? undefined,
    description: row.description || undefined,
  };
}

function mapReport(row: CatalogReportRow): WorkReport {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    clientSlug: row.client_slug,
    location: row.location,
    category: row.category,
    objective: row.objective,
    startDate: row.start_date,
    endDate: row.end_date,
    startLabel: row.start_label,
    endLabel: row.end_label,
    refs: row.refs ?? [],
    before: row.before_images ?? [],
    after: row.after_images ?? [],
    cover: row.cover || (row.after_images?.[0] ?? row.before_images?.[0] ?? ""),
  };
}

/** Chantiers pour le site public (fallback = données locales) */
export async function getCatalogProjects(): Promise<Project[]> {
  if (hasDatabaseUrl()) {
    try {
      const { rows } = await query<CatalogProjectRow>(
        `select * from catalog_projects
         where published = true
         order by sort_order asc, id asc`,
      );
      return rows.length ? rows.map(mapProject) : staticProjects;
    } catch {
      return staticProjects;
    }
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error || !data?.length) return staticProjects;
    return (data as CatalogProjectRow[]).map(mapProject);
  } catch {
    return staticProjects;
  }
}

/** Tous les chantiers (admin) */
export async function getAdminCatalogProjects(): Promise<CatalogProjectRow[]> {
  if (hasDatabaseUrl()) {
    const { rows } = await query<CatalogProjectRow>(
      "select * from catalog_projects order by sort_order asc, id asc",
    );
    return rows;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error || !data) return [];
  return data as CatalogProjectRow[];
}

export async function getCatalogReports(): Promise<WorkReport[]> {
  if (hasDatabaseUrl()) {
    try {
      const { rows } = await query<CatalogReportRow>(
        `select * from catalog_reports
         where published = true
         order by sort_order asc, id asc`,
      );
      return rows.length ? rows.map(mapReport) : staticReports;
    } catch {
      return staticReports;
    }
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_reports")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error || !data?.length) return staticReports;
    return (data as CatalogReportRow[]).map(mapReport);
  } catch {
    return staticReports;
  }
}

export async function getAdminCatalogReports(): Promise<CatalogReportRow[]> {
  if (hasDatabaseUrl()) {
    const { rows } = await query<CatalogReportRow>(
      "select * from catalog_reports order by sort_order asc, id asc",
    );
    return rows;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_reports")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error || !data) return [];
  return data as CatalogReportRow[];
}

export async function getCatalogProjectById(id: number) {
  if (hasDatabaseUrl()) {
    const { rows } = await query<CatalogProjectRow>(
      "select * from catalog_projects where id = $1 limit 1",
      [id],
    );
    return rows[0] ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("catalog_projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as CatalogProjectRow | null;
}

export async function getCatalogReportById(id: string) {
  if (hasDatabaseUrl()) {
    const { rows } = await query<CatalogReportRow>(
      "select * from catalog_reports where id = $1 limit 1",
      [id],
    );
    return rows[0] ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("catalog_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as CatalogReportRow | null;
}
