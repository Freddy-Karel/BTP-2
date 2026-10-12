"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";
import {
  DEFAULT_ACTIVITIES,
  normalizeActivity,
  type ActivityCategory,
  type ActivityContent,
} from "@/lib/activities-content";
import { getSiteActivities } from "@/lib/activities-content-server";

export type ActivityActionState = {
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

function validCategory(value: string): ActivityCategory {
  return value === "Travaux Publics" ? "Travaux Publics" : "Bâtiments";
}

async function persistActivities(activities: ActivityContent[]) {
  if (hasDatabaseUrl()) {
    await query(
      `insert into site_settings (key, value, updated_at)
       values ('activities', $1::jsonb, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [JSON.stringify(activities)],
    );
    return;
  }

  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "activities",
    value: activities,
    updated_at: new Date().toISOString(),
  });
}

export async function saveActivity(
  _prev: ActivityActionState,
  formData: FormData,
): Promise<ActivityActionState> {
  const { error } = await requireAdmin();
  if (error) return { error };

  const id = String(formData.get("id") ?? "").trim();
  const base = DEFAULT_ACTIVITIES.find((activity) => activity.id === id);
  if (!base) return { error: "Activité inconnue." };

  const next = normalizeActivity({
    ...base,
    category: validCategory(String(formData.get("category") ?? base.category)),
    family: String(formData.get("family") ?? "").trim() || base.family,
    title: String(formData.get("title") ?? "").trim() || base.title,
    short: String(formData.get("short") ?? "").trim() || base.short,
    detail: String(formData.get("detail") ?? "").trim() || base.detail,
    points: lines(formData.get("points")),
    applications: lines(formData.get("applications")),
    promise: String(formData.get("promise") ?? "").trim() || base.promise,
    icon: String(formData.get("icon") ?? "").trim() || base.icon,
    image: String(formData.get("image") ?? "").trim() || base.image,
    location: String(formData.get("location") ?? "").trim() || base.location,
    sortOrder: Number(formData.get("sort_order") ?? base.sortOrder),
    published: formData.get("published") === "on",
  });

  const activities = await getSiteActivities();
  const byId = new Map(activities.map((activity) => [activity.id, activity]));
  byId.set(id, next);

  const merged = DEFAULT_ACTIVITIES.map((activity) => byId.get(activity.id) ?? activity)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  await persistActivities(merged);
  revalidatePath("/");
  revalidatePath("/gestion-alliance/activites");
  return { ok: true };
}
