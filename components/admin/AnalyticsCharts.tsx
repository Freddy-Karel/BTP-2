"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsSummary } from "@/lib/analytics";

function formatDay(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function AnalyticsCharts({ data }: { data: AnalyticsSummary }) {
  const chartData = data.daily.map((d) => ({
    ...d,
    label: formatDay(d.date),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-5 shadow-rest backdrop-blur-sm md:p-6 lg:col-span-3">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-navy">
              Fréquentation
            </h2>
            <p className="text-caption text-muted">Vues de pages sur 30 jours</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#19862B" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#19862B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e8eef5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#5a6b7d", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#5a6b7d", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #e8eef5",
                  boxShadow: "0 18px 45px rgba(11,67,114,0.12)",
                  fontSize: 13,
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.date
                    ? new Date(
                        `${payload[0].payload.date}T12:00:00`,
                      ).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })
                    : ""
                }
                formatter={(value) => [`${value ?? 0}`, "Vues"]}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#0B4372"
                strokeWidth={3}
                fill="url(#viewsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-5 shadow-rest backdrop-blur-sm md:p-6 lg:col-span-2">
        <h2 className="font-display text-lg font-bold text-navy">
          Pages les plus vues
        </h2>
        <p className="mb-4 text-caption text-muted">30 derniers jours</p>
        {data.topPaths.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Pas encore assez de données.
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topPaths}
                layout="vertical"
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid stroke="#e8eef5" horizontal={false} />
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis
                  type="category"
                  dataKey="path"
                  width={96}
                  tick={{ fill: "#0B4372", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e8eef5",
                    boxShadow: "0 18px 45px rgba(11,67,114,0.12)",
                    fontSize: 13,
                  }}
                  formatter={(value) => [`${value ?? 0}`, "Vues"]}
                />
                <Bar dataKey="views" fill="#19862B" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
