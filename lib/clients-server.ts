import { createClient } from "@/lib/supabase/server";
import { clients as staticClients, type ClientRef } from "@/lib/clients";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";

export type SiteClientRow = {
  id: string;
  name: string;
  short_name: string;
  logo: string | null;
  featured: boolean;
  slug: string;
  summary: string | null;
  projects: { year: number; description: string }[];
  sort_order: number;
  published: boolean;
};

function mapClient(row: SiteClientRow): ClientRef {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    logo: row.logo,
    featured: row.featured,
    slug: row.slug,
    summary: row.summary ?? undefined,
    projects: Array.isArray(row.projects) ? row.projects : [],
  };
}

export async function getSiteClients(): Promise<ClientRef[]> {
  if (hasDatabaseUrl()) {
    try {
      const { rows } = await query<SiteClientRow>(
        `select * from site_clients
         where published = true
         order by sort_order asc`,
      );
      return rows.length ? rows.map(mapClient) : staticClients;
    } catch {
      return staticClients;
    }
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_clients")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return staticClients;
    return (data as SiteClientRow[]).map(mapClient);
  } catch {
    return staticClients;
  }
}

export async function getAdminSiteClients(): Promise<SiteClientRow[]> {
  if (hasDatabaseUrl()) {
    const { rows } = await query<SiteClientRow>(
      "select * from site_clients order by sort_order asc",
    );
    return rows;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_clients")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as SiteClientRow[];
}

export async function getSiteClientById(id: string) {
  if (hasDatabaseUrl()) {
    const { rows } = await query<SiteClientRow>(
      "select * from site_clients where id = $1 limit 1",
      [id],
    );
    return rows[0] ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as SiteClientRow | null;
}
