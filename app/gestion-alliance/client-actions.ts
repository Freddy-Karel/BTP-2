"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";

export type ClientActionState = { ok?: boolean; error?: string };

async function requireAdmin() {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    return { supabase: null, error: session ? null : ("Non authentifiÃ©." as const) };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { supabase, error: "Non authentifié." as const };
  return { supabase, error: null };
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function revalidateClients() {
  revalidatePath("/");
  revalidatePath("/realisations");
  revalidatePath("/gestion-alliance/clients");
}

export async function saveSiteClient(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const existingId = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const short_name = String(formData.get("short_name") ?? "").trim() || name;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || short_name || name);
  const id = existingId || slug;
  const logo = String(formData.get("logo") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sort_order = Number(formData.get("sort_order") ?? 0);

  const projectsRaw = String(formData.get("projects") ?? "");
  const projects = projectsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d{4})\s*[-–:]\s*(.+)$/);
      if (m) return { year: Number(m[1]), description: m[2].trim() };
      return { year: new Date().getFullYear(), description: line };
    });

  if (!name || !slug) return { error: "Nom requis." };

  const payload = {
    id,
    name,
    short_name,
    slug,
    logo,
    summary,
    featured,
    published,
    projects,
    sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    updated_at: new Date().toISOString(),
  };

  const dbError = hasDatabaseUrl()
    ? (
        await query(
          `insert into site_clients
            (id, name, short_name, slug, logo, summary, featured, published,
             projects, sort_order, updated_at)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, now())
           on conflict (id) do update set
             name = excluded.name,
             short_name = excluded.short_name,
             slug = excluded.slug,
             logo = excluded.logo,
             summary = excluded.summary,
             featured = excluded.featured,
             published = excluded.published,
             projects = excluded.projects,
             sort_order = excluded.sort_order,
             updated_at = now()`,
          [
            id,
            name,
            short_name,
            slug,
            logo,
            summary,
            featured,
            published,
            JSON.stringify(projects),
            payload.sort_order,
          ],
        )
      ).rowCount === null
    : (await supabase!.from("site_clients").upsert(payload)).error;
  if (dbError) return { error: "Enregistrement impossible." };

  revalidateClients();
  redirect("/gestion-alliance/clients");
}

export async function deleteSiteClient(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (error) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  if (hasDatabaseUrl()) {
    await query("delete from site_clients where id = $1", [id]);
  } else {
    await supabase!.from("site_clients").delete().eq("id", id);
  }
  revalidateClients();
}
