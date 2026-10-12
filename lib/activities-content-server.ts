import {
  DEFAULT_ACTIVITIES,
  normalizeActivity,
  type ActivityContent,
} from "@/lib/activities-content";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";

type SiteSettingRow = {
  value: unknown;
};

function parseActivities(value: unknown): ActivityContent[] {
  if (!Array.isArray(value)) return DEFAULT_ACTIVITIES;
  const normalized = value.map((item) =>
    normalizeActivity(typeof item === "object" && item !== null ? item : {}),
  );

  const seen = new Set(normalized.map((item) => item.id));
  const missing = DEFAULT_ACTIVITIES.filter((item) => !seen.has(item.id));

  return [...normalized, ...missing].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSiteActivities(): Promise<ActivityContent[]> {
  if (!hasDatabaseUrl()) {
    return DEFAULT_ACTIVITIES;
  }

  try {
    const { rows } = await query<SiteSettingRow>(
      "select value from site_settings where key = 'activities' limit 1",
    );
    return parseActivities(rows[0]?.value);
  } catch {
    return DEFAULT_ACTIVITIES;
  }
}

export async function getPublicActivities(): Promise<ActivityContent[]> {
  const activities = await getSiteActivities();
  return activities.filter((activity) => activity.published);
}
