import { createClient } from "@/lib/supabase/server";
import { hasDatabaseUrl, query } from "@/lib/db/postgres";

export type DailyViews = { date: string; views: number };
export type PathViews = { path: string; views: number };

export type AnalyticsSummary = {
  viewsToday: number;
  views7d: number;
  views30d: number;
  uniquePaths30d: number;
  daily: DailyViews[];
  topPaths: PathViews[];
  ready: boolean;
};

function emptySummary(): AnalyticsSummary {
  return {
    viewsToday: 0,
    views7d: 0,
    views30d: 0,
    uniquePaths30d: 0,
    daily: [],
    topPaths: [],
    ready: false,
  };
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (hasDatabaseUrl()) {
    try {
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - 29);
      since.setUTCHours(0, 0, 0, 0);

      const { rows } = await query<{ path: string; created_at: string }>(
        `select path, created_at
         from page_views
         where created_at >= $1
         order by created_at asc`,
        [since.toISOString()],
      );

      return summarizeRows(rows, since);
    } catch {
      return emptySummary();
    }
  }

  const supabase = await createClient();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 29);
  since.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("page_views")
    .select("path, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error || !data) {
    return emptySummary();
  }

  return summarizeRows(data, since);
}

function summarizeRows(
  data: { path: string; created_at: string }[],
  since: Date,
): AnalyticsSummary {
  const today = dayKey(new Date());
  const d7 = new Date();
  d7.setUTCDate(d7.getUTCDate() - 6);
  d7.setUTCHours(0, 0, 0, 0);
  const d7Key = dayKey(d7);

  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();

  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    byDay.set(dayKey(d), 0);
  }

  let viewsToday = 0;
  let views7d = 0;

  for (const row of data) {
    const key = dayKey(new Date(row.created_at));
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
    byPath.set(row.path, (byPath.get(row.path) ?? 0) + 1);
    if (key === today) viewsToday += 1;
    if (key >= d7Key) views7d += 1;
  }

  const daily: DailyViews[] = [...byDay.entries()].map(([date, views]) => ({
    date,
    views,
  }));

  const topPaths = [...byPath.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return {
    viewsToday,
    views7d,
    views30d: data.length,
    uniquePaths30d: byPath.size,
    daily,
    topPaths,
    ready: true,
  };
}
