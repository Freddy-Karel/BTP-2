"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import { getAdminSession } from "@/lib/auth/local-admin";
import {
  DEFAULT_SITE_CONTENT,
  type AboutContent,
  type ContactContent,
  type HeroContent,
} from "@/lib/site-content";

export type SaveState = {
  ok?: boolean;
  error?: string;
};

async function requireAdmin() {
  if (hasDatabaseUrl()) {
    const session = await getAdminSession();
    return { supabase: null, error: session ? null : ("Non authentifiÃ©." as const) };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { supabase, error: "Non authentifié." as const };
  }
  return { supabase, error: null };
}

export async function saveHeroContent(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const hero: HeroContent = {
    brandLabel: String(formData.get("brandLabel") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.brandLabel,
    titleLine1: String(formData.get("titleLine1") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.titleLine1,
    titleLine2: String(formData.get("titleLine2") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.titleLine2,
    subtitle: String(formData.get("subtitle") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.subtitle,
    locationLine: String(formData.get("locationLine") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.locationLine,
    cityLine: String(formData.get("cityLine") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.hero.cityLine,
  };

  const dbError = hasDatabaseUrl()
    ? (
        await query(
          `insert into site_settings (key, value, updated_at)
           values ($1, $2::jsonb, now())
           on conflict (key) do update
           set value = excluded.value, updated_at = now()`,
          ["hero", JSON.stringify(hero)],
        )
      ).rowCount === null
    : (await supabase!.from("site_settings").upsert({
        key: "hero",
        value: hero,
        updated_at: new Date().toISOString(),
      })).error;

  if (dbError) return { error: "Enregistrement impossible." };

  revalidatePath("/");
  revalidatePath("/gestion-alliance/contenu");
  return { ok: true };
}

export async function saveAboutContent(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const bullets = String(formData.get("bullets") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const about: AboutContent = {
    title: String(formData.get("title") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.about.title,
    paragraph1: String(formData.get("paragraph1") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.about.paragraph1,
    paragraph2: String(formData.get("paragraph2") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.about.paragraph2,
    bullets: bullets.length ? bullets : DEFAULT_SITE_CONTENT.about.bullets,
  };

  const dbError = hasDatabaseUrl()
    ? (
        await query(
          `insert into site_settings (key, value, updated_at)
           values ($1, $2::jsonb, now())
           on conflict (key) do update
           set value = excluded.value, updated_at = now()`,
          ["about", JSON.stringify(about)],
        )
      ).rowCount === null
    : (await supabase!.from("site_settings").upsert({
        key: "about",
        value: about,
        updated_at: new Date().toISOString(),
      })).error;

  if (dbError) return { error: "Enregistrement impossible." };

  revalidatePath("/");
  revalidatePath("/gestion-alliance/contenu");
  return { ok: true };
}

export async function saveContactContent(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const contact: ContactContent = {
    sectionTitle: String(formData.get("sectionTitle") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.sectionTitle,
    sectionSubtitle: String(formData.get("sectionSubtitle") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.sectionSubtitle,
    email: String(formData.get("email") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.email,
    whatsapp: String(formData.get("whatsapp") ?? "")
      .replace(/\D/g, "")
      .trim() || DEFAULT_SITE_CONTENT.contact.whatsapp,
    phone1: String(formData.get("phone1") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.phone1,
    phone2: String(formData.get("phone2") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.phone2,
    facebookPageId: String(formData.get("facebookPageId") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.facebookPageId,
    address: String(formData.get("address") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.address,
    mapQuery: String(formData.get("mapQuery") ?? "").trim() ||
      DEFAULT_SITE_CONTENT.contact.mapQuery,
  };

  const dbError = hasDatabaseUrl()
    ? (
        await query(
          `insert into site_settings (key, value, updated_at)
           values ($1, $2::jsonb, now())
           on conflict (key) do update
           set value = excluded.value, updated_at = now()`,
          ["contact", JSON.stringify(contact)],
        )
      ).rowCount === null
    : (await supabase!.from("site_settings").upsert({
        key: "contact",
        value: contact,
        updated_at: new Date().toISOString(),
      })).error;

  if (dbError) return { error: "Enregistrement impossible." };

  revalidatePath("/");
  revalidatePath("/realisations");
  revalidatePath("/gestion-alliance/contact");
  return { ok: true };
}
