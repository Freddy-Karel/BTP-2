"use server";

import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";

export type MediaItem = {
  name: string;
  url: string;
  updatedAt?: string;
};

const LOCAL_MEDIA_DIR = path.join(process.cwd(), "public", "uploads", "catalogue");
const LOCAL_MEDIA_URL = "/uploads/catalogue";

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
  if (!data?.claims) return { supabase, error: "Non authentifiÃ©." as const };
  return { supabase, error: null };
}

export async function listCatalogueMedia(): Promise<MediaItem[]> {
  const { supabase, error } = await requireAdmin();
  if (error) return [];

  if (hasDatabaseUrl()) {
    try {
      await mkdir(LOCAL_MEDIA_DIR, { recursive: true });
      const files = await readdir(LOCAL_MEDIA_DIR);
      const items = await Promise.all(
        files.map(async (name) => {
          const info = await stat(path.join(LOCAL_MEDIA_DIR, name));
          return {
            name,
            url: `${LOCAL_MEDIA_URL}/${name}`,
            updatedAt: info.mtime.toISOString(),
          };
        }),
      );
      return items.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    } catch {
      return [];
    }
  }

  const { data, error: listError } = await supabase!.storage
    .from("catalogue")
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (listError || !data) return [];

  return data
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const { data: pub } = supabase!.storage
        .from("catalogue")
        .getPublicUrl(f.name);
      return {
        name: f.name,
        url: pub.publicUrl,
        updatedAt: f.updated_at ?? f.created_at ?? undefined,
      };
    });
}

export async function uploadMediaFile(formData: FormData): Promise<{
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
    return { error: "Max 12 Mo." };
  }

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/heic",
    "image/heif",
  ];
  const type = (file.type || "").toLowerCase();
  const extFromName = file.name.split(".").pop()?.toLowerCase() || "jpg";
  if (
    type &&
    !allowed.includes(type) &&
    !["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"].includes(
      extFromName,
    )
  ) {
    return { error: "Formats : JPG, PNG, WebP, GIF, AVIF, HEIC." };
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFromName}`;

  if (hasDatabaseUrl()) {
    await mkdir(LOCAL_MEDIA_DIR, { recursive: true });
    await writeFile(
      path.join(LOCAL_MEDIA_DIR, filename),
      Buffer.from(await file.arrayBuffer()),
    );
    revalidatePath("/gestion-alliance/medias");
    return { url: `${LOCAL_MEDIA_URL}/${filename}` };
  }

  const { error: upError } = await supabase!.storage
    .from("catalogue")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: type || "image/jpeg",
    });

  if (upError) return { error: "Upload impossible." };

  revalidatePath("/gestion-alliance/medias");
  const { data } = supabase!.storage.from("catalogue").getPublicUrl(filename);
  return { url: data.publicUrl };
}

export async function deleteMediaFile(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (error) return;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  if (hasDatabaseUrl()) {
    const target = path.resolve(LOCAL_MEDIA_DIR, name);
    if (target.startsWith(path.resolve(LOCAL_MEDIA_DIR))) {
      await unlink(target).catch(() => undefined);
    }
  } else {
    await supabase!.storage.from("catalogue").remove([name]);
  }

  revalidatePath("/gestion-alliance/medias");
}

