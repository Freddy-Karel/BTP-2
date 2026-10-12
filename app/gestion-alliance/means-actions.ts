"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth/local-admin";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  DEFAULT_MEANS_CONTENT,
  normalizeMeansContent,
  type MeansContent,
} from "@/lib/means-content";

export type MeansActionState = {
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

function text(formData: FormData, key: string, fallback: string) {
  return String(formData.get(key) ?? "").trim() || fallback;
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseJson<T>(value: FormDataEntryValue | null, fallback: T, label: string): T {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    throw new Error(`JSON invalide dans le champ "${label}".`);
  }
}

async function persistMeans(content: MeansContent) {
  if (hasDatabaseUrl()) {
    await query(
      `insert into site_settings (key, value, updated_at)
       values ('means', $1::jsonb, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [JSON.stringify(content)],
    );
    return;
  }

  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "means",
    value: content,
    updated_at: new Date().toISOString(),
  });
}

export async function saveMeansContent(
  _prev: MeansActionState,
  formData: FormData,
): Promise<MeansActionState> {
  const { error } = await requireAdmin();
  if (error) return { error };

  let content: MeansContent;
  try {
    content = normalizeMeansContent({
      eyebrow: text(formData, "eyebrow", DEFAULT_MEANS_CONTENT.eyebrow),
      title: text(formData, "title", DEFAULT_MEANS_CONTENT.title),
      subtitle: text(formData, "subtitle", DEFAULT_MEANS_CONTENT.subtitle),
      stats: parseJson(formData.get("stats"), DEFAULT_MEANS_CONTENT.stats, "Statistiques"),
      organization: {
        title: text(
          formData,
          "organization_title",
          DEFAULT_MEANS_CONTENT.organization.title,
        ),
        subtitle: text(
          formData,
          "organization_subtitle",
          DEFAULT_MEANS_CONTENT.organization.subtitle,
        ),
        badge: text(
          formData,
          "organization_badge",
          DEFAULT_MEANS_CONTENT.organization.badge,
        ),
        manager: parseJson(
          formData.get("organization_manager"),
          DEFAULT_MEANS_CONTENT.organization.manager,
          "Gérant",
        ),
        level2: parseJson(
          formData.get("organization_level2"),
          DEFAULT_MEANS_CONTENT.organization.level2,
          "Niveau 2",
        ),
        level3: parseJson(
          formData.get("organization_level3"),
          DEFAULT_MEANS_CONTENT.organization.level3,
          "Niveau 3",
        ),
        workers: parseJson(
          formData.get("organization_workers"),
          DEFAULT_MEANS_CONTENT.organization.workers,
          "Ouvriers",
        ),
      },
      equipment: {
        title: text(formData, "equipment_title", DEFAULT_MEANS_CONTENT.equipment.title),
        badge: text(formData, "equipment_badge", DEFAULT_MEANS_CONTENT.equipment.badge),
        ownerLabel: text(
          formData,
          "equipment_ownerLabel",
          DEFAULT_MEANS_CONTENT.equipment.ownerLabel,
        ),
        groups: parseJson(
          formData.get("equipment_groups"),
          DEFAULT_MEANS_CONTENT.equipment.groups,
          "Groupes de matériel",
        ),
      },
      guaranteeLabel: text(
        formData,
        "guaranteeLabel",
        DEFAULT_MEANS_CONTENT.guaranteeLabel,
      ),
      guaranteeTitle: text(
        formData,
        "guaranteeTitle",
        DEFAULT_MEANS_CONTENT.guaranteeTitle,
      ),
      commitments: lines(formData.get("commitments")),
    });
  } catch (parseError) {
    return {
      error:
        parseError instanceof Error
          ? parseError.message
          : "Une donnée structurée est invalide.",
    };
  }

  try {
    await persistMeans(content);
  } catch {
    return { error: "Enregistrement impossible." };
  }

  revalidatePath("/");
  revalidatePath("/gestion-alliance/moyens");
  return { ok: true };
}
