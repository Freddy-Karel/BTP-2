import { hasDatabaseUrl, query } from "@/lib/db/postgres";
import {
  DEFAULT_QUALITY_CONTENT,
  normalizeQualityContent,
  type QualityContent,
} from "@/lib/quality-content";

type SiteSettingRow = {
  value: unknown;
};

export async function getQualityContent(): Promise<QualityContent> {
  if (!hasDatabaseUrl()) {
    return DEFAULT_QUALITY_CONTENT;
  }

  try {
    const { rows } = await query<SiteSettingRow>(
      "select value from site_settings where key = 'quality' limit 1",
    );
    return normalizeQualityContent(rows[0]?.value);
  } catch {
    return DEFAULT_QUALITY_CONTENT;
  }
}
