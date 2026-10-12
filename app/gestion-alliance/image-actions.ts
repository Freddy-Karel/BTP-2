"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";
import { type ImageAssetStatus } from "@/lib/image-assets";

export type ImageAssetActionState = {
  ok?: boolean;
  error?: string;
};

async function requireAdmin() {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    return { supabase: null, error: session ? null : ("Non authentifié." as const) };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { supabase, error: "Non authentifié." as const };
  return { supabase, error: null };
}

function isImageStatus(value: string): value is ImageAssetStatus {
  return value === "provisional" || value === "validated" || value === "replace";
}

export async function saveImageAsset(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (error) return;

  const key = String(formData.get("key") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const originalUrl = String(formData.get("original_url") ?? "").trim();
  const reset = formData.get("reset") === "1";
  const replacementUrl = reset
    ? null
    : String(formData.get("replacement_url") ?? "").trim() || null;
  const rawStatus = String(formData.get("status") ?? "provisional");
  const status = isImageStatus(rawStatus) ? rawStatus : "provisional";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!key || !label || !originalUrl) return;

  if (hasDatabaseUrl()) {
    await query(
      `insert into site_image_assets
        (key, area, label, original_url, replacement_url, status, sort_order, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, now())
       on conflict (key) do update set
         area = excluded.area,
         label = excluded.label,
         original_url = excluded.original_url,
         replacement_url = excluded.replacement_url,
         status = excluded.status,
         sort_order = excluded.sort_order,
         updated_at = now()`,
      [
        key,
        area,
        label,
        originalUrl,
        replacementUrl,
        status,
        Number.isFinite(sortOrder) ? sortOrder : 0,
      ],
    );
  } else {
    await supabase!.from("site_image_assets").upsert({
      key,
      area,
      label,
      original_url: originalUrl,
      replacement_url: replacementUrl,
      status,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath("/");
  revalidatePath("/gestion-alliance/images-provisoires");
}
