import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  DEFAULT_MEANS_CONTENT,
  normalizeMeansContent,
  type MeansContent,
} from "@/lib/means-content";

type SiteSettingRow = {
  value: unknown;
};

export async function getMeansContent(): Promise<MeansContent> {
  if (!hasDatabaseUrl()) {
    return DEFAULT_MEANS_CONTENT;
  }

  try {
    const { rows } = await query<SiteSettingRow>(
      "select value from site_settings where key = 'means' limit 1",
    );
    return normalizeMeansContent(rows[0]?.value);
  } catch {
    return DEFAULT_MEANS_CONTENT;
  }
}
