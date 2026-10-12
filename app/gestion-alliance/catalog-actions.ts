"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";

export type CatalogActionState = {
  ok?: boolean;
  error?: string;
};

async function requireAdmin() {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    return {
      supabase: null,
      error: session ? null : ("Non authentifiÃ©." as const),
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { supabase, error: "Non authentifiÃ©." as const };
  }
  return { supabase, error: null };
}

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/realisations");
  revalidatePath("/gestion-alliance/realisations");
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function saveCatalogProject(
  _prev: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const idRaw = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || "Libreville";
  const image = String(formData.get("image") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const gallery = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = [...new Set([image, ...gallery].filter(Boolean))];
  const category = String(formData.get("category") ?? "batiments");
  const year = Number(formData.get("year") ?? new Date().getFullYear());
  const client = String(formData.get("client") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const published = formData.get("published") === "on";

  if (!title || !image) return { error: "Titre et image requis." };
  if (category !== "batiments" && category !== "travaux") {
    return { error: "CatÃ©gorie invalide." };
  }

  const payload = {
    title,
    location,
    image,
    images,
    description,
    category,
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    client,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    published,
    updated_at: new Date().toISOString(),
  };

  if (hasDatabaseUrl()) {
    if (idRaw) {
      await query(
        `update catalog_projects
         set title = $2, location = $3, image = $4, images = $5,
             description = $6, category = $7, year = $8, client = $9,
             sort_order = $10, published = $11, updated_at = now()
         where id = $1`,
        [
          Number(idRaw),
          payload.title,
          payload.location,
          payload.image,
          payload.images,
          payload.description,
          payload.category,
          payload.year,
          payload.client,
          payload.sort_order,
          payload.published,
        ],
      );
    } else {
      await query(
        `insert into catalog_projects
          (title, location, image, images, description, category, year, client,
           sort_order, published, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())`,
        [
          payload.title,
          payload.location,
          payload.image,
          payload.images,
          payload.description,
          payload.category,
          payload.year,
          payload.client,
          payload.sort_order,
          payload.published,
        ],
      );
    }
  } else if (idRaw) {
    const { error: dbError } = await supabase!
      .from("catalog_projects")
      .update(payload)
      .eq("id", Number(idRaw));
    if (dbError) return { error: "Mise Ã  jour impossible." };
  } else {
    const { error: dbError } = await supabase!
      .from("catalog_projects")
      .insert(payload);
    if (dbError) return { error: "CrÃ©ation impossible." };
  }

  revalidateCatalog();
  redirect("/gestion-alliance/realisations");
}

export async function deleteCatalogProject(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (error) return;

  const id = Number(formData.get("id"));
  if (!id) return;

  if (hasDatabaseUrl()) {
    await query("delete from catalog_projects where id = $1", [id]);
  } else {
    await supabase!.from("catalog_projects").delete().eq("id", id);
  }
  revalidateCatalog();
}

export async function saveCatalogReport(
  _prev: CatalogActionState,
  formData: FormData,
): Promise<CatalogActionState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const existingId = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const id = existingId || slug;
  const client = String(formData.get("client") ?? "OCT").trim() || "OCT";
  const clientSlug =
    String(formData.get("client_slug") ?? "").trim() || slugify(client);
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "batiments");
  const objective = String(formData.get("objective") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();
  const endDate = String(formData.get("end_date") ?? "").trim();
  const startLabel = String(formData.get("start_label") ?? "").trim();
  const endLabel = String(formData.get("end_label") ?? "").trim();
  const refs = String(formData.get("refs") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const beforeImages = String(formData.get("before_images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const afterImages = String(formData.get("after_images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const cover =
    String(formData.get("cover") ?? "").trim() ||
    afterImages[0] ||
    beforeImages[0] ||
    "";
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const published = formData.get("published") === "on";

  if (!title || !slug) return { error: "Titre requis." };
  if (category !== "batiments" && category !== "travaux") {
    return { error: "CatÃ©gorie invalide." };
  }

  const payload = {
    id,
    slug,
    title,
    client,
    client_slug: clientSlug,
    location,
    category,
    objective,
    start_date: startDate,
    end_date: endDate,
    start_label: startLabel,
    end_label: endLabel,
    refs,
    before_images: beforeImages,
    after_images: afterImages,
    cover,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    published,
    updated_at: new Date().toISOString(),
  };

  if (hasDatabaseUrl()) {
    await query(
      `insert into catalog_reports
        (id, slug, title, client, client_slug, location, category, objective,
         start_date, end_date, start_label, end_label, refs, before_images,
         after_images, cover, sort_order, published, updated_at)
       values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
         $15, $16, $17, $18, now())
       on conflict (id) do update set
         slug = excluded.slug,
         title = excluded.title,
         client = excluded.client,
         client_slug = excluded.client_slug,
         location = excluded.location,
         category = excluded.category,
         objective = excluded.objective,
         start_date = excluded.start_date,
         end_date = excluded.end_date,
         start_label = excluded.start_label,
         end_label = excluded.end_label,
         refs = excluded.refs,
         before_images = excluded.before_images,
         after_images = excluded.after_images,
         cover = excluded.cover,
         sort_order = excluded.sort_order,
         published = excluded.published,
         updated_at = now()`,
      [
        payload.id,
        payload.slug,
        payload.title,
        payload.client,
        payload.client_slug,
        payload.location,
        payload.category,
        payload.objective,
        payload.start_date,
        payload.end_date,
        payload.start_label,
        payload.end_label,
        payload.refs,
        payload.before_images,
        payload.after_images,
        payload.cover,
        payload.sort_order,
        payload.published,
      ],
    );
  } else {
    const { error: dbError } = await supabase!
      .from("catalog_reports")
      .upsert(payload);
    if (dbError) return { error: "Enregistrement impossible." };
  }

  revalidateCatalog();
  redirect("/gestion-alliance/realisations");
}

export async function deleteCatalogReport(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (error) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  if (hasDatabaseUrl()) {
    await query("delete from catalog_reports where id = $1", [id]);
  } else {
    await supabase!.from("catalog_reports").delete().eq("id", id);
  }
  revalidateCatalog();
}

export async function uploadCatalogImage(formData: FormData): Promise<{
  url?: string;
  error?: string;
}> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Fichier manquant." };
  }
  if (file.size > 12 * 1024 * 1024) {
    return { error: "Image trop lourde (max 12 Mo)." };
  }

  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/heic",
    "image/heif",
  ];
  const type = (file.type || "").toLowerCase();
  const extFromName = file.name.split(".").pop()?.toLowerCase() || "";
  const okExt = ["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"].includes(
    extFromName,
  );
  if (type && !allowed.includes(type) && !okExt) {
    return { error: "Formats acceptÃ©s : JPG, PNG, WebP, GIF, AVIF, HEIC." };
  }

  const ext =
    extFromName ||
    (type.includes("png")
      ? "png"
      : type.includes("webp")
        ? "webp"
        : type.includes("gif")
          ? "gif"
          : type.includes("avif")
            ? "avif"
            : type.includes("heic") || type.includes("heif")
              ? "heic"
              : "jpg");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (hasDatabaseUrl()) {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "catalogue");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(
      path.join(uploadDir, filename),
      Buffer.from(await file.arrayBuffer()),
    );
    return { url: `/uploads/catalogue/${filename}` };
  }

  const { error: upError } = await supabase!.storage
    .from("catalogue")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: type || `image/${ext === "jpg" ? "jpeg" : ext}`,
    });

  if (upError) return { error: "Upload impossible." };

  const { data } = supabase!.storage.from("catalogue").getPublicUrl(filename);
  return { url: data.publicUrl };
}

