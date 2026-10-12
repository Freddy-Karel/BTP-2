import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  DEFAULT_SITE_CONTENT,
  mergeAbout,
  mergeContact,
  mergeHero,
  type SiteContent,
} from "@/lib/site-content";

export async function getSiteContent(): Promise<SiteContent> {
  if (hasDatabaseUrl()) {
    try {
      const { rows } = await query<{ key: string; value: unknown }>(
        "select key, value from site_settings where key = any($1)",
        [["hero", "about", "contact"]],
      );
      if (!rows.length) return DEFAULT_SITE_CONTENT;
      const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        hero: mergeHero(map.hero),
        about: mergeAbout(map.about),
        contact: mergeContact(map.contact),
      };
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["hero", "about", "contact"]);

    if (error || !data?.length) {
      return DEFAULT_SITE_CONTENT;
    }

    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return {
      hero: mergeHero(map.hero),
      about: mergeAbout(map.about),
      contact: mergeContact(map.contact),
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}
