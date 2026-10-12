"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth/local-admin";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  DEFAULT_QUALITY_CONTENT,
  normalizeQualityContent,
  type QualityContent,
} from "@/lib/quality-content";

export type QualityActionState = {
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

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function text(formData: FormData, key: string, fallback: string) {
  return String(formData.get(key) ?? "").trim() || fallback;
}

async function persistQuality(content: QualityContent) {
  if (hasDatabaseUrl()) {
    await query(
      `insert into site_settings (key, value, updated_at)
       values ('quality', $1::jsonb, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [JSON.stringify(content)],
    );
    return;
  }

  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "quality",
    value: content,
    updated_at: new Date().toISOString(),
  });
}

export async function saveQualityContent(
  _prev: QualityActionState,
  formData: FormData,
): Promise<QualityActionState> {
  const { error } = await requireAdmin();
  if (error) return { error };

  const content = normalizeQualityContent({
    eyebrow: text(formData, "eyebrow", DEFAULT_QUALITY_CONTENT.eyebrow),
    title: text(formData, "title", DEFAULT_QUALITY_CONTENT.title),
    subtitle: text(formData, "subtitle", DEFAULT_QUALITY_CONTENT.subtitle),
    methodLabel: text(formData, "methodLabel", DEFAULT_QUALITY_CONTENT.methodLabel),
    methodTitle: text(formData, "methodTitle", DEFAULT_QUALITY_CONTENT.methodTitle),
    methodText: text(formData, "methodText", DEFAULT_QUALITY_CONTENT.methodText),
    process: lines(formData.get("process")),
    commitment: text(formData, "commitment", DEFAULT_QUALITY_CONTENT.commitment),
    pillars: DEFAULT_QUALITY_CONTENT.pillars.map((pillar) => ({
      id: pillar.id,
      icon: text(formData, `${pillar.id}_icon`, pillar.icon),
      title: text(formData, `${pillar.id}_title`, pillar.title),
      text: text(formData, `${pillar.id}_text`, pillar.text),
      items: lines(formData.get(`${pillar.id}_items`)),
    })),
  });

  try {
    await persistQuality(content);
  } catch {
    return { error: "Enregistrement impossible." };
  }

  revalidatePath("/");
  revalidatePath("/gestion-alliance/hse");
  return { ok: true };
}
